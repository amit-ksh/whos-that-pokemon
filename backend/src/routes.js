const express = require("express");
const { randomInt, randomUUID } = require('crypto');

// Axios allows us to make HTTP requests from our app
const axios = require("axios").default;

let entries = require('./data.json');
const { getUniqueArray, saveQuiz } = require("./helpers");


const router = express.Router();

router.get("/check/:guess", (req, res) => {
  const guess = req.params.guess.toLowerCase()
  const uid = req.query.uid.trim()

  let guessed = false
  let name = null
  entries = entries.filter(e => {
    if (e.uid !== uid) return true
    
    if (guess === e.name) {
      guessed = true
    }
    name = e.name
    return false
  })
  saveQuiz(entries)

  return res.json({guessed, name})

})

router.post('/quiz', async (req, res) => {
  const ids = getUniqueArray(4, 300)
  const ID = randomInt(4)
  const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/?limit=300`)
  const results = response.data.results

  const pokemons = ids.map(id => results[id-1].name)
  const image = `https://unpkg.com/pokeapi-sprites@2.0.2/sprites/pokemon/other/dream-world/${ids[ID]}.svg`

  // Store the quiz in JSON file
  const uid = randomUUID()
  entries.push({uid, name: pokemons[ID]})
  saveQuiz(entries)

  const data = {
    uid,
    image,
    pokemons,
  }
  return res.status(201).json(data)
})

module.exports = router;
