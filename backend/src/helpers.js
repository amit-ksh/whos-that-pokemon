const { randomInt } = require('crypto');
const fs = require('fs');
const path = require('path');

exports.getUniqueArray = (len=4, max=100) => {
  const arr = []

  while (arr.length < 4) {
    const n = randomInt(max)
    if (!arr.includes(n)) 
      arr.push(n)
  }

  return arr
} 

exports.saveQuiz = (data) => {
  fs.writeFile(path.resolve(__dirname+'/data.json'), JSON.stringify(data), (e) => {})
}