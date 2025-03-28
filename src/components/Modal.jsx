import { forwardRef, useImperativeHandle, useRef } from 'react'
import { createPortal } from 'react-dom'

const Modal = forwardRef(function ResultModal({
  result,
  onReset,
  cardsLeft,
  score,
  betPoints
}, ref) {
  const dialog = useRef()

  useImperativeHandle(ref, () => ({
    open() {
      dialog.current.showModal()
    },
    close() {
      dialog.current.close()
    }
  }))

  const closeDialog = () => dialog.current.close()

  return createPortal(
    <dialog ref={dialog} className="result-modal">
      {result === 'victory' && <h1>You have won!</h1>}
      {result === 'loss' && <h1>You have lost!</h1>}

      {result === 'victory' ? (
        <>
          <p>Your final score is {score}</p>
          {betPoints > 0 && (
            <p>You earned {betPoints} bonus points from your bet!</p>
          )}
        </>
      ) : (
        <p>Your score is {score} with {cardsLeft} cards remaining.</p>
      )}

      <div className='modal-btns-container'>
        <button onClick={closeDialog}>Close</button>
        <button className='modal-newgame-btn' onClick={onReset}>New game</button>
      </div>
    </dialog>,
    document.getElementById('modal')
  )
})

export default Modal
