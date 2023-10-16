const Product = require('../models/Product');

const auth = require('../auth');

//Create A Product

module.exports.createProduct = (req, res) => {

    Product.find({})
        .then(products => {

            let filtered = products.filter(product => {
                return product['name'] === req.body.name
            })

            console.log("gjhkfvouy");

            if (filtered.length === 0) {

                let newProduct = new Product({
                    name: req.body.name,
                    description: req.body.description,
                    price: req.body.price,
                    picture: req.uploadedFileName,
                    tag: req.body.tag? req.body.tag : "normal"
                })
                newProduct.save()
                    .then(() => {
                        res.send(newProduct);
                    })
                    .catch((err) => {
                        console.log(err)
                        res.send("Unable to create new product");
                    })

            } else {
                return res.status(400).send("Product is already created")
            }
        })
        .catch(err => res.send(err));
}

// Retrive All Products

module.exports.getAllProduct = (req, res) => {

    Product.find({})
        .then(result => res.send(result))
        .catch(err => res.send(err));
};

// Get Active Products

module.exports.getActiveProduct = (req, res) => {

    Product.find({ isActive: true })
        .then(result => res.send(result))
        .catch(err => res.send(err));
};

// Retrieve Single Product
module.exports.getSingleProduct = (req, res) => {

    Product.findById(req.params.id)
        .then(product => res.send(product))
        .catch(err => res.send(err));

};

// Update Products

module.exports.updateProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if(!product) res.status(400).send("No item found");

    console.log(req.body);

    if(req.body.name)
        product.name = req.body.name;
    if(req.body.description)
        product.description = req.body.description;
    if(req.body.price)
        product.price = req.body.price;
    product.isActive = req.body.availability;

    await product.save();
    console.log(product);
    
    res.send(product);
};

//Archive A Product

module.exports.archiveProduct = (req, res) => {

    let updates = {
        isActive: false
    }

    Product.findByIdAndUpdate(req.params.id, updates, { new: true })
        .then(updatedProduct => res.send(updatedProduct))
        .catch(err => res.send(err));
};

//Activate A Product

module.exports.activateProduct = (req, res) => {

    let updates = {
        isActive: true
    }

    Product.findByIdAndUpdate(req.params.id, updates, { new: true })
        .then(updatedProduct => res.send(updatedProduct))
        .catch(err => res.send(err));
};


//Delete A Product 
module.exports.deleteProduct = (req, res) => {

    Product.findByIdAndRemove(req.params.id).exec()
        .then(doc => {
            if (!doc) { return res.status(404).end(); }
            return res.status(204).end();
        })
        .catch(err => res.send(err));
};