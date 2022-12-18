import { useState } from 'react'
import axios from 'axios'
import './App.css'
import pokebalImg from './assets/pokeball.png'

const IDLE = 'idle'
const PLAYING = 'playing'
const PLAYED = 'guessed'


function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState()
  const [guessed, setGuessed] = useState()
  const [guess, setGuess] = useState()
  const [gameState, setGameState] = useState(IDLE)

  const handleClick = async () => {
    setLoading(true)
    const response = await axios.post('http://localhost:3000/quiz')
    setData(response.data)
    setGameState(PLAYING)
    setLoading(false)
  }

  const checkGuess = async (e) => {
    e.preventDefault()

    const response = await axios.get(`http://localhost:3000/check/${guess}?uid=${data.uid}`)
    const {guessed, name} = response.data
    setGuessed(guessed)
    setName(name)
    setGameState(PLAYED)
  }

  return (
    <>
      <header>
        <h1>Who's That Pokémon?</h1>
      </header>
      <main>
        {/* LOADER */}
        {loading && <img src={pokebalImg} alt='pokeball' className='loader' />}

        {/* POKEMON IMAGE */}
        { !loading && data?.image && <img id='pokemon' src={data.image} alt='pokemon' className={gameState === PLAYED ? 'visible' : ''} /> }

        {/* WIN MESSAGE */}
        {gameState === PLAYED && guessed && (
          <h3>You guessed it correct. It's <span className='poke-name'>{name}</span></h3>
          )}

        {/* LOSE MESSAGE */}
        {gameState === PLAYED && !guessed && (
          <h3>No, It's <span className='poke-name'>{name}</span></h3>
        )}

        { gameState === PLAYING ? (
            // INPUT BOX
            <form onSubmit={checkGuess}>
              {data?.pokemons.map(p => (
                <div key={p} className={guess === p ? 'selected' : ''}>
                  <input 
                    type="radio"
                    id={p} 
                    name='pokemon' 
                    value={p} 
                    onChange={e => setGuess(e.target.value)} 
                  />
                  <label htmlFor={p}>{p}</label><br/>
                </div>
              ))}
              <button type='submit' onClick={checkGuess}>
                Submit
              </button>
            </form>
          ) : 
          (
            // PLAY BUTTON
            <button onClick={handleClick}>
              {gameState === IDLE ? 'Play' : 'Play Again!'}
            </button>
          )
        }
      </main>
    </>
  )
}

export default App
