// src/components/Footer.jsx

import { useEffect, useState } from "react";
import {} from "react-router-dom";
import "./footer.css";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
const Footer = () => {
  const [form, setForm] = useState({ name: "", email: "" });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [message]);
  const handlesubscribe = async (event) => {
    event.preventDefault();

    if (!form.name || !form.email) {
      setMessage("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/letter/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Subscription failed");
      }

      const data = await response.json();
      console.log("Subscription created", data);
      
      // Show success message
      setMessage("Thank you for subscribing! A confirmation email has been sent.");
      
      // Clear the form
      setForm({ name: "", email: "" });

    } catch (error) {
      console.error("Error creating subscription:", error);
      setMessage("Subscription failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleChange = (event) => {
    const { id, value } = event.target;
    setForm((prevForm) => ({
      ...prevForm,
      [id]: value,
    }));
  };
  return (
    <footer className="min-h-screen flex items-center text-white p-8 footer footer">
      <div className="container mx-auto h-full">
        {/* Newsletter Subscription Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl mb-4">
            Subscribe to our newsletter to get updates and new trends!
          </h1>
          <p className="text-gray-300 mb-8">Join Our Database NOW</p>
          
          <form
            onSubmit={handlesubscribe}
            className="flex flex-col md:flex-row justify-center items-center"
          >
            <input
              type="text"
              id="name"
              placeholder="Name"
              value={form.name}
              className="m-2 px-4 py-2 w-full md:w-64 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-800 bg-white"
              onChange={handleChange}
              required
            />
            <input
              type="email"
              id="email"
              placeholder="Email Address"
              value={form.email}
              className="m-2 px-4 py-2 w-full md:w-64 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-800 bg-white"
              onChange={handleChange}
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className={`m-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
          
          {/* Message display */}
          {message && (
            <div className={`mt-4 p-2 rounded-md ${
              message.includes("Thank you") 
                ? "bg-green-500" 
                : "bg-red-500"
            }`}>
              {message}
            </div>
          )}
        </div>
        {/* Footer Sections */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-center md:text-left">
          {/* Left Section */}
          <div className="w-full md:w-1/3 px-4 mb-6 md:mb-0">
            <div className="flex flex-col md:flex-row items-center md:items-start">
              <div>
                <h3 className="text-lg font-semibold mb-1">Give Us a Call</h3>
                <p className="text-gray-300">+254 - 794369806</p>
              </div>
            </div>
          </div>

          {/* Center Section */}
          <div className="w-full md:w-1/3 px-4 mb-6 md:mb-0 ">
            <h3 className="text-lg font-semibold mb-2">Come & Drop By</h3>
            <p>
              4th Floor palmnazi_rc Plaza
              <br />
              Nairobi
            </p>
            <div className="flex justify-center md:justify-start space-x-4 mt-4">
              <a
                href="https://www.facebook.com"
                className="text-white hover:text-gray-300"
              >
                <FaFacebook className="text-2xl" />
              </a>
              <a
                href="https://www.twitter.com"
                className="text-white hover:text-gray-300"
              >
                <FaTwitter className="text-2xl" />
              </a>
              <a
                href="https://www.instagram.com"
                className="text-white hover:text-gray-300"
              >
                <FaInstagram className="text-2xl" />
              </a>
              <a
                href="https://www.linkedin.com"
                className="text-white hover:text-gray-300"
              >
                <FaLinkedin className="text-2xl" />
              </a>
            </div>
          </div>

          {/* Right Section */}
          <div className="w-full md:w-1/3 px-4 mb-6 md:mb-0">
            <h3 className="text-lg font-semibold mb-2">Send Us a Message</h3>
            <a href="mailto:info@palmnazi_rc.com" className="hover:underline">
              info@palmnazi_rc.com
            </a>
          </div>
        </div>

        {/* Footer Bottom */}
        <p className="text-center mt-24 text-gray-100">
          Copyright 2025 @PalmNazi | powered by{" "}
          <a
            href="https://dancahtechnology.co.ke"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white transition"
          >
            dancah technology
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
