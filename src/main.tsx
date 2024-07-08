import './polyfills'
import './app/style/global.css'
import './app/style/dark.less'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, RouterProvider } from 'react-router-dom'
import App from './app/App'
import { router } from './app/router'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* <HashRouter>
      <App />
    </HashRouter> */}

    <RouterProvider router={router} />

  </React.StrictMode>
)
