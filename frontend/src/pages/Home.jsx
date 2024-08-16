import React, {  useContext, useEffect, useRef, useState } from 'react'
import '../assets/css/home.css'
import { Aside, Chat } from '../components/Home';
import {Notifications } from 'react-push-notification'
import { SocketContext } from '../socket/SocketProvider';
import { useSelector } from 'react-redux';
import PopUp from '../components/PopUp';
function Home() {
  let [asideShow, setAsideShow] = useState(true);
  const {connectSocket}=useContext(SocketContext);
  const user= useSelector((state)=>state.userData.user)
  useEffect(()=>{
    connectSocket();
  },[])
  return (
    <>
          <PopUp/>

    <div className='w-100 vh-100 homeBackground'>
      <div className="d-flex  gx-0 align-items-center">
        <Notifications/>
        <Aside asideShow={asideShow}  />
        {/* aside end  */}
        {/* chat start  */}
        <div className="chatInner vh-100 text-white  flex-grow-1 position-relative d-flex flex-column justify-content-between">
          {/* toggle  */}
          <button className={`toggleButton d-none ${asideShow ? 'show ' : 'hide '}`} onClick={(e) => { setAsideShow((value) => !value) }}><i className="fa-solid fa-angle-right"></i></button>
          <Chat />
        </div>
        {/* chat end */}
        <div className=" col-xl-0 d-none">
          <div className="asideInner vh-100">

          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default Home
