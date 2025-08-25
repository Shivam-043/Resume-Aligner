import { NextRequest, NextResponse } from 'next/server'
import PDFParser from 'pdf2json'

// Disable caching and extend timeout
export const dynamic = 'force-dynamic'
export const maxDuration = 60 // 60 seconds timeout

// Configure CORS to avoid middleware interference
export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  })
}

/**
 * Extract text from PDF using pdf2json
 * @param fileBuffer PDF file buffer
 * @returns Promise with extracted text and page count
 */
async function extractPdfText(fileBuffer: ArrayBuffer): Promise<{ text: string; pageCount: number }> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();
    
    pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
      try {
        // Extract text from each page
        let extractedText = '';
        const pages = pdfData.Pages || [];
        
        for (let pageIdx = 0; pageIdx < pages.length; pageIdx++) {
          const page = pages[pageIdx];
          const texts = page.Texts || [];
          
          // Process each text element on the page
          for (let textIdx = 0; textIdx < texts.length; textIdx++) {
            const text = texts[textIdx];
            // Decode text and remove special characters
            if (text.R && text.R.length > 0) {
              for (let rIdx = 0; rIdx < text.R.length; rIdx++) {
                const r = text.R[rIdx];
                const decodedText = decodeURIComponent(r.T);
                extractedText += decodedText + ' ';
              }
            }
          }
          
          extractedText += '\n\n'; // Add line breaks between pages
        }
        
        // Clean up the text (remove excessive spaces and line breaks)
        extractedText = extractedText
          .replace(/\s+/g, ' ')
          .replace(/\n\s*\n/g, '\n\n')
          .trim();
        
        resolve({
          text: extractedText,
          pageCount: pages.length
        });
      } catch (error) {
        reject(error);
      }
    });
    
    pdfParser.on('pdfParser_dataError', (errData: any) => {
      reject(new Error(`PDF parsing error: ${errData.parserError}`));
    });
    
    // Parse the PDF from the buffer
    const uint8Array = new Uint8Array(fileBuffer);
    pdfParser.parseBuffer(uint8Array);
  });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload a PDF file.' },
        { status: 400 }
      );
    }

    // Convert file to buffer for PDF parsing
    const fileBuffer = await file.arrayBuffer();
    
    // Extract text from the PDF
    const { text, pageCount } = await extractPdfText(fileBuffer);
    
    if (!text || text.trim() === '') {
      return NextResponse.json(
        { error: 'Could not extract text from PDF. The file may be empty or image-based.' },
        { status: 400 }
      );
    }

    // Return the extracted text and page count
    return NextResponse.json({
      text,
      pageCount,
      fileName: file.name,
      fileSize: file.size,
    });
    
  } catch (error: any) {
    console.error('Error processing resume upload:', error);
    return NextResponse.json(
      { error: `Failed to process resume: ${error.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}