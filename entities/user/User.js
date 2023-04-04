const Sequelize = require('sequelize')
const connection = require('../../database/database')


const User = connection.define('users',{
    name:{
        type:Sequelize.STRING,
        allowNull:false
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false
    }
})


// User.sync({force:true})

module.exports = User