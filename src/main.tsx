import './polyfills'
import './app/style/global.css'
import './app/style/dark.less'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App'
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
