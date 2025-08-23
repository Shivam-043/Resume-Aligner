import { useState, useEffect } from "react";

import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("SV");
  const [activeSection, setActiveSection] = useState("home");

  // Get name from portfolio data
  useEffect(() => {
    try {
      const portfolioData = localStorage.getItem('resumeVibe_portfolioData');
      if (portfolioData) {
        const parsedData = JSON.parse(portfolioData);
        if (parsedData.personalInfo && parsedData.personalInfo.name) {
          // Create initials from name
          const nameParts = parsedData.personalInfo.name.split(" ");
          if (nameParts.length >= 2) {
            setName(nameParts[0][0] + nameParts[nameParts.length - 1][0]);
          } else if (nameParts.length === 1) {
            setName(nameParts[0].substring(0, 2));
          }
        }
      }
    } catch (error) {
      console.error("Error getting name for navigation:", error);
    }
  }, []);

  // Handle scroll for active section highlighting
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      let current = '';
      
      sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop <= 100) {
          current = section.getAttribute('id') || '';
        }
      });
      
      if (current) {
        setActiveSection(current);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#experience", label: "Experience" },
    { href: "#skills", label: "Skills" },
    { href: "#contact", label: "Contact" },
  ];

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200/50 shadow-sm" data-testid="navigation">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <a href="#home" className="flex items-center space-x-2">
            <div 
              className="font-bold text-xl w-9 h-9 rounded-full bg-gradient-to-r from-[var(--portfolio-primary)] to-[var(--portfolio-secondary)] text-white flex items-center justify-center shadow-md" 
              data-testid="logo"
            >
              {name}
            </div>
            <span className="text-lg font-semibold text-[var(--portfolio-dark)] hidden sm:block">Portfolio</span>
          </a>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className={`text-gray-600 hover:text-[var(--portfolio-primary)] transition-colors duration-300 ${
                  activeSection === href.substring(1) ? 'text-[var(--portfolio-primary)] font-medium' : ''
                }`}
                data-testid={`nav-link-${label.toLowerCase()}`}
              >
                {label}
              </a>
            ))}
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" data-testid="mobile-menu-trigger">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[240px]">
              <div className="flex flex-col space-y-4 mt-8">
                {navLinks.map(({ href, label }) => (
                  <a
                    key={href}
                    href={href}
                    className={`text-lg font-medium transition-colors duration-300 ${
                      activeSection === href.substring(1) 
                        ? 'text-[var(--portfolio-primary)]' 
                        : 'text-gray-600 hover:text-[var(--portfolio-primary)]'
                    }`}
                    onClick={handleLinkClick}
                    data-testid={`mobile-nav-link-${label.toLowerCase()}`}
                  >
                    {label}
                  </a>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
