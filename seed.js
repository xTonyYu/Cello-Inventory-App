const db = require('./models')

// ******-------- Starter Data loading - for initial build -------******* /// 
const starter = require('./data/starterData')

// helper function
const getMakerProducts = function getMakerProducts(maker, allProducts, str1, str2 = 'xyz123') {
    console.log("loadedMaker for each loop IF", maker.name)
        allProducts.forEach(prod => {
            if (prod.title.includes(str1) || prod.title.includes(str2)) {
                maker.products.push(prod);
                maker.save((err, updatedMaker) => {
                    console.log("product found!", prod.title)
                })
            }
        })
}


// restting collection - rebuilding from scratch; delete all then load
db.Product.deleteMany({},(err, deletedData) => {
    if (err) console.log(err)
    console.log('Delete all doc - resetting Product collection')
    db.Product.create(starter.dataCellos, (err, allProducts) => {
        if (err) console.log(err)
        console.log("PRODUCT data loaded.")
        // console.log("PRODUCT data loaded...", allProducts)
        db.Maker.deleteMany({},(err, deletedData) => {
            if (err) console.log(err)
            console.log('Delete all doc - resetting Accessory collection')
            db.Maker.create(starter.dataMakers, (err, loadedMaker) => {
                if (err) console.log(err)
                console.log("Maker data loaded.")
                loadedMaker.forEach(maker => {
                    if (maker.name.includes('Stradivari')) {
                        getMakerProducts(maker, allProducts, 'Davidoff', 'Vatican')
                    } else if (maker.name.includes('Guarneri')) {
                        getMakerProducts(maker, allProducts, 'Guarneri')
                    } else if (maker.name.includes('Amati')) {
                        getMakerProducts(maker, allProducts, 'The King')
                    } else {
                        console.log('no prod found')
                    }
                });
            })
        })
    })
})
db.Accessory.deleteMany({},(err, deletedData) => {
    if (err) console.log(err)
    console.log('Delete all doc - resetting Accessory collection')
    db.Accessory.create(starter.dataAccessories, (err, loadedData) => {
        if (err) console.log(err)
        console.log("ACCESSORY data loaded")
    })
})


