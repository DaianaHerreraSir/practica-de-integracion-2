import jwt from 'jsonwebtoken';


const PRIVATE_KEY = "palabrasecretaparatoken" 

export const generateToken = (user) =>  jwt.sign(user, PRIVATE_KEY, 
        {expiresIn: "24h"});


export const authToken = (req, res, next) =>{

    const authHeader = req.headers["authorization"]
    if(!authHeader) return res.status(401).send({

        status: "Error",
        message: "no token"
    })

    const token = authHeader.split(' ')[1]

    jwt.verify(token,PRIVATE_KEY, (error, decodeUser)=>{
        if(error) return res.status(401).send({

            status: "Error",
            message: "no authorizated"
        })
        req.user = decodeUser
        next()
    })
}
