
import { Shield, ArrowRight, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Features = () => {
  return (
    <div className="py-20 bg-white overflow-hidden">
      <div className="container-custom">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
          <div className="lg:col-span-5 mb-10 lg:mb-0">
            <h2 className="heading-lg mb-6">Experience that grows with your scale</h2>
            <p className="text-xl text-gray-600 mb-8">
              Our AI-powered platform evolves with your business needs and investor preferences to ensure optimal matches.
            </p>
            <p className="text-gray-600 mb-6">
              Multiple disconnected tools result in inefficient processes, directly impacting profitability. It's time to join up the dots and work with a unified solution that optimizes operations, cost, and drives brand growth.
            </p>
            <div className="flex items-center text-investify-primary">
              <span className="mr-2 font-medium">Learn how it works</span>
              <ArrowRight className="h-5 w-5" />
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card className="card-hover border-l-4 border-l-investify-primary">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-investify-primary bg-opacity-10 text-investify-primary mb-5">
                    <ArrowRight className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Smart matching</h3>
                  <p className="text-gray-600">
                    Create a profile and instantly connect with compatible investors that match your specific industry and funding needs.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="card-hover border-l-4 border-l-investify-primary">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-investify-primary bg-opacity-10 text-investify-primary mb-5">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Data insights</h3>
                  <p className="text-gray-600">
                    Access powerful analytics on investor preferences and market trends to optimize your funding strategy.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="card-hover border-l-4 border-l-investify-primary md:col-span-2">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-investify-primary bg-opacity-10 text-investify-primary mb-5">
                    <Shield className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Secure process</h3>
                  <p className="text-gray-600">
                    Maintain complete control over your sensitive business information with our encrypted due diligence workspace.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
