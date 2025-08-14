
import { CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const PricingCard = ({ 
  title, 
  price, 
  description, 
  features, 
  buttonText, 
  popular = false 
}: { 
  title: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  popular?: boolean;
}) => {
  return (
    <div className={`
      p-8 rounded-lg shadow-md transition-all
      ${popular ? 'border-2 border-investify-primary scale-105 bg-white' : 'border border-gray-200 bg-white'}
    `}>
      {popular && (
        <span className="inline-block px-3 py-1 text-xs font-medium text-investify-primary bg-investify-primary bg-opacity-10 rounded-full mb-4">
          Most Popular
        </span>
      )}
      <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
      <div className="mt-4 flex items-baseline text-gray-900">
        <span className="text-3xl font-extrabold tracking-tight">{price}</span>
        <span className="ml-1 text-xl font-semibold">/month</span>
      </div>
      <p className="mt-5 text-gray-500">{description}</p>
      <ul className="mt-8 space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex">
            <div className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-green-100 text-green-800">
              <CheckIcon className="h-4 w-4" />
            </div>
            <span className="ml-3 text-gray-500">{feature}</span>
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <Link to="/signup">
          <Button variant={popular ? "default" : "outline"} className="w-full">
            {buttonText}
          </Button>
        </Link>
      </div>
    </div>
  );
};

const Pricing = () => {
  return (
    <div className="py-16 bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="heading-lg">Simple, transparent pricing</h2>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that's right for your business or investment strategy
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <PricingCard
            title="Free"
            price="₹0"
            description="Perfect for exploring the platform"
            features={[
              "Basic profile creation",
              "Up to 3 matches per month",
              "Limited analytics",
              "Community support"
            ]}
            buttonText="Get started"
          />
          <PricingCard
            title="Business"
            price="₹5,999"
            description="Everything you need to secure funding"
            features={[
              "Enhanced business profile",
              "Unlimited investor matches",
              "Advanced analytics dashboard",
              "Priority support",
              "Due diligence workspace"
            ]}
            buttonText="Start your trial"
            popular={true}
          />
          <PricingCard
            title="Investor"
            price="₹9,999"
            description="For active investors seeking opportunities"
            features={[
              "Advanced filtering tools",
              "Unlimited business matches",
              "Deal flow management",
              "Market insights dashboard",
              "Due diligence workspace",
              "Portfolio tracking"
            ]}
            buttonText="Start your trial"
          />
        </div>
      </div>
    </div>
  );
};

export default Pricing;
