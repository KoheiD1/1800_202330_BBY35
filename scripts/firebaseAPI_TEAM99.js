//----------------------------------------
//  Your web app's Firebase configuration
//----------------------------------------
var firebaseConfig = {
  apiKey: "AIzaSyDu5-Kzu68BYIKDWs8sP-elTONfO7ovaGA",
  authDomain: "comp1800bby35.firebaseapp.com",
  projectId: "comp1800bby35",
  storageBucket: "comp1800bby35.appspot.com",
  messagingSenderId: "64430395317",
  appId: "1:64430395317:web:630d2676747e9628a753fc",
  };

//--------------------------------------------
// initialize the Firebase app
// initialize Firestore database if using it
//--------------------------------------------
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
