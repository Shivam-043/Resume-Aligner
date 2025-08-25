import React, { useEffect, useState, useRef } from "react";
import { Rocket, Smartphone, Shield, Users, Settings, TrendingUp, Layers, Palette, ChevronDown, ChevronUp, MapPin, Calendar, Briefcase } from "lucide-react";

// Define color themes for different experiences
const colorThemes = [
  {
    gradient: "from-blue-500 to-indigo-600",
    iconBg: "from-blue-500 to-indigo-600",
    textColor: "text-blue-600",
    buttonBg: "bg-blue-50 hover:bg-blue-100",
    buttonText: "text-blue-600",
    iconColor: "text-blue-500"
  },
  {
    gradient: "from-purple-500 to-pink-600",
    iconBg: "from-purple-500 to-pink-600",
    textColor: "text-purple-600",
    buttonBg: "bg-purple-50 hover:bg-purple-100",
    buttonText: "text-purple-600",
    iconColor: "text-purple-500"
  },
  {
    gradient: "from-green-500 to-teal-600",
    iconBg: "from-green-500 to-teal-600",
    textColor: "text-green-600",
    buttonBg: "bg-green-50 hover:bg-green-100",
    buttonText: "text-green-600",
    iconColor: "text-green-500"
  },
  {
    gradient: "from-orange-500 to-red-500",
    iconBg: "from-orange-500 to-red-500",
    textColor: "text-orange-600",
    buttonBg: "bg-orange-50 hover:bg-orange-100",
    buttonText: "text-orange-600",
    iconColor: "text-orange-500"
  }
];

// Define icons for achievements with proper key props
const achievementIcons = [
  <Rocket key="rocket" className="w-4 h-4 flex-shrink-0 mt-1" />,
  <Smartphone key="smartphone" className="w-4 h-4 flex-shrink-0 mt-1" />,
  <Shield key="shield" className="w-4 h-4 flex-shrink-0 mt-1" />,
  <Users key="users" className="w-4 h-4 flex-shrink-0 mt-1" />,
  <Settings key="settings" className="w-4 h-4 flex-shrink-0 mt-1" />,
  <TrendingUp key="trendingUp" className="w-4 h-4 flex-shrink-0 mt-1" />,
  <Layers key="layers" className="w-4 h-4 flex-shrink-0 mt-1" />,
  <Palette key="palette" className="w-4 h-4 flex-shrink-0 mt-1" />,
];

interface ExperienceItem {
  company: string;
  role: string;
  duration: string;
  location: string;
  achievements: string[];
}

// Default fallback experience data
const defaultExperienceData: ExperienceItem[] = [
  {
    company: "MEMONEET",
    role: "Android Developer Internship",
    duration: "NOV 2023 - APRIL 2024",
    location: "Chennai - Remote",
    achievements: [
      "Pioneered cross-functional initiative to revamp user experience, increasing user retention by 20%",
      "Implemented 5 major online exam test features for enhanced user experience",
      "Optimized key functionalities leading to 35% decrease in crash rates",
      "Led team of 5 Flutter developers, achieved 4.7-star rating for 100K+ users"
    ]
  },
  {
    company: "BUKKIZ",
    role: "Flutter Team Lead",
    duration: "JAN 2023 - NOV 2023",
    location: "Gurugram, Haryana",
    achievements: [
      "Built full-stack ERP with e-Commerce features, improving efficiency by 40%",
      "Integrated live test results and performance dashboards for parents",
      "Created 4 comprehensive applications: User, Retailer, Admin, and Delivery Apps",
      "Expertise in Figma UI/UX design, Clean Architecture, and 20+ Flutter features"
    ]
  }
];

export default function Experience() {
  const [experienceData, setExperienceData] = useState<ExperienceItem[]>(defaultExperienceData);
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState<boolean[]>([]);
  
  useEffect(() => {
    // Try to get portfolio data from localStorage
    try {
      const portfolioData = localStorage.getItem('resumeVibe_portfolioData');
      if (portfolioData) {
        const parsedData = JSON.parse(portfolioData);
        if (parsedData.experience && Array.isArray(parsedData.experience) && parsedData.experience.length > 0) {
          setExperienceData(parsedData.experience);
          setInView(new Array(parsedData.experience.length).fill(false));
        }
      }
    } catch (error) {
      console.error("Error loading experience data:", error);
    }

    // Initialize intersection observer for animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            if (!isNaN(index)) {
              setInView(prev => {
                const newState = [...prev];
                newState[index] = true;
                return newState;
              });
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    // Observe timeline items
    const timelineItems = document.querySelectorAll('.experience-item');
    timelineItems.forEach(item => {
      observer.observe(item);
    });

    return () => {
      timelineItems.forEach(item => {
        observer.unobserve(item);
      });
    };
  }, [experienceData.length]);
  
  // Toggle expanded state for achievements
  const toggleExpand = (index: number) => {
    setExpandedItem(expandedItem === index ? null : index);
  };

  // Get an achievement icon based on index
  const getAchievementIcon = (achievementIndex: number, colorTheme: typeof colorThemes[0]) => {
    const iconElement = achievementIcons[achievementIndex % achievementIcons.length];
    // Clone the element and add the color class
    return React.cloneElement(iconElement, {
      className: `w-4 h-4 ${colorTheme.iconColor} flex-shrink-0 mt-1`
    });
  };
  
  return (
    <section id="experience" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50" data-testid="experience-section">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1 rounded-full bg-[var(--portfolio-primary)]/10 text-[var(--portfolio-primary)] text-sm font-semibold tracking-wide mb-4">
            Career Path
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" data-testid="experience-title">
            <span className="gradient-text">Professional</span> Experience
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto" data-testid="experience-description">
            Leading development teams and creating impactful applications
          </p>
        </div>

        <div className="space-y-12" ref={timelineRef}>
          {experienceData.map((exp, index) => {
            // Select a color theme for this experience
            const theme = colorThemes[index % colorThemes.length];
            
            return (
              <div 
                key={index} 
                data-index={index}
                className={`experience-item relative transition-all duration-1000 ${
                  inView[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                data-testid={`experience-${index}`}
              >
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  {/* Top colored bar with dynamic gradient */}
                  <div className={`h-1.5 w-full bg-gradient-to-r ${theme.gradient}`}></div>
                  
                  <div className="p-8">
                    <div className="flex flex-col md:flex-row md:items-start gap-6 mb-8">
                      {/* Company Logo & Info */}
                      <div className="flex items-center space-x-5">
                        <div className={`w-16 h-16 bg-gradient-to-br ${theme.iconBg} rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg`}>
                          <Briefcase className="h-8 w-8" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900" data-testid={`company-${index}`}>{exp.company}</h3>
                          <p className={`text-lg font-semibold ${theme.textColor}`} data-testid={`role-${index}`}>{exp.role}</p>
                          <div className="flex items-center mt-2 text-gray-500 text-sm">
                            <Calendar className="w-4 h-4 mr-1.5" />
                            <span className="mr-4">{exp.duration}</span>
                            <MapPin className="w-4 h-4 mr-1.5" />
                            <span data-testid={`location-${index}`}>{exp.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="text-lg font-semibold mb-4 text-gray-800">Key Achievements:</h4>
                      
                      {/* Achievements section */}
                      <div className={`grid gap-4 transition-all duration-500 ${
                        expandedItem === index || exp.achievements.length <= 3 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'
                      }`}>
                        {exp.achievements
                          .slice(0, expandedItem === index ? exp.achievements.length : Math.min(4, exp.achievements.length))
                          .map((achievement, achievementIndex) => (
                            <div 
                              key={achievementIndex} 
                              className="flex items-start space-x-3"
                            >
                              {getAchievementIcon(achievementIndex, theme)}
                              <p className="text-gray-700">{achievement}</p>
                            </div>
                        ))}
                      </div>
                      
                      {/* Show more/less button if there are more than 4 achievements */}
                      {exp.achievements.length > 4 && (
                        <div className="mt-6 text-center">
                          <button 
                            onClick={() => toggleExpand(index)}
                            className={`inline-flex items-center px-4 py-2 rounded-full ${theme.buttonBg} ${theme.buttonText} text-sm font-medium transition-colors`}
                          >
                            {expandedItem === index ? (
                              <>
                                Show Less <ChevronUp className="ml-1 w-4 h-4" />
                              </>
                            ) : (
                              <>
                                Show More <ChevronDown className="ml-1 w-4 h-4" />
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
