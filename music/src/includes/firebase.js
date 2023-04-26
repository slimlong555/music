import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyAsh394ExVaaGcUPDesxEtH6qW821281Hw",
  authDomain: "music-c9b05.firebaseapp.com",
  projectId: "music-c9b05",
  storageBucket: "music-c9b05.appspot.com",
  messagingSenderId: "617384047532",
  appId: "1:617384047532:web:a038f67130ec2de2be4009"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// firestore函数将返回一个具有与数据库交互的方法和属性的对象,而不是重复调用它，而是将它存储在一个变量中。

const usersCollection = db.collection("users");//此函数将返回一个对象，其中包含用于处理用户集合的方法和属性。
const songsCollection = db.collection('songs');
const commentCollection = db.collection('comments');
export {
  auth,
  db,
  usersCollection,
  songsCollection,
  commentCollection,
  storage,
};
