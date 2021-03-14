import firebase from "firebase/app";
import "firebase/storage";
import "firebase/analytics";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAYCgqdsPtpdMrSiNAPJuUd50rp-ICqiIA",
  authDomain: "social-media-app-e978a.firebaseapp.com",
  projectId: "social-media-app-e978a",
  storageBucket: "social-media-app-e978a.appspot.com",
  messagingSenderId: "898401640785",
  appId: "1:898401640785:web:cd0c64c551935e5791b370",
  measurementId: "G-13B4DP5DPC",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const storage = firebase.storage();
const db = firebase.firestore();

export { storage, db, firebase as default };
