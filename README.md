# Resume Aligner - AI-Powered Resume Job Matcher

A sophisticated Next.js application that analyzes resumes against job postings using Google's Gemini AI to provide detailed matching insights, tailoring recommendations, and improvement suggestions.

## Features

### 🎯 **Comprehensive Analysis**

- **Match Percentage**: Overall compatibility score between resume and job posting
- **Skills Analysis**: Technical skills, soft skills, and certifications evaluation
- **Section Analysis**: Detailed breakdown of experience, education, skills, and achievements
- **Keyword Analysis**: Matched and missing keywords with density metrics
- **ATS Compatibility**: Applicant Tracking System optimization score and recommendations

### 🔧 **Smart Recommendations**

- **Tailoring Suggestions**: Specific section-by-section improvement recommendations
- **Improvement Roadmap**: Prioritized action items with expected impact
- **Competitive Analysis**: Strengths, weaknesses, and differentiators
- **Industry Standards**: Current market trends and best practices

### 📊 **Interactive Dashboard**

- **Visual Analytics**: Charts and progress indicators
- **Detailed Reports**: Expandable sections with actionable insights
- **Export Options**: Print-friendly analysis reports
- **Multi-format Support**: PDF resume upload and URL-based job scraping

### 🌐 **Job Portal Integration**

- Supports major job portals (LinkedIn, Indeed, Glassdoor, etc.)
- Web scraping for automated job description extraction
- Manual input fallback for restricted sites
- URL validation and error handling

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **AI/ML**: Google Gemini AI (gemini-1.5-flash)
- **PDF Processing**: pdf-parse
- **Web Scraping**: Cheerio, Axios
- **Charts**: Recharts
- **Icons**: Lucide React
- **Styling**: Tailwind CSS with custom components

## Prerequisites

- Node.js 18+
- npm or yarn
- Google AI Studio API key (Gemini)

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd resume_aligner
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:

   ```env
   GOOGLE_API_KEY=your_gemini_api_key_here
   NEXT_PUBLIC_APP_NAME=Resume Aligner
   NEXT_PUBLIC_APP_VERSION=1.0.0
   ```

4. **Get Google Gemini API Key**

   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Create a new API key
   - Add it to your `.env.local` file

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage Guide

### Step 1: Upload Resume

- Drag and drop your PDF resume or click to browse
- Supports PDF files up to 10MB
- Text is automatically extracted and processed

### Step 2: Add Job Information

- **Option A**: Enter a job posting URL for automatic extraction
- **Option B**: Manually paste the job description
- Supports all major job portals

### Step 3: Analyze Match

- Click "Analyze Match" to start AI-powered analysis
- Processing typically takes 10-30 seconds
- Comprehensive report is generated

### Step 4: Review Results

Navigate through different analysis sections:

#### **Overview**

- Overall match percentage with visual pie chart
- Section scores comparison
- Quick statistics (keywords matched, ATS score)

#### **Skills Analysis**

- Technical skills evaluation
- Soft skills assessment
- Certifications analysis
- Keyword matching visualization

#### **Section Analysis**

- Professional experience breakdown
- Education alignment
- Skills section optimization
- Achievements evaluation

#### **Recommendations**

- Prioritized tailoring suggestions
- Before/after comparisons
- ATS compatibility improvements
- Specific action items

#### **Improvements**

- Long-term career development suggestions
- Competitive analysis insights
- Industry-specific recommendations
- Implementation roadmap

## API Endpoints

### `/api/upload-resume`

- **Method**: POST
- **Purpose**: Upload and extract text from PDF resume
- **Input**: FormData with PDF file
- **Output**: Extracted text content

### `/api/scrape-job`

- **Method**: POST
- **Purpose**: Extract job description from URL
- **Input**: Job posting URL
- **Output**: Job description, title, company info

### `/api/analyze`

- **Method**: POST
- **Purpose**: AI-powered resume-job matching analysis
- **Input**: Resume text, job description, job URL
- **Output**: Comprehensive analysis results

## Configuration

### Gemini AI Settings

The application uses Google's Gemini 1.5 Flash model for analysis. You can modify the model or parameters in `/src/app/api/analyze/route.ts`.

### Scraping Configuration

Web scraping selectors can be customized in `/src/app/api/scrape-job/route.ts` to support additional job portals.

### UI Customization

- Tailwind CSS configuration in `tailwind.config.ts`
- Custom styles in `/src/app/globals.css`
- Component styling in individual component files

## Troubleshooting

### Common Issues

1. **API Key Errors**

   - Ensure your Gemini API key is correctly set in `.env.local`
   - Verify the API key has proper permissions

2. **PDF Upload Issues**

   - Only PDF files are supported
   - Ensure file size is under 10MB
   - Check that the PDF contains extractable text

3. **Job Scraping Failures**

   - Some sites block scraping - use manual input
   - Check if the URL is publicly accessible
   - Try different job portal URLs

4. **Analysis Errors**
   - Ensure both resume and job description are provided
   - Check internet connection for AI API calls
   - Verify content isn't too long (10k character limit)

### Performance Optimization

- Large files are processed client-side before upload
- AI analysis is optimized for speed and accuracy
- Caching can be implemented for repeated analyses

## Development

### Project Structure

```
src/
├── app/
│   ├── api/          # API routes
│   ├── globals.css   # Global styles
│   ├── layout.tsx    # App layout
│   └── page.tsx      # Main page
├── components/       # React components
└── types/           # TypeScript definitions
```

### Adding New Features

1. **New Analysis Metrics**

   - Modify the `AnalysisResult` type in `/src/types/index.ts`
   - Update the AI prompt in `/src/app/api/analyze/route.ts`
   - Add UI components in `/src/components/MatchingResults.tsx`

2. **Additional Job Portals**

   - Add new selectors to `/src/app/api/scrape-job/route.ts`
   - Test with various job posting formats

3. **Enhanced UI**
   - Components use Tailwind CSS and Lucide icons
   - Responsive design with mobile-first approach
   - Custom animations and transitions

## Deployment

### Vercel (Recommended)

1. Push code to GitHub/GitLab
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

- **Netlify**: Use `npm run build` and deploy `out/` folder
- **Docker**: Create Dockerfile for containerization
- **VPS**: Use PM2 for process management

## Security Considerations

- API keys are server-side only (not exposed to client)
- File uploads are validated and limited
- Web scraping includes rate limiting and error handling
- CORS policies are configured for production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues, questions, or contributions:

- Create an issue on GitHub
- Review the troubleshooting section
- Check the API documentation

## Acknowledgments

- Google Gemini AI for intelligent analysis
- Next.js team for the excellent framework
- Open source libraries and contributors

---

**Made with ❤️ for job seekers and career professionals**

## Setup Instructions

### Basic Setup

1. Clone this repository
2. Install dependencies: `npm install`
3. Create a `.env.local` file with the following variables:
   ```
   GOOGLE_API_KEY=your-gemini-api-key
   CLAUDE_API_KEY=your-claude-api-key (optional)
   ```
4. Start the development server: `npm run dev`

### Firebase Setup (for Portfolio Hosting)

To enable the portfolio hosting feature, you'll need to set up Firebase:

1. Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Enable the following services:
   - Authentication (Email/Password and Google sign-in)
   - Firestore Database
   - Storage
3. Get your Firebase configuration from Project Settings > General > Your apps > SDK setup
4. Add the Firebase configuration to your `.env.local` file:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
   ```
5. Set up Firebase security rules for Firestore and Storage to secure your application

## How It Works

1. Users upload their resume
2. The app extracts key information from the resume
3. Users can enter a job description URL or paste the text
4. The AI analyzes the resume against the job description
5. Users get a matching score and suggestions for improvement
6. Users can generate a tailored portfolio and cover letter
7. Users can host their portfolio with a shareable link (requires Firebase setup)

## Portfolio Hosting Feature

The new portfolio hosting feature allows users to:

- Generate a professional portfolio from their resume
- Host the portfolio online with a unique URL
- Share the portfolio link with recruiters and on social media
- Authentication only required when hosting (not for resume analysis)
- View and manage all their hosted portfolios

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Gemini API
- Firebase (Authentication, Firestore, Storage)
