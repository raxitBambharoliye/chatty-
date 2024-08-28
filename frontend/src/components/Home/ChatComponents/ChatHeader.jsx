import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import ReceiverMoreInfo from './ReceiverMoreInfo';
/* with of full picture 767 */
function ChatHeader() {
    const activeUserChat = useSelector((state) => state.chat.activeUserChat);
    const [chatHeaderMenu, setChatHeaderMenu] = useState(false);
    const [showMoreInfo, setShowMoreInfo] = useState(false);
    useEffect(() => {
        setShowMoreInfo(false);
    },[activeUserChat])
    return (
        <>
            {/* chat header */}
            <div className="chatHeader " >
                <div className="d-flex justify-content-between align-items-center position-relative" >
                    <div className="userProfile d-flex flex-grow-1" onClick={(e) => setShowMoreInfo((value) => !value)}>
                        <div className="img">
                            <img src={activeUserChat.type && activeUserChat.type == 'GROUP' ? activeUserChat.groupProfile ?? "./image/dummyGroupProfile.png" : activeUserChat.profilePicture ?? "./image/dummyProfile.png"} alt="" />
                        </div>
                        <div className="userInfo ms-3">
                            <h2 className="mb-0">{activeUserChat.type && activeUserChat.type == 'GROUP' ? activeUserChat.groupName : activeUserChat.userName}</h2>
                            <p className='m-0'>{activeUserChat.tagLine ?? "-"}</p>
                        </div>
                    </div>
                    <div className="menu position-relative me-3  px-2">
                        <button className="menuButton" onClick={() => setChatHeaderMenu(!chatHeaderMenu)}>
                            <i className="fa-solid fa-ellipsis-vertical"></i>
                        </button>
                        <div className="chatHeaderUserMenu">
                            <ul className={`m-0 p-0 ${chatHeaderMenu && "show"}`}>
                                <li className="m-0">block</li>
                                <li className="m-0">mute</li>
                                <li className="m-0">un follow</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* user/groupInformation */}
                <ReceiverMoreInfo infoClassName={showMoreInfo ? "show" : "hide"} closeInfo= {setShowMoreInfo} />
            </div>
        </>
    );
}

export default ChatHeader;
