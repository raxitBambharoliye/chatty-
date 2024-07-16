import React, { useEffect, useState } from 'react'
import '../assets/css/home.css'
import {Input} from '../components/Form'
function Home() {
  let [asideShow, setAsideShow] = useState(true);
  const contactArray = new Array(20).fill(1)
  console.log('contactArray', contactArray)
  useEffect(() => {
    
    console.log('asideShow', asideShow)
  },[asideShow])
  return (
    <div className='w-100 vh-100 homeBackground'>
      <div className="d-flex  gx-0 align-items-center">
      {/* aside start  */}
          <div className={`asideInner  d-flex flex-column vh-100 position-relative ${asideShow? 'show ':'hide '} `}>

            <div className="asideHeader d-flex align-items-center justify-content-between position-sticky top-0">
            <h1 className='m-0'>Chatty 𝝅</h1>
              <div className="userProfile">
                <img src="./image/dummyProfile.png" alt="" />
              </div>
            </div>
            <div className="asideContacts flex-grow-1 overflow-auto">
              {contactArray.map((contact, index) =>( 
                <div className={`asideContactsItem ${index==1 ? 'active' : ""}` }key={index}>
                <div className="userProfile d-flex align-items-center">
                  <div className="profile me-2 ">
                      <img src="./image/dummyProfile.png" alt="" />
                  </div>
                  <div className="name">
                    <h3 className='m-0'>Radhe Patel</h3>
                    <p className='m-0'>enjoy full life </p>
                  </div>  
                </div>
              </div>
              ))}
            </div>
            <div className="asideFooter">
            <h3 className='m-0'>footer</h3>
            <div className="asideFooterMenu">
              <div className="menuItem">
                <button><i className="fa-solid fa-user-plus"></i></button>
              </div>
              <button className="menuItem">
              <i className="fa-solid fa-right-from-bracket"></i>
              </button>
            </div>
            </div>
          </div>
      {/* aside end  */}
      {/* chat start  */}
        <div className="chatInner vh-100 text-white  flex-grow-1 position-relative d-flex flex-column justify-content-between">
            {/* toggle  */}
            <button className={`toggleButton d-none ${asideShow? 'show ':'hide '}`} onClick={(e)=>{setAsideShow((value)=>!value)}}><i className="fa-solid fa-angle-right"></i></button>
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
            <div className="message send position-relative d-flex align-items-end">
              <div className="profile me-1"><img src="./image/profile1.jpg" alt="" /></div>
              <p className='mb-1'>Hii</p>
            </div>
            <div className="message receive position-relative d-flex align-items-end justify-content-end">
              <p className='mb-1'>Hello</p>
              <div className="profile ms-1"><img src="./image/profile1.jpg" alt="" /></div>
            </div>
            <div className="message send position-relative d-flex align-items-end">
              <div className="profile me-1"><img src="./image/profile1.jpg" alt="" /></div>
              <p className='mb-1'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quaerat, impedit? Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatem, eaque.</p>
            </div>
            <div className="message receive position-relative d-flex align-items-end justify-content-end">
              <p className='mb-1'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quaerat, impedit? Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatem, eaque.</p>
              <div className="profile ms-1"><img src="./image/profile1.jpg" alt="" /></div>
              
            </div>
          </div>
            {/* chat Input  */}
          <div className="chatInput  mt-3">
            <form action="">
              <div className="d-flex align-items-center">
              <div className="input me-2 flex-grow-1"><Input type="text" placeholder="Enter Your message... " inputClass="inputBlack  "/></div>
              <div className="attachmentButton me-2"><button ><i className="fa-solid fa-paperclip"/></button></div>
              <div className="sendButton"><button type='submit'><i className="fa-regular fa-paper-plane"/></button></div>
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
