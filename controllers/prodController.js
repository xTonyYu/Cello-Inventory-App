const express = require('express');
const db = require('../models')
const router = express.Router()

// ******------------ POST Route (CREATE) -----------******* //
// get add new form page
router.get('/new', (req, res) => {
    // TODO change below to actual view
    res.render('test', {
        test: req.productType,
        text: 'Get Add new form'
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
    // TODO get data
    // TODO change below to actual view
    res.render('test', {
        test: req.productType,
        text: 'Get product index page',
    });
})

// get detail page
router.get('/:id', (req, res) => {
    // TODO get data based on id
    // TODO change below to actual view
    res.render('test', {
        test: req.productType,
        text: 'Get datial page for ID: ' + req.params.id,
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