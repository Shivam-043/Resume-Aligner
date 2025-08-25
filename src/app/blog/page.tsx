import type { Metadata } from "next";
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Resume Tips & Career Advice Blog",
  description: "Expert resume tips, ATS optimization guides, job search strategies, and career advice from HR professionals. Learn how to create winning resumes and land your dream job.",
  keywords: [
    "resume tips", "ATS optimization", "job search tips", "career advice",
    "resume writing", "cover letter tips", "interview preparation", "job application",
    "resume keywords", "career development", "job hunting", "professional growth"
  ],
  openGraph: {
    title: "Resume Tips & Career Advice Blog",
    description: "Expert resume tips and career advice from HR professionals.",
    type: 'website',
  },
  alternates: {
    canonical: '/blog',
  },
};

const blogPosts = [
  {
    id: 1,
    title: "10 Essential ATS Keywords Every Resume Needs in 2024",
    excerpt: "Discover the most important ATS keywords that will help your resume pass through applicant tracking systems and land in front of hiring managers.",
    slug: "ats-keywords-2024",
    category: "ATS Optimization",
    readTime: "5 min read",
    publishDate: "2024-01-15"
  },
  {
    id: 2,
    title: "How to Tailor Your Resume for Different Job Applications",
    excerpt: "Learn the step-by-step process of customizing your resume for each job application to increase your interview chances by 300%.",
    slug: "tailor-resume-job-applications",
    category: "Resume Writing",
    readTime: "8 min read",
    publishDate: "2024-01-10"
  },
  {
    id: 3,
    title: "The Ultimate Guide to Resume Formatting for ATS Success",
    excerpt: "Master the art of ATS-friendly resume formatting with our comprehensive guide. Avoid common mistakes that could disqualify your application.",
    slug: "resume-formatting-ats-success",
    category: "ATS Optimization",
    readTime: "12 min read",
    publishDate: "2024-01-05"
  },
  {
    id: 4,
    title: "Cover Letter Templates That Actually Get Responses",
    excerpt: "Proven cover letter templates and strategies that have helped thousands of job seekers land interviews at top companies.",
    slug: "cover-letter-templates-responses",
    category: "Cover Letters",
    readTime: "6 min read",
    publishDate: "2024-01-01"
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Resume & Career Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Expert insights, proven strategies, and actionable tips to accelerate your job search 
            and build a successful career. Written by HR professionals and career coaches.
          </p>
        </header>

        {/* Featured Categories */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Popular Topics</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {['ATS Optimization', 'Resume Writing', 'Cover Letters', 'Interview Tips'].map((category) => (
              <div key={category} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="font-semibold text-lg mb-2">{category}</h3>
                <p className="text-gray-600 text-sm">Expert guidance and practical tips</p>
              </div>
            ))}
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section>
          <h2 className="text-3xl font-bold mb-12 text-center">Latest Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {post.category}
                    </span>
                    <span className="text-gray-500 text-sm">{post.readTime}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 text-gray-900">
                    <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
                      {post.title}
                    </Link>
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                  
                  <div className="flex justify-between items-center">
                    <time className="text-gray-500 text-sm">
                      {new Date(post.publishDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </time>
                    <Link 
                      href={`/blog/${post.slug}`}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="mt-16 bg-white rounded-lg p-8 shadow-md text-center">
          <h2 className="text-2xl font-bold mb-4">Stay Updated with Career Tips</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Get weekly resume tips, job search strategies, and career advice delivered to your inbox. 
            Join 50,000+ professionals who are accelerating their careers.
          </p>
          <div className="flex max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email address"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-r-lg transition-colors">
              Subscribe
            </button>
          </div>
        </section>

        {/* Back to Tools */}
        <div className="text-center mt-12">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            ← Back to Resume Analyzer
          </Link>
        </div>
      </div>
    </div>
  );
}