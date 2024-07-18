import React from 'react'

function AsideContactsItem({ index,activeChat, profile = `./image/dummyProfile.png`, userName = ``, tagLine = `` ,...props}) {
    return (
        <div className={`asideContactsItem ${index == activeChat ? 'active' : ""}`} {...props}>
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
//<div className={`asideContactsItem ${index==1 ? 'active' : ""}` }key={index}>
//   <div className="userProfile d-flex align-items-center">
//     <div className="profile me-2 ">
//         <img src="./image/dummyProfile.png" alt="" />
//     </div>
//     <div className="name">
//       <h3 className='m-0'>Radhe Patel</h3>
//       <p className='m-0'>enjoy full life </p>
//     </div>  
//   </div>
// </div>//