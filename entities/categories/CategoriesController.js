const express = require('express')
const router = express.Router()
const Category = require('./Category')
const slugify = require('slugify')

router.get('/categories',(request,response)=>{
    
})


router.get('/admin/categories/new',(request,response)=>{
    response.render('./admin/categories/new.ejs',{
        titleHead:"Admin new category"
    })
})


router.post('/categories/save',(request,response)=>{
    let {title} = request.body
    if(title){
        console.log('entrou')
        Category.create({
            title,
            slug: slugify(title)
        })
        return response.redirect('/admin/categories/new')
    }

    return response.redirect('/af')
    
})

router.get('/categories/list',(request,response)=>{

    Category.findAll().then((item)=>{

        response.render('./admin/categories/listCategories.ejs',{
            titleHead:"Page",
            item
        });

    })
    

    
})

router.post('/categories/delete',(request,response)=>{
    const {id} = request.body;
    console.log(request.body)

    if(id != undefined && !isNaN(id) ){

        Category.destroy({
            where:{
                id:id
            }
        }).then(()=>{
             response.redirect('/categories/list')

        })

    }else{
        response.redirect('/')

    }

})

router.get('/categories/edit/:id',(request,response)=>{
    const {id} = request.params

    Category.findByPk(id).then((id)=>{
        response.render('./admin/categories/edit.ejs',{id,titleHead:"Editar Categoria"})

    })


})

router.post('/categories/update', (request,response)=>{
    const {id, title} = request.body
        console.log(id)
    Category.update({title, slug:slugify(title)},{
        where:{
            id
        }
    }).then(()=>{
        response.redirect('/categories/list')
    })
} )


module.exports = router;