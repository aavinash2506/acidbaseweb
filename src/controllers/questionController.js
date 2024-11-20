const { db } = require("../configs/firebase.js");
const { Timestamp } = require('firebase-admin/firestore');

// Add a new question
exports.addQuestion = async (req, res) => {
  const { level, question, type, options = [], correctAnswer = '' } = req.body;
  
  // Data validation (optional)
  if (!question || !level) {
    return res.status(400).json({ error: 'Question and level are required.' });
  }

  // Set up question data
  const questionData = {
    level,
    question,
    type: type || null,
    options: level === 'Level 4' ? options : null, // only set options for Level 4
    correctAnswer: level === 'Level 4' ? correctAnswer : null,
    createdAt: Timestamp.now()
  };

  try {
    const docRef = await db.collection('questions').add(questionData);
    res.status(201).json({ id: docRef.id, message: 'Question added successfully.' });
  } catch (error) {
    console.error('Error adding question:', error);
    res.status(500).json({ error: 'Failed to add question.' });
  }
};

// Edit a question
exports.editQuestion = async (req, res) => {
  const { questionId } = req.params;
  const { level, question, type, options = [], correctAnswer = '' } = req.body;

  if (!question || !level) {
    return res.status(400).json({ error: 'Question and level are required.' });
  }

  const updatedData = {
    question,
    type: type || null,
    options: level === 'Level 4' ? options : null,
    correctAnswer: level === 'Level 4' ? correctAnswer : null
  };

  try {
    await db.collection('questions').doc(questionId).update(updatedData);
    res.json({ message: 'Question updated successfully.' });
  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).json({ error: 'Failed to update question.' });
  }
};

// Delete a question
exports.deleteQuestion = async (req, res) => {
  const { questionId } = req.params;

  try {
    await db.collection('questions').doc(questionId).delete();
    res.json({ message: 'Question deleted successfully.' });
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({ error: 'Failed to delete question.' });
  }
};

// Fetch questions based on the level
exports.getQuestions = async (req, res) => {
    const { level } = req.query;
  
    if (!level) {
      return res.status(400).json({ error: 'Level is required' });
    }
  
    try {
      // Query Firestore to get questions based on level
      const snapshot = await db.collection('questions').where('level', '==', level).get();
  
      if (snapshot.empty) {
        return res.status(404).json({ error: 'No questions found for this level' });
      }
  
      const questions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      res.status(200).json(questions);
    } catch (error) {
      console.error('Error fetching questions:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  const data = require('../sampleLvl4.json');
 
const importJSON = async () => {
  try {
    for (const item of data) {
      const documentData = {
        ...item,
        createdAt: Timestamp.now()
      };
      await db.collection('questions').add(documentData);
      console.log(`Document added for: ${item.question} ${item.type}`);
    }
    console.log('Data imported successfully');
  } catch (error) {
    console.error('Error importing data:', error);
  }
};


  // importJSON();