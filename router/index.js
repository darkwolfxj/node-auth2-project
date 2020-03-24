const router = require("express").Router()
const bcrypt = require("bcryptjs")
const db = require("../data/users-model")
const jwt = require("jsonwebtoken")
const restricted = require("../middlewares/restricted-middleware")


function tokenGenerator(user){
    const payload = {
        subject: user.id,
        username: user.username,
        role: user.role || "user"
    }
    const secret = "This is the most secretest secret to ever be secretly secret....... secret."
    const options = {
        expiresIn: "24h"
    }
    return jwt.sign(payload, secret, options)
}


router.get("/api/users", restricted, (req, res) => { 
    db.getUsers()
            .then(user => res.status(200).json(user))
            .catch(({ name, message }) => res.status(500).json({ message: "You shall not pass!", name, message }))
})
router.post("/api/auth/register", (req, res) => {
    let { username, password } = req.body
    password = bcrypt.hashSync(password, 12)
    db.addUser({ username, password })
        .then(() => res.status(201).json({ username, password }))
        .catch(({ name, message }) => res.status(500).json({ name, message }))
})
router.post("/api/auth/login", (req, res) => {
    const { username, password } = req.body
    db.getUsersBy({ username })
    // console.log(user, username, password)
        .then(([user]) => {
        if (user && bcrypt.compareSync(password, user.password)){ 
            const token = tokenGenerator(user)
            req.session.user = {
                user: user.username,
                id: user.id
            }
            res.status(200).json({ logged: "in!", token })
        } else { res.status(401).json({ message: "You shall not pass!" }) }
    })
        .catch(({ name, message, stack }) => res.status(500).json({ name, message, stack }))
})
router.get("/api/auth/logout", (req, res) => {
    console.log("req.session.user in logout", req.session.user);
    (req.session.user) ? req.session.destroy(err => {
        ({ name, message }) ? res.status(500).json({ name, message }) : res.status(200).json({ message: "See ya!" })
    }) : res.status(400).json({ message: "Log in, you dope!" })
})
module.exports = router