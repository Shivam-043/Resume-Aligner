import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Frequently Asked Questions - Resume Aligner",
    description: "Get answers to common questions about resume optimization, ATS compatibility, job matching, and how to use Resume Aligner's AI-powered tools effectively.",
    keywords: [
        "resume FAQ", "ATS questions", "resume optimization help", "job matching FAQ",
        "resume analyzer questions", "cover letter help", "portfolio builder FAQ"
    ],
    openGraph: {
        title: "Frequently Asked Questions - Resume Aligner",
        description: "Get answers to common questions about resume optimization and ATS compatibility.",
        type: 'website',
    },
    alternates: {
        canonical: '/faq',
    },
};

const faqs = [
    {
        id: 1,
        question: "What is Resume Aligner and how does it work?",
        answer: "Resume Aligner is an AI-powered tool that analyzes your resume against specific job descriptions. It provides ATS compatibility scores, identifies keyword gaps, suggests optimizations, and generates tailored cover letters to increase your interview chances."
    },
    {
        id: 2,
        question: "Is Resume Aligner free to use?",
        answer: "Yes! Resume Aligner is completely free to use. You can analyze unlimited resumes, get ATS scores, receive optimization suggestions, and generate cover letters without any cost or registration required."
    },
    {
        id: 3,
        question: "What file formats does Resume Aligner support?",
        answer: "Resume Aligner supports PDF, DOC, and DOCX file formats. We recommend using PDF format for the most accurate text extraction and analysis results."
    },
    {
        id: 4,
        question: "How accurate is the ATS compatibility scoring?",
        answer: "Our ATS scoring algorithm is trained on real Applicant Tracking Systems and considers factors like keyword density, formatting, section structure, and industry standards. While highly accurate, we recommend treating it as a guide rather than an absolute measure."
    },
    {
        id: 5,
        question: "Do you store my resume data?",
        answer: "No, we prioritize your privacy. Resume data is processed in real-time for analysis and immediately discarded. We never store, save, or share your personal information or resume content."
    },
    {
        id: 6,
        question: "How long does the analysis take?",
        answer: "Resume analysis typically takes 15-30 seconds. The AI processes your resume content, compares it against the job description, and generates comprehensive recommendations almost instantly."
    },
    {
        id: 7,
        question: "Can I use Resume Aligner for any industry?",
        answer: "Yes! Resume Aligner works across all industries including technology, healthcare, finance, marketing, education, and more. Our AI adapts to industry-specific keywords and requirements."
    },
    {
        id: 8,
        question: "What makes Resume Aligner different from other resume tools?",
        answer: "Resume Aligner combines AI-powered analysis, real-time job matching, ATS optimization, cover letter generation, and portfolio creation in one free platform. Our focus is on practical, actionable recommendations rather than generic advice."
    },
    {
        id: 9,
        question: "How do I improve my ATS score?",
        answer: "Follow our specific recommendations: add missing keywords, optimize section headers, use standard formatting, include relevant skills, and ensure your resume matches the job description's language and requirements."
    },
    {
        id: 10,
        question: "Can I generate cover letters for multiple jobs?",
        answer: "Absolutely! You can generate unique, tailored cover letters for each job application. Simply upload your resume and paste different job descriptions to get personalized cover letters for each position."
    }
];

export default function FAQPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                {/* Header */}
                <header className="text-center mb-16">
                    <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Everything you need to know about Resume Aligner, ATS optimization, 
                        and how to maximize your job search success with our AI-powered tools.
                    </p>
                </header>

                {/* FAQ Section */}
                <section>
                    <div className="space-y-6">
                        {faqs.map((faq) => (
                            <div key={faq.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                <details className="group">
                                    <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                                        <h3 className="text-lg font-semibold text-gray-900 pr-4">
                                            {faq.question}
                                        </h3>
                                        <svg 
                                            className="w-5 h-5 text-gray-500 transition-transform group-open:rotate-180" 
                                            fill="none" 
                                            viewBox="0 0 24 24" 
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </summary>
                                    <div className="px-6 pb-6">
                                        <p className="text-gray-600 leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </details>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA Section */}
                <section className="mt-16 bg-white rounded-lg p-8 shadow-md text-center">
                    <h2 className="text-2xl font-bold mb-4">Ready to Optimize Your Resume?</h2>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                        Get instant AI-powered analysis, ATS compatibility scores, and personalized 
                        recommendations to land more interviews. Start your job search transformation today!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link 
                            href="/"
                            className="inline-flex items-center justify-center px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors shadow-lg"
                        >
                            Analyze My Resume Free
                        </Link>
                        <Link 
                            href="/blog"
                            className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                        >
                            Browse Career Tips
                        </Link>
                    </div>
                </section>

                {/* Additional Help Section */}
                <section className="mt-16 bg-white rounded-lg p-8 shadow-md text-center">
                    <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
                    <p className="text-gray-600 mb-6">
                        Can&apos;t find what you&apos;re looking for? Check out our comprehensive blog with detailed guides 
                        and tutorials, or try our AI resume analyzer to see how it works.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link 
                            href="/blog"
                            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                            Browse Blog Articles
                        </Link>
                        <Link 
                            href="/"
                            className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                        >
                            Try Resume Analyzer
                        </Link>
                    </div>
                </section>

                {/* Structured Data for FAQ */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "FAQPage",
                            "mainEntity": faqs.map((faq) => ({
                                "@type": "Question",
                                "name": faq.question,
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": faq.answer
                                }
                            }))
                        })
                    }}
                />
            </div>
        </div>
    );
}
