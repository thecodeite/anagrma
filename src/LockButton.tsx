import  PadlockOpen from './padlock-open.svg?react'
import PadlockClosed from './padlock-closed.svg?react'
import styled from 'styled-components'

const LockButtonWrapper = styled.button`
  background-color: transparent;
  border: none;
`
export function LockButton({ locked, onClick }: {locked: boolean, onClick: () => void}) {
  return (
    <LockButtonWrapper onClick={onClick} style={{ border: 'none' }}>
       {locked ? <PadlockClosed /> : <PadlockOpen />}
    </LockButtonWrapper>
  )
}