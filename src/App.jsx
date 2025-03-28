import GameBoard from './components/GameBoard'
import Beginning from './components/Beginning'
import './App.css'
import { useEffect, useMemo, useState } from 'react'
import { useCallback } from 'react'

function App() {
  const [gameStarted, setGameStarted] = useState(false)
  const [bet, setBet] = useState({
    first: 'Coppe',
    second: 'Ori',
    third: 'Bastoni',
    fourth: 'Spade'
  })
  const possibleBetValues = useMemo(() => ['Coppe', 'Ori', 'Bastoni', 'Spade'], [])

  const handleGameStart = (e) => {
    e.preventDefault()
    setGameStarted(true)
  }

  const handleNewGame = () => {
    setGameStarted(false)
  }

  const handleBet = (position, newBetValue) => {
    setBet((prevBet) => {
      const cleanedBet = Object.fromEntries(
        Object.entries(prevBet).map(([key, value]) => {
          if (key !== position && value === newBetValue) {
            return [key, '']
          }
          return [key, value]
        })
      )  
      return {
        ...cleanedBet,
        [position]: newBetValue
      }
    })
  }
  
  const handleBetFourthValue = useCallback(() => {
    if (bet.first && bet.second && bet.third) {
      const fourthValue = possibleBetValues.find((value) =>
        value !== bet.first &&
        value !== bet.second &&
        value !== bet.third
      )
      if (fourthValue && bet.fourth !== fourthValue) {
        setBet(prevBet => ({
          ...prevBet,
          fourth: fourthValue
        }))
      }
    }
  }, [bet.first, bet.second, bet.third, bet.fourth, possibleBetValues])
  

  useEffect(() => {
    handleBetFourthValue()
  }, [bet, handleBetFourthValue])

  return (
    <main>
      <h1 className='title'>Solitaire</h1>
      {!gameStarted && <Beginning handleNewGame={handleGameStart} handleBet={handleBet} bet={bet} />}
      {gameStarted && <GameBoard handleNewGame={handleNewGame} bet={bet} />}
    </main>
  )
}

export default App

/* 
- header
-gameboard
*/
