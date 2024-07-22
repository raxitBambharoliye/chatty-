import React, { useEffect, useState } from 'react'
import '../assets/css/home.css'
import { Input } from '../components/Form'
import SendMessage from '../components/Message/SendMessage';
import ReceiveMessage from '../components/Message/ReceiveMessage';
import { DatePart } from '../components/Message';
import { Aside, AsideContactsItem } from '../components/Home';
import { Link } from 'react-router-dom';
import { APP_URL } from '../constant/index'
function Home() {
  let [asideShow, setAsideShow] = useState(true);
  let [activeChat, setActiveChat] = useState(-1);
  const contactArray = new Array(20).fill(1)
  console.log('contactArray', contactArray)
  let asideContent = useState("contacts")
  return (
    <div className='w-100 vh-100 homeBackground'>
      <div className="d-flex  gx-0 align-items-center">
      <Aside asideShow={asideShow} contactArray={contactArray} activeChat={activeChat} />
        {/* aside end  */}
        {/* chat start  */}
        <div className="chatInner vh-100 text-white  flex-grow-1 position-relative d-flex flex-column justify-content-between">
          {/* toggle  */}
          <button className={`toggleButton d-none ${asideShow ? 'show ' : 'hide '}`} onClick={(e) => { setAsideShow((value) => !value) }}><i className="fa-solid fa-angle-right"></i></button>
          {/* chat header  */}
          <div className="chatHeader d-flex justify-content-between align-items-center">
            <div className="userProfile d-flex ">
              <div className="img">
                <img src="./image/profile1.jpg" alt="" />
              </div>
              <div className="userInfo ms-3">
                <h2 className='mb-0'>MR. Radhe</h2>
                <p >enjoy the life</p>
              </div>
            </div>
            <div className="menu">
              <button className="menu">
                <i className="fa-solid fa-ellipsis-vertical"></i>
              </button>
            </div>
          </div>
          {/* chat show */}
          <div className="chatBox flex-grow-1 d-flex flex-column justify-content-end">
            <DatePart />
            <SendMessage message="Hii" time="12:30 AM" />
            <ReceiveMessage message="Hello" />
          </div>
          {/* chat Input  */}
          <div className="chatInput  mt-3">
            <form action="">
              <div className="d-flex align-items-center">
                <div className="input me-2 flex-grow-1"><Input type="text" placeholder="Enter Your message... " inputClass="inputBlack  " /></div>
                <div className="attachmentButton me-2"><button ><i className="fa-solid fa-paperclip" /></button></div>
                <div className="sendButton"><button type='submit'><i className="fa-regular fa-paper-plane" /></button></div>
              </div>
            </form>
          </div>
        </div>
        {/* chat end */}
        <div className=" col-xl-0 d-none">
          <div className="asideInner vh-100">

          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
