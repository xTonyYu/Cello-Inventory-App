const express = require('express');
const db = require('../models');

const router = express.Router()


// ******------------ POST Route (CREATE) -----------******* //
// get add new form page
router.get('/new', (req, res) => {
    const prodType = req.productType;
    const schema = prodType !== 'accessories' ? db.Product.schema.obj : db.Accesory.schema.obj;
    // in case the form needs to display Maker info
    db.Maker.find((err, makers) => {
        if (err) console.log(err)
        res.render('new', {
            prodType,
            schema,
            makers,
            priorProdType: '',
        });
    })
});

// create data
router.post('/', (req, res) => {
    const prodType = req.productType;
    //  update corresponding collections based on req.productType
    // below set the model to post data
    const model = prodType !== 'accessories' ? db.Product : db.Accesory;
    model.create(req.body, (err, newData) => {
        if (err) console.log(err)
        // only product need to also link to maker
        if (prodType !== 'accessories' && req.body.type !== 'bow') {
            db.Maker.findById(req.body.makerId, (err, foundMaker)=> {
                foundMaker.products.push(newData)
                foundMaker.save((err, savedMaker) => {
                res.redirect('/' + req.productType);
                })
            })
        } else {
            res.redirect('/' + req.productType);
        }
    })
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
                // TODO below still need to be tested once makers are linked with products
                // console.log(item._id)  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                // db.Maker.findOne({'products': item._id}, (err, foundMaker) => {
                //     if (err) console.log(err)  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                //     item.maker = foundMaker;
                    if (item.type === prodType) {
                        dataResult.push(item)
                    }
                // })
            })
        } else {
            dataResult = allData;
        }
        // console.log(dataResult)  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
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
    // TODO get Maker info
    db.Maker.find((err, makers) => {  // in case the form needs to display Maker info
        if (err) console.log(err)
        model.findById(req.params.id, (err, foundProduct) => {
            if (err) console.log(err)
            res.render('show', {
                prodType,
                Product: foundProduct._doc,
                makers,
            })
        });
    })
});


// ******------------ PUT Route (UPDATE) -----------******* //
// get edit from page
router.get('/:id/edit', (req, res) => {
    const prodType = req.productType;
    const model = prodType !== 'accessories' ? db.Product : db.Accesory;
    const schema = prodType !== 'accessories' ? db.Product.schema.obj : db.Accesory.schema.obj;
    console.log('get EDIT page route!')  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<
    db.Maker.find((err, makers) => {  // in case the form needs to display Maker info
        if (err) console.log(err)
        model.findById(req.params.id, (err, foundProduct) => {
            if (err) console.log(err)
            res.render('edit', {
                prodType,
                schema,
                makers,
                priorProdType: '',
                Product: foundProduct._doc,
            })
        });
    })
});

// update any product or maker
router.put('/:id', (req, res) => {
    // update data based on req.productType
    const prodType = req.productType;
    const model = prodType !== 'accessories' ? db.Product : db.Accesory;
    console.log('PUT route!')  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<
    model.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new: true},
        (err, foundData) => {
            if (err) console.log(err)
            // if the update is not for accessories or bow then update Maker else redirect
            if (prodType !== 'accessories' && prodType !== 'bow') {
                db.Maker.findOne({'products': req.params.id}, (err, foundMaker) => {
                    if (foundMaker._id.toString() !== req.body.makerId) {
                        foundMaker.products.remove(req.params.id);
                        foundMaker.save((err, savedFoundMaker) => {
                            db.Maker.findById(req.params.id, (err, newMaker) => {
                                newMaker.products.push(foundData);
                                newMaker.save((err, updatedMaker) => {
                                    res.redirect('/'+ prodType);
                                })
                            })
                        })
                    } else {
                        res.redirect('/'+ prodType);
                    }
                })
            } else {
                res.redirect('/'+ prodType);
            }
        }
    )
});


// ******------------ DELETE Route (DELETE) -----------******* //
router.delete('/:id', (req, res) => {
    // delete data based on id and req.productType
    const prodType = req.productType;
    const model = prodType !== 'accessories' ? db.Product : db.Accesory;
    model.findByIdAndDelete(req.params.id, (err, deletedProduct) => {
        if (err) console.log(err)
        // need to test below when Maker had linked products
        // if (prodType !== 'accessories' && prodType !== 'bow') {
        //     db.Maker.findOne({'products': req.params.id}, (err, foundMaker) => {
        //         console.log(foundMaker)
        //         foundMaker.products.remove(req.params.id);
        //         foundMaker.save((err, updatedMaker) => {
        //             res.redirect('/' + req.productType);
        //         })
        //     })
        // } else {
            res.redirect('/' + req.productType);
        // }
        console.log('deleted...', deletedProduct)
    });
});


module.exports = router