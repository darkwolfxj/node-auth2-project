const knexconfig = require("../knexfile")
const db = require("knex")(knexconfig.development)

function getUsers(){
    return db("users")
        .select("id as user-id", "username")
}
function getUsersBy(filter){
    return db("users")
        .where(filter)
}
function addUser(user){
    return db("users")
        .insert(user)
}

module.exports = {
    getUsers,
    getUsersBy,
    addUser
}