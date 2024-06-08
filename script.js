// Storage key
let storageKey = "students";

// Modal
let studentModal = document.querySelector("#studentModal");
let closeModalBtn = document.querySelector(".close");
// Table
let tableBody = document.querySelector("#studentsTable tbody");
let addStudentBtn = document.querySelector("#addStudentBtn");
// Form
let studentForm = document.querySelector("#studentForm");
let studentIdInput = document.querySelector("#studentId");
let firstNameInput = document.querySelector("#firstName");
let lastNameInput = document.querySelector("#lastName");

/** EVENTS */
// Modal Events
addStudentBtn.addEventListener("click", function(){
    openModal();
});
closeModalBtn.addEventListener("click", function(){
    closeModal();
});

// Form Events
studentForm.addEventListener("submit", function(e){
    e.preventDefault();
    saveStudent();
});

// Window Events
window.addEventListener("load", function(){
    loadStudents();
})

/** EVENT HANDLER FUNCTIONS */


/** MODAL FUNCTIONS */
function openModal() {
    studentModal.style.display = "block";
}

function closeModal() {
    studentModal.style.display = "none";
    studentForm.reset();
    studentIdInput.value = "";
}

/** CRUD FUNCTIONS */
function loadStudents(){
    let students = getStudentsFromStorage();
    tableBody.innerHTML = "";

    students.forEach(function(student){
        let row = tableBody.insertRow();
        row.innerHTML = `
            <td>${student.firstName}</td>
            <td>${student.lastName}</td>
            <td>
                <button onclick="editStudent(${student.id})" class="editStudent">Uredi</button>
                <button onclick="deleteStudent(${student.id})" class="deleteStudent">Izbriši</button>
            </td>
        `;
    });
}

function saveStudent(){
    let student = {
        firstName: firstNameInput.value,
        lastName: lastNameInput.value,
        id: studentIdInput.value.trim() ? studentIdInput.value : Date.now().toString()
    }
    
    if(studentIdInput.value.trim()){
        updateStudentInStorage(student)
    } else{
        addStudentToStorage(student);
    }

    closeModal();
    loadStudents();
}

function deleteStudent(id){
    if (confirm("Jesi li siguran da želiš izbrisati ovog studenta?")) {
        deleteStudentFromStorage(id);
        loadStudents();
    }
}

function editStudent(id){
    let students = getStudentsFromStorage();
    let student = students.find(function(student){
        return student.id == id
    });

    if (!student) {
        alert("Greška");
        return;
    }

    studentIdInput.value = student.id;
    firstNameInput.value = student.firstName;
    lastNameInput.value = student.lastName;
    
    openModal();
}


/** STORAGE FUNCTIONS */
function addStudentToStorage(student){
    let students = getStudentsFromStorage();
    students.push(student);
    localStorage.setItem(storageKey, JSON.stringify(students));
}

function getStudentsFromStorage(){
    let students = localStorage.getItem(storageKey);
    return students ? JSON.parse(students) : []
}

function deleteStudentFromStorage(id) {
    let students = getStudentsFromStorage();
    students = students.filter(function(student){
        return student.id != id
    })
    localStorage.setItem(storageKey, JSON.stringify(students));
}

function updateStudentInStorage(updatedStudent) {
    let students = getStudentsFromStorage();
    
    let index = students.findIndex(function(student){
        return updatedStudent.id == student.id
    })

    students[index] = updatedStudent;
    localStorage.setItem(storageKey, JSON.stringify(students));
}