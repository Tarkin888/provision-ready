import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import logo from "@/assets/readinow-logo.png";
import { useState, useEffect } from "react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-50 w-full border-b border-border bg-card transition-shadow duration-200 ease-in-out ${
        isScrolled ? "shadow-[0_2px_8px_rgba(0,0,0,0.1)]" : "shadow-none"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center">
          </Link>
          <div className="flex items-center gap-6">
            <Link
              to="/about"
              className="text-sm font-medium text-secondary hover:text-primary transition-colors"
            >
              About
            </Link>
            <Link
              to="/login"
              className="text-sm font-medium text-secondary hover:text-primary transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
