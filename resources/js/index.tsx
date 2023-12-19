import React from 'react';
import ReactDOM from 'react-dom';
import { createOvermind } from 'overmind';
import { Provider } from 'overmind-react';
import { config } from './overmind';
import App from './components/App';

const overmind = createOvermind(config);

ReactDOM.render(
    <Provider value={overmind}>
        <App />
    </Provider>,
    document.getElementById('app')
);
