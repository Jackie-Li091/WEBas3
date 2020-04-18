const express = require('express');
const router = express.Router();
const model = require("../model/product");
const productModel = require("../model/products");

router.get("/",(req,res)=>{
    productModel.find({bestSeller:true}) 
    .then((products)=>{
        productModel.find({isCate:"true"})
        .then((cates)=>{
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
            
            const filteredCate = cates.map(cate=>{
                return{
                    id : cate._id,
                    title : cate.cate,
                    productImg : cate.productImg
                }
            })
            res.render("General/home",{
                title : "Home",
                data : filteredCate,
                data1 : filtered
            });
        })
        .catch(err=>console.log(`Err the 2nd foud ${err}`));
    })
    .catch(err=>console.log(`Error when get the data at homepage ${err}`));

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

router.get("/products/:cate",(req,res)=>{
    productModel.find({cate:req.params.cate})
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
    .catch(err=>console.log(`Error when get the cate data at productPage`));
})

router.get("/products/item/:id",(req,res)=>{

    productModel.findById(req.params.id)
    .then((product)=>{
        const {_id,cate,title,description,price,quantity,bestSeller,productImg} = product;
        res.render("General/item",{
            _id,
            cate,
            title,
            description,
            price,
            quantity,
            bestSeller,
            productImg
        })
    })
    .catch(err=>console.log(`Err found the item`));
})

module.exports = router;