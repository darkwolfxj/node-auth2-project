const jwt = require("jsonwebtoken")
const { jwtSecret } = require("../config/secrets")

const restricted = (req, res, next) => {
    const { authorization } = req.headers
    if(authorization){
        jwt.verify(authorization, jwtSecret, (err, decodedToken) => {
        err ? res.status(401).json({ message: "Invalid Credentials", err }) : req.decodedToken = decodedToken && next()
        })
    } else res.status(400).json({ message: "Provide credentials, twit!" })
}

module.exports = restricted