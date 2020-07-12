const mongoose = require('mongoose');

const celloSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    year: {
        type: Number,
    },
    category: {
        type: String,
        required: true,
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
        type: Number,
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
    photos: {
        type: String,
    },
    maker: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Maker',
    }],
    accesories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Accesories'
    }],
}, {timestamps: true});

const Cello = mongoose.model('Cello', celloSchema);

module.exports = Cello;