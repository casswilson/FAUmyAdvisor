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
  
  let classes = {};
  let currentUser = {
    "classesTaken": [],
    "acquiredSkills": {}
  };
  
    // Fetch classes from Firebase
    database.ref('/classes').once('value', snapshot => {
        classes = snapshot.val();
        console.log(classes);  // Add this line
        // Fetch User 1 (for now) from Firebase
          // Fetch User 1 (for now) from Firebase
  database.ref('/users/user1').once('value', snapshot => {
    currentUser = snapshot.val();
    
    // Check if currentUser.classesTaken is an array, if not initialize it as an empty array
    if (!Array.isArray(currentUser.classesTaken)) {
      console.log('classesTaken is not an array, initializing it as an empty array');
      currentUser.classesTaken = [];
    }
    
    // Check if currentUser.acquiredSkills is an object, if not initialize it as an empty object
    if (typeof currentUser.acquiredSkills !== 'object' || currentUser.acquiredSkills === null) {
      console.log('acquiredSkills is not an object, initializing it as an empty object');
      currentUser.acquiredSkills = {};
    }

    createCheckboxes();
  });

      });
    
  
  // Save currentUser to Firebase when 'Save' button is clicked
  document.getElementById('saveButton').addEventListener('click', () => {
    database.ref('/users/user1').set(currentUser); // Update the user data in the Firebase
  });
  
  function createCheckboxes() {
    const classesContainer = document.getElementById('classesContainer');
    for (const classId in classes) {
    
      const classItem = document.createElement('div');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = classId;
      checkbox.value = classId;
      checkbox.addEventListener('change', function(e) {
        const classData = classes[classId];
        if (e.target.checked) {
          currentUser.classesTaken.push(classId);
          const skills = classData.skillsTaught;
          for (const skill in skills) {
            if (currentUser.acquiredSkills[skill]) {
              currentUser.acquiredSkills[skill] += skills[skill];
            } else {
              currentUser.acquiredSkills[skill] = skills[skill];
            }
          }
        } else {
          const index = currentUser.classesTaken.indexOf(classId);
          if (index !== -1) {
            currentUser.classesTaken.splice(index, 1);
          }
          const skills = classData.skillsTaught;
          for (const skill in skills) {
            currentUser.acquiredSkills[skill] -= skills[skill];
            if (currentUser.acquiredSkills[skill] <= 0) {
              delete currentUser.acquiredSkills[skill];
            }
          }
        }
      });
  
      // Check if the classId is in the currentUser's classesTaken array
      // If it is, mark this checkbox as checked
      if (currentUser.classesTaken.includes(classId)) {
        checkbox.checked = true;
      }
  
      const label = document.createElement('label');
      label.htmlFor = classId;
      label.textContent = classes[classId].name;
  
      classItem.appendChild(checkbox);
      classItem.appendChild(label);
      classesContainer.appendChild(classItem);
    }
  }
  
