import React from 'react'
import ReactDOM from 'react-dom/client'
import './assets/css/index.css'
import './assets/css/media.css'
import { RouterProvider } from 'react-router-dom'
import router from './router/index.jsx'
import { Provider } from 'react-redux'
import store from './store/index.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
    <RouterProvider router={router}>{/* <App /> */}</RouterProvider>
    </Provider>
  </React.StrictMode>,
)
