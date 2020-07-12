const express = require('express');
const methodOverride = require('method-override')
const db = require('./models')

const app = express();
const PORT = process.env.PORT || 4000;

// Controllers
const prodController = require('./controllers/prodController')

app.set('view engine', 'ejs');

// ******------------ Middleware -----------******* //
app.use(express.static(__dirname + '/public'))
app.use(express.urlencoded({extended: false}))
app.use(methodOverride('_method'));
app.use('/');


// ******------------ GET Route -----------******* /
// home/dashboard page
app.get('/', (req, res) => {
    res.redirect('/dashboard');
})

app.get('/dashboard', (req, res) => {
    let totalQtyForProd = 0, totalPriceForProd = 0, totalCostForProd = 0;
    let productTypes = []
    db.products.find((err, coreProducts) => {
        if (err) console.log(err)
        // calculate summarized stats 
        coreProducts.forEach(product => {
            if (product.status !== 'sold out') {
                totalQtyForProd += product.quantity
                totalPriceForProd += product.price
                totalCostForProd += product.cost
            }
        });
        const celloObj = {
            name: 'Cellos',
            quantity: totalQtyForProd,
            avgPrice: totalPriceForProd / totalQtyForProd,
            avgCost: totalCostForProd / totalQtyForProd,
            avgMargin: this.avgPrice - this.avgCost,
        }
        productTypes.push(celloObj)
        // TODO - get accs data
    })
    res.rednder('dashboard', {

    })
})


// ******------------ Server listening -----------******* //
app.listen(PORT, () => {
    console.log(`Cello Server started on port ` + PORT);
});