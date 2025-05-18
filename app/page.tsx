import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Battery, MapPin, Zap } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-green-600 text-white">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6" />
            <h1 className="text-2xl font-bold">EV Route Planner</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="font-medium hover:underline">
              Home
            </Link>
            <Link href="/map" className="font-medium hover:underline">
              Plan Route
            </Link>
            <Link href="/stations" className="font-medium hover:underline">
              Charging Stations
            </Link>
            <Link href="/about" className="font-medium hover:underline">
              About
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline" className="bg-white text-green-600 hover:bg-green-50">
                Login
              </Button>
            </Link>
            <Link href="/register" className="hidden md:block">
              <Button className="bg-green-700 hover:bg-green-800">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-green-600 to-green-500 text-white py-20">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Smart EV Route Planning for Worry-Free Travel</h2>
              <p className="text-xl mb-8">
                Plan your electric vehicle journeys with confidence. Find optimal routes with charging stops based on
                your battery level and vehicle range.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/map">
                  <Button size="lg" className="bg-white text-green-600 hover:bg-green-50">
                    Plan Your Route
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/stations">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-green-600">
                    Find Charging Stations
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                  <div className="bg-gray-200 h-48 relative">
                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                      <MapPin className="h-12 w-12 text-green-600" />
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-800">San Francisco</h3>
                        <p className="text-sm text-gray-500">Starting Point</p>
                      </div>
                      <div className="flex items-center">
                        <Battery className="h-5 w-5 text-green-600 mr-1" />
                        <span className="text-sm font-medium text-gray-700">85%</span>
                      </div>
                    </div>
                    <div className="w-full h-px bg-gray-200 my-4"></div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-800">Los Angeles</h3>
                        <p className="text-sm text-gray-500">Destination</p>
                      </div>
                      <div className="text-sm font-medium text-gray-700">382 miles</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Smart Features for EV Drivers</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Battery className="h-10 w-10 text-green-600" />}
                title="Battery-Aware Routing"
                description="Our intelligent algorithm considers your current battery level and vehicle range to plan the most efficient route with optimal charging stops."
              />
              <FeatureCard
                icon={<MapPin className="h-10 w-10 text-green-600" />}
                title="Real-Time Charger Availability"
                description="Get up-to-date information on charging station availability, pricing, and amenities to make informed decisions on your journey."
              />
              <FeatureCard
                icon={<Zap className="h-10 w-10 text-green-600" />}
                title="Smart Alerts & Notifications"
                description="Receive timely alerts about battery levels, nearby charging stations, and potential route adjustments to ensure a smooth trip."
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Plan Your EV Journey?</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of EV drivers who travel with confidence using our smart route planner.
            </p>
            <Link href="/register">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                Create Free Account
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">EV Route Planner</h3>
              <p className="text-gray-400">
                Smart route planning for electric vehicles, helping you travel with confidence.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/map" className="text-gray-400 hover:text-white">
                    Plan Route
                  </Link>
                </li>
                <li>
                  <Link href="/stations" className="text-gray-400 hover:text-white">
                    Charging Stations
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/help" className="text-gray-400 hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-gray-400 hover:text-white">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-400 hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-400 hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
              <p className="text-gray-400 mb-4">Stay updated with the latest features and EV news.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} EV Route Planner. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
