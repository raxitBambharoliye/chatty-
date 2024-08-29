import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { APP_URL } from '../../constant'
import EditProfile from './EditProfile'
import { AddFriends, CreateGroup } from '../../components/Models/index'
import Notifications from './Notifications'
import Friend from './Friend'
import { useDispatch, useSelector } from 'react-redux'
import { changeActiveNewChat, changeAsideContent, setPendingNotificationView } from '../../reducers/chatReducer'
function Aside({ asideShow }) {
    const dispatch = useDispatch()
    const {activeAside,activeNewChat,notificationViewPending} = useSelector((state) => state.chat);
    const user = useSelector((state) => state.userData.user)
    useEffect(() => {
        if (activeAside == "NOTIFICATION") {
            // setNotificationPreview(false);
            dispatch(setPendingNotificationView(false));
        }
    }, [activeAside])

    return (
        <>

            {/* aside start  */}
            <div className={`asideInner  d-flex flex-column vh-100 position-relative ${asideShow ? 'show' : 'hide'} `}>
                <div className="asideHeader d-flex align-items-center justify-content-between position-sticky top-0">
                    <div className="img logo">
                        <img src="./image/logo.png" alt="" />
                    </div>
                    {/* <h1 className='m-0'>Chatty 𝝅</h1> */}
                    <div className="userProfile" data-bs-toggle="modal" data-bs-target="#editUserProfile">
                        <i className="fa-solid fa-pen pen"></i>
                        <img src={(user && user.profilePicture) ? user.profilePicture : "./image/dummyProfile.png"} alt="" />
                    </div>
                </div>
                <div className="asideContacts flex-grow-1 overflow-auto">
                    {activeAside === 'FRIENDS' && (<Friend />)}
                    {activeAside === 'NOTIFICATION' && (<Notifications />)}
                </div>
                <div className="asideFooter">
                    <div className="asideFooterMenu">
                        {/* friends */}
                        <div className="menuItem" onClick={(e) => { dispatch(changeAsideContent("FRIENDS")) }}><Link className={` ${activeAside == "FRIENDS" ? "active" : ''}`}><i className={`fa-regular fa-address-book`}></i></Link></div>
                        {/* add friends */}
                        <div className="menuItem"><Link data-bs-toggle="modal" data-bs-target="#addFriendsModel"><i className="fa-solid fa-user-plus"></i></Link></div>
                        {/* notification  */}
                        <div className="menuItem" onClick={(e) => { dispatch(changeAsideContent("NOTIFICATION")) }}><Link className={`${notificationViewPending ? "pendingBall notificationBall position-relative" : ''} ${activeAside == "NOTIFICATION" ? "active" : ''}`}><i className="fa-solid fa-bell"></i></Link></div>
                        {/* create group  */}
                        <div className="menuItem"><Link className="menuItem" title='search' data-bs-toggle="modal" data-bs-target="#createGroupModal"><i className="fa-solid fa-users" title="create group "></i></Link></div>
                        {/* log out  */}
                        <div className="menuItem"><Link className="menuItem" title='logout' to={APP_URL.FE_LOGOUT}><i className="fa-solid fa-right-from-bracket"></i></Link></div>
                    </div>
                </div>
                {/* new Chat start button */}
                <div className={`newCat ${activeNewChat? "active":""}`} onClick={(e)=>{dispatch(changeActiveNewChat(!activeNewChat))}}>
                    <i className="fa-solid fa-comment-medical"></i>
                </div>
            </div>
            <EditProfile id={'editUserProfile'} modalClass='secondBlackModal editUserProfile'></EditProfile>
            <AddFriends id={"addFriendsModel"} modalClass='blackModal addFriendsModal '></AddFriends>
            <CreateGroup id={"createGroupModal"} modalClass='secondBlackModal editUserProfile' />
        </>
    )
}

export default Aside
