const mongoose = require('mongoose');
const Maker = require('./makers')

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
    photos: {
        type: String,
    },
    maker: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Maker',
    }],
}, {timestamps: true});

const Cello = mongoose.model('Cello', celloSchema);

module.exports = Cello;