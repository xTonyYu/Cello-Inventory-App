const db = require('./models')

// ******-------- Starter Data loading - for initial build -------******* /// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
const starter = require('./data/starterData')

// restting collection - rebuilding from scratch; delete all then load
db.Product.deleteMany({},(err, deletedData) => {
    if (err) console.log(err)
    console.log('Delete all doc - resetting Product collection')
    db.Product.create(starter.dataCellos, (err, loadedData) => {
        if (err) console.log(err)
        console.log("PRODUCT data loaded.")
        // console.log("PRODUCT data loaded...", loadedData)
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
db.Maker.deleteMany({},(err, deletedData) => {
    if (err) console.log(err)
    console.log('Delete all doc - resetting Accessory collection')
    db.Maker.create(starter.dataMakers, (err, loadedData) => {
        if (err) console.log(err)
        console.log("Maker data loaded.")
    })
})

