const { db } = require("../configs/firebase.js");
const { Timestamp } = require('firebase-admin/firestore');


// function to get students' scores
exports.getStudentsScores = async (req, res) => {
    try {
        const usersCollection = db.collection('users'); 
        const snapshot = await usersCollection.get();

        if (snapshot.empty) {
            return res.status(404).json({ message: 'No students found' });
        }

        let studentsData = [];

        snapshot.forEach(doc => {
            let userData = doc.data();

            studentsData.push({
                name: `${userData.first_name} ${userData.last_name}`,
                email: userData.email,
                level1: userData.highest_score_lvl_1 || null,
                level2: userData.highest_score_lvl_2 || null,
                level3: userData.highest_score_lvl_3 || null,
                level4: userData.highest_score_lvl_4 || null,
            });
        });
        let success = true
        return res.status(200).send({ studentsData, success });
    } catch (err){
        console.log("Error ", err)
    }
}
