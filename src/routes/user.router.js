import { Router } from "express";
import usersModel from "../models/users.model.js";
import passportCall from "../middleware/passportCall.js";
import authorization from "../middleware/authentication.middleware.js";

const userRouter = Router()

userRouter.get("/", passportCall("jwt"),authorization(["USER_PREMIUM", "ADMIN"]), async(req, res)=>{
    try {
        const users = await usersModel.find({isActive: true})
        res.json({
            status: "succes",
            results: users
        })
    } catch (error) {
        console.log(error);
        
    }
})