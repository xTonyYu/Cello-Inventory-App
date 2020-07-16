const express = require('express');
const methodOverride = require('method-override')
require('dotenv').config()
const session = require('express-session');
const db = require('./models')

const app = express();
const PORT = process.env.PORT || 4000;

const minimumProdTypes = ['cello', 'violin', 'bow', 'accessories', 'sales']

// Controllers
const prodController = require('./controllers/prodController')
const dashboardController = require('./controllers/dashboardController')
const makerController = require('./controllers/makerController')
const authController = require('./controllers/authController');
// const emplyController = require('./controllers/emplyController');

app.set('view engine', 'ejs');

// ******------------ Middleware -----------******* //
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));

// Express session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 *60 *60 *24 *7 *2 //expires in two weeks
    }
}));

app.use((req, res, next) => {
    if (req.url !== '/register'  && req.url !== '/login' && req.url !== '/'  && !req.session.currentUser) return res.redirect('/login');
    next();
});

// ******------------ GET Route -----------******* /
// home/dashboard page
app.get(['/', '/home'], (req, res) => {
    res.redirect('/dashboard');
})
// Auth Routes
app.use('/', authController);

// ******------------ Rerouting -----------******* /
app.use('/dashboard', dashboardController)
app.use('/maker', (req, res, next) => {
    req.productType = 'maker'
    next();
}, makerController)

app.use('/:productType', function(req, res, next) {
    req.productType = req.params.productType
    // below condition is based on what are in the Product.type + accessories
    db.Product.distinct('type', (err, uniqueProdTypes) => {
        if (err) console.log(err)
        if (uniqueProdTypes.includes(req.productType) || minimumProdTypes.includes(req.productType)) {
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