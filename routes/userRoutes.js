const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/userControllers')
const auth = require("../auth");
const { verify, verifyAdmin } = auth;

//User Registration
router.post("/", userControllers.registerUser);

//Retrieve all users
router.get("/", verify, verifyAdmin, userControllers.getAllUsers);

//LOG IN route
router.post("/login", userControllers.loginUser)

router.get('/currentuser', verify, userControllers.currentUser);

//Update to Admin
router.put("/updateAdmin/:id", verify, verifyAdmin, userControllers.updateAdmin);

//Add to cart
router.post('/addToCart/:productId', verify, userControllers.addToCart);

//update cart
router.put('/updateCart', verify, userControllers.updateCart);

//OrderCart
router.post('/orderCart', verify, userControllers.orderCart);

//Get cart
router.get('/getCart', verify, userControllers.getCart);

//GET SINGLE USER
router.get("/:id", verify, userControllers.getSingleUser);

module.exports = router;