const express = require('express');
const router = express.Router();
const model = require("../model/product");

router.get("/",(req,res)=>{

    res.render("General/home",{
        title : "Home",
        data : model.getCategory(),
        data1 : model.getAllBest()

    });
});

router.get("/products",(req,res)=>{

    res.render("General/products",{ //same name with the name of the handlebars
        title : "Product",
        data : model.getAllProduct()
    });
});

module.exports = router;