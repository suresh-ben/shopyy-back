const express = require('express');
const router = express.Router();
const productControllers = require('../controllers/productControllers')
const auth = require("../auth");
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(path.join(process.cwd(), 'uploads'))
    cb(null, process.cwd() + '/uploads'); // Define the destination folder
  },
  filename: function (req, file, cb) {
    console.log("File mowa: " + file);
    const seed = Math.random();
    const fileName = Date.now() + Math.floor(seed*1000) + file.originalname;
    req.uploadedFileName = fileName;
    cb(null, fileName); // Define the file name
  },
});

const upload = multer({ storage: storage });

const {verify, verifyAdmin} = auth;

//createProduct
router.post("/", [verify, verifyAdmin, upload.single('picture')], productControllers.createProduct);

// Retrieve All Products
router.get("/", productControllers.getAllProduct);

// Retrieve Active Products
router.get("/active", productControllers.getActiveProduct);

// Retrieve Single Products
router.get("/getSingleProduct/:id", productControllers.getSingleProduct);

//Update Product
router.put("/updateProduct/:id", verify, verifyAdmin, productControllers.updateProduct);

//ARCHIEVE
router.put("/archive/:id", verify, verifyAdmin, productControllers.archiveProduct);

//ACTIVATE
router.put("/activate/:id", verify, verifyAdmin, productControllers.activateProduct);

//DELETE
router.delete("/delete/:id", verify, verifyAdmin, productControllers.deleteProduct);





module.exports = router;