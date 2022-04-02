
import React from "react"
// import Main from "./components/Main"
import { nanoid } from "nanoid"
import Confetti from "react-confetti"
import Die from "./components/Die"
import "./index.scss"

export default function App() {
  const [die, setDie] = React.useState(allNewDice())
  const [tenzies, setTenzies] = React.useState(false)
  const [timer, setTimer] = React.useState(0)
  const [timerOn, setTimerOn] = React.useState(false)

  React.useEffect(() => {
    const allDiceHeld = die.every(dice => dice.isHeld)
    const firstValue = die[0].value
    const allSameValue = die.every(dice => dice.value === firstValue)
    if(allDiceHeld && allSameValue) {
      setTenzies(true)
    }
  }, [die])

  React.useEffect(() => {
    let interval = null

    if(!tenzies && timerOn) {
      interval = setInterval(() => {
        setTimer(prevtime => prevtime + 10)
      }, 10)
    } else{
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [tenzies])

  function generateNewDice() {
    const randomImageNum = Math.floor(Math.random() * 6) + 1
    const randomImage = `../images/dice${randomImageNum}.png`

    return {
      value: randomImage, 
      isHeld: false,
      id: nanoid()
    }
  }

  function allNewDice() {
    const newDiceArr = []
    for(let i = 0; i < 10; i++) {
      newDiceArr.push(generateNewDice())
    }
    return newDiceArr
  }
  
  function rollDice() {
    if(!tenzies) {
    setDie(oldDie => oldDie.map(dice => {
      return dice.isHeld ? dice : generateNewDice()
    }))
   }else {
    setTimer(0)
    setTenzies(false)
    setTimerOn(false)
    setDie(allNewDice())
   }
  }
  
  function startGame() {
    setTenzies(false)
    setTimerOn(true)
}

  function holdDice(id) {
    setDie(prevDie => prevDie.map(dice => {
      return dice.id === id ? {...dice, isHeld: !dice.isHeld} : dice
    }))
  }

  const dieElements = die.map(dice => {
    return <Die
    key={dice.id}
    value={dice.value}
    isHeld={dice.isHeld}
    holdDice={() => holdDice(dice.id)}
    />
})

  return (
    <main className="dice--bg">
      <div className="tenzies--timer">
        <p>Time</p>
        <span>{`0${Math.floor(timer/60000) % 60}`.slice(-2)}</span>:
        <span>{`0${Math.floor(timer/1000) % 60}`.slice(-2)}</span>:
        <span>{`0${(timer/10) % 100}`.slice(-2)}</span>
      </div>
      <h1 className="title">Tenzies</h1>
      <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
      <div className="dice--container">
         {dieElements}
      </div>
      {!tenzies && !timerOn && <button onClick={startGame}>Start Game</button>}
      {!tenzies && timerOn && <button onClick={rollDice}>Roll</button>}
      {tenzies && <button onClick={rollDice}>New Game</button>}
      {tenzies && <Confetti />}
    </main>
  )
}

