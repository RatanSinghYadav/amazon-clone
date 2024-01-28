const express = require('express');
const router = new express.Router();
const Products = require('../models/productSchema');
const USER = require('../models/userSchema');
const bcrypt = require('bcryptjs');
const authenticate = require('../middleware/authenticate')


// Get all the Product from the database

router.get('/getproducts', async (req, res) => {
    try {
        const productsdata = await Products.find();
        // console.log(productsdata);
        res.status(201).json(productsdata);
    } catch (error) {
        console.log("error" + error.message);
        res.stauts(404).json("Data Not Found")
    }
})

// Get only single product from the database

router.get('/getproductsone/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = await Products.findOne({ id: id });
        // console.log(data);
        res.status(201).json(data);
    } catch (error) {
        res.status(400).json("error found");
    }
})

// Register user API

router.post('/register', async (req, res) => {
    const { fname, email, mobile, password, cpassword } = req.body;

    if (!fname || !email || !mobile || !password || !cpassword) {
        res.status(422).json({ error: "filll the all details" });
        console.log("filll the all details");
    };

    try {

        const preuser = await USER.findOne({ email: email });

        if (preuser) {
            res.status(422).json({ error: "This email is already exist" });
        } else if (password !== cpassword) {
            res.status(422).json({ error: "password are not matching" });;
        } else {

            const finaluser = new USER({
                fname, email, mobile, password, cpassword
            });

            // yaha pe hasing krenge 

            const storedata = await finaluser.save();
            // console.log(storedata + "user successfully added");
            res.status(201).json(storedata);
        }

    } catch (error) {
        console.log("error found" + error.message);
        res.status(422).send(error);
    }

})

// Login user API

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ error: "fill the details" });
        }



        const userlogin = await USER.findOne({ email });

        if (!userlogin) {
            return res.status(401).json({ message: 'Authentication failed' });
        }

        const match = await bcrypt.compare(String(password), String(userlogin.password));


        // console.log(match);



        if (!match) {
            res.status(401).json({ error: "Match Authentication failed" });
        }


        // Genrate JWT Token

        const authToken = await userlogin.generateAuthtoken();
        // console.log(authToken);

        res.cookie("AmazonWeb", authToken, {
            // expires: new Date(Date.now() + 900000),
            httpOnly: true
        });
        res.status(201).json(userlogin);
    } catch (error) {
       res.status(401).json("Your Session is expired!");
    }



});


// Add product in user cart API

router.post("/addcart/:id", authenticate, async (req, res) => {

    try {
        const { id } = req.params;
        const cart = await Products.findOne({ id: id });
        // console.log(cart + "cart milta hain");

        const Usercontact = await USER.findOne({ _id: req.userID });
        // console.log(Usercontact + "user milta hain");


        if (Usercontact) {
            const cartData = await Usercontact.addcartdata(cart);
            // console.log(cartData);
            await Usercontact.save();
            res.status(201).json(Usercontact);
        } else {
            res.stauts(401).json("invalid user");
        }
    } catch (error) {
        res.status(401).json("Your Session is expired!");
    }
});

// Get all user products in user cart

router.get('/cartdetails',authenticate,async(req,res)=>{
    try {
        const buyuser = await USER.findOne({_id:req.userID});
        res.status(201).json(buyuser);
    } catch (error) {
        res.status(401).json("product not found.");

    }
})

// Valid user badge 

router.get('/validuser',authenticate,async(req,res)=>{
    try {
        const validuser = await USER.findOne({_id:req.userID});
        res.status(201).json(validuser);
    } catch (error) {
        res.status(401).json("product not found.");

    }
})

// remove item from cart

router.delete("/remove/:id",authenticate,(req,res)=>{
    try {
        const {id} = req.params;
        req.rootUser.carts = req.rootUser.carts.filter((currentVal)=>{
            return currentVal.id != id
        });
        req.rootUser.save();
        res.status(201).json(req.rootUser)
    } catch (error) {
        console.log("remove data not found");
        res.status(401).json("remove data not found")
    }
})

// for userlogout

router.get("/logout", authenticate, async (req, res) => {
    try {
        req.rootUser.tokens = req.rootUser.tokens.filter((curelem) => {
            return curelem.token !== req.token
        });

        res.clearCookie("AmazonWeb", { path: "/" });
        req.rootUser.save();
        res.status(201).json(req.rootUser.tokens);
        // console.log("user logout");

    } catch (error) {
        console.log(error + "jwt provide then logout");
    }
});

module.exports = router;