const http = require("http");
const {studentInfo}=require('./studentdata');
http.createServer(takeRequestGiveResponse).listen(process.env.PORT||1234, (err, data)=>{
    if(err){
        throw err;
    }else{
        console.log('Server start at 1234');

    }
})

function isStatic(url){
    const staticArray = [".html", ".css", ".jpeg", ".jpg", ".js", ".png"];
    //console.log("URL is ", url);
    const path = require('path');
    var ext = path.extname(url);
    //console.log("ext is ", ext);
    //console.log("Indexof array is ", staticArray.indexOf(ext));
    return staticArray.indexOf(ext)>=0;
}

function takeRequestGiveResponse(request, response){
    //console.log("Received Request ", request.url);
    response.writeHead('200', {'content-type' : 'text/html'});
    const url = require('url');
    var object = url.parse(request.url);
    //console.log("URL object is ", object);
    if(isStatic(request.url)){
        const fs = require('fs');
        const path = require('path');
        const fullPath = path.join(__dirname, "public", request.url);
        //console.log("Fullpath is ", fullPath);
        fs.readFile(fullPath, (err , content)=>{
            if(err){
                response.write("Invalid Path");
            }else{
                response.write(content);
                response.end();
            }
        })
    }else if(request.method=='GET' && object.pathname == '/register'){
        //console.log("Entered in register");
        const qs = require('querystring');
        const obj = qs.parse(object.query);
        //console.log("register obj is ", obj);
        var status = obj.status;
        //console.log("Status is ", status);
        const fs = require('fs');
        const path = require('path');
        const fullPath = path.join(__dirname, "public", object.pathname+".html");
        //console.log("Full path is ", fullPath);
        fs.readFile(fullPath, (err , content)=>{
            if(err){
                //console.log("Error is ", err);
                response.write("Invalid Path");
            }else{
                response.write(content);
                response.end();
            }
        })
    }else if(request.method=='POST' && object.pathname == '/registerUser'){
        var myData = '';
        
        request.on('data', (chunk)=>{
            myData+=chunk;
        })
        request.on('end', ()=>{
            var auth = require('./authenticationOperation.js');
            var qs = require("querystring");
            console.log(`Data is ${myData}`);
            const obj = qs.parse(myData);
            var firstname = obj.firstName;
            var lastname = obj.lastName;
            var email = obj.email;
            var password = obj.password;
            var confirmpassword = obj.confirmPassword;
            var isPasswordEqual = auth.comparePasswords(password, confirmpassword);
            hashpassword = auth.encryptPassword(password);
            //Give a function where you store this hashpassword 
            //storeHashPassword(hashpassword, email);
            // obj.hashpassword=hashpassword;
            // studentList.push(obj);
            isPasswordCorrect = auth.checkLoginPassword(hashpassword, password);
            if(isPasswordCorrect){
                console.log("Password is correct");
            }else{
                console.log("Password is not correct");
            }
            // auth.encryptPassword(password).then(result=>{
            //     console.log("EP ", result);
            //     auth.checkLoginPassword(result);
                
            // }).catch(err=>{
            //     console.log(err);
            // })
            if(isPasswordEqual==false){
                var fs = require('fs');
                var path = require('path');
                var status = "Password and confirm password is not matching";
                const fullPath = path.join(__dirname, "public", "register"+".html");
                //console.log("Full path is ", fullPath);
                fs.readFile(fullPath, (err , content)=>{
                    if(err){
                    //    console.log("Error is ", err);
                        response.write("Invalid Path");
                    }else{
                        response.write(content);
                        response.end();
                    }
                })
                // response.writeHead(302,  {Location: "localhost:1234/public/register.html"})
                // response.end();
            }else{
                var studentcontroller = require('./studentController.js');
                console.log('Hash password in else is '+hashpassword);
                studentcontroller.addStudent(firstname, lastname, email, hashpassword);
                var studentObject = studentcontroller.getNewStudents();
                console.log("Student Object New is ", studentObject);
                studentcontroller.saveStudentToFile(studentObject);
                studentcontroller.saveStudent();
                studentcontroller.loadStudent();
                response.write("<h1>"+`Thanks for Registeration ${firstname} ${lastname}`+"</h1>");
                response.write("<h2>"+`Your Email Id is ${email}`+"</h2>");
                response.end();
                
            }
        })

    }else if(request.method=='GET' && object.pathname == '/login'){
        const qs = require('querystring');
        const obj = qs.parse(object.query);
        var status = obj.status;
        const fs = require('fs');
        const path = require('path');
        const fullPath = path.join(__dirname, "public", object.pathname+".html");
        fs.readFile(fullPath, (err, content)=>{
            if(err){
                throw err;
            }else{
                response.write(content);
                response.end();
            }
        });
    }else if(request.method=='POST' && object.pathname == '/login'){
        var myData = '';
        request.on('data', (chunk)=>{
            myData+=chunk;
        })
        request.on('end', ()=>{
            const auth = require('./authenticationOperation');
            const qs = require('querystring');
            const obj = qs.parse(myData);
            var email = obj.loginEmail;
            var password = obj.loginPass;
            console.log("printing email",email)
            const tempUser=studentInfo.studentList.find(item=>item.email===email);
            var firstName = tempUser.firstname;
            var lastName = tempUser.lastname;
            const fullName = (firstName, lastName) => {return firstName + lastName};
            const FULLNAME = fullName(firstName, lastName);
            console.log("printing temp user",tempUser)
            var hashedPassword=tempUser.password;
            console.log("brcypt called and returned object",auth.checkLoginPassword(hashedPassword,password));
            response.write(`${FULLNAME} You are successfully login with ${email}`);
        })
    }else if(object.pathname == '/login'){
        response.write("Welcome to login");
        response.end();
    }else if(object.pathname == '/'){
        const fs = require('fs');
        const path = require('path');
        const fullPath = path.join(__dirname, "public", "index.html");
        //console.log("Fullpath is ", fullPath);
        fs.readFile(fullPath, (err , content)=>{
            if(err){
                response.write("Invalid Path");
            }else{
                response.write(content);
                response.end();
            }
        })
    }
}

// function storeHashPassword(hashedPassword, email){
//     let studArray = studentInfo.studentData.studentList;
//     let stud = studArray.filter(studentVar => studentVar.email == email);
//     stud.password = hashedPassword;
// }


