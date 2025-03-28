import React from 'react'

export default function Card({ card, disabled }) {
  return (
    <div 
      key={card.id} 
      className='card' 
      disabled={disabled} 
      data-card={card}
    >
      <img 
        alt={card.id} 
        src={card.discovered ? `/img/cards/${card.src}` : '/img/cards/dorsom.jpg'} 
      />
    </div>
  )
}
