import * as firebase from "firebase/app";
import "firebase/messaging";
const initializedFirebaseApp = firebase.initializeApp({
    // Project Settings => Add Firebase to your web app
    apiKey: "AIzaSyBH53Gr7mz3vFocoaAhTWt2ZYBwc4YSvZw",
    authDomain: "banitro-4d758.firebaseapp.com",
    databaseURL: "https://banitro-4d758.firebaseio.com",
    projectId: "banitro-4d758",
    storageBucket: "banitro-4d758.appspot.com",
    messagingSenderId: "340817962454",
    appId: "1:340817962454:web:e679e7532e3d1f72fbb077",
    measurementId: "G-SMSEZBSCP7"
});

let messaging;


if(firebase.messaging.isSupported()) {
    messaging = initializedFirebaseApp.messaging();
    messaging.usePublicVapidKey(
        // Project Settings => Cloud Messaging => Web Push certificates
        "BCrw1aZoj1CxDI75_MUN-szJ6s8fUKa9Abw0FwFfxSZ6ttA7Ub1KtOWOgwH5_7Hw3GquMW53rm3iNCG-uJzoWEY"
    );
}
export {
    messaging
};

