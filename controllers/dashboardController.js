const express = require('express');
const db = require('../models')
const router = express.Router()

// ******------------ Starter Data loading -----------******* /
const starterData = require('../data/starterData')
// TODO delete prior data
// TODO create data


// ******------------ GET Route in /dashboard-----------******* /
router.get('/', (req, res) => {
    let totalQtyForProd = 0, totalPriceForProd = 0, totalCostForProd = 0;
    let productTypes = []
    // db.products.find((err, coreProducts) => {
    //     if (err) console.log(err)
    //     // calculate summarized stats 
    //     coreProducts.forEach(product => {
    //         if (product.status !== 'sold out') {
    //             totalQtyForProd += product.quantity
    //             totalPriceForProd += product.price
    //             totalCostForProd += product.cost
    //         }
    //     });
    //     const celloObj = {
    //         name: 'Cellos',
    //         quantity: totalQtyForProd,
    //         avgPrice: totalPriceForProd / totalQtyForProd,
    //         avgCost: totalCostForProd / totalQtyForProd,
    //         avgMargin: this.avgPrice - this.avgCost,
    //     }
    //     productTypes.push(celloObj)
    //     // TODO - get accs data
    // })
    res.render('test', {
        test: 'dashboard page',
        text: 'home page'
    })
})


module.exports = router;