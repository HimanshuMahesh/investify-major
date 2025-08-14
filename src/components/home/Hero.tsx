
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-investify-mint/30">
      <div className="container-custom pt-20 pb-24 lg:pt-28 lg:pb-32">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
          <div className="lg:col-span-6 z-10">
            <h1 className="heading-xl mb-6">
              <span className="block font-garrett">Welcome to the</span>
              <span className="block font-garrett text-gradient">platform that makes</span>
              <span className="block font-garrett">investor matching efficient</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg">
              Investify centralizes business profiles, investors, and logistics in one dashboard, helping innovative companies connect with the right funding partners.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto px-8 py-6 rounded-full font-medium">
                  Get started
                </Button>
              </Link>
              <Link to="/how-it-works">
                <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 py-6 rounded-full border-investify-primary text-investify-primary hover:bg-investify-primary/5">
                  Book a demo
                </Button>
              </Link>
            </div>
          </div>
          <div className="mt-16 sm:mt-24 lg:mt-0 lg:col-span-6">
            <div className="relative">
              <div className="absolute -top-12 -right-12 w-64 h-64 bg-investify-primary/20 rounded-full blur-3xl"></div>
              <div className="relative">
                <div className="bg-white sm:max-w-md sm:w-full sm:mx-auto sm:rounded-xl sm:overflow-hidden shadow-xl">
                  <div className="px-4 py-8 sm:px-6">
                    <div className="bg-investify-primary rounded-lg p-2 mb-4 inline-flex">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                      </svg>
                    </div>
                    <div className="relative">
                      <div className="flex items-start space-x-3 mb-6">
                        <div className="h-10 w-10 flex-shrink-0 rounded bg-gray-200"></div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Tech Innovate</h3>
                          <p className="text-sm text-gray-500">Software & AI • Series A</p>
                        </div>
                      </div>
                      <div className="border rounded-md p-3 mb-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">Seeking</h4>
                          <p className="text-investify-primary font-bold">₹1,800,000</p>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full mt-2">
                          <div className="h-2 bg-investify-primary rounded-full" style={{ width: '65%' }}></div>
                        </div>
                      </div>
                      <div className="border border-investify-primary rounded-md p-4 mb-4 bg-gradient-to-r from-white to-blue-50">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">Investor match</h4>
                            <p className="text-sm text-gray-500">94% compatibility</p>
                          </div>
                          <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-investify-navy">VC</div>
                        </div>
                      </div>
                      <Button className="w-full rounded-full">Connect now</Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-green-300/20 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
