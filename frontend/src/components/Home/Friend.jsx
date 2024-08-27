import React, { useContext, useEffect, useState } from 'react'
import { Input } from '../Form'
import AsideContactsItem from './AsideContactsItem'
import { useDispatch, useSelector } from 'react-redux'
import { changeActiveUserChat, changeChangeChatLoader, removeIdFromPendingViews } from '../../reducers/chatReducer';
import { SocketContext } from '../../socket/SocketProvider';
import { EVENT_NAME } from '../../constant';

function Friend() {
    const { activeNewChat, friends } = useSelector((state) => state.chat);
    const { messageOrder, pinedUsers } = useSelector((state) => state.chat.userFriendsData);
    const { sendRequest } = useContext(SocketContext);
    const user = useSelector((state) => state.userData.user);
    const dispatch = useDispatch();
    const [activeChat, setActiveChat] = useState(-1)
    const friendLoader = useSelector((state) => state.chat.loader.friendsLoader)
    const pendingViewsId = useSelector((state) => state.chat.pendingViewIds)
    const [friendsState, setFriends] = useState(friends);
    const [friendSearch, setFriendsSearch] = useState("");
    const [messageOrderState, setMessageOrder] = useState(messageOrder);

    useEffect(() => {
        setFriends(friends);
    }, [friends])

    useEffect(() => {
        if (activeChat < 0) {
            return;
        }
        dispatch(changeActiveUserChat(friendsState[activeChat]));
        //NOTE - find chat of that user 
        const sendData = {
            eventName: EVENT_NAME.CHATS,
            data: {
                senderId: user._id,
                receiverId: friendsState[activeChat]._id,
                isGroup: (friendsState[activeChat].type && friendsState[activeChat].type === "GROUP") ? true : false,
            }
        }
        dispatch(removeIdFromPendingViews(friendsState[activeChat]._id));
        dispatch(changeChangeChatLoader(true))
        sendRequest(sendData);
    }, [activeChat])
    useEffect(() => {
        setMessageOrder(messageOrder);
    }, [messageOrder])
    useEffect(() => {
        if (friendSearch) {
            let newFriends = friendsState.filter((element) => {
                if (element.type === 'GROUP') {
                    return element.groupName.toLowerCase().includes(friendSearch.toLowerCase())
                }
                return element.userName.toLowerCase().includes(friendSearch.toLowerCase())
            });
            setFriends(newFriends);
        } else {
            setFriends(friends);
            setFriendsSearch("");
        }
    }, [friendSearch])

    if (friendLoader) {
        return (
            <div className="w-100 bg-dark h-100 d-flex align-items-center justify-content-center">
                <div className="asideLoader"></div>
            </div>
        )
    }
    return (
        <>
            <Input inputClass='inputBlack mx-2' placeholder="Search User Name ... " onChange={(e) => { setFriendsSearch(e.target.value) }}></Input>
            {(!friendsState || friendsState.length === 0) &&
                <div className='h-100 d-flex flex-column justify-content-center align-items-center '>
                    <h4 className='emptyMessage'>friendsState not found</h4>
                </div>
            }
            {(!activeNewChat && (friendsState && friendsState.length >= 0)) &&
                <>
                    {
                        pinedUsers.map((element) => {
                            const contact = friendsState.find((val) => val._id === element);
                            const index = friendsState.findIndex((val) => val._id == element);
                            if (contact) {
                                return (
                                    <AsideContactsItem userName={contact.type && contact.type == "GROUP" ? contact.groupName : contact.userName} profile={contact.type && contact.type == "GROUP" ? contact.groupProfile ?? "./image/dummyGroupProfile.png" : contact.profilePicture ?? "./image/dummyProfile.png"} itemClass={pendingViewsId.includes(contact._id) ? "pendingBall" : ""} tagLine={contact.tagLine ?? "-"} index={index} activeChat={activeChat} key={`${index}FriendsItems`} onClick={(e) => { setActiveChat(index) }} isPined={true} />
                                )
                            }
                            return;
                        })
                    }
                    {
                        messageOrderState.map((element) => {
                            const contact = friendsState.find((val) => val._id == element);
                            const index = friendsState.findIndex((val) => val._id == element)
                            if (contact && !pinedUsers.includes(contact._id)) {
                                return (
                                    <AsideContactsItem userName={contact.type && contact.type == "GROUP" ? contact.groupName : contact.userName} profile={contact.type && contact.type == "GROUP" ? contact.groupProfile ?? "./image/dummyGroupProfile.png" : contact.profilePicture ?? "./image/dummyProfile.png"} itemClass={pendingViewsId.includes(contact._id) ? "pendingBall" : ""} tagLine={contact.tagLine ?? "-"} index={index} activeChat={activeChat} key={`${index}FriendsItems`} onClick={(e) => { setActiveChat(index) }} />
                                )
                            }
                            return;
                        })
                    }
                </>
            }

            {(activeNewChat && (friendsState && friendsState.length >= 0)) && (
                <>
                    {friendsState.map((contact, index) => {
                        console.log('friendsState', friendsState)
                        if (1 || !messageOrderState.includes(contact?._id) && !pinedUsers.includes(contact?._id)) {
                            return (
                                <AsideContactsItem userName={contact.type && contact.type == "GROUP" ? contact.groupName : contact.userName} profile={contact.type && contact.type == "GROUP" ? contact.groupProfile ?? "./image/dummyGroupProfile.png" : contact.profilePicture ?? "./image/dummyProfile.png"} itemClass={pendingViewsId.includes(contact._id) ? "pendingBall" : ""} tagLine={contact.tagLine ?? "-"} index={index} activeChat={activeChat} key={`${index}FriendsItems`} onClick={(e) => { setActiveChat(index) }} />
                            )
                        }
                        return;
                    })}
                </>
            )}

        </>
    )
}

export default Friend
