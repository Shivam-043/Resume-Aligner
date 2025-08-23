import { useEffect, useState } from "react";
import { Code, Database, Paintbrush, Layers, Server } from "lucide-react";

interface SkillItem {
  name: string;
  percentage: number;
}

interface SkillCategory {
  category: string;
  items: SkillItem[];
}

// Default fallback skills data with percentages
const defaultSkillsData: SkillCategory[] = [
  {
    category: "Languages",
    items: [
      { name: "Dart", percentage: 95 },
      { name: "JavaScript", percentage: 85 },
      { name: "Kotlin", percentage: 90 },
      { name: "TypeScript", percentage: 80 },
      { name: "Java", percentage: 75 }
    ]
  },
  {
    category: "Frameworks",
    items: [
      { name: "Flutter", percentage: 95 },
      { name: "React.js", percentage: 85 },
      { name: "Node.js", percentage: 80 },
      { name: "Express.js", percentage: 80 },
      { name: "Socket.IO", percentage: 75 }
    ]
  },
  {
    category: "Databases",
    items: [
      { name: "MongoDB", percentage: 90 },
      { name: "Firebase", percentage: 95 },
      { name: "PostgreSQL", percentage: 80 },
      { name: "GraphCMS", percentage: 75 },
      { name: "Redis", percentage: 70 }
    ]
  },
  {
    category: "Other Technologies",
    items: [
      { name: "REST APIs", percentage: 90 },
      { name: "OAuth", percentage: 80 },
      { name: "Kubernetes", percentage: 60 },
      { name: "Microservices", percentage: 85 },
      { name: "Agile/Scrum", percentage: 85 }
    ]
  }
];

export default function Skills() {
  const [skillsData, setSkillsData] = useState<SkillCategory[]>(defaultSkillsData);
  const [animated, setAnimated] = useState<boolean[]>([]);
  
  useEffect(() => {
    // Try to get portfolio data from localStorage
    try {
      const portfolioData = localStorage.getItem('resumeVibe_portfolioData');
      if (portfolioData) {
        const parsedData = JSON.parse(portfolioData);
        if (parsedData.skills && Array.isArray(parsedData.skills) && parsedData.skills.length > 0) {
          // Convert data format if needed - from array of strings to array of objects with percentages
          const formattedSkills = parsedData.skills.map((category: any) => {
            return {
              category: category.category,
              items: category.items.map((item: string | SkillItem) => {
                if (typeof item === 'string') {
                  // Convert string items to objects with default percentages between 70-95
                  return {
                    name: item,
                    percentage: Math.floor(Math.random() * (95 - 70 + 1)) + 70
                  };
                }
                return item;
              })
            };
          });
          setSkillsData(formattedSkills);
        }
      }
    } catch (error) {
      console.error("Error loading skills data:", error);
    }
    
    // Setup animation observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            if (!isNaN(index)) {
              setAnimated(prev => {
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

    // Initialize animation state
    setAnimated(new Array(skillsData.length).fill(false));
    
    // Observe skill categories
    setTimeout(() => {
      const skillItems = document.querySelectorAll('.skill-category');
      skillItems.forEach(item => {
        observer.observe(item);
      });
    }, 100);

    return () => {
      const skillItems = document.querySelectorAll('.skill-category');
      skillItems.forEach(item => {
        observer.unobserve(item);
      });
    };
  }, []);

  // Associate icons with skill categories
  const getCategoryIcon = (category: string) => {
    const lowerCategory = category.toLowerCase();
    if (lowerCategory.includes('language')) {
      return <Code className="h-6 w-6 text-white" />;
    } else if (lowerCategory.includes('database')) {
      return <Database className="h-6 w-6 text-white" />;
    } else if (lowerCategory.includes('framework')) {
      return <Layers className="h-6 w-6 text-white" />;
    } else if (lowerCategory.includes('other') || lowerCategory.includes('technolog')) {
      return <Server className="h-6 w-6 text-white" />;
    } else {
      return <Paintbrush className="h-6 w-6 text-white" />;
    }
  };

  // Get style for category
  const getCategoryStyle = (index: number) => {
    const styles = [
      {
        bg: "bg-gradient-to-br from-blue-50 to-indigo-50",
        iconBg: "bg-gradient-to-br from-blue-500 to-indigo-500",
        barColor: "bg-gradient-to-r from-blue-500 to-indigo-500"
      },
      {
        bg: "bg-gradient-to-br from-green-50 to-teal-50",
        iconBg: "bg-gradient-to-br from-green-500 to-teal-500",
        barColor: "bg-gradient-to-r from-green-500 to-teal-500"
      },
      {
        bg: "bg-gradient-to-br from-purple-50 to-pink-50",
        iconBg: "bg-gradient-to-br from-purple-500 to-pink-500",
        barColor: "bg-gradient-to-r from-purple-500 to-pink-500"
      },
      {
        bg: "bg-gradient-to-br from-orange-50 to-red-50",
        iconBg: "bg-gradient-to-br from-orange-500 to-red-500",
        barColor: "bg-gradient-to-r from-orange-500 to-red-500"
      }
    ];
    return styles[index % styles.length];
  };
  
  return (
    <section id="skills" className="py-20 bg-white" data-testid="skills-section">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1 rounded-full bg-[var(--portfolio-primary)]/10 text-[var(--portfolio-primary)] text-sm font-semibold tracking-wide mb-4">
            Technical Skills
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" data-testid="skills-title">
            <span className="gradient-text">Technical</span> Skills
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto" data-testid="skills-description">
            Proficient in modern technologies and frameworks for full-stack development
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {skillsData.map((category, index) => {
            const style = getCategoryStyle(index);
            return (
              <div 
                key={index}
                data-index={index} 
                className={`skill-category ${style.bg} p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform ${
                  animated[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                data-testid={`skill-category-${index}`}
              >
                <div className="text-center mb-6">
                  <div className={`w-16 h-16 ${style.iconBg} rounded-xl flex items-center justify-center text-white text-2xl mx-auto mb-4 shadow-md`}>
                    {getCategoryIcon(category.category)}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{category.category}</h3>
                </div>

                <div className="space-y-3">
                  {category.items.map((skill, skillIndex) => (
                    <div key={skillIndex} className="skill-item">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                        <span className="text-sm text-gray-500">{skill.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 skill-bar">
                        <div 
                          className={`${style.barColor} h-2 rounded-full transition-all duration-1000 ease-out`}
                          style={{ 
                            width: animated[index] ? `${skill.percentage}%` : '0%'
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
