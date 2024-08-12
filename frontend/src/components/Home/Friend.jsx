import React, { useContext, useEffect, useState } from 'react'
import { Input } from '../Form'
import AsideContactsItem from './AsideContactsItem'
import { useDispatch, useSelector } from 'react-redux'
import { changeActiveUserChat, removeIdFromPendingViews } from '../../reducers/chatReducer';
import { SocketContext } from '../../socket/SocketProvider';
import { EVENT_NAME } from '../../constant';

function Friend() {

    const friendsState = useSelector((state) => state.chat.friends);
    const { sendRequest } = useContext(SocketContext);
    const user = useSelector((state) => state.userData.user);
    const dispatch = useDispatch();
    const [activeChat, setActiveChat] = useState(-1)
    const friendLoader = useSelector((state) => state.chat.loader.friendsLoader)
    const pendingViewsId = useSelector((state) => state.chat.pendingViewIds)
    const [friends, setFriends] = useState(friendsState);
    const [friendSearch, setFriendsSearch] = useState("");
    useEffect(() => {
        setFriends(friendsState);
    }, [friendsState])

    useEffect(() => {
        if (activeChat < 0) {
            return;
        }
        dispatch(changeActiveUserChat(friends[activeChat]));
        //NOTE - find chat of that user 
        const sendData = {
            eventName: EVENT_NAME.CHATS,
            data: {
                senderId: user._id,
                receiverId: friends[activeChat]._id
            }
        }
        dispatch(removeIdFromPendingViews(friends[activeChat]._id));
        sendRequest(sendData);
    }, [activeChat])

    if (friendLoader) {

        return (
            <div className="w-100 bg-dark h-100 d-flex align-items-center justify-content-center">

                <div className="asideLoader"></div>
            </div>
        )
    }
    // useEffect(() => {
    //     // if(!friendSearch){
    //     //     // setFriends(friendsState);
    //     //     // return;
    //     // }else{
    //         // if(friendSearch){

    //             // let newFriends = friends.filter(user => user.userName.toLowerCase().includes(friendSearch.toLowerCase()));
    //         //     // setFriends(newFriends);
    //         // }
    //     // }
    // }, [friendSearch])

    return (
        <>
            {(!friends || friends.length === 0) &&
                <div className='h-100 d-flex flex-column justify-content-center align-items-center '>
                    <h4 className='emptyMessage'>Friends not found</h4>
                </div>
            }
            {(friends && friends.length >= 0) && (
                <>
                    <Input inputClass='inputBlack mx-2' placeholder="Search User Name ... " onChange={(e) => { setFriendsSearch(e.target.value) }}></Input>
                    {friends.map((contact, index) => (
                        <AsideContactsItem userName={contact.userName} profile={contact.profilePicture ?? "./image/dummyProfile.png"} itemClass={pendingViewsId.includes(contact._id) ? "pendingBall" : ""} tagLine={contact.tagLine ?? "-"} index={index} activeChat={activeChat} key={`${index}FriendsItems`} onClick={(e) => { setActiveChat(index) }} />
                    ))}
                </>)}
        </>
    )
}

export default Friend
