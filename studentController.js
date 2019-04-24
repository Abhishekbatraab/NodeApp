const studentObject = require("./Student.js");
const studentOperationModule = require('./studentOperations.js');
const studentDataFile = require("./studentdata.js");
const fs = require('fs');
const path = require('path');
const ls = require('local-storage');
//var studentList=[];

function addStudent(firstname, lastname, email, password){
    var studentdetail = studentObject.Student(firstname, lastname, email, password);
    studentOperationModule.studentOperations.add(studentdetail);
}

function getNewStudents(){
    return studentOperationModule.studentOperations.getStudents();
}

function saveStudent(){
    if(ls){
        var studentArray = getNewStudents();
        var studentJSON = JSON.stringify(studentArray);
        console.log("JSON is "+studentJSON);
        ls.set('studentinfo', studentJSON);
        console.log("Data Saved");
        //https://api.myjson.com/bins/nm020 --> online url of the following JSON
    }else{
        console.log("Your browser does not support the localstorage");
    }
}

function getDataFromFile(){
    return JSON.stringify(studentDataFile.studentInfo.studentList);
}
function saveStudentToFile(studentObject){
    var studentDataArray = getDataFromFile();
    console.log("studentDataArray is "+studentDataArray);
    studentDataFile.studentInfo.studentList.push(studentObject);
    console.log("Data Saved to file");
    console.log("new data",getDataFromFile())
    // console.log("studentDataArray is "+studentDataArray);
}

function loadStudent(){
    if(ls){
        if(ls.get('studentinfo')){
            var studentsArray = JSON.parse(ls.get('studentinfo'));
            studentOperationModule.studentOperations.studentList = studentsArray;
            console.log(studentOperationModule.studentOperations.studentList);
        }else{
            console.log("There is no data");
        }
    }else{
        console.log("Your browser does not support the localstorage");
    }
}

module.exports = {
    addStudent, getNewStudents, saveStudent, loadStudent, saveStudentToFile
}