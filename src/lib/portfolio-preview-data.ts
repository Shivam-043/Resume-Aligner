import { PortfolioData } from './portfolio-context';

export const SAMPLE_PORTFOLIO_DATA: PortfolioData = {
  personalInfo: {
    name: "Alex Johnson",
    jobTitle: "Senior Software Engineer",
    summary: "Passionate full-stack developer with 5+ years of experience building scalable web applications. Experienced in React, Node.js, and cloud technologies with a focus on creating user-centric solutions.",
    location: "San Francisco, CA",
    email: "alex.johnson@email.com",
    phone: "+1 (555) 123-4567",
    linkedin: "alexjohnson",
    github: "alexj-dev",
    website: "https://alexjohnson.dev"
  },
  experience: [
    {
      company: "TechCorp Solutions",
      role: "Senior Software Engineer",
      duration: "Jan 2021 - Present",
      location: "San Francisco, CA",
      achievements: [
        "Led development of microservices architecture serving 10M+ users",
        "Reduced application load time by 40% through performance optimizations",
        "Mentored 5 junior developers and established code review best practices"
      ]
    },
    {
      company: "StartupXYZ",
      role: "Full Stack Developer",
      duration: "Jun 2019 - Dec 2020",
      location: "Remote",
      achievements: [
        "Built responsive web applications using React and Node.js",
        "Implemented CI/CD pipelines reducing deployment time by 60%",
        "Collaborated with design team to improve user experience"
      ]
    }
  ],
  skills: [
    {
      category: "Programming Languages",
      items: [
        { name: "JavaScript", percentage: 95 },
        { name: "TypeScript", percentage: 90 },
        { name: "Python", percentage: 85 },
        { name: "Java", percentage: 75 }
      ]
    },
    {
      category: "Frameworks & Libraries",
      items: [
        { name: "React", percentage: 95 },
        { name: "Node.js", percentage: 90 },
        { name: "Next.js", percentage: 85 },
        { name: "Express.js", percentage: 80 }
      ]
    },
    {
      category: "Tools & Technologies",
      items: [
        { name: "AWS", percentage: 85 },
        { name: "Docker", percentage: 80 },
        { name: "Git", percentage: 95 },
        { name: "MongoDB", percentage: 75 }
      ]
    }
  ],
  projects: [
    {
      title: "E-Commerce Platform",
      description: "Full-stack e-commerce solution with real-time inventory management, payment processing, and analytics dashboard.",
      technologies: ["React", "Node.js", "MongoDB", "Stripe API", "AWS"],
      link: "https://github.com/alexj-dev/ecommerce-platform"
    },
    {
      title: "Task Management App",
      description: "Collaborative project management tool with real-time updates, file sharing, and team communication features.",
      technologies: ["Next.js", "Socket.io", "PostgreSQL", "Redis"],
      link: "https://github.com/alexj-dev/task-manager"
    },
    {
      title: "Weather Analytics Dashboard",
      description: "Interactive dashboard for weather data visualization with predictive analytics and location-based insights.",
      technologies: ["React", "D3.js", "Python", "FastAPI", "Docker"],
      link: "https://github.com/alexj-dev/weather-dashboard"
    }
  ],
  leadership: [
    {
      title: "Team Leadership",
      description: "Led cross-functional teams to deliver high-impact projects on time and within budget constraints.",
      icon: "users"
    },
    {
      title: "Technical Excellence",
      description: "Established coding standards and best practices that improved code quality and reduced bugs by 30%.",
      icon: "trophy"
    },
    {
      title: "Innovation Driver",
      description: "Championed adoption of new technologies and methodologies that increased team productivity.",
      icon: "lightbulb"
    },
    {
      title: "Strategic Planning",
      description: "Developed technical roadmaps aligned with business objectives and market requirements.",
      icon: "target"
    }
  ],
  education: [
    {
      institution: "University of California, Berkeley",
      degree: "Bachelor of Science in Computer Science",
      duration: "2015 - 2019",
      location: "Berkeley, CA",
      details: [
        "Graduated Magna Cum Laude with 3.8 GPA",
        "Relevant Coursework: Data Structures, Algorithms, Software Engineering",
        "Dean's List for 6 semesters"
      ]
    }
  ],
  contact: {
    email: "alex.johnson@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA"
  }
};