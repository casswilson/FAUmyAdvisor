//  web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyB8MQgtQq2_AbIZEHMJrh3VkJDuvTTy5ss",
    authDomain: "myadvisor-f1061.firebaseapp.com",
    databaseURL: "https://myadvisor-f1061-default-rtdb.firebaseio.com",
    projectId: "myadvisor-f1061",
    storageBucket: "myadvisor-f1061.appspot.com",
    messagingSenderId: "560337324833",
    appId: "1:560337324833:web:f98e380915a03ff55a0c60",
    measurementId: "G-N2V217YPX0"
  };

  firebase.initializeApp(firebaseConfig);
  var database = firebase.database();
  
  let careers = {};
  let classes = {};

  // Fetch careers from Firebase
  database.ref('/careers').once('value', snapshot => {
    careers = snapshot.val();
    populateCareerSelect();
  });
  
  function populateCareerSelect() {
    const careerSelect = document.getElementById('careerSelect');
  
    for (const career in careers) {
      const option = document.createElement('option');
      option.value = career;
      option.textContent = career;
      careerSelect.appendChild(option);
    }
  }
  
  // Save currentUser to Firebase when 'Save' button is clicked
  document.getElementById('saveButton').addEventListener('click', () => {
    const firstName = document.getElementById('firstNameInput').value;
    const lastName = document.getElementById('lastNameInput').value;
    const careerSelect = document.getElementById('careerSelect');
    const intendedCareer = careerSelect.value;
  
    // Update the user data in the Firebase
    database.ref('/users/user1').update({
      firstName: firstName,
      lastName: lastName,
      intendedCareer: intendedCareer
    });
  });
  
  // Fetch User 1 (for now) from Firebase
  database.ref('/users/user1').once('value', snapshot => {
    const userData = snapshot.val();
  
    // Check if userData exists and has valid values
    if (userData && userData.firstName && userData.lastName && userData.intendedCareer) {
      // Populate the input fields and select the correct option in the career select
      document.getElementById('firstNameInput').value = userData.firstName;
      document.getElementById('lastNameInput').value = userData.lastName;
      document.getElementById('careerSelect').value = userData.intendedCareer;
    }
  });

  function createCheckboxes() {
    const classesContainer = document.getElementById('classesContainer');
    const classesTable = document.createElement('table');
    classesTable.classList.add('classes-table');
  
    let rowCounter = 1;
    let cellCounter = 1;
    let currentRow = document.createElement('tr');
    currentRow.id = `row${rowCounter}`;
    classesTable.appendChild(currentRow);
  
    for (const classType in classes) {
      for (const classId in classes[classType]) {
        const classData = classes[classType][classId];
  
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = classId;
        checkbox.value = classId;
        checkbox.addEventListener('change', function(e) {
          // ... your checkbox change event code here ...
        });
  
        const label = document.createElement('label');
        label.htmlFor = classId;
        label.textContent = classData.name;
  
        const cell = document.createElement('td');
        cell.appendChild(checkbox);
        cell.appendChild(label);
  
        currentRow.appendChild(cell);
        cellCounter++;
  
        // Move to the next row if we have reached the maximum number of columns
        if (cellCounter > 5) {
          rowCounter++;
          cellCounter = 1;
          currentRow = document.createElement('tr');
          currentRow.id = `row${rowCounter}`;
          classesTable.appendChild(currentRow);
        }
      }
    }
  
    // Remove empty rows
    while (rowCounter <= 5) {
      const emptyRow = document.getElementById(`row${rowCounter}`);
      if (emptyRow) {
        emptyRow.parentNode.removeChild(emptyRow);
      }
      rowCounter++;
    }
  
    classesContainer.innerHTML = ''; // Clear the existing content
    classesContainer.appendChild(classesTable);
  }
  
  // Fetch classes from Firebase
  database.ref('/classes').once('value', snapshot => {
    classes = snapshot.val();
    createCheckboxes();
  });