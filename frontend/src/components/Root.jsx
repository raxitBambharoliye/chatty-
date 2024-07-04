import React from 'react'
import Header from './Herder'
import Footer from './Footer'
import { Outlet } from 'react-router-dom'
function Root() {
  return (
      <>
      <Header/>
      <Outlet/>
      <Footer/>
      </>
  )
}

export default Root
