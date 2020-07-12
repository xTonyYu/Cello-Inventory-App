const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb://localhost:27017/celloShop';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
})
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.log(`MongoDB connection error: ${err}`));

module.exports = {
  Cello: require('./cellos'),
  Accesories: require('./accessories'),
  Makers: require('./makers'),
  Employee: require('./employees')
};
