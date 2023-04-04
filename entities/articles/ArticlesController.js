const express = require('express')
const router = express.Router()
const slugify = require('slugify')
const Category = require("../categories/Category")
const Articles = require("./Article")


router.get('/admin/articles/list',(request,response)=>{
    Articles.findAll({
        include:[{model: Category}]
    }).then((item)=>{
      
        response.render('admin/articles/listArticles',{titleHead:"lista de Artigos",item})

    })
})

router.get('/articles',(request,response)=>{
    response.send('rota articles')
})


router.get('/admin/articles/new',(request,response)=>{

    Category.findAll().then((item)=>{
        response.render('./admin/articles/new.ejs',{
        titleHead:"Novo artigo",
        item
    })
    })

    
})


router.post('/admin/articles/create',(request,response)=>{
    const {idCategory,description,titulo} = request.body
    Articles.create({
        title:titulo,
        body:description,
        slug:slugify(titulo),
        categoryId:idCategory

    })
    
    response.redirect('/admin/articles/list');

   
})


router.post('/admin/article/delete',(request,response)=>{
    const {id} = request.body;
    console.log(request.body)

    if(id != undefined && !isNaN(id) ){

        Articles.destroy({
            where:{
                id:id
            }
        }).then(()=>{
             response.redirect('/admin/articles/list')

        })

    }else{
        response.redirect('/')

    }

})

router.get('/admin/article/edit/:id',(request,response)=>{
    const id = request.params.id

    Category.findAll().then((item)=>{

        Articles.findByPk(id).then((article)=>{
            response.render('./admin/articles/edit.ejs',{
                titleHead:'Edit Article',
                item,
                article
            })
    
        }).catch((error)=>{
            response.redirect('/')
    
        })



    }).catch((error)=>{response.redirect('/')})


    
})

router.post('/admin/article/save',(request,response)=>{
    const {id,titulo,idCategory,description} = request.body;

    Articles.update(
        {
           title:titulo,
           slug:slugify(titulo),
           categoryId:idCategory,
           body:description 
        },
        {where:{id}}
        
        ).then(()=>{
            response.redirect('/')
        })
  

})

router.get('/',(request,response)=>{
    const numPage = request.params.num;
    console.log(numPage)
    Articles.findAll(
        {
            order:[
                ['id','DESC']
            ]
        }
    ).then((articles)=>{
        response.render('index',{
            articles,
            next:false,
            numPage:0

        })
    })
})

router.get('/articles/view/:slug',(request,response)=>{
    const slug = request.params
    console.log(slug)
    Articles.findOne({
        where: slug
    }).then((article)=>{
         response.render('./admin/articles/view.ejs',{
            titleHead:"View Article",
            article
         })
    })
    .catch((error)=>{
        response.redirect('/')
    })
    
})


router.get('/pages/:num?',(request,response)=>{
    let numPage = request.params.num;
    
    if(isNaN(numPage)){
        numPage = 0;
    }else{
        numPage = Number(numPage)
    }

    
    Articles.findAndCountAll({
        order:[
            ['id','ASC']
        ],
        limit:4,
        offset:numPage * 4
    }).then((articles)=>{
        let next = null;
        if((numPage*4) + 4 >= articles.count){
            next = false
        }else{
            next = true
        }
        response.render('index',{
            articles: articles.rows,
            next,
            numPage
        })
      
    })


    
    Articles.findAll(
        {
            order:[
                ['id','DESC']
            ]
        }
    ).then((articles)=>{
       
        response.render('index',{
            articles

        })
    })
})



module.exports = router;




// "titulo": "o que é python",
// "idCategory": "3",
// "description": "<p>testando um dois tres</p>",
// "id": "11"