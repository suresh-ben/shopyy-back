const bcrypt = require('bcrypt');

const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

const auth = require('../auth');
const jwt = require('jsonwebtoken');
const crypto = require("crypto");

//Creating  User
const secret = "OnlineShoppingAPI";

module.exports.registerUser = async (req, res) => {
    let existingUSer = await User.findOne({userName: req.body.userName});
    if(existingUSer) {
        res.status(400).send('Existing Username.')
        return;
    }

    const hashedPW = bcrypt.hashSync(req.body.password, 10)

    let newUser = await User.create({
        userName: req.body.userName,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPW,
        mobileNo: req.body.mobileNo,
        cart: []
    });
    res.send(newUser);
}

// GET ALL USERS
module.exports.getAllUsers = (req, res) => {

    User.find({})
        .then(result => res.send(result))
        .catch(err => res.send(err));
};

// Log In User

module.exports.loginUser = async (req, res) => {

    try {
        const user = await User.findOne({ userName: req.body.userName });
        if (!user) {
            res.status(401).send('User does not exist');
            return;
        }

        console.log("sent 01");
        const isPasswordCorrect = bcrypt.compareSync(req.body.password, user?.password);
        if (isPasswordCorrect) {
            let token = auth.createAccessToken(user);

            res
                .cookie('authorization', token, {
                    domain: "*",
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                    path: "/"
                })
                .send("Login successfull!!")
        } else {
            res.status(401).send('Password is incorrect')
        }
    } catch(err) {
        res.status(400).send(err);
    }
};

module.exports.currentUser = async (req, res) => {
    const token = req.userToken;
    const payload = jwt.verify(token, secret);
    const user = await User.findById(payload.id);

    if(!token || !user) res.status(400).send("Unable to Login");

    res.status(200).send({
        user
    })
}

// Update to Admin

module.exports.updateAdmin = async (req, res) => {

    const user = await User.findById(req.params.id);
    if(!user) res.status(401).send('User does not exist');
    
    user.isAdmin = true;
    await user.save();

    res.send(user);
};

//Getting a SINGLE USER

module.exports.getSingleUser = (req, res) => {

    console.log(req.params);

    User.findById(req.params.id)
        .then(result => res.send(result))
        .catch(error => res.send(error))

};

module.exports.addToCart = async(req, res) => {
    const productId = req.params.productId;
    const product = await Product.findById(productId);
    if(!product) res.status(400).send("No product found!!");

    const user = await User.findById(req.user.id);
    let cart = user.cart;
    let productInCart = null;
    
    for(let i = 0; i < cart.length; i++) {
        const item = cart[i];
        if(item.productId == productId) {
            productInCart = item;
            cart[i].val++;
        }       
    }

    if(!productInCart) {
        cart.push({
            productId: productId,
            val: 1
        });
    }

    user.cart = cart;
    await user.save();
    res.send(user);
};

module.exports.updateCart = async(req, res) => {
    const user = await User.findById(req.user.id);
    let cart = user.cart;

    const productId = req.body.productId;
    const count = req.body.count;

    for(let i = 0; i < cart.length; i++) {
        const item = cart[i];
        if(item.productId == productId) {
            cart[i].val = count;
        }       
    }

    user.cart = cart;
    await user.save();
    res.send(user);
}

module.exports.orderCart = async(req, res) => {
    const user = await User.findById(req.user.id);
    let cart = user.cart;

    for(let i = 0; i < cart.length; i++) {
        const item = cart[i];
        if(item.val <= 0) continue;
        
        const invoiceNumber = crypto.randomBytes(16).toString("hex");
        const product = await Product.findById(item.productId);

        let order = await Order.create({
            invoiceNo: invoiceNumber,
            orderedBy: await User.findById(req.user.id).userName,
            product: product,
            quantity: item.val,
            shippingAddress: req.body.shippingAddress,
            total: item.val * product.price,
            // orderDetails: orderDetailsRaw,
        });
    }

    user.cart = [];
    await user.save();
    res.send(user);
}

module.exports.getCart = async(req, res)=>{
    const user = await User.findById(req.user.id);
    let cart = user.cart;
    console.log("cart: " + cart);
    res.send(cart);
}