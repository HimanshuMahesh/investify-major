
const Testimonials = () => {
  return (
    <div className="py-16 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="heading-lg">We've helped innovative companies</h2>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Hear from the businesses and investors who found their perfect match
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-xl font-bold text-blue-700 mr-4">TB</div>
              <div>
                <h4 className="font-semibold text-gray-900">Tech Bloom</h4>
                <p className="text-sm text-gray-500">SaaS Startup</p>
              </div>
            </div>
            <p className="text-gray-700">
              "We were struggling to find investors who understood our niche market. Within weeks of using Investify, we connected with three perfect matches and closed our Series A."
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-xl font-bold text-green-700 mr-4">GF</div>
              <div>
                <h4 className="font-semibold text-gray-900">Green Future</h4>
                <p className="text-sm text-gray-500">CleanTech Innovator</p>
              </div>
            </div>
            <p className="text-gray-700">
              "The AI matchmaking saved us months of networking. We received term sheets from investors who were genuinely excited about our mission and technology."
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-xl font-bold text-purple-700 mr-4">AP</div>
              <div>
                <h4 className="font-semibold text-gray-900">Alpha Partners</h4>
                <p className="text-sm text-gray-500">Venture Capital Firm</p>
              </div>
            </div>
            <p className="text-gray-700">
              "Investify's platform has dramatically improved our deal flow quality. We've discovered promising startups that would have been off our radar through traditional channels."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
