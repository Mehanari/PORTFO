import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getAuth} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCrBwNN6rEaGifpgyqLtihX6lt1_2l-mNY",
    authDomain: "portfo-test-36022.firebaseapp.com",
    databaseURL: "https://portfo-test-36022-default-rtdb.firebaseio.com",
    projectId: "portfo-test-36022",
    storageBucket: "portfo-test-36022.appspot.com",
    messagingSenderId: "997122448036",
    appId: "1:997122448036:web:f3fd9623668651c0722431"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {db, auth};