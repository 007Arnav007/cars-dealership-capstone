/* Dealerships & Reviews microservice (Express). Uses MongoDB when MONGO_URL is set,
   otherwise falls back to an in-memory store loaded from data/*.json. */
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3030;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const readJson = (f) => JSON.parse(fs.readFileSync(path.join(__dirname, 'data', f), 'utf8'));
const dealershipsData = readJson('dealerships.json').dealerships;
const reviewsData = readJson('reviews.json').reviews;

let store;

function memoryStore() {
  const dealers = dealershipsData.slice();
  const reviews = reviewsData.slice();
  return {
    mode: 'in-memory',
    dealers: async () => dealers,
    dealersByState: async (s) => dealers.filter((d) => d.state.toLowerCase() === s.toLowerCase()),
    dealerById: async (id) => dealers.filter((d) => d.id === id),
    reviews: async () => reviews,
    reviewsByDealer: async (id) => reviews.filter((r) => r.dealership === id),
    insertReview: async (r) => { reviews.push(r); return r; },
    lastReviewId: async () => reviews.reduce((m, r) => Math.max(m, r.id), 0)
  };
}

async function mongoStore(url) {
  const mongoose = require('mongoose');
  await mongoose.connect(url, { dbName: 'dealershipsDB' });
  const Reviews = mongoose.model('reviews', new mongoose.Schema({
    id: { type: Number, required: true }, name: String, dealership: Number, review: String,
    purchase: Boolean, purchase_date: String, car_make: String, car_model: String, car_year: Number
  }));
  const Dealerships = mongoose.model('dealerships', new mongoose.Schema({
    id: { type: Number, required: true }, city: String, state: String, st: String, address: String,
    zip: String, lat: String, long: String, short_name: String, full_name: String
  }));
  await Reviews.deleteMany({});
  await Reviews.insertMany(reviewsData);
  await Dealerships.deleteMany({});
  await Dealerships.insertMany(dealershipsData);
  const clean = { _id: 0, __v: 0 };
  return {
    mode: 'mongodb',
    dealers: () => Dealerships.find({}, clean).lean(),
    dealersByState: (s) => Dealerships.find({ state: new RegExp('^' + s + '$', 'i') }, clean).lean(),
    dealerById: (id) => Dealerships.find({ id: id }, clean).lean(),
    reviews: () => Reviews.find({}, clean).lean(),
    reviewsByDealer: (id) => Reviews.find({ dealership: id }, clean).lean(),
    insertReview: (r) => new Reviews(r).save(),
    lastReviewId: async () => {
      const last = await Reviews.findOne().sort({ id: -1 });
      return last ? last.id : 0;
    }
  };
}

const wrap = (fn) => async (req, res) => {
  try { await fn(req, res); } catch (e) { console.error(e); res.status(500).json({ error: 'Error processing request' }); }
};

app.get('/', (req, res) => res.send('Welcome to the Mongoose API (' + store.mode + ')'));
app.get('/fetchReviews', wrap(async (req, res) => res.json(await store.reviews())));
app.get('/fetchReviews/dealer/:id', wrap(async (req, res) => res.json(await store.reviewsByDealer(parseInt(req.params.id, 10)))));
app.get('/fetchDealers', wrap(async (req, res) => res.json(await store.dealers())));
app.get('/fetchDealers/:state', wrap(async (req, res) => res.json(await store.dealersByState(req.params.state))));
app.get('/fetchDealer/:id', wrap(async (req, res) => res.json(await store.dealerById(parseInt(req.params.id, 10)))));

app.post('/insert_review', wrap(async (req, res) => {
  const d = req.body;
  const newId = (await store.lastReviewId()) + 1;
  const review = {
    id: newId, name: d.name, dealership: parseInt(d.dealership, 10), review: d.review,
    purchase: d.purchase === true || d.purchase === 'true', purchase_date: d.purchase_date,
    car_make: d.car_make, car_model: d.car_model, car_year: d.car_year ? parseInt(d.car_year, 10) : undefined
  };
  await store.insertReview(review);
  res.json(review);
}));

(async () => {
  store = process.env.MONGO_URL ? await mongoStore(process.env.MONGO_URL) : memoryStore();
  app.listen(port, () => console.log('Dealers API (' + store.mode + ') listening on ' + port));
})();
