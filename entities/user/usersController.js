const express = require('express')
const router = express.Router()
const User = require('./User')
const bcrypt = require('bcryptjs')


router.get('/admin/users',(require, response)=>{
    response.send('Listagem de usuários')
})

router.get('/admin/users/create',(require,response)=>{
    response.render('./admin/user/create',{
        titleHead:"Create User"
    })
})

router.post('/admin/user/save',(require,response)=>{
    let{userName, userPassword} = require.body;
    if(userName.length <= 4 || userPassword.length <= 2){
        return response.redirect('/')
    }
   

    User.findOne({
        where:{
            name:userName
        }
    }).then((user)=>{
        if(!user){

            userName = userName.trim();
            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(userPassword,salt)


            User.create({
                name:userName,
                password:hash
            }).then(()=>{
                response.redirect('/')
            })

        }else{
            console.log('user alwater exists')
        }
    }) 


  
   
})

module.exports = router