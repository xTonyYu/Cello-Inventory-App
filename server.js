const express = require('express');
const methodOverride = require('method-override')
const db = require('./models')

const app = express();
const PORT = process.env.PORT || 4000;

// Controllers
const prodController = require('./controllers/prodController')
const dashboardController = require('./controllers/dashboardController')

app.set('view engine', 'ejs');

// ******------------ Middleware -----------******* //
app.use(express.static(__dirname + '/public'))
app.use(express.urlencoded({extended: false}))
app.use(methodOverride('_method'));


// ******------------ GET Route -----------******* /
// home/dashboard page
app.get('/', (req, res) => {
    res.redirect('/dashboard');
})


// ******------------ Rerouting -----------******* /
app.use('/dashboard', dashboardController)

app.use('/:productType', function(req, res, next) {
    req.productType = req.params.productType
    // TODO below condition should based on what are in the coreproduct.type + accessories
    db.Product.distinct('type', (err, uniqueProdTypes) => {
        if (err) console.log(err)
        if (uniqueProdTypes.includes(req.productType) || req.productType === 'accessories') {
            next(); 
        } else {
            res.send("Sorry, page not found")
        }
    })
}, prodController);

// ******------------ Server listening -----------******* //
app.listen(PORT, () => {
    console.log(`Cello Server started on port ` + PORT);
});