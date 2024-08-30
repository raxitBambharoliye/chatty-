import React from 'react'
import { cutString } from '../../common'

function AsideContactsItem({ index, activeChat, profile = `./image/dummyProfile.png`, userName = ``, tagLine = ``, itemClass = "", isPined = false, ...props }) {
    return (
        <div className={`asideContactsItem position-relative ${itemClass} ${index == activeChat ? 'active' : ""}`} {...props}>
            <div className="userProfile d-flex align-items-center">
                <div className="profile me-2 ">
                    <img src={profile} alt="" />
                </div>
                <div className="name">
                    <h3 className='m-0'>{cutString(userName,18)}</h3>
                    <p className='m-0'>{cutString(tagLine,25)}</p>
                </div>
              {isPined &&   <div className="pinIcon flex-grow-1 text-end me-3 "><i className="fa-solid fa-star"></i></div>}
            </div>
        </div>
    )
}

export default AsideContactsItem