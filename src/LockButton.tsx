import padlockOpen from './padlock-open.svg'
import padlockClosed from './padlock-closed.svg'
import styled from 'styled-components'

const LockButtonWrapper = styled.button`
  background-color: transparent;
  border: none;
  
  img {
    color: var(--fg);
  }
`

export function LockButton({ locked, onClick }: {locked: boolean, onClick: () => void}) {
  return (
    <LockButtonWrapper onClick={onClick} style={{ border: 'none' }}>
      <img src={locked ? padlockClosed : padlockOpen} alt="lock" />
    </LockButtonWrapper>
  )
}