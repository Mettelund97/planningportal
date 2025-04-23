import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA-PmR-iAkqVUujEgQ1LY8HLiUhn8WdL1I",
  authDomain: "planningportal-440a0.firebaseapp.com",
  projectId: "planningportal-440a0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };