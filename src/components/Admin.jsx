import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUser } from "./Adminuser";

const Admin = () => {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [usernameEntered, setUsernameEntered] = useState(false);
  useUser(); 

  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    const savedAuthenticated = localStorage.getItem("authenticated");
    const expirationTime = localStorage.getItem("expirationTime");
    const currentTime = new Date().getTime();

    if (expirationTime && currentTime < parseInt(expirationTime, 10)) {
      if (savedAuthenticated === "true") {
        setAuthenticated(true);
      }

      if (savedUsername) {
        setUsernameEntered(true);
        setUsername(savedUsername);
      }
    } else {
      localStorage.removeItem("username");
      localStorage.removeItem("authenticated");
      localStorage.removeItem("expirationTime");
    }
  }, []);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === "Palmnazi@2024") {
      setAuthenticated(true);
      localStorage.setItem("authenticated", "true");

      const expirationTime = new Date().getTime() + 3 * 60 * 60 * 1000; // 24 hours
      localStorage.setItem("expirationTime", expirationTime.toString());
    } else {
      alert("Incorrect password");
    }
  };

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (username) {
      setUsernameEntered(true);
      localStorage.setItem("username", username);

      const expirationTime = new Date().getTime() + 6 * 60 * 60 * 1000; // 24 hours
      localStorage.setItem("expirationTime", expirationTime.toString());
    } else {
      alert("Please enter a username");
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form onSubmit={handlePasswordSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
          <h1 className="text-2xl font-bold mb-4 text-center">Admin Login</h1>
          <label className="block mb-2 text-gray-700">
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-2 rounded w-full mt-1"
            />
          </label>
          <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mt-4 w-full">
            Submit
          </button>
        </form>
      </div>
    );
  }

  if (!usernameEntered) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form onSubmit={handleUsernameSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
          <h1 className="text-2xl font-bold mb-4 text-center">Enter Username</h1>
          <label className="block mb-2 text-gray-700">
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border p-2 rounded w-full mt-1"
            />
          </label>
          <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mt-4 w-full">
            Submit
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-semibold mb-6 text-center">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Link
          to="/createlisting"
          className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg flex items-center justify-center"
        >
          Create Listing
        </Link>
        <Link 
          to="/property" 
          className="bg-violet-700 hover:bg-pink-600 text-white p-4 rounded-lg flex items-center justify-center"
        >
          Property
        </Link>
        <Link
          to="/addimage"
          className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg flex items-center justify-center"
        >
          Add City Information
        </Link>
        <Link
          to="/addblog"
          className="bg-yellow-500 hover:bg-yellow-600 text-white p-4 rounded-lg flex items-center justify-center"
        >
          Add Blog
        </Link>
        <Link
          to="/addcity"
          className="bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-lg flex items-center justify-center"
        >
          Add Resort City
        </Link>
        <Link
          to="/link1"
          className="bg-blue-700 hover:bg-blue-600 text-white p-4 rounded-lg flex items-center justify-center"
        >
          Add Business
        </Link>
        <Link 
          to="/viewlisting" 
          className="bg-violet-700 hover:bg-pink-600 text-white p-4 rounded-lg flex items-center justify-center"
        >
          View Listing
        </Link>
        <Link 
          to="/viewBusiness"
          className="bg-violet-700 hover:bg-indigo-600 text-white p-4 rounded-lg flex items-center justify-center"
        >
          View Business
        </Link>
        <Link 
          to="/viewletters"
          className="bg-violet-700 hover:bg-indigo-600 text-white p-4 rounded-lg flex items-center justify-center"
        >
          View Letters
        </Link>

      </div>
    </div>
  );
};

export default Admin;
