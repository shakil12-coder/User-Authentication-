const express = require("express");
const app = express();
const path=require("path");
const hbs=require('hbs');
const bcrypt = require("bcryptjs");
const jwt=require("jsonwebtoken")
require('./db/conn')
require('dotenv').config()
const Register =require('./models/registers')
const port=process.env.PORT || 3000;
const static_path=path.join(__dirname , "../public")
const template_path=path.join(__dirname,'../templates/views')
const partials_path=path.join(__dirname,'../templates/partials')


app.use(express.json()) 
app.use(express.urlencoded({extended:false}))
app.use(express.static(static_path))   
app.set('view engine' ,'hbs')
app.set("views" , template_path);
hbs.registerPartials(partials_path);


app.get("/" , (req , res)=>{
    res.render('index')
})


//read data from database
app.get("/register" , (req , res)=>{
    res.render('register');
})

app.get("/login" ,(req , res)=>{
    res.render("login")
})


// //create a new user from database;
app.post("/register" ,async (req ,res)=>{
    try {
        const passwd=req.body.password;
        const confirmpasswd=req.body.confirmPassword;
        if(passwd===confirmpasswd){
            const registerEmployee = new Register({
                firstname:req.body.firstname,
                lastname :req.body.lastname,
                email : req.body.email,
                gender:req.body.gender,
                phone :req.body.Phone,
                age : req.body.Age,
                password :req.body.password,
                confirmpassword:req.body.confirmPassword
            })


            console.log(`the employee  details  is : ${registerEmployee}`)
            const token=await registerEmployee.generateAuthToken();
            console.log("the token part is " + token);


            const registered = registerEmployee.save();
            res.status(201).render('index');
        }
        else{
            res.send("password not matching")
        }
    } catch (error) {
        res.status(400).send(error);
    }
})


//login validation

app.post("/login" , async(req , res) =>{
    try {
        const currEmail=req.body.email;
        const currPassword=req.body.password;
        const usermail=await Register.findOne({email:currEmail});
        const isMatch=await bcrypt.compare(currPassword , usermail.password);
        const token=await usermail.generateAuthToken();
        console.log("the token part is " + token);
        if(isMatch){
            res.status(201).render("index");
        }
        else{
            res.send("Invalid login Details");
        }
    } catch (error) {
        res.status(400).send("Invalid login Details")
    }
})






//bcrypt algorithm
// const bcrypt = require("bcryptjs");

// const securePassword = async  (password)=>{
//     const passwordHash= await bcrypt.hash(password , 10);
//     const passwordMatch = await bcrypt.compare("shakil" , passwordHash);
//     console.log(passwordMatch)
// }
// securePassword("shakil");



//---------------------------jsonwebtoken algorithm-----------------------------------------

// const jwt=require("jsonwebtoken");
// const createToken = async ()=>{
//     const token=await jwt.sign({_id:"643aad0d3a60de882a315fb9"} , "mynameisshakilahmed"  , {
//         expiresIn:"2 seconds"
//     });
//     console.log(token);
//     const userVer=await jwt.verify(token , "mynameisshakilahmed");
//     console.log(userVer);
// }
// createToken();


app.listen(port , (err) =>{
    if(err){
        throw new Error("server not created");
    }
    console.log(`server is listening at port no. ${port}`)
})