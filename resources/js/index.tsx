import React from 'react'
import ReactDOM from 'react-dom/client'
import { createOvermind } from 'overmind'
import { Provider } from 'overmind-react'
import { config } from './overmind'
import App from './components/App'

const overmind = createOvermind(config)

const app = ReactDOM.createRoot(document.getElementById('app'))
app.render(
  <Provider value={overmind}>
    <App />
  </Provider>
)
