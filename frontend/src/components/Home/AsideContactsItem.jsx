import React from 'react'

function AsideContactsItem({ index, activeChat, profile = `./image/dummyProfile.png`, userName = ``, tagLine = ``, itemClass="" ,...props}) {
    return (
        <div className={`asideContactsItem position-relative ${itemClass} ${index == activeChat ? 'active' : ""}`} {...props}>
            <div className="userProfile d-flex align-items-center">
                <div className="profile me-2 ">
                    <img src={profile} alt="" />
                </div>
                <div className="name">
                    <h3 className='m-0'>{ userName}</h3>
                    <p className='m-0'>{tagLine}</p>
                </div>
            </div>
        </div>
    )
}

export default AsideContactsItem