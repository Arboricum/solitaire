import { useCallback, useEffect, useRef, useState } from 'react'
import Modal from './Modal'
import Card from './Card'
import cards from '../assets/cards'
import emptyCard from '../assets/empty.jpg'
import questionCard from '../assets/question.jpg'
import { randomSortArray } from '../utils/common_used_module'
import './GameBoard.css'

const calcCardsFiles = (initialCardsState) => {
  const firstFile = initialCardsState.slice(0, 9)
  const secondFile = initialCardsState.slice(9, 18)
  const thirdFile = initialCardsState.slice(18, 27)
  const fourthFile = initialCardsState.slice(27, 36)
  const freeCards = initialCardsState.slice(36, 40)
  return { firstFile, secondFile, thirdFile, fourthFile, freeCards }
}

export default function GameBoard({ handleNewGame, bet }) {
  const [initialCards, setInitialCards] = useState(randomSortArray(cards).map(card => ({ ...card })))
  const { firstFile, secondFile, thirdFile, fourthFile, freeCards } = calcCardsFiles(initialCards)

  const [currentFirstFile, setCurrentFirstFile] = useState(firstFile)
  const [currentSecondFile, setCurrentSecondFile] = useState(secondFile)
  const [currentThirdFile, setCurrentThirdFile] = useState(thirdFile)
  const [currentFourthFile, setCurrentFourthFile] = useState(fourthFile)
  const [currentFreeCards, setCurrentFreeCards] = useState(freeCards)

  const [isAnimationRunning, setIsAnimationRunning] = useState(false)
  const [isNewTurn, setIsNewTurn] = useState(false)
  const [activeCard, setActiveCard] = useState(null)
  const [cardToReplace, setCardToReplace] = useState(null)

  const [pointCounter, setPointCounter] = useState(0)
  const [currentCompletionOrder, setCurrentCompletionOrder] = useState([])
  const [gameOver, setGameOver] = useState(false)
  const [result, setResult] = useState('')
  const [betPoints, setBetPoints] = useState(0)

  const ReCRef = useRef(null)
  const ReQRef = useRef(null)
  const ReBRef = useRef(null)
  const ReSRef = useRef(null)
  const dialog = useRef()

  const cardsLeft = [
    ...currentFirstFile,
    ...currentSecondFile,
    ...currentThirdFile,
    ...currentFourthFile,
    ...currentFreeCards
  ].reduce((acc, card) => acc + (card.discovered ? 0 : 1), 0)

  const fileSelector = useCallback((seed) => {
    switch (seed) {
      case 'coppe': return { setFileArray: setCurrentFirstFile }
      case 'ori': return { setFileArray: setCurrentSecondFile }
      case 'bastoni': return { setFileArray: setCurrentThirdFile }
      case 'spade': return { setFileArray: setCurrentFourthFile }
      default: return {}
    }
  }, [])

  const verFileCompletion = () => {
    const first = currentFirstFile.every(c => c.discovered)
    const second = currentSecondFile.every(c => c.discovered)
    const third = currentThirdFile.every(c => c.discovered)
    const fourth = currentFourthFile.every(c => c.discovered)

    if (first && !currentCompletionOrder.includes('Coppe') && ReCRef.current?.src?.endsWith('/img/cards/ReC.png')) {
      setCurrentCompletionOrder(prev => [...prev, 'Coppe'])
    }
    if (second && !currentCompletionOrder.includes('Ori') && ReQRef.current?.src?.endsWith('/img/cards/ReQ.png')) {
      setCurrentCompletionOrder(prev => [...prev, 'Ori'])
    }
    if (third && !currentCompletionOrder.includes('Bastoni') && ReBRef.current?.src?.endsWith('/img/cards/ReB.png')) {
      setCurrentCompletionOrder(prev => [...prev, 'Bastoni'])
    }
    if (fourth && !currentCompletionOrder.includes('Spade') && ReSRef.current?.src?.endsWith('/img/cards/ReS.png')) {
      setCurrentCompletionOrder(prev => [...prev, 'Spade'])
    }

    return { first, second, third, fourth }
  }

  const countPoints = (card) => {
    setPointCounter(prev => prev + (card.value === 10 ? 20 : 10))
  }

  const countExtraPoints = () => {
    const { first, second, third, fourth } = verFileCompletion()
    if (first || second || third || fourth) {
      setPointCounter(prev => prev + 50)
    }
  }

  const calculateBetBonus = () => {
    let bonus = 0
    if (bet.first === currentCompletionOrder[0]) bonus++
    if (bet.second === currentCompletionOrder[1]) bonus++
    if (bet.third === currentCompletionOrder[2]) bonus++
    if (bet.fourth === currentCompletionOrder[3]) bonus++

    const points = bonus === 4 ? 500 : bonus * 100
    setPointCounter(prev => prev + points)
    setBetPoints(points)
  }

  const checkVictory = () => {
    const { first, second, third, fourth } = verFileCompletion()
    const allCompleted = first && second && third && fourth
    const allKings = ReCRef.current?.src?.endsWith('/ReC.png') &&
                     ReQRef.current?.src?.endsWith('/ReQ.png') &&
                     ReBRef.current?.src?.endsWith('/ReB.png') &&
                     ReSRef.current?.src?.endsWith('/ReS.png')

    if (allKings) {
      setResult(allCompleted ? 'victory' : 'loss')
      if (allCompleted) calculateBetBonus()
      setGameOver(true)
    }
  }

  const cardToReplaceSelectorHandler = (card) => {
    setIsAnimationRunning(true)
    if (card.value === 10) {
      const kingMap = {
        'ReC': ReCRef,
        'ReQ': ReQRef,
        'ReB': ReBRef,
        'ReS': ReSRef
      }
      if (kingMap[card.id]) {
        kingMap[card.id].current.src = `/img/cards/${card.src}`
        countPoints(card)
        checkVictory()
        setActiveCard(null)
        setIsNewTurn(false)
      }
      return
    }

    const column = card.value - 1
    const { setFileArray } = fileSelector(card.seed)
    setFileArray(prev =>
      prev.map((c, i) => {
        if (i === column) {
          setCardToReplace(c)
          return { ...c, discovered: true }
        }
        return c
      })
    )
    countPoints(card)
  }

  const handleActiveCard = (card) => {
    setCurrentFreeCards(prev => prev.filter(c => c.id !== card.id))
    setActiveCard(card)
    setIsAnimationRunning(false)
    setIsNewTurn(true)
  }

  const resetGame = () => {
    const newCards = randomSortArray(cards).map(card => ({ ...card }))
    const { firstFile, secondFile, thirdFile, fourthFile, freeCards } = calcCardsFiles(newCards)

    setInitialCards(newCards)
    setCurrentFirstFile(firstFile)
    setCurrentSecondFile(secondFile)
    setCurrentThirdFile(thirdFile)
    setCurrentFourthFile(fourthFile)
    setCurrentFreeCards(freeCards)

    ReCRef.current.src = emptyCard
    ReQRef.current.src = emptyCard
    ReBRef.current.src = emptyCard
    ReSRef.current.src = emptyCard

    setPointCounter(0)
    setCurrentCompletionOrder([])
    setBetPoints(0)
    setIsAnimationRunning(false)
    setIsNewTurn(false)
    setActiveCard(null)
    setCardToReplace(null)
    setGameOver(false)
    setResult('')
    dialog.current.close()
    handleNewGame()
  }

  useEffect(() => {
    if (cardToReplace !== null) {
      const column = activeCard.value - 1
      const { setFileArray } = fileSelector(activeCard.seed)
      setCardToReplace(null)
      setTimeout(() => {
        setFileArray(prev =>
          prev.map((c, i) => i === column ? { ...activeCard, discovered: true } : c)
        )
        setIsAnimationRunning(false)
        setActiveCard(cardToReplace)
      }, 500)
    }
  }, [cardToReplace, activeCard])

  useEffect(() => {
    if (gameOver) {
      dialog.current?.open()
    }
  }, [gameOver])

  useEffect(() => {
    countExtraPoints()
  }, [currentFirstFile, currentSecondFile, currentThirdFile, currentFourthFile])

  return (
    <div className='gameboard-container'>
      <div className='score-container'>
        <p className='score'>Score: {pointCounter}</p>
        <div className='bet'>
          <p>Bet: {bet.first} → {bet.second} → {bet.third} → {bet.fourth}</p>
          <p>Completion: {currentCompletionOrder.join(' → ')}</p>
        </div>
      </div>

      <section className='free-cards'>
        {!isNewTurn && <p>Choose a card:</p>}
        {currentFreeCards.map(card => (
          <button key={card.id} className='card-button' onClick={() => handleActiveCard(card)} disabled={isNewTurn}>
            <img alt={card.id} src={card.discovered ? `/img/cards/${card.src}` : '/img/cards/dorsom.jpg'} />
          </button>
        ))}
        <div className='active-card-container'>
          {isNewTurn && <p>Click to place</p>}
          <button
            className='card-button active-card'
            disabled={!activeCard || isAnimationRunning}
            onClick={() => cardToReplaceSelectorHandler(activeCard)}
          >
            <img alt='x' src={activeCard ? `/img/cards/${activeCard.src}` : questionCard} />
          </button>
        </div>
      </section>

      <div className='cards-file-container'>
        <section className='cards-file-coppe'>
          {currentFirstFile.map(card => <Card key={card.id} card={card} disabled={isAnimationRunning} />)}
          <div className='card'><img alt='x' src={emptyCard} ref={ReCRef} /></div>
        </section>
        <section className='cards-file-ori'>
          {currentSecondFile.map(card => <Card key={card.id} card={card} disabled={isAnimationRunning} />)}
          <div className='card'><img alt='x' src={emptyCard} ref={ReQRef} /></div>
        </section>
        <section className='cards-file-bastoni'>
          {currentThirdFile.map(card => <Card key={card.id} card={card} disabled={isAnimationRunning} />)}
          <div className='card'><img alt='x' src={emptyCard} ref={ReBRef} /></div>
        </section>
        <section className='cards-file-spade'>
          {currentFourthFile.map(card => <Card key={card.id} card={card} disabled={isAnimationRunning} />)}
          <div className='card'><img alt='x' src={emptyCard} ref={ReSRef} /></div>
        </section>
      </div>

      <button onClick={resetGame}>New game</button>

      <Modal
        ref={dialog}
        result={result}
        onReset={resetGame}
        cardsLeft={cardsLeft}
        score={pointCounter}
        betPoints={betPoints}
      />
    </div>
  )
}
