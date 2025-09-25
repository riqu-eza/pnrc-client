import "../pages/about.css";
import "./page.css";
export default function About() {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="hero-section relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-black/30 z-0"></div>
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: "url(/images/about1.jpg)" }}
        ></div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-black/80 mb-8 drop-shadow-lg">
            Palmnazi - RC
          </h1>

          <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-500/70 to-blue-500/50 backdrop-blur- rounded-xl p-8 shadow-2xl border border-blue-300/20">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-white">
                About Us
              </span>
            </h2>
            <p className="text-lg md:text-xl text-blue-100 leading-relaxed">
              Welcome to PALMNAZI RC Integrated Tourism Marketing Company, an
              innovative, dynamic and ultimate leader in tourism promotion,
              local area culture, local businesses and Natural Heritage
              preservation and conservation of natural ecosystem in our regions
              across Africa. Our marketing strategy is a multifaceted,
              diversified and integrated resort city based approach that covers
              a range of services and products.
            </p>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            ></path>
          </svg>
        </div>
      </section>

      {/* Full Width Content Section */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-6">
                Our Integrated Approach
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                We cover three thematic areas: Tourism, Local Businesses and
                Natural Heritage Conservation. In broad terms these include
                hotels and lodges, Conventions & Conferences, tour operators,
                and local businesses to boost the needs of local communities and
                Cultures.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Our objective is the advancement of greater holistic impact of
                tourism to local communities and raising awareness of
                conservation of our unique biodiversity, within the resort
                cities and other holiday destinations as best offers in our
                regions.
              </p>
            </div>
            <div className="lg:w-1/2">
              <div className="rounded-xl overflow-hidden shadow-2xl transform hover:scale-105 transition duration-500">
                <img
                  src="/images/aboutbusiness.jpg"
                  alt="Our Business"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-blue-600 mb-4">
              Why Choose Us?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover what makes us different and why we&#39;re the preferred
              choice for travelers and businesses alike.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="group relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col">
              <div
                className="h-64 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                style={{ backgroundImage: "url(/images/card1.webp)" }}
              >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
              </div>
              <div className="p-6 flex-grow">
                <div className="absolute top-3 left-4 bg-blue-600 text-white p-3 rounded-lg shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3 mt-4">
                  Premier Destinations
                </h3>
                <p className="text-gray-600">
                  Destinations are updated frequently meeting diverse tastes and
                  needs of clients.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col">
              <div
                className="h-64 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                style={{ backgroundImage: "url(/images/aboutbusiness.jpg)" }}
              >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
              </div>
              <div className="p-6 flex-grow">
                <div className="absolute top-3 left-4 bg-blue-600 text-white p-3 rounded-lg shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3 mt-4">
                  Business Network
                </h3>
                <p className="text-gray-600">
                  Building stronger, more authentic local businesses and
                  communities together.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col">
              <div
                className="h-64 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                style={{ backgroundImage: "url(/images/local-community.jpg)" }}
              >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
              </div>
              <div className="p-6 flex-grow">
                <div className="absolute top-3 left-4 bg-blue-600 text-white p-3 rounded-lg shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3 mt-4">
                  Local Community
                </h3>
                <p className="text-gray-600">
                  We are local, we love local, we act local. Exposing local
                  cultures.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
