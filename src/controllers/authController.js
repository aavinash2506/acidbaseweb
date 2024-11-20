const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require("firebase/auth");
const { db } = require("../configs/firebase.js");

const auth = getAuth();


exports.signup = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const userId = userCredential.user.uid;

    await db.collection("professors").doc(userId).set({
      firstName: firstName,
      lastName: lastName,
      email: email,
      createdAt: Date.now(),
    });

    res.status(201).json({ message: "Professor signed up successfully", userId });
  } catch (error) {
    console.log("Error while signup ", error)
    res.status(400).json({ error: error.message });
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.log("Error while signup ", error)
    res.status(400).json({ error: error.message });
  }
};
