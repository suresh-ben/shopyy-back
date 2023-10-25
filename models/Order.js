const mongoose = require('mongoose');

let orderSchema = new mongoose.Schema(

	{
		
		invoiceNo: {
			type: String,
			required: true
		},

		orderedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref:'User'
		},
		product: {
			type: mongoose.Schema.Types.ObjectId,
			ref:'Product'
		},
		quantity: {
			type: Number,
			required: true
		},
		shippingAddress: {
			type: String,
			required: true
		},

		// purchaseDate: {
		// 	type: Date,
		// 	default: new Date()
		// },

		total: {
			type: Number,
			required: true
		},

		status: {
			type: String,
			enum: ['success', 'delivered', 'canceled'],
			default: 'success'
		}

		// orderDetails: [
		// 	{	
		// 		shippingAddress: {
		// 			type: String,
		// 			required: true
		// 		},
		// 		productName: {
		// 			type: String,
		// 			required: true
		// 		},
		// 		quantity: {
		// 			type: Number,
		// 			required: true
		// 		},
		// 		subTotal: {
		// 			type: Number,
		// 			required: true
		// 		}
		// 	}
		// ]	
	}
);


module.exports = mongoose.model("Order", orderSchema);




