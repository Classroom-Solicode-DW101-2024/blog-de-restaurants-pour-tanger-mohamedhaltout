let express = require('express');
let fs = require('fs');
let cors = require('cors');
let app = express();
let PORT = 3000;

app.use(express.json());
app.use(cors());

let restaurants = require('./restaurants.json');

app.get('/', (req, res) => {
  res.send('Bienvenue sur mon API!');
});

app.get('/restaurants', (req, res) => {
  res.json(restaurants);
});

app.get('/restaurants/:name', (req, res) => {
  let restaurantName = req.params.name.toLowerCase();
  let restaurant = restaurants.restaurants.find(r => r.name.toLowerCase() === restaurantName);

  if (restaurant) {
      let reviewsCount = restaurant.reviews ? restaurant.reviews.length : 0;
      res.json({ ...restaurant, reviewsCount });
  } else {
      res.status(404).json({ message: "Restaurant not found" });
  }
});

app.get('/restaurants/search/:term', (req, res) => {
  let searchTerm = req.params.term.toLowerCase();
  let results = restaurants.restaurants.filter(r =>
    r.name.toLowerCase().includes(searchTerm) ||
    r.specialty.toLowerCase().includes(searchTerm) ||
    r.address.toLowerCase().includes(searchTerm)
  );

  if (results.length > 0) {
    res.json(results);
  } else {
    res.status(404).json({ message: 'Aucun restaurant trouvé' });
  }
});

app.post('/restaurant', (req, res) => {
  let newRestaurant = {
      id: Date.now(),
      ...req.body
  };

  restaurants.restaurants.push(newRestaurant);
  fs.writeFileSync('./restaurants.json', JSON.stringify(restaurants, null, 2));

  res.status(201).json(newRestaurant);
});

app.put('/restaurant/:name', (req, res) => {
  let restaurantName = req.params.name;
  let restaurant = restaurants.restaurants.find(r => r.name === restaurantName);

  if (!restaurant) {
      return res.status(404).send('Restaurant non trouvé');
  }

  Object.assign(restaurant, req.body);
  fs.writeFileSync('./restaurants.json', JSON.stringify(restaurants, null, 2));

  res.json(restaurant);
});

app.delete('/restaurant/:id', (req, res) => {
  let id = parseInt(req.params.id);
  let index = restaurants.restaurants.findIndex(r => r.id === id);

  if (index === -1) {
      return res.status(404).json({ message: "Restaurant not found" });
  }

  restaurants.restaurants.splice(index, 1);
  fs.writeFileSync('./restaurants.json', JSON.stringify(restaurants, null, 2));

  res.sendStatus(204);
});

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
