// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//   authDomain: "mern-estate-be67f.firebaseapp.com",
//   projectId: "mern-estate-be67f",
//   storageBucket: "mern-estate-be67f.appspot.com",
//   messagingSenderId: "578377994106",
//   appId: "1:578377994106:web:65d94eb103e4167d3ad0c3",
// };

// // Initialize Firebase
// export const app = initializeApp(firebaseConfig);
import { initializeApp } from "firebase/app";
import {getFirestore,  } from "firebase/firestore";
import {getAuth} from "firebase/auth"
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyDIDUqLUu6do5yOw80FOTXXs5wlZutmicg",
  authDomain: "palmnazi-598d7.firebaseapp.com",
  projectId: "palmnazi-598d7",
  storageBucket: "palmnazi-598d7.appspot.com",
  messagingSenderId: "78675878598",
  appId: "1:78675878598:web:7aa61f0cea98c48111adc7",
  measurementId: "G-776D4PDRR3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const storage =getStorage(app);

  export {db};
  export {storage};