const Course = ({ course }) => {
    return (
        <div>
            <Header course={course} />
            <Content course={course} />
            <b><Total course={course} /></b>
        </div>
    )
}

const Header = ({ course }) => {
    return (
        <h2>{course.name}</h2>
    )
}

const Content = ({ course }) => {
    return (
        <div>
            {course.parts.map(coursePart => <Part key={coursePart.id} part={coursePart} />)}
        </div>
    )
}

const Part = ({ part }) => {
    return (
        <p>{part.name} {part.exercises}</p>
    )
}

const Total = ({ course }) => {
    const total = course.parts.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.exercises
    }, 0)
    return (
        <p>Total of {total}  exercises</p>
    )
}

export default Course