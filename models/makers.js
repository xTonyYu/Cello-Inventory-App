const mongoose = require('mongoose');
const Product = require('./products')

const makerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
    },
    photo: {
        type: String,
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    }],
}, {timestamps: true});

const Maker = mongoose.model('Maker', makerSchema);

module.exports = Maker;