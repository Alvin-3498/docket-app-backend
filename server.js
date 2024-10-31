const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcryptjs = require("bcryptjs");
const docket1 = require('./models/docket1');
const {docket1model} = require('./models/docket1');
const uploaddoc = require('./models/uploaddoc')
const {uploaddocmodel} = require('./models/uploaddoc')
const uploaddrafts = require('./models/uploaddrafts')
const {uploaddraftsmodel} = require('./models/uploaddrafts')
const jwt = require("jsonwebtoken");
const session = require("express-session");
const MongoStore = require("connect-mongo")

const app = express();
app.use(cors({origin:"http://localhost:3000"}));
app.use(express.json());

mongoose.connect("mongodb+srv://alvinproject332:alvin123@cluster0.s2ugg.mongodb.net/docket1DB?retryWrites=true&w=majority&appName=Cluster0")

app.use(session({
    secret:"docket1-app",
    resave:false,
    saveUninitialized:false,
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://alvinproject332:alvin123@cluster0.s2ugg.mongodb.net/docket1DB',
        ttl: 60 * 60 * 24 * 30,  // Time to live in seconds (30 days)
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 30 } // Cookie expiry set to 30 days
}));


const generateHashedPassword = async(pass) =>{
    const salt = await bcryptjs.genSalt(10)
    return bcryptjs.hash(pass,salt)
}

const createDefaultAdmin = async () => {
    try{
        const adminpassword = await generateHashedPassword("12345");
        let newAdmin = new docket1model ({
            empid:"001",
            empname:"Default Admin",
            mobileno:"12345789",
            gender:"male",
            email:"admin8@gmail.com",
            pass:adminpassword,
            cpass:adminpassword,
        });
        
        await newAdmin.save();
        console.log("Default Admin Created.");
    } catch (error){
        console.error("Error in creating default admin",error);
    }
}

// createDefaultAdmin();

app.post("/register",async(req,res) => {
    let input = req.body
    let HashedPassword = await generateHashedPassword(input.pass)
    console.log(HashedPassword)
    input.pass = HashedPassword
    let docket1 = new docket1model(input)
    docket1.save()
    res.json({"status":"Success"})
})

app.post("/upload-doc", (req, res) => {
    let input = req.body
    let uploaddoc = new uploaddocmodel(input)
    uploaddoc.save()
    res.json({"status":"Success"})
    })

app.post("/upload-drafts", (req, res) => {
   let input = req.body
   let uploaddrafts = new uploaddraftsmodel(input)
   uploaddrafts.save()
   res.json({"status":"Success"})
  });
  
app.get("/doc-view",(req,res) => {
    uploaddocmodel.find().then(
        (data) => {
            res.json(data)
        }
    ).catch(
        (error) => {
            res.json(error)
        }
    ).finally()
})

app.get("/draft-view",(req,res) => {
    uploaddraftsmodel.find().then(
        (data) => {
            res.json(data)
        }
    ).catch(
        (error) => {
            res.json(error)
        }
    ).finally()
})

app.get("/view-users",(req,res) => {
    docket1model.find().then(
        (data) => {
            res.json(data)
        }
    ).catch(
        (error) => {
            res.json(error)
        }
    ).finally()
})

app.post("/login",async(req,res) => {
    let input = req.body
    docket1model.find({"email":req.body.email}).then(
        (response) => {
            if (response.length > 0) {
                let dbpassword = response[0].pass
                console.log(dbpassword)
                bcryptjs.compare(input.pass,dbpassword,(error,isMatch) =>{
                    if (isMatch) {

                        req.session.userid = response[0]._id;
                        req.session.email = input.email;
                        req.session.empname = input.empname;

                        jwt.sign({email:input.email},"docket1-app",{expiresIn:"30d"},
                            (error,token) => {
                                if (error) {
                                    res.json({"status":"Unable to generate the token"})
                                } else {
                                    res.json({"status":"Success","userid":response[0]._id,"token":token})
                                }
                            })
                    } else {
                        res.json({"status":"Incorrect Password"})
                    }
                })
            } else {
                res.json({"status":"user not found"})
            }
        }
    ).catch()
})

const isAuthenticated = (req,res,next) => {
    if(req.session.userid)
    {
        next();
    } else {
        res.json({"status":"Unauthorized"})
    }
}

const isAdmin = (req,res,next) => {
    if (req.session.email) {
        next();
    } else {
        res.json({"status":"Unauthorized admin"})
    }
}

app.post('/user-dashboard',isAuthenticated,(req,res) => {
    res.json({"status":"Success","message":"Welcome to User Dashboard"})
});

app.post('/admin-dashboard',isAuthenticated,isAdmin,(req,res) => {
    res.json({"status":"Success","message":"Welcome to User Dashboard"})
})

app.post('/logout',(req,res) => {
    req.session.destroy((error) => {
        if(error){ 
            res.json({"status":"Error","message":"failed to logout"})
        } else {
            res.json({"status":"Success","message":"logout successfull"})
        }
    })
})

app.listen(8080,() => {
    console.log("Server is running")
})