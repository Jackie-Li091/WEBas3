const express = require('express');
const router = express.Router();
const model = require("../model/product");
const productModel = require("../model/products");

router.get("/",(req,res)=>{
    productModel.find({bestSeller:true}) 
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

        res.render("General/home",{
            title : "Home",
            data : model.getCategory(),
            data1 : filtered
        });
    })
    .catch(err=>console.log(`Error when get the data at homepage`));

});

router.get("/products",(req,res)=>{
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

        res.render("General/products",{
            title : "Product",
            data : filtered
        });
    })
    .catch(err=>console.log(`Error when get the data at productPage`));
    
});

module.exports = router;