
export default function Beginning({handleNewGame, handleBet, bet}) {

  return (
    <div>
      <form className="beginning-form">
        <h2>Guess completion order</h2>
        <h3>Your current bet:</h3>
        <ol>
          <li>{bet.first}</li>
          <li>{bet.second}</li>
          <li>{bet.third}</li>
          <li>{bet.fourth}</li>
        </ol>
        <div className="beginning-form-input-container">
          <Input labelText='First' handleBet={handleBet} defaultValue='Cups' />
          <Input labelText='Second' handleBet={handleBet} defaultValue='Coins' />
          <Input labelText='Third' handleBet={handleBet} defaultValue='Sticks' />
        </div>
        <div className="beginning-form-btn-container">
          <button onClick={handleNewGame}>Bet and begin game!</button>
        </div>
      </form>
    </div>
  )
}

function Input({labelText, handleBet, defaultValue}) {
  const betValueHandler = (e) => {
    handleBet(labelText.toLowerCase(), e.target.value)
    console.log(labelText.toLowerCase(), e.target.value)
  }

  
  return (
  <>
    <label className="beginning-label">{labelText}:&nbsp;</label>
    <select onChange={betValueHandler} defaultValue={defaultValue} >
      <option value='Cups'>Coppe</option>
      <option value='Coins'>Ori</option>
      <option value='Sticks'>Bastoni</option>
      <option value='Swords'>Spade</option>
    </select>
  </>
  )
}
