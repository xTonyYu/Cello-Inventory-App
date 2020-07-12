const mongoose = require('mongoose');
const { model } = require('./accessories');

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
    }
}, {timestamps: true});

const Maker = mongoose.model('Maker', makerSchema);

module.exports = Maker;