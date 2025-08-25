import { useEffect } from "react";
import Navigation from "../components/navigation";
import Hero from "../components/hero";
import About from "../components/about";
import Experience from "../components/experience";
import Skills from "../components/skills";
import Leadership from "../components/leadership";
import Contact from "../components/contact";
import Footer from "../components/footer";
import { HostPortfolio } from "../../../components/HostPortfolio";
import { usePortfolio } from "../../../lib/portfolio-context";

interface PortfolioProps {
  portfolioData?: any;
  isHostedVersion?: boolean;
  hostInfo?: {
    title: string;
    description: string;
    createdAt: string;
  };
}

export default function Portfolio({ portfolioData: propData, isHostedVersion = false, hostInfo }: PortfolioProps) {
  // Use context state for persistence when navigating
  const { portfolioData: contextData } = usePortfolio();
  
  // Use props data for hosted version, otherwise use context data
  const portfolioData = isHostedVersion ? propData : contextData;

  useEffect(() => {
    // Ensure the portfolio-page class is applied to get the CSS variables
    document.documentElement.classList.add('portfolio-page');

    // Smooth scrolling for navigation links
    const handleNavClick = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      if (target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const targetElement = document.querySelector(target.getAttribute('href')!);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    };

    document.addEventListener('click', handleNavClick);

    // Intersection Observer for animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
        }
      });
    }, observerOptions);

    // Observe all sections for scroll animations
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => {
      observer.observe(section);
    });

    // Active navigation highlighting
    const handleScroll = () => {
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop <= 200) {
          current = section.getAttribute('id') || '';
        }
      });

      document.querySelectorAll('nav a[href^="#"]').forEach(link => {
        link.classList.remove('text-primary');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('text-primary');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('click', handleNavClick);
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  // If there's no portfolio data and this isn't a hosted version,
  // display a message or redirect the user
  if (!portfolioData && !isHostedVersion) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">No Portfolio Data Found</h2>
          <p className="text-gray-600 mb-6">
            It looks like you haven't generated a portfolio yet, or your portfolio data has been lost.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Resume Aligner
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden portfolio-page">
      <Navigation />
      <Hero />
      <About />
      <Experience />
      <Skills />
      <Leadership />
      <Contact />
      {!isHostedVersion && portfolioData && (
        <div className="container mx-auto px-4 py-8">
          <HostPortfolio portfolioData={portfolioData} />
        </div>
      )}
      {isHostedVersion && hostInfo && (
        <div className="container mx-auto px-4 py-8 bg-secondary/10">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              This portfolio was created with ResumeVibe
            </p>
            {hostInfo.createdAt && (
              <p className="text-xs text-muted-foreground">
                Created on {new Date(hostInfo.createdAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
