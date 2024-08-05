
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_VhIHqlXDz9NZmSv4yKYaZp_7yfbdzNs",
  authDomain: "pantryapp-e3621.firebaseapp.com",
  projectId: "pantryapp-e3621",
  storageBucket: "pantryapp-e3621.appspot.com",
  messagingSenderId: "295308429254",
  appId: "1:295308429254:web:539dec645cb3c868b954c7",
  measurementId: "G-QQY87LQS8V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);
const auth = getAuth(app);

export { app, analytics, firestore, auth };