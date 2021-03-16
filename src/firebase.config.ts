import firebase from "firebase/app";
import "firebase/storage";
import "firebase/analytics";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_SOCIAL_MEDIA_apiKey,
  authDomain: process.env.REACT_APP_SOCIAL_MEDIA_authDomain,
  projectId: process.env.REACT_APP_SOCIAL_MEDIA_projectId,
  storageBucket: process.env.REACT_APP_SOCIAL_MEDIA_storageBucket,
  messagingSenderId: process.env.REACT_APP_SOCIAL_MEDIA_messagingSenderId,
  appId: process.env.REACT_APP_SOCIAL_MEDIA_appId,
  measurementId: process.env.REACT_APP_SOCIAL_MEDIA_measurementId,
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const storage = firebase.storage();
const db = firebase.firestore();

export { storage, db, firebase as default };
