const express = require('express');
const db = require('../models')
const router = express.Router()


// ******------------ GET Route in /dashboard-----------******* /
router.get('/', (req, res) => {
    let allProdTypesAndAccs = [];
    const currencyStyle = { style: 'currency', currency: 'USD' };
    db.Product.find((err, coreProducts) => {
        if (err) console.log(err)
        // find unique product types within Product collection and group/display them separately
        db.Product.distinct('type', (err, uniqueProdTypes) => {
            if (err) console.log(err)
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
                    quantity: totalQty,
                    avgPrice: Intl.NumberFormat('en-US', currencyStyle).format(totalPrice / totalQty),
                    avgCost: Intl.NumberFormat('en-US', currencyStyle).format(totalCost / totalQty),
                    avgMargin: Intl.NumberFormat('en-US', currencyStyle).format((totalPrice - totalCost) / totalQty),
                }
                allProdTypesAndAccs.push(prodObj)
            }
            // also need to get data from accessories collection and push to allProdTypesAndAccs for display on dashboard page
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
                    quantity: totalQty,
                    avgPrice: Intl.NumberFormat('en-US', currencyStyle).format(totalPrice / totalQty),
                    avgCost: Intl.NumberFormat('en-US', currencyStyle).format(totalCost / totalQty),
                    avgMargin: Intl.NumberFormat('en-US', currencyStyle).format((totalPrice - totalCost) / totalQty),
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