import React from "react";
import logo from '../assets/logo.svg'

const LearnMore = () => {
  return (
    <div className="bg-[#f4ebe3] text-[#5a3e36] min-h-screen font-sans">
      {/* Header */}
      <header className="flex justify-between items-center p-4 shadow-md">
        <h1 className="text-2xl font-bold flex items-center">
          <span className="mr-2"><img src={logo} className="w-14" alt="" /></span> Book House
        </h1>
        <nav>
          <a
            href="/"
            className="px-4 py-2 text-[#5a3e36] border border-[#5a3e36] rounded hover:bg-[#5a3e36] hover:text-[#f4ebe3] transition"
          >
            Back Home
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center gap-8 px-6 md:px-20 py-12">
        <div className="flex-1">
          <h2 className="text-4xl font-bold mb-4">Learn More About Us</h2>
          <p className="text-lg leading-relaxed mb-6">
            Welcome to Book House, your ultimate destination for finding books
            from every genre, author, and interest. We are committed to making
            your reading experience seamless and accessible.
          </p>
          <p className="text-lg leading-relaxed">
            Discover a platform built for book enthusiasts, offering a
            user-friendly interface, personalized recommendations, and a wide
            selection of titles. Explore the wonders of reading with us.
          </p>
        </div>
        <div className="flex-1">
          <img
            src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f"
            alt="Bookshelf"
            className="w-full rounded-lg shadow-lg"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-[#fff5ec] py-12 px-6 md:px-20">
        <h3 className="text-3xl font-bold mb-8 text-center">Our Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white shadow-md rounded-lg">
            <h4 className="text-xl font-bold mb-2">Wide Selection</h4>
            <p>
              Access thousands of books across various genres, including
              fiction, non-fiction, educational, and more.
            </p>
          </div>
          <div className="p-6 bg-white shadow-md rounded-lg">
            <h4 className="text-xl font-bold mb-2">Personalized Search</h4>
            <p>
              Find the perfect book easily with our advanced search filters and
              recommendations.
            </p>
          </div>
          <div className="p-6 bg-white shadow-md rounded-lg">
            <h4 className="text-xl font-bold mb-2">Community Support</h4>
            <p>
              Join a vibrant community of book lovers and share your reading
              journey with others.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#5a3e36] text-[#f4ebe3] py-8 px-6 md:px-20">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Book House. All rights reserved.
          </p>
          <nav className="flex gap-4">
            <a href="#" className="hover:text-gray-300">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-gray-300">
              Terms of Service
            </a>
            <a href="#" className="hover:text-gray-300">
              Contact Us
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default LearnMore;
