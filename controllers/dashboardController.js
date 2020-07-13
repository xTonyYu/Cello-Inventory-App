const express = require('express');
const db = require('../models')
const router = express.Router()

// ******-------- Starter Data loading - for initial build -------******* /// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
const starter = require('../data/starterData')

// restting collection - rebuilding from scratch; delete all then load
db.Product.deleteMany({},(err, deletedData) => {
    if (err) console.log(err)
    console.log('Delete all doc - resetting Product collection')
    db.Product.create(starter.dataCellos, (err, loadedData) => {
        if (err) console.log(err)
        console.log("PRODUCT data loaded")
    })
})
db.Accesory.deleteMany({},(err, deletedData) => {
    if (err) console.log(err)
    console.log('Delete all doc - resetting Accessory collection')
    db.Accesory.create(starter.dataAccessories, (err, loadedData) => {
        if (err) console.log(err)
        console.log("ACCESSORY data loaded")
    })
})


// ******------------ GET Route in /dashboard-----------******* /
router.get('/', (req, res) => {
    let allProdTypesAndAccs = [];
    db.Product.find((err, coreProducts) => {
        if (err) console.log(err)
        // find unique product types and group/display them separately
        db.Product.distinct('type', (err, uniqueProdTypes) => {
            if (err) console.log(err)
            console.log('uniqueProdTypes...', uniqueProdTypes)  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
            // calculate summarized stats by each prod type 
            for (let index = 0; index < uniqueProdTypes.length; index++) {
                const prodType = uniqueProdTypes[index];
                let totalQty = 0, totalPrice = 0, totalCost = 0;
                // adding each product info to the total stats
                coreProducts.forEach(product => {
                    if (product.status !== 'sold out' && product.type === prodType) {
                        totalQty += product.quantity
                        totalPrice += product.price
                        totalCost += product.cost
                    }
                });
                const prodObj = {
                    name: prodType,
                    indexPage: 'products',
                    quantity: totalQty,
                    avgPrice: totalPrice / totalQty,
                    avgCost: totalCost / totalQty,
                    avgMargin: (totalPrice - totalCost) / totalQty,
                }
                allProdTypesAndAccs.push(prodObj)
            }
            console.log('allProdTypesAndAccs...', allProdTypesAndAccs)  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
            db.Accesory.find((err, accessories) => {
                let totalQty = 0, totalPrice = 0, totalCost = 0;
                if (err) console.log(err)
                accessories.forEach(accessory => {
                    if (accessory.status !== 'sold out') {
                        totalQty += accessory.quantity
                        totalPrice += accessory.price
                        totalCost += accessory.cost
                    }
                })
                const prodObj = {
                    name: 'accessories',
                    indexPage: 'accessories',
                    quantity: totalQty,
                    avgPrice: totalPrice / totalQty,
                    avgCost: totalCost / totalQty,
                    avgMargin: (totalPrice - totalCost) / totalQty,
                }
                allProdTypesAndAccs.push(prodObj)
                res.render('dashboard', {
                    productTypes: allProdTypesAndAccs,
                });
            })
        });
    })
})


module.exports = router;