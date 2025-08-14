
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <div className="py-20 bg-pink-100 relative overflow-hidden">
      <div className="absolute left-0 bottom-0">
        <svg width="120" height="160" viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,0 C80,30 120,60 120,120 C120,140 100,150 80,160" stroke="#0A3141" strokeWidth="10" fill="none" />
        </svg>
      </div>
      <div className="absolute right-0 top-0">
        <svg width="120" height="160" viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M120,0 C40,30 0,60 0,120 C0,140 20,150 40,160" stroke="#0A3141" strokeWidth="10" fill="none" />
        </svg>
      </div>
      <div className="container-custom relative z-10">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-4xl font-garrett font-bold mb-6">Let's talk!</h2>
          <p className="text-lg text-gray-700 mb-8">
            Ready to level up your investment process? Join thousands of businesses and investors who are using Investify.
          </p>
          <Link to="/signup">
            <Button size="lg" className="bg-white text-investify-navy hover:bg-gray-100 rounded-full px-8 py-6">
              Book a demo
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CTA;
