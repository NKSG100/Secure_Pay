import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white text-center p-4">
      <p>&copy; {new Date().getFullYear()} Secure Pay. All rights reserved.</p>
    </footer>
  );
};

export default Footer;