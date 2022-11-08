import * as ReactDOM from 'react-dom/client'
import { App } from './app'
import * as React from 'react'

const root = ReactDOM.createRoot(document.querySelector('#root')!)

root.render(React.createElement(App, {}))