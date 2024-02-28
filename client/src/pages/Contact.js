import React from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const Contact = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold text-center mb-4">Contact Us</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src="/images/support1.webp"
            alt="Contact"
            className="w-full rounded-lg mb-4"
            style={{ maxWidth: "500px" }} // Adjust the maximum width as needed
          />
        </div>
        <div>
          <div className="flex items-center mb-4">
            <FaPhone className="text-xl mr-2" />
            <span>1800-0000-0000</span>
          </div>
          <div className="flex items-center mb-4">
            <FaEnvelope className="text-xl mr-2" />
            <a
              href="mailto:support@ecommerce.com"
              className="text-gray-700 hover:text-gray-900"
            >
              support@ecommerce.com
            </a>
          </div>
          <div className="flex items-center">
            <FaMapMarkerAlt className="text-xl mr-2" />
            <span>123 Street, City, Country</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
