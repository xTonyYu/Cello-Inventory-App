const express = require('express');
const db = require('../models')
const router = express.Router()

// ******-------- Starter Data loading - for initial build -------******* /// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
const starter = require('../data/starterData')

// restting collection - rebuilding from scratch
db.Product.deleteMany({},(err, deletedData) => {
    if (err) console.log(err)
    console.log('Delete all doc - resetting Product collection')
})
db.Accesory.deleteMany({},(err, deletedData) => {
    if (err) console.log(err)
    console.log('Delete all doc - resetting Accessory collection')
})

// loading starter data
db.Product.create(starter.dataCellos, (err, loadedData) => {
    if (err) console.log(err)
    console.log("PRODUCT - loaded Data...", loadedData)
})
db.Accesory.create(starter.dataAccessories, (err, loadedData) => {
    if (err) console.log(err)
    // console.log("ACCESSORY - loaded Data...", loadedData)
})


// ******------------ GET Route in /dashboard-----------******* /
router.get('/', (req, res) => {
    let allProdTypesAndAccs = [];
    db.Product.find((err, coreProducts) => {
        if (err) console.log(err)
        // calculate summarized stats 
        console.log("fetching all product data...", coreProducts) // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        // find unique product types and group/display them separately
        db.Product.distinct('type', (err, uniqueProdTypes) => {
            if (err) console.log(err)
            console.log('uniqueProdTypes...', uniqueProdTypes)  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
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
                    quantity: totalQty,
                    avgPrice: totalPrice / totalQty,
                    avgCost: totalCost / totalQty,
                    avgMargin: (totalPrice - totalCost) / totalQty,
                }
                console.log('prodObj...', prodObj)  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                allProdTypesAndAccs.push(prodObj)
            }
            console.log('allProdTypesAndAccs...', allProdTypesAndAccs)  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        });
    // TODO - get accessory data
    })
    res.render('test', {
        test: 'dashboard page',
        text: allProdTypesAndAccs[0]
    })
})


module.exports = router;