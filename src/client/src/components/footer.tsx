import { Linkedin, Github, Twitter, Mail } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-gray-300 py-12" data-testid="footer">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4" data-testid="footer-name">Shivam Krishan Varshney</h2>
            <p className="text-gray-400 max-w-md" data-testid="footer-tagline">
              Transforming ideas into exceptional mobile experiences with Flutter and Android development.
            </p>
          </div>
          
          <div className="md:text-right">
            <h3 className="text-lg font-medium text-white mb-4" data-testid="footer-connect">Connect With Me</h3>
            <div className="flex space-x-4 md:justify-end">
              <a 
                href="https://linkedin.com/in/shivamkvarshney" 
                target="_blank" 
                rel="noreferrer"
                className="bg-gray-800 p-3 rounded-full hover:bg-blue-600 transition-colors"
                aria-label="LinkedIn Profile"
                data-testid="footer-linkedin"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a 
                href="https://github.com/Shivam-043" 
                target="_blank" 
                rel="noreferrer"
                className="bg-gray-800 p-3 rounded-full hover:bg-gray-600 transition-colors"
                aria-label="GitHub Profile"
                data-testid="footer-github"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="https://twitter.com/ShivamK12345" 
                target="_blank" 
                rel="noreferrer"
                className="bg-gray-800 p-3 rounded-full hover:bg-blue-400 transition-colors"
                aria-label="Twitter Profile"
                data-testid="footer-twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="mailto:contact@example.com" 
                className="bg-gray-800 p-3 rounded-full hover:bg-red-500 transition-colors"
                aria-label="Email me"
                data-testid="footer-mail"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-sm text-gray-500" data-testid="footer-copyright">
            &copy; {currentYear} Shivam Krishan Varshney. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
