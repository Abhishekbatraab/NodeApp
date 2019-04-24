let studentObj = {};
const studentDataFile = require("./studentdata.js");
function Student(firstname, lastname, email, password){
    studentObj.firstname = firstname;
    studentObj.lastname = lastname;
    studentObj.email = email;
    studentObj.password = password;
    return studentObj;
}

module.exports.Student = Student;

