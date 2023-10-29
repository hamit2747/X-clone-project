// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA1HXyD232n5z3TBQnREQ_296EowRcW8rc",
  authDomain: "twitter-clone-30c10.firebaseapp.com",
  projectId: "twitter-clone-30c10",
  storageBucket: "twitter-clone-30c10.appspot.com",
  messagingSenderId: "837567781719",
  appId: "1:837567781719:web:bcaff235168ca56759fc12"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

import {getAuth , GoogleAuthProvider }  from 'firebase/auth'

// yetkilendirmenin referansını alma
export const auth = getAuth(app);

// google sağlayıcı kurulum
export const provider = new GoogleAuthProvider();

//database kurulum importu
import {getFirestore} from 'firebase/firestore'

//database referansını alma
export const  db = getFirestore(app);

//storage kurulum importu
import{ getStorage} from 'firebase/storage'

//storage referansını alma
export const storage = getStorage(app)
