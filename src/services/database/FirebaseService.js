import * as firebase from 'firebase';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDxN9KTgJ2VzgZkPvDH4HqmEgLNM09Bbno",
    authDomain: "cannavia-e2b7b.firebaseapp.com",
    databaseURL: "https://cannavia-e2b7b.firebaseio.com",
    storageBucket: "cannavia-e2b7b.appspot.com"
};
export const firebaseApp = firebase.initializeApp(firebaseConfig);
