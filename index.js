const express = require('express')
const session = require('express-session')
const routerCategorie = require('./entities/categories/CategoriesController')
const routerArticles = require('./entities/articles/ArticlesController')
const routerUser = require('./entities/user/usersController')

const app = express()
const bodyParse = require('body-parser')

app.use(session({
    secret:"lowSecretTestSecury",
    cookie:{
        maxAge:30_000
    }
}))

const connection = require('./database/database')
connection.authenticate().then(()=>{
    console.log("Conection realy sucess")
}).catch((error)=>{console.log(error)})




const Article = require('./entities/articles/Article')
const Category = require('./entities/categories/Category')
const Users = require('./entities/user/User')


app.use(bodyParse.urlencoded({extended:false}))
app.use(express.static('public'))
app.use(express.json())

app.use(routerCategorie)
app.use(routerArticles)
app.use(routerUser)

app.use(bodyParse.json())

app.set('view engine','ejs')

app.get("/session",(request,response)=>{
    request.session.name = "Vinicio";
    response.send("Criado")
})

app.get("/leitura",(request,response)=>{
    response.json(request.session.name);
})




app.get('/',(request,response)=>{
    response.render('index.ejs',{
        title:"Olá mundo"
    })
})
app.use('',(request,response)=>{
    response.send('404 not found')
})

app.listen(3333,()=>{console.log('server start')})