import { useEffect } from "react";
import Navigation from "../components/navigation";
import Hero from "../components/hero";
import About from "../components/about";
import Experience from "../components/experience";
import Skills from "../components/skills";
import Leadership from "../components/leadership";
import Contact from "../components/contact";
import Footer from "../components/footer";

export default function Portfolio() {
  useEffect(() => {
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

  return (
    <div className="overflow-x-hidden">
      <Navigation />
      <Hero />
      <About />
      <Experience />
      <Skills />
      <Leadership />
      <Contact />
      <Footer />
    </div>
  );
}
