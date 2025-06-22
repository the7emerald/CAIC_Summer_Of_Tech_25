// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, set, ref, remove, onValue } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, deleteUser, updateEmail, updatePassword } from "firebase/auth";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional


const firebaseConfig = require("../firebaseConfigFrontend.json");

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);


const createUpdateUser = async (user, username, status) => {
  try {
    const userDocRef = ref(database, `ChatUsers/${user.uid}`);
    await set(userDocRef, {
      username: username,
      email: user.email,
      flag: "chat",
      status: status,
      userid: user.uid
    });
    console.log("created");
  }
  catch (error) {
    console.error(error);
    return new Error(error);
  }
}


export const handleLogin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const userRef = ref(database, `ChatUsers/${user.uid}/status`);
    await set(userRef, "online");
    return user.uid;
  } catch (error) {
    console.log("Login error:", error);
    return null;
  }
};

export const handleLogout = async () => {
  return new Promise(async (resolve) => {
    try {
      const user = auth.currentUser;
      const userRef = ref(database, `ChatUsers/${user.uid}/status`);
      await set(userRef, "offline");
      console.log("done");
      auth.signOut();
      resolve("done");
    }
    catch (error) {
      resolve(new Error(error));
    }
  })
}

export const handleRegister = async (username, email, password) => {
  return new Promise(async (resolve) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        console.log("uid done");
        const user = userCredential.user;
        await createUpdateUser(user, username, "offline");
        handleLogout();
        console.log("loged out");
        resolve(user);
      })
      .catch((error) => {
        console.log(error);
        resolve(new Error(error));
      });
  })
}

export const handleDelete = async (email, password) => {
  try {
    const user = auth.currentUser;
    const userDocRef = ref(database, `ChatUsers/${user.uid}`);
    await remove(userDocRef);
    await deleteUser(user);
  }
  catch (error) {
    return new Error(error);
  }
}

export const handleUpdate = async (newVals) => {
  return new Promise(async (resolve) => {
    try {
      let user = auth.currentUser;
      console.log(newVals);
      if ("email" in newVals) {
        console.log(newVals.email);
        await updateEmail(user, newVals.email);
      }
      if ("password" in newVals) {
        await updatePassword(user, newVals.password);
      }
      user = auth.currentUser;
      await createUpdateUser(user, newVals.username, "online");
      console.log("updated");
      resolve(user);

    }
    catch (error) {
      console.log(error);
      return new Error(error);
    }
  });
}