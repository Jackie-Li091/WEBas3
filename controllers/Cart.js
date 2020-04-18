const express = require('express');
const router = express.Router();
const cartModel = require("../model/Cart");
const userModel = require("../model/User");
const productModel = require("../model/products");
const isAuthenticated = require("../middleware/normalAuth");

router.post("/add/:id",isAuthenticated,(req,res)=>{
    productModel.findById(req.params.id)
    .then((product)=>{
        const cart = {
            productId : product._id,
            productName : product.title,
            price : product.price,
            existQuantity : product.quantity,
            productImg : product.productImg
        };

        cartModel.findOne({userId:req.session.userInfo._id,productId:cart.productId})
        .then((cartt)=>{
            if(cartt){
                const update ={quantity : Number(req.body.addQuantity) + Number(cartt.quantity)};
                //console.log(typeof(update.quantity));
                cartModel.updateOne({_id:cartt._id},update)
                .then(()=>{
                    res.redirect("/cart/list");
                })
                .catch(err=>{console.log(`Err during the adding to cartt ${err}`)});
            }else{
                const addCart = {
                    userId : req.session.userInfo._id,
                    productId : cart.productId,
                    productName : cart.productName,
                    price : cart.price,
                    quantity : req.body.addQuantity,
                    existQuantity : cart.existQuantity,
                    productImg : cart.productImg
                }
                const newCart = new cartModel(addCart);
                newCart.save()
                .then(()=>{
                    res.redirect("/cart/list");
                })
                .catch(err=>{console.log(`Err during the adding to cart ${err}`)});
            }
        })
        .catch(err=>{console.log(`Err found inforamation ${err}`)});      

    })
    .catch(err=>{console.log(`Err to found the product ${err}`);});
});

router.get("/list",isAuthenticated,(req,res)=>{
    cartModel.find({userId:req.session.userInfo._id})
    .then((carts)=>{
        const filtered = carts.map(cart=>{
            return{
                id : cart._id,
                userId : cart.userId,
                title : cart.productName,
                productId : cart.productId,
                price : cart.price,
                existQuantity : cart.existQuantity,
                quantity : cart.quantity,
                productImg : cart.productImg,
                itemTotal : cart.price*cart.quantity
            }
        });

    //    console.log(filtered);
        let totalPrice = 0;
        filtered.forEach((item)=>{
            totalPrice = totalPrice + item.itemTotal;
        });
        res.render("Cart/cart",{
            title : "Shopping Cart",
            data : filtered,
            id : filtered.userId,
            totalPrice : totalPrice
        });
    })
    .catch(err=>console.log(`Err found shopping cart`));
});

router.get("/confirm",isAuthenticated,(req,res)=>{
    cartModel.find({userId:req.session.userInfo._id})
    .then((carts)=>{
        const filtered = carts.map(cart=>{
            return{
                title : cart.productName,
                quantity : cart.quantity,
                itemTotal : cart.price*cart.quantity
            }
        });

        let totalPrice = 0;
        filtered.forEach((item)=>{
            totalPrice = totalPrice + item.itemTotal;
        });

        cartModel.deleteMany({userId:req.session.userInfo._id})
        .then(()=>{
            userModel.findById(req.session.userInfo._id)
            .then((user)=>{
                const email = user.email;
                const username = user.username;
            //    console.log(email);
                const sgMail = require('@sendgrid/mail');
                sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
                const msg = {
                to: `${email}`,
                from: `jackienleee@gmail.com`,
                subject: 'Welcome to our family',
                html: 
                `
                Hi, ${username} <br>
                Thank you for shopping in our company<br>
                Today, tou bought ${filtered.quantity} of ${filtered.title} <br>
                Total cost is ${totalPrice}.
                `,
                };

                sgMail.send(msg)
                .then(()=>{
                    res.render("Cart/cartDashboard",{
                        title : "Thankyou for shopping",
                        data : filtered,
                        totalPrice : totalPrice
                    });
                })
                .catch(err=>{console.log(`Error sending confirm email ${err}`);});
            })
            .catch(err=>{console.log(`Error found the userInfo ${err}`);});
            
        })
        .catch(err=>{console.log(`Err during the delete ${err}`);});
    })
    .catch(err=>{console.log(`Err to found the order ${err}`);});
})

module.exports=router;