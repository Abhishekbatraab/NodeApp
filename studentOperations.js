const studentOperations = {
    studentList : [],

    add(newstudent){
        this.studentList.push(newstudent);
    },

    getStudents(){
        return this.studentList;
    }
}

module.exports.studentOperations = studentOperations;