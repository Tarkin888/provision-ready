import { Link } from "react-router-dom";
const Footer = () => {
  return <footer className="border-t border-border bg-secondary/5 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-secondary mb-4">ReadiNow</h3>
              <p className="text-sm text-muted-foreground">
                GRC platform for Provision 29 compliance and material controls monitoring.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-secondary mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/about" className="hover:text-primary transition-colors">
                    About Assessment
                  </Link>
                </li>
                <li>
                  <Link to="/assessment" className="hover:text-primary transition-colors">
                    Take Assessment
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-secondary mb-4">Contact</h3>
              <p className="text-sm text-muted-foreground">
                Get in touch to learn more about ReadiNow GRC solutions.
              </p>
            </div>
          </div>
          
          <div className="border-t border-border pt-8">
            <p className="text-sm text-muted-foreground text-center mb-2">
              Assessment methodology developed by{" "}
              <span className="font-medium text-secondary">Accelerated Growth Consulting Ltd               </span>
            </p>
            <p className="text-xs text-muted-foreground text-center">
              Powered by ReadiNow GRC Platform | © {new Date().getFullYear()} All rights reserved
            </p>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;