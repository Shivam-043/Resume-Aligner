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

export async function POST(request: NextRequest) {
  try {
    // Get file from form data
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' }, 
        { status: 400 }
      )
    }

    // Check if the file is a PDF
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json(
        { error: 'Only PDF files are supported' },
        { status: 400 }
      )
    }

    // Get file buffer
    const buffer = await file.arrayBuffer()
    const pdfParser = new PDFParser(null, 1)

    // Parse PDF using PDF2JSON (server-side)
    const extractedText = await new Promise<string>((resolve, reject) => {
      pdfParser.on('pdfParser_dataError', (errData: Error) => {
        reject(new Error(errData.toString()))
      })

      pdfParser.on('pdfParser_dataReady', () => {
        try {
          const data = pdfParser.getRawTextContent()
          resolve(data)
        } catch (error) {
          reject(error)
        }
      })

      // Load PDF data
      pdfParser.parseBuffer(Buffer.from(buffer))
    })

    // Clean up text
    const cleanedText = extractedText
      .replace(/\r\n/g, '\n') // normalize line breaks
      .replace(/\s{2,}/g, ' ') // reduce multiple spaces to single space
      .replace(/\n{3,}/g, '\n\n') // reduce excessive line breaks
      .trim()

    return NextResponse.json({
      text: cleanedText,
      pageCount: pdfParser.Pages?.length || 1
    })

  } catch (error) {
    console.error('PDF parsing error:', error)
    return NextResponse.json(
      { error: 'Failed to extract text from PDF' },
      { status: 500 }
    )
  }
}