import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme-context";
import { AuthProvider } from "@/lib/auth-context";
import { PortfolioProvider } from "@/lib/portfolio-context";
import { CoverLetterProvider } from "@/lib/cover-letter-context";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Resume Aligner - AI-Powered Resume Job Matcher & ATS Optimizer",
    template: "%s | Resume Aligner"
  },
  description: "Optimize your resume with AI-powered job matching analysis. Get ATS compatibility scores, tailored recommendations, cover letter generation, and portfolio creation tools. Land your dream job faster with Resume Aligner.",
  keywords: [
    "resume optimizer", "ATS checker", "job matching", "resume analyzer", 
    "AI resume tool", "cover letter generator", "resume builder", "job application",
    "applicant tracking system", "resume scanner", "job search", "career tools",
    "resume keywords", "resume tailoring", "interview preparation", "portfolio generator"
  ],
  authors: [{ name: "Resume Aligner Team" }],
  creator: "Resume Aligner",
  publisher: "Resume Aligner",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://resumealigner.theerrors.in'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Resume Aligner',
    title: 'Resume Aligner - AI-Powered Resume Job Matcher & ATS Optimizer',
    description: 'Optimize your resume with AI-powered job matching analysis. Get ATS compatibility scores, tailored recommendations, and cover letter generation.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Resume Aligner - AI Resume Optimization Tool',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Resume Aligner - AI Resume Optimization Tool',
    description: 'Optimize your resume with AI-powered job matching analysis and ATS compatibility checking.',
    images: ['/twitter-image.png'],
    creator: '@resumealigner',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION_CODE,
    yandex: process.env.YANDEX_VERIFICATION_CODE,
    yahoo: process.env.YAHOO_VERIFICATION_CODE,
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <GoogleAnalytics />
        <link rel="canonical" href={process.env.NEXT_PUBLIC_BASE_URL || 'https://resumealigner.com'} />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#6366f1" />
        <meta name="msapplication-TileColor" content="#6366f1" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Resume Aligner",
              "description": "AI-powered resume optimization and job matching tool",
              "url": process.env.NEXT_PUBLIC_BASE_URL || 'https://resumealigner.com',
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "creator": {
                "@type": "Organization",
                "name": "Resume Aligner",
                "url": process.env.NEXT_PUBLIC_BASE_URL || 'https://resumealigner.com'
              },
              "featureList": [
                "AI-powered resume analysis",
                "Job matching and compatibility scoring",
                "ATS optimization",
                "Cover letter generation",
                "Portfolio creation tools",
                "Resume tailoring recommendations"
              ]
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <AuthProvider>
            <PortfolioProvider>
              <CoverLetterProvider>
                {children}
              </CoverLetterProvider>
            </PortfolioProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
