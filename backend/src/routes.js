const express = require("express");
const router = express.Router();

const { randomInt, randomUUID} = require('crypto');
const { writeFile } = require("fs");
const path = require("path");

// Axios allows us to make HTTP requests from our app
const axios = require("axios").default;

// Handle a GET request to the root directory,
// and send "Hello World" as a response
router.get("/", (req, res) => {
  res.send("Hello World!");
});


router.get("/api/:guess", (req, res) => {
  const guess = req.params.guess.toLowerCase()
  const uid = req.body.uid

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
  writeFile(path.resolve(__dirname+'/data.json'), JSON.stringify(latest), (e) => {})

  return res.json({data: {guessed, name}})

})

router.post('/api/quiz', async (req, res) => {
  const id = randomInt(100)
  const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
  const name = response.data.name.toLowerCase()
  const image = `https://unpkg.com/pokeapi-sprites@2.0.2/sprites/pokemon/other/dream-world/${id}.svg`

  const uid = randomUUID()

  const entries = require('./data.json')
  entries.push({uid, name})

  writeFile(path.resolve(__dirname+'/data.json'), JSON.stringify(entries), (e) => {})

  return res.status(201).json({data: {uid, image}})
})

module.exports = router;
