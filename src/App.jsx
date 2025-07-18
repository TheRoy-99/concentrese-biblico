import { useState, useEffect } from 'react'
import StartScreen from './components/StartScreen'
import GameBoard from './components/GameBoard'
import ScoreBoard from './components/ScoreBoard'
import { biblePairs } from './data/biblePairs'

function App () {
  const [players, setPlayers] = useState([])
  const [scores, setScores] = useState({})
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)

  // 🔄 Cargar progreso
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('concentreseGame'))
    if (saved) {
      setPlayers(saved.players)
      setScores(saved.scores)
      setCurrentPlayerIndex(saved.currentPlayerIndex)
      setGameStarted(true)
    }
  }, [])

  
  // 🔐 Bloquear recarga accidental
  useEffect(() => {
    const handleBeforeUnload = e => {
      e.preventDefault()
      e.returnValue = ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  const handleStart = playerNames => {
    const initialScores = {}
    playerNames.forEach(name => (initialScores[name] = 0))
    setPlayers(playerNames)
    setScores(initialScores)
    setCurrentPlayerIndex(0)
    setGameStarted(true)
  }

  const handleMatchFound = () => {
    const currentPlayer = players[currentPlayerIndex]
    setScores(prev => ({
      ...prev,
      [currentPlayer]: prev[currentPlayer] + 1
    }))
  }

  const handleNextTurn = () => {
    setCurrentPlayerIndex(prev => (prev + 1) % players.length)
  }

  const handleResetGame = () => {
    const confirmed = window.confirm('¿Estás seguro de que deseas terminar el juego?')
    if (confirmed) {
      localStorage.removeItem('concentreseGame')
      localStorage.removeItem('concentreseBoard')
      setPlayers([])
      setScores({})
      setCurrentPlayerIndex(0)
      setGameStarted(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-blue-300">
      {!gameStarted ? (
        <StartScreen onStart={handleStart} />
      ) : (
        <div className='w-full max-w-screen-xl mx-auto px-4 mt-8 mb-6'>
          <h2 className='text-3xl text-center font-bold text-white mb-4'>
            ¡Concéntrese Bíblico!
          </h2>

          {/* Botón de terminar juego */}
          <div className='flex justify-end w-full mb-4'>
            <button
              onClick={handleResetGame}
              className='px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition'
            >
              Terminar juego
            </button>
          </div>

          <ScoreBoard
            players={players}
            scores={scores}
            currentPlayerIndex={currentPlayerIndex}
          />

          <GameBoard
            players={players}
            currentPlayerIndex={currentPlayerIndex}
            onMatch={handleMatchFound}
            onNextTurn={handleNextTurn}
            cards={biblePairs}
          />
        </div>
      )}
    </div>
  )
}

export default App
