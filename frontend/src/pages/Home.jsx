import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { APP_URL } from '../constant';
import '../assets/css/home.css'
function Home() {
  // let user = useSelector((state) => state.userData.user);
  // console.log('user', user)
  const contactArray = new Array(15).fill(1)
  console.log('contactArray', contactArray)
  return (
    <div className='w-100 vh-100 homeBackground'>

      <div className="row gx-0">
        <div className="col-12 col-md-4 col-lg-3 ">
          <div className="asideInner d-flex flex-column vh-100 position-relative">
            <div className="asideHeader d-flex align-items-center justify-content-between position-sticky top-0">
            <h1 className='m-0'>Chatty 𝝅</h1>
              <div className="userProfile">
                <img src="./image/dummyProfile.png" alt="" />
              </div>
            </div>
            <div className="asideContacts flex-grow-1 overflow-auto">
              {contactArray.map((contact, index) =>( 
                <div className="asideContactsItem" key={index}>
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
            </div>
          </div>
        </div>
      </div>
      {/* <p>hello {user.userName}</p>
      <Link to={APP_URL.FE_LOGOUT}>LogOut</Link> */}
    </div>
  )
}

export default Home
