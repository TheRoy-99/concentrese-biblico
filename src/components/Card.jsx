import { motion } from 'framer-motion'

export default function Card ({
  content,
  isFlipped,
  onClick,
  index,
  isMatched = false,
  matchColor = ''
}) {
  return (
    <motion.button
      className='h-28 flex items-center justify-center text-center rounded-lg border shadow cursor-pointer transition-all duration-300 text-black font-semibold'
      style={{
        backgroundColor: isFlipped
          ? isMatched
            ? matchColor || '#D1FAE5'
            : '#ffffff'
          : '#ffffff',
        border: isFlipped ? '2px solid #3b82f6' : '1px solid #e5e7eb',
        cursor: isFlipped ? 'default' : 'pointer'
      }}
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      animate={isMatched ? { scale: [1, 1.1, 1] } : {}}
      transition={isMatched ? { duration: 0.5, repeat: 1 } : {}}
    >
      {isFlipped ? content : `Carta ${index + 1}`}
    </motion.button>
  )
}
