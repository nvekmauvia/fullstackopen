const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14
  const contents = [
    { sectionName: 'Fundamentals of React', exerciseCount: 10 },
    { sectionName: 'Using props to pass data', exerciseCount: 7 },
    { sectionName: 'State of a component', exerciseCount: 14 },
  ]

  return (
    <div>
      <Header course={course} />
      <Content contents={contents}/>
      <Total total={exercises1 + exercises2 + exercises3}/>
    </div>
  )
}

const Header = ({course}) => {
  return (
    <>
      <h1>{course}</h1>
    </>
  )
}

const Content = ({contents}) => {
  return (
    <div>
      <Part part = {contents[0]}/>
      <Part part = {contents[1]}/>
      <Part part = {contents[2]}/>
    </div>
  )
}

const Part = ({part}) => {
  return (
    <>
      <p>{part.sectionName} {part.exerciseCount}</p>
    </>
  )
}

const Total = ({total}) => {
  return (
    <>
      <p>Number of exercises {total}</p>
    </>
  )
} 

export default App