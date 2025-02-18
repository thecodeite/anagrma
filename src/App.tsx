import { useEffect, useState } from 'react'

import './App.css'
import styled from 'styled-components'
import { LockButton } from './LockButton'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`

const Letters = styled.div<{ $length: number }>` 
  /* display: flex;
  justify-content: center;
  gap: 4px; */
  position: relative;
  width: ${({ $length }) => ($length ) * 56}px;
  margin-left: 3px;
  height: 100px;
`

const LetterWrapper = styled.div<{ $pos: number }>`
  position: absolute;
  top: 0;
  left: ${({ $pos }) => $pos * 56}px;

  transition: left 0.5s;
  height: 100px;

  display: flex;
  flex-direction: column;
`

const Letter = styled.div`
  background-color: #f0f0f0;
  color: #333;
  font-size: 2rem;
  width: 50px;
  height: 50px;
  margin: 3px;
  
  border: 1px solid #ccc;
  text-transform: uppercase;
`

const ActionButton = styled.button`
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  font-size: 1.2rem;
  background-color: #f0f0f0;
  color: #333;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
`

const LettersInput = styled.input`
  background-color: transparent;
  border: none;
  font-size: 1.8rem;
  text-align: center;
  text-transform: uppercase;
`


function App() {
  const [letters, setLetters] = useState<string | null>(null)
  const [letterPos, setLetterPos] = useState<number[]>([])
  const [lockedLetters, setLockedLetters] = useState<boolean[]>([])

  useEffect(() => {
    setLetters(window.location.hash.slice(1))
  }  , [])

  useEffect(() => {
    // copt letters to # in url
    if (letters !== null) {
      window.location.hash = letters
      setLetterPos(letters.split('').map((_,i) => i))
      setLockedLetters(letters.split('').map(() => false))
    }
  }, [letters])

  const shuffle = () => {
    // const newLetterPos = [...letterPos].map((pos) => ({ pos, rand: Math.random() }))
    // newLetterPos.sort((a, b) => a.rand - b.rand)
    // setLetterPos(newLetterPos.map((pos) => pos.pos))

    const unlocked = lockedLetters.map((locked, index) => ({ locked, index })).filter(({ locked }) => !locked).map(({ index }) => ({from: index, to: index}))
    for(let i = 0; i < unlocked.length; i++) {
      const a = Math.floor(Math.random() * unlocked.length)
      const b = Math.floor(Math.random() * unlocked.length)
      
      const temp = unlocked[a].to
      unlocked[a].to = unlocked[b].to
      unlocked[b].to = temp
    }
    console.log('unlocked:', unlocked)
    const newLetterPos = [...letterPos]
    unlocked.forEach(({ from, to }) => {
      const temp = newLetterPos[from]
      newLetterPos[from] = newLetterPos[to]
      newLetterPos[to] = temp
    })
    setLetterPos(newLetterPos)
  }

  const letterString = letters ?? ''

  function buttonClicked(index: number) {
    const newLockedLetters = [...lockedLetters]
    newLockedLetters[index] = !newLockedLetters[index]
    setLockedLetters(newLockedLetters)
  }

  const reset = () => {
    setLetters(null)
  }

  return (
    <Wrapper>
      <label >
        <LettersInput placeholder='letters' type="text" value={letterString} onChange={(e) => setLetters(e.target.value)} />
      </label>

      <ActionButton onClick={() => shuffle()} >
        Shuffle
      </ActionButton>

      <Letters $length={letterString.length} >
        {letterString.split('').map((letter, index) => (
          <LetterWrapper key={index} $pos={letterPos[index]}>
            <Letter>
              {letter}
            </Letter>
            <LockButton locked={lockedLetters[index]} onClick={() => buttonClicked(index)}/>
          </LetterWrapper>
        ))}
      </Letters>
      <ActionButton onClick={() => reset()} >
        Reset
      </ActionButton>
    </Wrapper>
  )
}

export default App
