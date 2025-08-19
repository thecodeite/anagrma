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

const Letter = styled.div<{ $outline?: string }>`
  background-color: #f0f0f0;
  color: #333;
  font-size: 2rem;
  width: 50px;
  height: 50px;
  margin: 3px;
  
  border: 1px solid #ccc;
  text-transform: uppercase;

  ${({ $outline }) => $outline && `outline: ${$outline};`}
`

const ActionButton = styled.button<{$bg?: string}>`
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  font-size: 1.2rem;
  background-color: ${props => props.$bg || '#f0f0f0'};
  color: #333;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
`

const LettersInput = styled.input`
  background-color: transparent;
  border: none;
  border-bottom: 2px solid var(--fg);
  font-size: 1.8rem;
  text-align: center;
  text-transform: uppercase;
`


function App() {
  const [letters, setLetters] = useState<string | null>(null)
  const [letterPos, setLetterPos] = useState<number[]>([])
  const [lockedLetters, setLockedLetters] = useState<boolean[]>([])
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null); // NEW


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

  

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

 const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = async (targetIndex: number) => {
    if (draggedIndex === null || draggedIndex === targetIndex) return;
    

    const newLetterPos = [...letterPos];

    const temp = newLetterPos[draggedIndex];
    newLetterPos[draggedIndex] = newLetterPos[targetIndex];
    newLetterPos[targetIndex] = temp;
    

    setLetterPos(newLetterPos);
    setDraggedIndex(null);
  };

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
          <LetterWrapper
            key={index}
            $pos={letterPos[index]}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={() => handleDrop(index)}
            style={{
              opacity: draggedIndex === index ? 0.5 : 1,
             
              zIndex: dragOverIndex === index ? 2 : 1,
            }}
          >
            <Letter $outline={
              dragOverIndex === index && draggedIndex !== null && draggedIndex !== index
                ? '3px solid #0074D9'
                : undefined
            }
       
            >
              {letter}
            </Letter>
            <LockButton locked={lockedLetters[index]} onClick={() => buttonClicked(index)}/>
          </LetterWrapper>
        ))}
      </Letters>
      <ActionButton $bg={'#dd6060'} onClick={() => reset()}  >
        Reset
      </ActionButton>
    </Wrapper>
  )
}

export default App
