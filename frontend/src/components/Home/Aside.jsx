import React, { useEffect, useState } from 'react'
import AsideContactsItem from './AsideContactsItem'
import { Link } from 'react-router-dom'
import { APP_URL } from '../../constant'
import EditProfile from './EditProfile'
import { useSelector } from 'react-redux'
import { AddFriends } from '../../components/Models/index'
import { Input } from '../Form'
import Notifications from './Notifications'
import Friend from './Friend'
function Aside({ asideShow }) {
    const [asideContext, setAsideContext] = useState("FRIENDS");
   


    return (
        <>
            {/* aside start  */}
            <div className={`asideInner  d-flex flex-column vh-100 position-relative ${asideShow ? 'show' : 'hide'} `}>
                {/* <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">Launch demo modal</button> */}

                <div className="asideHeader d-flex align-items-center justify-content-between position-sticky top-0">
                    <h1 className='m-0'>Chatty 𝝅</h1>
                    <div className="userProfile" data-bs-toggle="modal" data-bs-target="#editUserProfile">
                        <i className="fa-solid fa-pen pen"></i>
                        <img src="./image/dummyProfile.png" alt="" />
                    </div>
                </div>
                <div className="asideContacts flex-grow-1 overflow-auto">
                    {asideContext === 'FRIENDS' && (<Friend/>)}
                    {asideContext === 'NOTIFICATION' && (<>
                    <Notifications/>
                    </>)}
                </div>
                <div className="asideFooter">
                    <div className="asideFooterMenu">
                        <div className="menuItem" onClick={(e)=>{setAsideContext('FRIENDS')}}><Link><i className="fa-regular fa-address-book"></i></Link></div>
                        {/* add friends */}
                        <div className="menuItem"><Link data-bs-toggle="modal" data-bs-target="#addFriendsModel"><i className="fa-solid fa-user-plus"></i></Link></div>
                        <div className="menuItem" onClick={(e)=>{setAsideContext('NOTIFICATION')}}><Link><i className="fa-solid fa-bell"></i></Link></div>
                        <div className="menuItem"><Link className="menuItem" title='search'><i className="fa-solid fa-magnifying-glass"></i></Link></div>
                        <div className="menuItem"><Link className="menuItem" title='logout' to={APP_URL.FE_LOGOUT}><i className="fa-solid fa-right-from-bracket"></i></Link></div>
                    </div>
                </div>
            </div>
            <EditProfile id={'editUserProfile'} modalClass='secondBlackModal editUserProfile'></EditProfile>
            <AddFriends id={"addFriendsModel"} modalClass='blackModal addFriendsModal '></AddFriends>
        </>
    )
}

export default Aside
