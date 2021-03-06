const mongoose = require('mongoose');

const accesorieSchema = new mongoose.Schema({
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
    status: {
        type: String,
        default: 'in stock',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
    },
    descrption: {
        type: String,
    },
    photo: {
        type: String,
    },
    forInstrument: {
        type: [String],
    }
}, {timestamps: true});

const Accesories = mongoose.model('Accesories', accesorieSchema);

module.exports = Accesories;