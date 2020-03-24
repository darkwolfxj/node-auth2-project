const express = require("express")
const server = express()
const router = require("../router/")
const session = require("express-session")

const sessionConfig = {
    name: "innocent cookie :\)",
    secret: "It's a secret to everyone that if you blow up this rock you get $30.",
    cookie: {
        maxAge: 1000 * 60 * 60,   
        secure: false,
        // process.env.NODE_ENV === "development" ? false : true,
        httpOnly: true
    },
    resave: false,
    saveUninitialized: true
}

server.use(session(sessionConfig))
server.use(express.json())
server.use("/", router)
server.get("/", (req, res) => {
    res.status(200).json({ api: "up" })
})

module.exports = server