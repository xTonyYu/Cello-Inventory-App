const express = require('express');
const db = require('../models')
const router = express.Router()


const currencyStyle = { style: 'currency', currency: 'USD' };
const formatToCurrency = function formatToCurrency(variable, string, currencyStyle) {
    return Intl.NumberFormat(string, currencyStyle).format(variable);
}
class findMakerById {
    constructor(prodType, totalQty, totalPrice, totalCost) {
        this.name = prodType;
        this.quantity = totalQty;
        this.avgPrice =  formatToCurrency(totalPrice / totalQty, 'en-US', currencyStyle);
        this.avgCost = formatToCurrency(totalCost / totalQty, 'en-US', currencyStyle);
        this.avgMargin = formatToCurrency(((totalPrice - totalCost) / totalQty), 'en-US', currencyStyle);
    }
}

// ******------------ GET Route in /dashboard-----------******* /
router.get('/', (req, res) => {
    let allProdTypesAndAccs = [];
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
                        totalPrice += product.price * product.quantity
                        totalCost += product.cost * product.quantity
                    }
                });
                const prodObj = new findMakerById(prodType, totalQty, totalPrice, totalCost)
                allProdTypesAndAccs.push(prodObj)
            }
            // also need to get data from accessories collection and push to allProdTypesAndAccs for display on dashboard page
            db.Accessory.find((err, accessories) => {
                let totalQty = 0, totalPrice = 0, totalCost = 0;
                if (err) console.log(err)
                accessories.forEach(accessory => {
                    if (accessory.status !== 'sold out') {
                        totalQty += accessory.quantity
                        totalPrice += accessory.price * accessory.quantity
                        totalCost += accessory.cost * accessory.quantity
                    }
                })
                const prodObj = new findMakerById('accessories', totalQty, totalPrice, totalCost)
                allProdTypesAndAccs.push(prodObj)
                res.render('dashboard', {
                    productTypes: allProdTypesAndAccs,
                });
            })
        });
    })
})

module.exports = router;