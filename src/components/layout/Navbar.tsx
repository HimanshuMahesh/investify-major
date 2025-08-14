
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="py-5 bg-white sticky top-0 z-50 shadow-sm">
      <div className="container-custom">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-investify-primary font-garrett">Investify</span>
            </Link>
          </div>


          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login">
              <Button variant="outline" className="px-6">Log in</Button>
            </Link>
            <Link to="/signup">
              <Button className="px-6">Sign up</Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              type="button"
              onClick={toggleMenu}
              className="p-2 text-gray-500 rounded-md hover:bg-gray-100"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 pt-4 pb-3 border-t animate-fade-in">
            <div className="space-y-3">
              <Link 
                to="/login" 
                className="block px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100"
                onClick={toggleMenu}
              >
                Log in
              </Link>
              <Link 
                to="/signup" 
                className="w-full"
                onClick={toggleMenu}
              >
                <Button className="w-full">Sign up</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
