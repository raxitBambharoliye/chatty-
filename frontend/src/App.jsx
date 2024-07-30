import { useEffect, useState } from 'react'
import './App.css'
import { Axios } from './axios'
import { io } from 'socket.io-client'
import { SocketEvent } from './soket/eventHandler'


function App() {
  const [count, setCount] = useState(0)
  return (
    <>
    <h1>hello world </h1>
    </>
  )
}

export default App
