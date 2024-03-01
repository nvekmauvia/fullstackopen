import { useCounterValue } from '../CounterContext'

const Display = () => {
    return <div>
        {useCounterValue()}
    </div>
}

export default Display