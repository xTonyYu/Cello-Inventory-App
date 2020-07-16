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
const fetchingIndexData = (req, res, next) => {
    const prodType = req.productType;
    // below set the fetching of the data based on prodType
    const model = prodType !== 'accessories' ? db.Product : db.Accesory;
    model.find((err, allData) => {
        if (err) console.log(err)
        let dataResult = [];
        if (prodType !== 'accessories') {
            db.Maker.find((err, makers) => {
                allData.forEach(item => {
                    makers.forEach(maker => {
                        if (maker.products.includes(item._id)) {
                            item.maker = maker
                        }
                    })
                    !item.maker ? item.maker = {name: ''} : null
                    if (item.type === prodType) {
                        dataResult.push(item)
                    }
                })
                req.dataResult = dataResult
                next()
            })
        } else {
            req.dataResult = allData;
            next()
        }
    })
}

// Get route for product index page
router.get('/', fetchingIndexData, (req, res) => {
    res.render('index', {
        prodType: req.productType,
        products: req.dataResult,
    });
})

// get detail SHOW page
router.get('/:id', (req, res) => {
    const prodType = req.productType;
    const model = prodType !== 'accessories' ? db.Product : db.Accesory;
    model.findById(req.params.id, (err, foundProduct) => {
        if (err) console.log(err)
        if (prodType !== 'accessories' && prodType !== 'bow') {
            let prodMaker;
            db.Maker.find((err, makers) => {  
                if (err) console.log(err)
                makers.forEach(maker => {
                    if (maker.products.includes(foundProduct._id)) {
                        prodMaker = maker
                    }
                })
                !prodMaker ? prodMaker = {name: 'Unknown Maker'} : null
                res.render('show', {
                    prodType,
                    Product: foundProduct._doc,
                    prodMaker,
                })
            })
        } else {      
            res.render('show', {
                prodType,
                Product: foundProduct._doc,
                prodMaker: {name: ''},
            })
        }
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
    model.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new: true},
        (err, foundData) => {
            if (err) console.log(err)
            // if the update is not for accessories or bow then update Maker else redirect
            if (prodType !== 'accessories' && prodType !== 'bow') {
                db.Maker.findOne({'products': req.params.id}, (err, foundMaker) => {
                    if (!foundMaker) {

                        db.Maker.findById(req.body.makerId, (err, newMaker) => {
                            newMaker.products.push(foundData);
                            newMaker.save((err, updatedMaker) => {
                                res.redirect('/'+ prodType);
                            })
                        })
                    } else if (foundMaker._id.toString() !== req.body.makerId) {
                        foundMaker.products.remove(req.params.id);
                        foundMaker.save((err, savedFoundMaker) => {
                            db.Maker.findById(req.body.makerId, (err, newMaker) => {
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
        if (prodType !== 'accessories' && prodType !== 'bow') {
            db.Maker.findOne({'products': req.params.id}, (err, foundMaker) => {
                console.log(foundMaker)
                foundMaker.products.remove(req.params.id);
                foundMaker.save((err, updatedMaker) => {
                    res.redirect('/' + req.productType);
                })
            })
        } else {
            res.redirect('/' + req.productType);
        }
        console.log('deleted...', deletedProduct)
    });
});


module.exports = router