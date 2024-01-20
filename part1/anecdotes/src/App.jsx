import { useState } from 'react'

const App = () => {

  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState(new Uint8Array(anecdotes.length))

  const voteAnecdote = () => {
    const copy = [...points]
    copy[selected] += 1
    console.log(copy)
    setPoints(copy)
  }

  const maxVoteIndex = getIndexOfMaxIntFromArray(points)

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <div>{anecdotes[selected]}</div>
      <div>has {points[selected]} votes</div>
      <Button handleClick={voteAnecdote} text="vote" />
      <Button handleClick={() => setSelected(randomRange(0, anecdotes.length - 1))} text="next anecdote" />
      <h1>Anecdote with most votes</h1>
      <div>{anecdotes[maxVoteIndex]}</div>
      <div>has {points[maxVoteIndex]} votes</div>
    </div>
  )
}

const anecdotes = [
  'If it hurts, do it more often.',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
  'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
  'The only way to go fast, is to go well.'
]

const randomRange = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getIndexOfMaxIntFromArray = (arr) => {
  if (arr.length === 0) {
    return -1;
  }

  let highestIndex = 0;
  let highestValue = arr[0];

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > highestValue) {
      highestValue = arr[i];
      highestIndex = i;
    }
  }

  return highestIndex;
}

const Button = (props) => (
  <button onClick={props.handleClick}>{props.text}</button>
)

export default App