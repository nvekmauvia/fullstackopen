import { useState } from 'react'

const App = () => {
  // save clicks of each button to its own state
  const [feedback, setFeedback] = useState({ good: 0, neutral: 0, bad: 0 })

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={() => setFeedback({ ...feedback, good: feedback.good + 1 })} text="Good" />
      <Button handleClick={() => setFeedback({ ...feedback, neutral: feedback.neutral + 1 })} text="Neutral" />
      <Button handleClick={() => setFeedback({ ...feedback, bad: feedback.bad + 1 })} text="Bad" />
      <Statistics feedback={feedback} />
    </div>
  )
}

const Button = (props) => (
  <button onClick={props.handleClick}>{props.text}</button>
)

const Statistics = ({ feedback }) => {
  const all = feedback.good + feedback.neutral + feedback.bad
  const average = (feedback.good - feedback.bad) / all
  const positive = feedback.good / all * 100 + "%"

  if (all === 0) {
    return (
      <div>
        <h1>statistics</h1>
        <div>
          No feedback given
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1>statistics</h1>
      <table>
        <tbody>
          <StatisticLine text="good" value={feedback.good}></StatisticLine>
          <StatisticLine text="neutral" value={feedback.neutral}></StatisticLine>
          <StatisticLine text="bad" value={feedback.bad}></StatisticLine>
          <StatisticLine text="all" value={all}></StatisticLine>
          <StatisticLine text="average" value={average}></StatisticLine>
          <StatisticLine text="positive" value={positive}></StatisticLine>
        </tbody>
      </table>
    </div>
  )
}

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

export default App