const express = require('express');
const db = require('../models');
const { Product } = require('../models');
const { dataAccessories } = require('../data/starterData');
const router = express.Router()

// ******------------ POST Route (CREATE) -----------******* //
// get add new form page
router.get('/new', (req, res) => {
    const prodSchema = db.Product.schema.obj
    const accessorySchema = db.Accesory.schema.obj
    console.log('accessorySchema...', accessorySchema)
    // TODO get key info for each collection and pass to ejs
    // const makerKeys = db.Maker.schema.obj
    // TODO change below to actual view
    res.render('testnew', {
        prodType: req.productType,
        prodSchema,
        accessorySchema,
    });
});

// create data
router.post('/', (req, res) => {
    // TODO update corresponding collections based on req.productType
    console.log('create done!')
    res.redirect('/' + req.productType);
});


// ******------------ GET Route (READ) -----------******* //
// Get route for product index page
router.get('/', (req, res) => {
    const prodType = req.productType;
    // below set the fetching of the data based on prodType
    const model = prodType !== 'accessories' ? db.Product : db.Accesory;
    model.find((err, allData) => {
        if (err) console.log(err)
        let dataResult = [];
        if (prodType !== 'accessories') {
            allData.forEach(item => {
                if (item.type === prodType) {
                    dataResult.push(item)
                }
            })
        } else {
            dataResult = allData;
        }
        res.render('index', {
            prodType,
            products: dataResult,
        });
    });
})

// get detail SHOW page
router.get('/:id', (req, res) => {
    const prodType = req.productType;
    const model = prodType !== 'accessories' ? db.Product : db.Accesory;
    model.findById(req.params.id, (err, foundProduct) => {
        if (err) console.log(err)
        res.render('show', {
            prodType,
            Product: foundProduct._doc,
        });
    });
});


// ******------------ PUT Route (UPDATE) -----------******* //
// get edit from page
router.get('/:id/edit', (req, res) => {
    // TODO get data based on id
    // TODO change below to actual view
    res.render('test', {
        test: req.productType + ' edit page',
        text: 'Get datial page for ID: ' + req.params.id,
    });
})

// update
router.put('/:id', (req, res) => {
    // TODO update data based on req.productType
    console.log("update success!")
    res.redirect('/'+ req.productType);
});


// ******------------ DELETE Route (DELETE) -----------******* //
router.delete('/:id', (req, res) => {
    // TODO delete data based on id and req.productType
    console.log('delete done')
    res.redirect('/' + req.productType);
});


module.exports = router