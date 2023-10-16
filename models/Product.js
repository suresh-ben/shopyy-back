const mongoose = require('mongoose');

let productSchema = new mongoose.Schema(

	{
		name: {
			type: String,
			required: [true, "Product Name is required"]
		},

		description: {
			type: String,
			required: [true, "Description is required"]
		},
		
		price: {
			type: Number,
			required: [true, "Price is required"]
		},

		picture: {
			type: String,
			required: true
		},

		isActive: {
			type: Boolean,
			default: true
		},

		tag: {
			type: String,
			default: "normal"
		},

		createOn: {
			type: Date,
			default: new Date()
		}
	}
);


module.exports = mongoose.model("Product", productSchema);




