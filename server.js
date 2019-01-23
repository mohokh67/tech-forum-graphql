const express = require('express');
const graphqlHTTP = require('express-graphql');
const axios = require('axios');

const schema = require('./schema');

const PORT = process.env.PORT || 4000;
const app = express();

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true
  })
);

app.get('/launches', (req, res) => {
  axios
    .get('https://api.spacexdata.com/v3/launches')
    .then(result => res.json(result.data))
    .catch(error => res.send(error));
});

app.get('/launches/:flight_number', (req, res) => {
  axios
    .get(`https://api.spacexdata.com/v3/launches/${req.params.flight_number}`)
    .then(result => res.json(result.data))
    .catch(error => res.send(error));
});

app.get('/rockets', (req, res) => {
  axios
    .get('https://api.spacexdata.com/v3/rockets')
    .then(result => res.json(result.data))
    .catch(error => res.send(error));
});

app.get('/rockets/:rocket_id', (req, res) => {
  axios
    .get(`https://api.spacexdata.com/v3/rockets/${req.params.rocket_id}`)
    .then(result => res.json(result.data))
    .catch(error => res.send(error));
});

app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`)
);
