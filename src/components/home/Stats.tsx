
import { ArrowUp, Users, Clock, ShoppingBag, ArrowUpRight } from "lucide-react";

const StatCard = ({ 
  percentage, 
  title, 
  description,
  bgColor = "bg-green-100",
  textColor = "text-green-800",
  icon
}: { 
  percentage: string;
  title: string;
  description: string;
  bgColor?: string;
  textColor?: string;
  icon: React.ReactNode;
}) => {
  return (
    <div className={`${bgColor} p-8 rounded-lg shadow-sm transition-transform duration-300 hover:scale-105`}>
      <div className="flex items-center gap-2 mb-3">
        <div className={`${textColor} text-3xl font-bold`}>{percentage}</div>
        <ArrowUpRight className={`h-5 w-5 ${textColor}`} />
      </div>
      <h3 className={`text-xl font-semibold mb-2 ${textColor}`}>{title}</h3>
      <p className={`${textColor} text-opacity-80`}>{description}</p>
    </div>
  );
};

const Stats = () => {
  return (
    <div className="py-16 bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="heading-lg">Why they prefer Investify</h2>
        </div>
        
        <div className="lg:max-w-5xl mx-auto">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="text-xl text-gray-600">
              Investify allows you to operate globally with ease by integrating all processes related to business funding, investor matching, and growth into a single solution.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-4">
            <StatCard
              percentage="+35%"
              title="Match rate"
              description="Boost business success with qualified investor matches."
              bgColor="bg-green-100"
              textColor="text-green-800"
              icon={<Users />}
            />
            <StatCard
              percentage="+81%"
              title="Faster funding"
              description="Make it easy for businesses to secure funding in less time."
              bgColor="bg-pink-100"
              textColor="text-pink-700"
              icon={<Clock />}
            />
            <StatCard
              percentage="+71%"
              title="Investor engagement"
              description="Encourage repeat investments and build loyal investor networks."
              bgColor="bg-purple-100"
              textColor="text-purple-700"
              icon={<ShoppingBag />}
            />
            <StatCard
              percentage="+29%"
              title="Growth rate"
              description="Help businesses scale faster with the right investment partners."
              bgColor="bg-yellow-100"
              textColor="text-yellow-700"
              icon={<ArrowUp />}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
