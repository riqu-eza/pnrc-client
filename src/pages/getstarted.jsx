/* eslint-disable no-undef */
import  { useState } from "react";
import "./getstarted.css";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import OAuth from "../components/OAuth";
import { signInSuccess } from "../redux/user/userSlice";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle signup logic here
    try {
      const querySnapshot = await db
        .collection("users")
        .where("username", "==", username)
        .get();
      if (querySnapshot.empty) {
        throw new Error("User not found");
      }
      const user = querySnapshot.docs[0].data();

      // eslint-disable-next-line no-undef
      await signInWithEmailAndPassword(Auth, user.email, password);
      console.log("User logged in successfully");

      navigate("/");
    } catch (error) {
      console.error("Authentication error:", error);
      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        setError("Invalid email or password. Please try again.");
      } else {
        setError("An error occurred during login. Please try again later.");
      }
      setUsername("");
      setPassword("");
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <input
        className="auth-input"
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="auth-input"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="auth-button" type="submit">
        Login
      </button>
    </form>
  );
};

const SignupForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [selectedOption, setSelectedOption] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle sign up logic here
    const regex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    if (!regex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }
    try {
      const userCrediatils = await createUserWithEmailAndPassword(
        Auth,
        email,
        password
      );
      // console.log(userCrediatils);

      const user = userCrediatils.user;

      localStorage.setItem("token", user.accessToken);
      localStorage.setItem("user", JSON.stringify(user));

      await addDoc(collection(db, "users"), {
        id: user.uid,
        email: email,
        username: username,
        userType: userType,
        createdat: new Date(),
        password: password,
      });

      console.log("User account created successfully!");
      dispatch(signInSuccess(user));

      navigate("/login");
    } catch (error) {
      if (error.code === "auth/invalid-email") {
        // Handle invalid email error
        console.error("Invalid email format");
      } else {
        // Handle other authentication errors
        console.error("Authentication failed:", error.message);
      }
    }
    setUsername("");
    setPassword("");
    setEmail("");
    setUserType("");
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <input
        className="auth-input"
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="auth-input"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="auth-input"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
     
     <div>
      <label>
        <input
          type="radio"
          value="option1"
          checked={selectedOption === 'bussiness'}
          onChange={(e) => setSelectedOption(e.target.value)}
        />
        bussiness
      </label>
      <label>
        <input
          type="radio"
          value="option2"
          checked={selectedOption === 'Tourist'}
          onChange={(e) => setSelectedOption(e.target.value)}

        />
        Tourist
      </label>
    </div>
      <button className="auth-button" type="submit">
        Sign Up
      </button>
    </form>
  );
};

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-container">
      <h1 className="auth-title">{isLogin ? "Login" : "Sign Up"}</h1>
      {isLogin ? <LoginForm /> : <SignupForm />}
      <button
        // className="switch-button"
        className="switch-button bg-blue-900 text-white p-3 rounded-lg uppercase hover:opacity-95"
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin ? "Switch to Sign Up" : "Switch to Login"}
      </button>
      <button>
        <OAuth />
      </button>
    </div>
  );
};

export default AuthPage;
