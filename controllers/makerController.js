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
    const prodType = req.productType;
    db.Maker.create(req.body, (err, createdData) => {
        if (err) console.log(err)
        res.redirect('/' + req.query._priorProdType + '/new');
    })
});


// ******------------ GET Route (READ) -----------******* //
// Get Route for Maker Show page
router.get('/', (req, res) => {
    const prodType = req.productType;
    // db.Maker.find((err, allMakers) => {
    //     if (err) console.log(err)
    //     res.render('makerIndex', {
    //         prodType,
    //         products: dataResult,
    //     });
    // })

    res.redirect('/dashboard');
});


// ******------------ PUT Route (UPDATE) -----------******* //
// router.get('/:id/edit', (req, res) => {
//     const prodType = req.productType;

//     db.Maker.find((err, makers) => {  // in case the form needs to display Maker info
//         if (err) console.log(err)
//         model.findById(req.params.id, (err, foundProduct) => {
//             if (err) console.log(err)
//             res.render('edit', {
//                 prodType,
//                 schema,
//                 makers,
//                 priorProdType: '',
//                 Product: foundProduct._doc,
//             });
//         });
//     })
// })

// TODO update route for Maker


module.exports = router;