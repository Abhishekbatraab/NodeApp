var bcrypt = require('bcrypt');
//Function to compare password with confirm password
function comparePasswords(password, confirmPassword){
    if(password!=confirmPassword){
        return false;      
    }else{
        return true;
    }  
}
//Conversion to hash password
function encryptPassword(password){
    hashPassword = bcrypt.hashSync(password,10);
    console.log("Encrypted Password is "+hashPassword);
    return hashPassword;
}

function checkLoginPassword(hashedPassword, userPassword){
   return  bcrypt.compareSync(userPassword, hashedPassword)

}

module.exports = {
    comparePasswords, encryptPassword, checkLoginPassword
}