const express = require('express');
const router = express.Router();
const productModel = require("../model/products");
const path = require("path");
const isClerkAuthenticated = require("../middleware/clerkAuth");

router.get("/add",isClerkAuthenticated,(req,res)=>
{
    res.render("Product/productAdd");
});


router.post("/add",isClerkAuthenticated,(req,res)=>
{
    const newProduct = {
        title : req.body.title,
        cate : req.body.cate,
        description : req.body.description,
        price : req.body.price,
        quantity : req.body.quantity,
        bestSeller : req.body.bestSeller,
    }
    const product = new productModel(newProduct);
    product.save()
    .then((product)=>{
        req.files.productImg.name = `pic_${product._id}${path.parse(req.files.productImg.name).ext}`;
        console.log(req.files.productImg.name);
        req.files.productImg.mv(`public/img/${req.files.productImg.name}`)
        .then(()=>{

            productModel.updateOne({_id:product._id},{
                productImg: req.files.productImg.name
            })
            .then(()=>{
                res.redirect(`/product/list`);
            })
            
        })
        .catch(err=>console.log(`Fail set image`));
    })
    .catch(err=>console.log(`Error during inserting :${err}`));
   
});

//!---
router.get("/list",isClerkAuthenticated,(req,res)=>
{
    
    productModel.find() 
    .then((products)=>{
    
        const filtered = products.map(product=>{
            return{
                id : product._id,
                cate : product.cate,
                title : product.title,
                description : product.description,
                price : product.price,
                quantity : product.quantity,
                bestSeller : product.bestSeller,
                productImg : product.productImg
            }
        }); 


        res.render("Product/productDashboard",{
            data : filtered
        });
    })
    .catch(err=>console.log(`Error when get the data`));


  
});




router.get("/edit/:id",isClerkAuthenticated,(req,res)=>{
    productModel.findById(req.params.id)
    .then((product)=>{
        const {_id,title,cate,description,price,quantity,bestSeller,productImg} = product;
        res.render("Product/productEdit",{
            _id,
            title,
            cate,
            description,
            price,
            quantity,
            bestSeller,
            productImg
        });
    })
    .catch(err=>console.log(`Can not found the task`));

    
})

router.put("/update/:id",isClerkAuthenticated,(req,res)=>{

    const product = {
        title : req.body.title,
        cate : req.body.cate,
        description : req.body.description,
        price : req.body.price,
        quantity : req.body.quantity,
        bestSeller : req.body.bestSeller
    }

    productModel.updateOne({_id:req.params.id},product)
    .then((product)=>{
        req.files.productImg.name = `pic_${product._id}${path.parse(req.files.productImg.name).ext}`;
        req.files.productImg.mv(`public/img/${req.files.productImg.name}`)
        .then(()=>{

            productModel.updateOne({_id:product._id},{
                productImg: req.files.productImg.name
            })
            .then(()=>{
                res.redirect("/product/list");
            })
            
        })
        
    })
    .catch(err=>console.log(`Fail to update ${err}`));
});

router.delete("/delete/:id",isClerkAuthenticated,(req,res)=>{
    productModel.deleteOne({_id:req.params.id})
    .then(()=>{
        res.redirect("/product/list");
    })
    .catch(err=>console.log(`Fail to delete ${err}`));
});


module.exports=router;