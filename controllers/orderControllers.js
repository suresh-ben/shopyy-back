const Order = require('../models/Order');
const User = require("../models/User");
const Product = require("../models/Product");
const auth = require('../auth');
const crypto = require("crypto");


//checkOutOrder

module.exports.checkOutOrder = async(req, res) => {

    if (req.user.isAdmin) {
        return res.status(401).send("Action Forbidden")
    };

    const invoiceNumber = crypto.randomBytes(16).toString("hex");

    let product = await Product.findById(req.body.productID);
    if (!product) res.send("No product with that ID");

    let newOrder = new Order({
        invoiceNo: invoiceNumber,
        orderedBy: await User.findById(req.user.id).userName,
        product: product,
        quantity: req.body.quantity,
        shippingAddress: req.body.shippingAddress,
        total: req.body.quantity * product.price,
        // orderDetails: orderDetailsRaw,
    });


    newOrder.save()
        .then(newOrder => res.send(newOrder))
        .catch(err => res.send(err));

};

// MY STRETCH GOALS-- START  not yet finish testing////

//View orders by Admin

module.exports.viewAllOrders = (req, res) => {

    Order.find({})
        .then(result => res.send(result))
        .catch(err => res.send(err));
};

//View orders by User
module.exports.viewMyOrders = async (req, res) => {
    const user = await User.findById(req.user.id).userName;

    const orders = await Order.find({orderedBy: user});
    res.send(orders);
}


module.exports.viewMyOrdersByInvoiceNo = (req, res) => {
    const invoiceNo = req.params.id;

    if (!invoiceNo) {
        return res.status(400).json({ error: "InvoiceNo is required." });
    }

    Order.findOne({ invoiceNo })
        .then((result) => {
            if (!result) {
                return res.status(404).json({ error: "Order not found." });
            }
            res.json(result);
        })
        .catch((err) => res.status(400).json({ error: "No order found." }));
};

module.exports.cancelOrderById = (req, res) => {
    const invoiceNo = req.params.id;

    if (!invoiceNo) {
        return res.status(400).json({ error: "InvoiceNo is required." });
    }

    Order.findOne({ invoiceNo })
        .then(async (order) => {
            if (!order) {
                return res.status(404).json({ error: "Order not found." });
            }
            //if order
            order.status = 'canceled';
            await order.save();
            res.send(order);
        })
        .catch((err) => res.status(400).json({ error: "No order found." }));
}



/* Previous version
module.exports.viewMyOrders = (req, res) => {

	Order.findById(req.params.invoiceNo)
	.then(result => res.send(result))
	.catch(err => res.send(err));
}; */

// MY STRETCH GOALS-- END////