import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Send, Mail, Phone, MapPin } from "lucide-react";

interface ContactInfo {
  email: string;
  phone: string;
  location: string;
}

// Default fallback data
const defaultContactInfo: ContactInfo = {
  email: "contact@example.com",
  phone: "+91 98765 43210",
  location: "Kurukshetra, Haryana"
};

export default function Contact() {
  const [contactInfo, setContactInfo] = useState<ContactInfo>(defaultContactInfo);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  useEffect(() => {
    // Try to get portfolio data from localStorage
    try {
      const portfolioData = localStorage.getItem('resumeVibe_portfolioData');
      if (portfolioData) {
        const parsedData = JSON.parse(portfolioData);
        if (parsedData.contact) {
          setContactInfo({
            email: parsedData.contact.email || defaultContactInfo.email,
            phone: parsedData.contact.phone || defaultContactInfo.phone,
            location: parsedData.contact.location || defaultContactInfo.location
          });
        }
      }
    } catch (error) {
      console.error("Error loading contact data:", error);
    }
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setIsSubmitting(false);
      setFormSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset the success message after 5 seconds
      setTimeout(() => {
        setFormSubmitted(false);
      }, 5000);
    }, 1500);
  };
  
  return (
    <section id="contact" className="py-20 bg-[var(--portfolio-light)]" data-testid="contact-section">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1 rounded-full bg-[var(--portfolio-primary)]/10 text-[var(--portfolio-primary)] text-sm font-semibold tracking-wide mb-4">
            Get In Touch
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" data-testid="contact-title">
            <span className="gradient-text">Contact</span> Me
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto" data-testid="contact-description">
            Have a project in mind or want to discuss opportunities? I&apos;d love to hear from you!
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-start space-x-4" data-testid="contact-email">
              <div className="bg-[var(--portfolio-primary)]/10 p-3 rounded-xl">
                <Mail className="h-6 w-6 text-[var(--portfolio-primary)]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Email</h3>
                <a href={`mailto:${contactInfo.email}`} className="text-gray-600 hover:text-[var(--portfolio-primary)]">
                  {contactInfo.email}
                </a>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-start space-x-4" data-testid="contact-phone">
              <div className="bg-[var(--portfolio-accent)]/10 p-3 rounded-xl">
                <Phone className="h-6 w-6 text-[var(--portfolio-accent)]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Phone</h3>
                <a href={`tel:${contactInfo.phone}`} className="text-gray-600 hover:text-[var(--portfolio-accent)]">
                  {contactInfo.phone}
                </a>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-start space-x-4" data-testid="contact-location">
              <div className="bg-[var(--portfolio-secondary)]/10 p-3 rounded-xl">
                <MapPin className="h-6 w-6 text-[var(--portfolio-secondary)]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Location</h3>
                <p className="text-gray-600">{contactInfo.location}</p>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="md:col-span-2 bg-white p-8 rounded-2xl shadow-lg" data-testid="contact-form-container">
            {formSubmitted ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-600">Thank you for reaching out. I&apos;ll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--portfolio-primary)] focus:border-transparent"
                      placeholder="John Doe"
                      data-testid="contact-name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--portfolio-primary)] focus:border-transparent"
                      placeholder="john@example.com"
                      data-testid="contact-email-input"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input 
                    type="text" 
                    id="subject" 
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--portfolio-primary)] focus:border-transparent"
                    placeholder="Project Opportunity"
                    data-testid="contact-subject"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea 
                    id="message" 
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--portfolio-primary)] focus:border-transparent"
                    placeholder="I&apos;d like to discuss a project..."
                    data-testid="contact-message"
                  ></textarea>
                </div>
                
                <Button 
                  type="submit" 
                  className="gradient-bg w-full md:w-auto px-8 py-6 text-white font-semibold rounded-xl flex items-center justify-center hover:shadow-lg transition-all"
                  disabled={isSubmitting}
                  data-testid="contact-submit"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin mr-2 h-5 w-5 border-t-2 border-b-2 border-white rounded-full"></div>
                      Sending...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <span>Send Message</span>
                      <Send className="ml-2 h-5 w-5" />
                    </div>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
