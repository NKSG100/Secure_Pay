import React from "react";

const AboutPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-gray-900 to-gray-800">
      <main className="flex-grow container mx-auto px-6 py-16 md:px-12 md:py-24">
        <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-6 text-center tracking-wider animate-pulse">
          About Us
        </h2>
        <p className="text-lg text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
          Welcome to our platform. We provide easy and secure ways to send and receive money. Our mission is to make financial transactions simple and accessible to everyone.
        </p>

        <section className="bg-gray-800 shadow-2xl rounded-xl p-10 md:p-12 space-y-8 mb-14 transform hover:scale-105 transition-transform duration-300 hover:shadow-purple-500/50">
          <h3 className="text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 text-center animate-pulse">
            Our Mission
          </h3>
          <p className="text-gray-300 text-center max-w-2xl mx-auto text-lg">
            Our goal is to create a seamless, user-friendly experience for all types of transactions, whether it's sending money to a friend or managing regular payments.
          </p>
        </section>

        <section className="bg-gray-800 shadow-2xl rounded-xl p-10 md:p-12 space-y-8 transform hover:scale-105 transition-transform duration-300 hover:shadow-purple-500/50">
          <h3 className="text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 text-center animate-pulse">
            Contact Us
          </h3>
          <p className="text-gray-300 text-center text-lg max-w-2xl mx-auto">
            If you have any questions or need assistance, feel free to reach out to us.
          </p>
          <ul className="list-disc pl-8 space-y-4 text-gray-300">
            <li>
              Email:{" "}
              <a
                href="mailto:support@example.com"
                className="text-blue-400 hover:text-blue-300 transition-colors duration-300"
              >
                support@example.com
              </a>
            </li>
            <li>
              Phone:{" "}
              <a
                href="tel:+1234567890"
                className="text-blue-400 hover:text-blue-300 transition-colors duration-300"
              >
                +123 456 7890
              </a>
            </li>
            <li>Address: 1234 Street, City, Country</li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default AboutPage;