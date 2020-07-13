const mongoose = require('mongoose');
const Maker = require('./makers')

const productSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    year: {
        type: Number,
    },
    price: {
        type: Number,
        required: true,
    },
    cost: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    players: {
        type: [String],
    },
    description: {
        type: String,
    },
    photo: {
        type: String,
    },
    maker: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Maker',
    }],
}, {timestamps: true});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;