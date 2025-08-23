import { useEffect, useState, useRef } from "react";
import { Trophy, Users, ChartBar, Target, Award, Lightbulb } from "lucide-react";

interface LeadershipItem {
  title: string;
  description: string;
  icon: "trophy" | "users" | "chart" | "target" | "award" | "lightbulb";
}

// Default fallback leadership data
const defaultLeadershipData: LeadershipItem[] = [
  {
    title: "Team Leadership",
    description: "Led cross-functional team of 5 developers to deliver mobile applications with 4.7-star rating and 100K+ active users.",
    icon: "users"
  },
  {
    title: "Project Management",
    description: "Managed multiple concurrent projects from concept to completion, optimizing workflows that reduced development time by 30%.",
    icon: "chart"
  },
  {
    title: "Technical Excellence",
    description: "Implemented clean architecture patterns and best practices, reducing bug rates by 40% and improving code maintainability.",
    icon: "trophy"
  },
  {
    title: "Strategic Planning",
    description: "Developed and executed product roadmaps aligning with business objectives, resulting in 20% increased user retention.",
    icon: "target"
  }
];

export default function Leadership() {
  const [leadershipData, setLeadershipData] = useState<LeadershipItem[]>(defaultLeadershipData);
  const [inView, setInView] = useState<boolean[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Try to get portfolio data from localStorage
    try {
      const portfolioData = localStorage.getItem('resumeVibe_portfolioData');
      if (portfolioData) {
        const parsedData = JSON.parse(portfolioData);
        if (parsedData.leadership && Array.isArray(parsedData.leadership) && parsedData.leadership.length > 0) {
          setLeadershipData(parsedData.leadership);
          setInView(new Array(parsedData.leadership.length).fill(false));
        }
      }
    } catch (error) {
      console.error("Error loading leadership data:", error);
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

    // Observe achievement items
    const achievementItems = document.querySelectorAll('.achievement-item');
    achievementItems.forEach(item => {
      observer.observe(item);
    });

    return () => {
      achievementItems.forEach(item => {
        observer.unobserve(item);
      });
    };
  }, [leadershipData.length]);

  // Function to render the appropriate icon based on the icon name
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'trophy':
        return <Trophy className="h-6 w-6 text-white" />;
      case 'users':
        return <Users className="h-6 w-6 text-white" />;
      case 'chart':
        return <ChartBar className="h-6 w-6 text-white" />;
      case 'target':
        return <Target className="h-6 w-6 text-white" />;
      case 'award':
        return <Award className="h-6 w-6 text-white" />;
      case 'lightbulb':
        return <Lightbulb className="h-6 w-6 text-white" />;
      default:
        return <Trophy className="h-6 w-6 text-white" />;
    }
  };

  // Get background gradient style for items
  const getGradientStyle = (index: number) => {
    const gradients = [
      {
        bg: "bg-gradient-to-br from-blue-500 to-indigo-600",
        shadow: "shadow-blue-500/20"
      },
      {
        bg: "bg-gradient-to-br from-green-500 to-teal-600",
        shadow: "shadow-green-500/20"
      },
      {
        bg: "bg-gradient-to-br from-purple-500 to-pink-600",
        shadow: "shadow-purple-500/20"
      },
      {
        bg: "bg-gradient-to-br from-orange-500 to-red-600",
        shadow: "shadow-orange-500/20"
      }
    ];
    return gradients[index % gradients.length];
  };

  return (
    <section id="leadership" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50" data-testid="leadership-section" ref={sectionRef}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1 rounded-full bg-[var(--portfolio-primary)]/10 text-[var(--portfolio-primary)] text-sm font-semibold tracking-wide mb-4">
            Leadership Skills
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" data-testid="leadership-title">
            <span className="gradient-text">Leadership</span> & Achievements
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto" data-testid="leadership-description">
            Guiding teams to deliver exceptional results through vision and expertise
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {leadershipData.map((item, index) => {
            const style = getGradientStyle(index);
            return (
              <div 
                key={index} 
                data-index={index}
                className={`achievement-item bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform overflow-hidden ${
                  inView[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                data-testid={`leadership-item-${index}`}
              >
                <div className="relative">
                  {/* Colored top bar */}
                  <div className={`h-2 w-full ${style.bg}`}></div>
                  
                  <div className="p-8">
                    <div className="flex items-start space-x-4">
                      <div className={`${style.bg} p-3 rounded-xl ${style.shadow} shadow-lg`}>
                        {getIcon(item.icon)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-gray-700">{item.description}</p>
                      </div>
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
