import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import * as cheerio from 'cheerio'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json(
        { error: 'Job URL is required' },
        { status: 400 }
      )
    }

    // Validate URL format
    try {
      new URL(url)
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      )
    }

    // Fetch the web page
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })

    const html = response.data
    const $ = cheerio.load(html)

    // Remove script and style elements
    $('script, style, nav, header, footer, aside').remove()

    let jobDescription = ''
    let title = ''
    let company = ''

    // Try to extract job title
    title = $('title').text().trim() || 
            $('h1').first().text().trim() ||
            $('[class*="job-title"], [class*="title"]').first().text().trim()

    // Try to extract company name
    company = $('[class*="company"], [class*="employer"]').first().text().trim()

    // Common selectors for job descriptions across different job sites
    const jobDescriptionSelectors = [
      '[class*="job-description"]',
      '[class*="jobdescription"]',
      '[class*="job-detail"]',
      '[class*="description"]',
      '[class*="job-content"]',
      '[class*="posting-content"]',
      '[id*="job-description"]',
      '[id*="jobdescription"]',
      '[id*="description"]',
      '[data-testid*="job-description"]',
      '[data-testid*="description"]',
      '.jobsearch-jobDescriptionText', // Indeed
      '.jobs-description-content', // LinkedIn  
      '.jobDescriptionContent', // Glassdoor
      '.job-description-container',
      'main',
      'article'
    ]

    // Try each selector until we find content
    for (const selector of jobDescriptionSelectors) {
      const element = $(selector)
      if (element.length > 0) {
        const text = element.text().trim()
        if (text.length > 100) { // Ensure we have substantial content
          jobDescription = text
          break
        }
      }
    }

    // If no specific job description found, extract main content
    if (!jobDescription) {
      // Try to get the main content of the page
      const mainContent = $('main').text() || $('body').text()
      if (mainContent && mainContent.length > 200) {
        jobDescription = mainContent.trim()
      }
    }

    if (!jobDescription || jobDescription.length < 100) {
      return NextResponse.json(
        { error: 'Could not extract job description from the provided URL. Please try manual input.' },
        { status: 400 }
      )
    }

    // Clean up the extracted text
    jobDescription = jobDescription
      .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
      .replace(/\n\s*\n/g, '\n')  // Remove empty lines
      .trim()
      .substring(0, 10000) // Limit length to prevent oversized content

    return NextResponse.json({
      jobDescription,
      title: title.substring(0, 200),
      company: company.substring(0, 100),
      url
    })
  } catch (error) {
    console.error('Job scraping error:', error)
    
    if (axios.isAxiosError(error)) {
      if (error.code === 'ENOTFOUND') {
        return NextResponse.json(
          { error: 'Could not reach the provided URL. Please check the URL and try again.' },
          { status: 400 }
        )
      }
      if (error.response?.status === 404) {
        return NextResponse.json(
          { error: 'Job posting not found. The URL may be expired or incorrect.' },
          { status: 400 }
        )
      }
      if (error.response?.status === 403) {
        return NextResponse.json(
          { error: 'Access denied to the job posting. Please try manual input.' },
          { status: 400 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to fetch job details. Please try manual input or check if the URL is accessible.' },
      { status: 500 }
    )
  }
}