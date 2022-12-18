const express = require("express");
const router = express.Router();

const { randomInt, randomUUID } = require('crypto');
const fs = require("fs");
const path = require("path");


// Axios allows us to make HTTP requests from our app
const axios = require("axios").default;

// Handle a GET request to the root directory,
// and send "Hello World" as a response
router.get("/", (req, res) => {
  res.send("Hello World!");
});


router.get("/check/:guess", (req, res) => {
  const guess = req.params.guess.toLowerCase()
  const uid = req.query.uid.trim()

  const entries = require('./data.json')

  let guessed = false
  let name = null
  const latest = entries.filter(e => {
    if (e.uid !== uid) return e
    
    if (guess === e.name) {
      guessed = true
    }
    name = e.name
  })
  fs.writeFile(path.resolve(__dirname+'/data.json'), JSON.stringify(latest), (e) => {})

  return res.json({guessed, name})

})

router.post('/quiz', async (req, res) => {
  const ids = [randomInt(100), randomInt(100), randomInt(100), randomInt(100)]
  const id = randomInt(4)
  const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/?limit=100`)
  const results = response.data.results

  const pokemons = ids.map(id => results[id].name)
  const image = `https://unpkg.com/pokeapi-sprites@2.0.2/sprites/pokemon/other/dream-world/${id}.svg`

  // Store the quiz in JSON file
  const uid = randomUUID()
  const entries = require('./data.json')
  entries.push({uid, name: pokemons[id]})
  fs.writeFile(path.resolve(__dirname+'/data.json'), JSON.stringify(entries), (e) => {})

  const data = {
    uid,
    image,
    pokemons,
  }
  return res.status(201).json(data)
})

module.exports = router;
