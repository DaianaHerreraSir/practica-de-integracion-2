import { Router } from "express";
import  authorization  from "../middleware/authentication.middleware.js";
import UserManagerMongo from "../daos/Mongo/UserManagerMongo.js";
import usersModel from "../models/users.model.js";
import { createHash, isValidPassword } from "../utils/hashBcrypt.js";
import passport from "passport";

import  passportCall  from "../middleware/passportCall.js";
import { generateToken } from "../utils/jsonwebtoken.js";


const sessionRouter = Router()



//REGISTRO
sessionRouter.post("/register", async(req, res)=>{
    const{first_name, last_name, email, password}= req.body

const userNew= {
    first_name, 
    last_name,
    email,
    password: createHash(password)
}
const result = await usersModel.create(userNew)


const token = generateToken({
    first_name,
    last_name,
    id: result._id
})

res.cookie("cookieToken", token,{
    maxAge: 60 * 60 * 1000 *24,
    httpOnly: true
}).send({
    status: "success",
    usersCreate: result, 
    token
})
})
//LOGIN

sessionRouter.post("/login", async(req,res)=>{
    const {email, password}= req.body

    const user= await usersModel.findOne({email})
    if(!isValidPassword(password, user.password)) return res.status(401).send("contraseña incorrecta")

//TOKEN
const token = generateToken({
    id: user._id,
    email: user.email,
    role: user.role
    })

    res.cookie("cookieToken", token, {
        maxAge : 60 * 60 * 1000 *24,
        httpOnly: true
    }).send({
        status: "success",
        usersCreate: "login success", 
        token
    })
})

sessionRouter.post("/logout", (req, res)=>{
    res.send("logout")
})


//CURRENT
sessionRouter.get("/current", passportCall("jwt"), authorization(["USER", "ADMIN"]) ,async(req,res)=>{
    res.send({ user: req.user, message: "Datos sensibles" });
})



//GITHUB

sessionRouter.get("/github", passport.authenticate("github", 
{scope: ['user: email']}), async (req, res) => {
    
});

//GITHUBCALLBACK

sessionRouter.get("/githubcallback",passport.authenticate("github", {failureRedirect:"/login"} ), async(req, res)=>{
    req.session.user = req.user
    res.redirect("/products")
})



export default sessionRouter