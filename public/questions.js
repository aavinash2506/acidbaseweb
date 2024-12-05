// This function is used to switch between tabs
function openTab(event, tabName) {
  const tabContents = document.querySelectorAll('.tab-content');
  tabContents.forEach(content => {
    content.classList.remove('active');
  });

  const tabButtons = document.querySelectorAll('.tab-button');
  tabButtons.forEach(button => {
    button.classList.remove('active');
  });

  document.getElementById(tabName).classList.add('active');
  event.currentTarget.classList.add('active');

  // Fetch questions when switching to the tab
  const level = tabName.replace('content-', 'Level '); // Extract level number
  fetchQuestions(level);
}

// Fetch questions from the backend for the given level
async function fetchQuestions(level) {
  const table = document.getElementById(`level${level.split(' ')[1]}-questions`);
  table.innerHTML = '<tr><th>Question</th><th>Type</th><th>Actions</th></tr>';
  const noDataRow = document.createElement('tr');
  noDataRow.innerHTML = '<td colspan="3">No questions found for this level.</td>';
  table.appendChild(noDataRow);
  
  
  try {
    // Fetch questions for the specific level from the backend
    const response = await fetch(`/api/questions?level=${level}`);
    
    if (response.ok) {
      const questions = await response.json();
      console.log("Questions ", questions)
      // Clear previous questions
      table.innerHTML = '<tr><th>Question</th><th>Type</th><th>Actions</th></tr>';
      if (questions.length === 0) {
        const noDataRow = document.createElement('tr');
        noDataRow.innerHTML = '<td colspan="3">No questions found for this level.</td>';
        table.appendChild(noDataRow);
      } else {
        if(level === 'Level 4'){
          table.innerHTML = '<tr><th>Question</th><th>Option 1</th><th>Option 2</th><th>Option 3</th><th>Correct Answer</th><th>Actions</th></tr>';
        }
        questions.forEach((question) => {
         // console.log(question)
          const row = document.createElement('tr');
          row.dataset.questionid = question.id;
          
          if (level === 'Level 4') {
            row.innerHTML = `
              <td class="question">${question.question}</td>
              <td class="option1">${question.options[0]}</td>
              <td class="option2">${question.options[1]}</td>
              <td class="option3">${question.options[2]}</td>
              <td class="correctAnswer">${question.correctAnswer}</td>
              <td>
                <button class="edit-btn" onclick="openEditPopupLevel4(this)">Edit</button>
                <button onclick="deleteQuestion(this)">Delete</button>
              </td>
            `;
          } else {
            row.innerHTML = `
              <td class="q1">${question.question}</td>
              <td class="t1">${question.type}</td>
              <td>
                <button class="edit-btn" onclick="openEditPopup('Level 1', this)">Edit</button>
                <button onclick="deleteQuestion(this)">Delete</button>
              </td>
            `;
          }
          
          table.appendChild(row);
        });
      }
    } else {
      console.error('Failed to fetch questions:', response.status);
    }
  } catch (error) {
    console.error('Error fetching questions:', error);
  }
}


// Add Question (Levels 1-3)
document.getElementById('questionForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  const question = document.getElementById('question').value;
  const type = document.getElementById('type').value;
  let levelText = document.getElementsByTagName('h3')[0].textContent;
  let level = levelText.split('-')[1].trim();
  // API call to add question for levels 1-3
  try {
    const response = await fetch('/api/questions/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ level, question, type })
    });
    const result = await response.json();
    if(result.id){
      fetchQuestions(level)
    }
    console.log('Add Question (Levels 1-3):', result);
  } catch (error) {
    console.error('Error adding question:', error);
  }

  document.getElementById('questionForm').reset();
  closePopup();
});

// Add Question (Level 4)
document.getElementById('questionFormLevel4').addEventListener('submit', async function(event) {
  event.preventDefault();

  const questionLevel4 = document.getElementById('questionLevel4').value;
  const option1 = document.getElementById('option1').value;
  const option2 = document.getElementById('option2').value;
  const option3 = document.getElementById('option3').value;
  let correctAnswer = document.getElementById('correctAnswer').value;

  if (correctAnswer === 'Option-1') {
    correctAnswer = option1;
  } else if (correctAnswer === 'Option-2') {
    correctAnswer = option2;
  } else if (correctAnswer === 'Option-3') {
    correctAnswer = option3;
  } else {
    console.error('Invalid correct answer selection');
  }

  // API call to add question for level 4
  try {
    const response = await fetch('/api/questions/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        level: "Level 4",
        question: questionLevel4,
        options: [option1, option2, option3],
        correctAnswer
      })
    });
    const result = await response.json();
    console.log('Add Question (Level 4):', result);
  } catch (error) {
    console.error('Error adding question:', error);
  }

  document.getElementById('questionFormLevel4').reset();
  closePopupLevel4();
});



// Edit question function for Levels 1, 2, 3
async function openEditPopup(level, button) {
  level = "Level 1"
  document.getElementById('editoverlay').classList.add('active');
  
  const row = button.closest('tr');
  const question = row.querySelector('.q1').innerText;
  const type = row.querySelector('.t1').innerText;
  
  document.getElementById('editquestion').value = question;
  document.getElementById('edittype').value = type;
  
  // Set up the submit button to handle editing
  document.getElementById('editquestionForm').onsubmit = async function(event) {
    event.preventDefault();
    
    const updatedQuestion = document.getElementById('editquestion').value;
    const updatedType = document.getElementById('edittype').value;
    
    const questionId = row.dataset.questionid;

    console.log("Edit - ", level, updatedQuestion, updatedType, questionId)
    
    try {
      const response = await fetch(`/api/questions/edit/${questionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level,
          question: updatedQuestion,
          type: updatedType,
        }),
      });
      
      const result = await response.json();
      console.log('Question updated:', result);
      closeeditPopup();
      fetchQuestions(level); // Refresh the questions after editing
    } catch (error) {
      console.error('Error editing question:', error);
    }
  };
}

// Edit question function for Level 4
async function openEditPopupLevel4(button) {
  document.getElementById('editoverlay-level-4').style.display = 'flex';
  
  const row = button.closest('tr');
  const question = row.querySelector('.question').innerText;
  const option1 = row.querySelector('.option1').innerText;
  const option2 = row.querySelector('.option2').innerText;
  const option3 = row.querySelector('.option3').innerText;
  let correctAnswer = row.querySelector('.correctAnswer').innerText;
  console.log(correctAnswer, option1, option2, option3)
  if (correctAnswer === option1) {
    correctAnswer = "Option-1";
  } else if (correctAnswer === option2) {
    correctAnswer = "Option-2";
  } else {
    correctAnswer = "Option-3";
  }
  console.log(correctAnswer)
  document.getElementById('editquestionLevel4').value = question;
  document.getElementById('editoption1').value = option1;
  document.getElementById('editoption2').value = option2;
  document.getElementById('editoption3').value = option3;
  document.getElementById('editcorrectAnswer').value = correctAnswer;


  document.getElementById('editquestionFormLevel4').onsubmit = async function(event) {
    event.preventDefault();
    
    const updatedQuestion = document.getElementById('editquestionLevel4').value;
    const updatedOption1 = document.getElementById('editoption1').value;
    const updatedOption2 = document.getElementById('editoption2').value;
    const updatedOption3 = document.getElementById('editoption3').value;
    let updatedCorrectAnswer = document.getElementById('editcorrectAnswer').value;
    if (updatedCorrectAnswer === 'Option-1') {
      updatedCorrectAnswer = updatedOption1;
    } else if (updatedCorrectAnswer === 'Option-2') {
      updatedCorrectAnswer = updatedOption2;
    } else if (updatedCorrectAnswer === 'Option-3') {
      updatedCorrectAnswer = updatedOption3;
    } else {
      console.error('Invalid correct answer selection');
    }
    
    const questionId = row.dataset.questionid;
    console.log("Lvl4 edit id - ",questionId)
    try {
      const response = await fetch(`/api/questions/edit/${questionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level: 'Level 4',
          question: updatedQuestion,
          options: [updatedOption1, updatedOption2, updatedOption3],
          correctAnswer: updatedCorrectAnswer,
        }),
      });
      
      const result = await response.json();
      console.log('Level 4 Question updated:', result);
      closeeditPopupLevel4();
      fetchQuestions('Level 4'); // Refresh the Level 4 questions
    } catch (error) {
      console.error('Error editing Level 4 question:', error);
    }
  };
}

// Delete question
async function deleteQuestion(button) {
  const row = button.closest('tr');
  const questionId = row.dataset.questionid;
  const level = row.closest('.tab-content').id.replace('content-', 'Level ');

  try {
    const response = await fetch(`/api/questions/delete/${questionId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      console.log('Question deleted successfully');
      fetchQuestions(level); // Refresh questions after delete
    }
  } catch (error) {
    console.error('Error deleting question:', error);
  }
}

// Initially fetch and display questions for Level 1 when the page loads
document.addEventListener('DOMContentLoaded', function() {
  fetchQuestions('Level 1');
});

function closePopupLevel4() {
  const overlayLevel4 = document.getElementById('overlay-level-4');
  overlayLevel4.style.display = 'none';
}

function closePopup() {
  const overlay = document.getElementById('overlay');
  overlay.classList.remove('active');
}

function closeeditPopupLevel4() {
  const overlayLevel4 = document.getElementById('editoverlay-level-4');
  overlayLevel4.style.display = 'none';
}

function closeeditPopup() {
  const overlay = document.getElementById('editoverlay');
  overlay.classList.remove('active');
}

function openPopup(level) {
  document.getElementsByTagName('h3')[0].innerHTML = "Add Question - " + level;
  document.getElementById('overlay').classList.add('active');

  document.getElementById('question').value = '';
  document.getElementById('type').value = '';
}

function openPopupLevel4() {
  document.getElementById('edit4').innerHTML = "Add Question - Level 4";
  const overlayLevel4 = document.getElementById('overlay-level-4');
  document.getElementById('overlay-level-4').classList.add('active');
  overlayLevel4.style.display = 'flex';

  document.getElementById('questionLevel4').value = '';
  document.getElementById('option1').value = '';
  document.getElementById('option2').value = '';
  document.getElementById('option3').value = '';
  document.getElementById('correctAnswer').value = '';
}
