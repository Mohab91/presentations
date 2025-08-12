import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ✅ التكوين الصحيح من مشروع: presentation-platform-ppo
const firebaseConfig = {
  apiKey: "AIzaSyB7GlKBOCrSq64wYCUWY3W-BDcLESiEpbA",
  authDomain: "presentation-platform-ppo.firebaseapp.com",
  projectId: "presentation-platform-ppo",
  storageBucket: "presentation-platform-ppo.appspot.com",
  messagingSenderId: "71499932139",
  appId: "1:71499932139:web:ed33657e891ee7e01ff9ae"
};

// ✅ تهيئة Firebase
const app = initializeApp(firebaseConfig);

// ✅ تصدير خدمات المصادقة وقاعدة البيانات
export const auth = getAuth(app);
export const db = getFirestore(app);