const mongoose = require('mongoose');

const accesorieSchema =new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    brand: {
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
    quantity: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    descrption: {
        type: String,
    },
    forInstrument: {
        type: String,
    }
}, {timestamps: true});

const Accesories = mongoose.model('Accesories', accesorieSchema);

module.exports = Accesories;