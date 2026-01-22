import * as firebase from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAjXo9Oqjx8TOAsjSwKD1aRUwfzDPo_32Y",
  authDomain: "ogrencitakipdb.firebaseapp.com",
  projectId: "ogrencitakipdb",
  storageBucket: "ogrencitakipdb.firebasestorage.app",
  messagingSenderId: "156353228149",
  appId: "1:156353228149:web:dab266645d827d55cfb73c",
  measurementId: "G-HBGX9W2G81"
};

const app = firebase.initializeApp(firebaseConfig);
export const db = getFirestore(app);