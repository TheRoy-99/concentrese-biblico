import Confetti from 'react-confetti'
import { useWindowSize } from '@react-hook/window-size'
import { useState, useEffect } from 'react'
import Card from './Card'
import CardModal from './CardModal'
import { biblePairs } from '../data/biblePairs'

function shuffle (array) {
  return array
    .flatMap((card, index) => [
      {
        ...card,
        id: index,
        back: card.back,
        pair: card.front,
        uniqueId: `${index}-a`
      },
      {
        ...card,
        id: index,
        back: card.front,
        pair: card.back,
        uniqueId: `${index}-b`
      }
    ])
    .sort(() => Math.random() - 0.5)
}

function getRandomColor () {
  const greens = ['#6EE7B7', '#34D399', '#10B981', '#059669']
  return greens[Math.floor(Math.random() * greens.length)]
}

export default function GameBoard ({
  players,
  currentPlayerIndex,
  onMatch,
  onNextTurn
}) {
  const [shuffledCards, setShuffledCards] = useState([])
  const [flippedIndices, setFlippedIndices] = useState([])
  const [matchedIds, setMatchedIds] = useState([])
  const [selectedCard, setSelectedCard] = useState(null)
  const [disabled, setDisabled] = useState(false)
  const [matchedColors, setMatchedColors] = useState({})
  const [width, height] = useWindowSize()
  const [showConfetti, setShowConfetti] = useState(false)

  // 🧠 Guardar estado en localStorage
  useEffect(() => {
    if (shuffledCards.length > 0) {
      localStorage.setItem(
        'concentreseBoard',
        JSON.stringify({
          shuffledCards,
          matchedIds,
          matchedColors,
          flippedIndices
        })
      )
    }
  }, [shuffledCards, matchedIds, matchedColors, flippedIndices])

  // 🧠 Cargar estado desde localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('concentreseBoard'))
    if (saved) {
      setShuffledCards(saved.shuffledCards)
      setMatchedIds(saved.matchedIds)
      setMatchedColors(saved.matchedColors)
      setFlippedIndices(saved.flippedIndices || [])
    } else {
      const shuffled = shuffle(biblePairs)
      setShuffledCards(shuffled)
      setMatchedIds([])
      setMatchedColors({})
      setFlippedIndices([])
    }
  }, [])

  const handleCardClick = index => {
    if (disabled) return
    if (
      flippedIndices.includes(index) ||
      matchedIds.includes(shuffledCards[index].uniqueId)
    )
      return

    const newFlipped = [...flippedIndices, index]
    setFlippedIndices(newFlipped)
    setSelectedCard(shuffledCards[index])

    if (newFlipped.length === 2) {
      setDisabled(true)
      const [firstIdx, secondIdx] = newFlipped
      const firstCard = shuffledCards[firstIdx]
      const secondCard = shuffledCards[secondIdx]

      const isMatch =
        firstCard.id === secondCard.id &&
        firstCard.uniqueId !== secondCard.uniqueId

      if (isMatch) {
        const color = getRandomColor()
        setShowConfetti(true)
        setTimeout(() => {
          setMatchedIds(prev => [
            ...prev,
            firstCard.uniqueId,
            secondCard.uniqueId
          ])
          setMatchedColors(prev => ({
            ...prev,
            [firstCard.uniqueId]: color,
            [secondCard.uniqueId]: color
          }))
          setFlippedIndices([])
          onMatch()
          setDisabled(false)
        }, 1000)

        // ❗️Ocultar confetti con más duración
        setTimeout(() => setShowConfetti(false), 5000)
      } else {
        setTimeout(() => {
          setFlippedIndices([])
          onNextTurn()
          setDisabled(false)
        }, 1000)
      }
    }
  }

  return (
    <div className='relative'>
      {showConfetti && (
        <div className='absolute inset-0 z-50 pointer-events-none'>
          <Confetti
            width={width}
            height={height}
            numberOfPieces={200}
            recycle={false}
            colors={['#10B981', '#34D399', '#22C55E', '#D1FAE5', '#047857']}
          />
        </div>
      )}

      <div className='grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-4 w-full max-w-7xl mx-auto px-4 pb-24'>
        {shuffledCards.map((card, index) => (
          <Card
            key={card.uniqueId}
            index={index}
            content={card.back}
            isFlipped={
              flippedIndices.includes(index) ||
              matchedIds.includes(card.uniqueId)
            }
            isMatched={matchedIds.includes(card.uniqueId)}
            matchColor={matchedColors[card.uniqueId]}
            onClick={() => handleCardClick(index)}
          />
        ))}
      </div>

      <CardModal card={selectedCard} onClose={() => setSelectedCard(null)} />
    </div>
  )
}
