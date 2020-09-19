
importScripts("https://www.gstatic.com/firebasejs/5.9.4/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/5.9.4/firebase-messaging.js");
firebase.initializeApp({
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
const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function(payload) {
    // const Data={
    //     title:payload.data.title,
    //     body:payload.data.body,
    //     icon: '/favicon.ico',
    //     // click_action:payload.data.click_action
    // }
    const notificationTitle = payload.data.title;
    const notificationOptions = {
        body: payload.data.body,
        icon: payload.data.icon,
        click_action:payload.data.click_action
        // icon: '/applogo.ico',
    };
    console.log(payload)
    const promiseChain = clients
        .matchAll({
            type: "window",
            includeUncontrolled: true
        })
        .then(windowClients => {
            for (let i = 0; i < windowClients.length; i++) {
                const windowClient = windowClients[i];
                windowClient.postMessage(payload);
            }
        })
        .then(() => {
            return registration.showNotification(notificationTitle,notificationOptions);
        });
    return promiseChain;
});
self.addEventListener('notificationclick', function(event) {
    // if (event.action) {
    //     clients.openWindow(event.action);
    // }
    // event.notification.close();
});