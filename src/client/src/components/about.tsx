import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Download, ExternalLink } from "lucide-react";

interface AboutInfo {
  title: string;
  description: string[];
  resumeLink: string;
}

// Default fallback data
const defaultAboutInfo: AboutInfo = {
  title: "About Me",
  description: [
    "I am a passionate Mobile App Developer specializing in Flutter and Android development with over 2 years of experience building high-quality applications.",
    "Currently pursuing B.Tech in Computer Science at NIT Kurukshetra, I have led multiple development teams and created applications serving over 100K users.",
    "My expertise includes UI/UX design, clean architecture implementation, and integrating complex features like real-time data synchronization and REST APIs."
  ],
  resumeLink: "#"
};

export default function About() {
  const [aboutInfo, setAboutInfo] = useState<AboutInfo>(defaultAboutInfo);
  
  useEffect(() => {
    // Try to get portfolio data from localStorage
    try {
      const portfolioData = localStorage.getItem('resumeVibe_portfolioData');
      if (portfolioData) {
        const parsedData = JSON.parse(portfolioData);
        if (parsedData.about) {
          setAboutInfo({
            title: parsedData.about.title || defaultAboutInfo.title,
            resumeLink: parsedData.about.resumeLink || defaultAboutInfo.resumeLink,
            description: parsedData.about.description || defaultAboutInfo.description
          });
        }
      }
    } catch (error) {
      console.error("Error loading about data:", error);
    }
  }, []);
  
  return (
    <section id="about" className="py-20 bg-white" data-testid="about-section">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block px-4 py-1 rounded-full bg-[var(--portfolio-primary)]/10 text-[var(--portfolio-primary)] text-sm font-semibold tracking-wide mb-4">
              Get To Know Me
            </div>
            <h2 className="text-4xl font-bold mb-6" data-testid="about-title">
              <span className="gradient-text">About</span> Me
            </h2>
            
            <div className="space-y-4">
              {aboutInfo.description.map((paragraph, index) => (
                <p 
                  key={index} 
                  className="text-gray-700 leading-relaxed"
                  data-testid={`about-paragraph-${index}`}
                >
                  {paragraph}
                </p>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-4 mt-8">
              <Button 
                asChild
                className="gradient-bg text-white rounded-full font-semibold text-lg hover:shadow-lg transition-all"
                data-testid="resume-button"
              >
                <a href={aboutInfo.resumeLink} target="_blank" rel="noreferrer">
                  <Download className="mr-2 h-5 w-5" />
                  Download Resume
                </a>
              </Button>
              
              <Button 
                asChild
                variant="outline"
                className="border-2 border-primary text-primary rounded-full font-semibold text-lg hover:bg-primary hover:text-white transition-all"
                data-testid="portfolio-button"
              >
                <a href="#projects">
                  <ExternalLink className="mr-2 h-5 w-5" />
                  View Projects
                </a>
              </Button>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-primary/5 to-secondary/5 p-8 rounded-2xl">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm" data-testid="about-stat-1">
                <h3 className="text-4xl font-bold text-primary">2+</h3>
                <p className="text-gray-600 mt-2">Years Experience</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm" data-testid="about-stat-2">
                <h3 className="text-4xl font-bold text-secondary">10+</h3>
                <p className="text-gray-600 mt-2">Projects Completed</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm" data-testid="about-stat-3">
                <h3 className="text-4xl font-bold text-accent">100K+</h3>
                <p className="text-gray-600 mt-2">App Users</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm" data-testid="about-stat-4">
                <h3 className="text-4xl font-bold text-vibrant">4.7★</h3>
                <p className="text-gray-600 mt-2">App Rating</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
