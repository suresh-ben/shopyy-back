const express = require('express');

const router = express.Router();

const orderControllers = require('../controllers/orderControllers')

const auth = require("../auth");

const { verify, verifyAdmin } = auth;

//checkOutOrder
router.post("/", verify, orderControllers.checkOutOrder);

// MY STRETCH GOALS-- START  not yet finish testing////
// RETRIEVE ALL ORDERS by Admin
router.get("/viewAllOrders", verify, verifyAdmin, orderControllers.viewAllOrders);

// RETRIEVE MY ORDERS
router.get("/viewMyOrders", verify, orderControllers.viewMyOrders);

router.get("/viewMyOrders/:id", verify, orderControllers.viewMyOrdersByInvoiceNo);

/*previous versions
 1. router.post("/viewMyOrders/:id",  orderControllers.viewMyOrders);
 2. router.post("/viewMyOrders/:invoiceNo", verify, orderControllers.viewMyOrders);
*/


// MY STRETCH GOALS-- END////


module.exports = router;