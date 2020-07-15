const express = require('express');
const db = require('../models')
const router = express.Router()


// ******------------ POST Route (CREATE) -----------******* //
// get add new form page
router.get('/new', (req, res) => {
        res.render('new', {
            prodType: req.productType,
            schema: db.Maker.schema.obj,
            priorProdType: req.query._priorProdType
        });
});

// create data
router.post('/', (req, res) => {
    db.Maker.create(req.body, (err, createdData) => {
        if (err) console.log(err)
        res.redirect('/' + req.query._priorProdType + '/new');
    })
});



module.exports = router;