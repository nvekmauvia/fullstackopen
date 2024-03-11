import App from './App'
import React from 'react'
import ReactDOM from 'react-dom/client'

const hello = name => {
    console.log(`hello ${name}`)
}

App()

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
