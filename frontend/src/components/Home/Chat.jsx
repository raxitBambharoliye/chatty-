import React, { useContext, useEffect, useRef, useState } from 'react'
import { DatePart, ReceiveMessage, SendMessage } from '../Message';
import { Input } from '../Form';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { SocketContext } from '../../socket/SocketProvider'
import { APP_URL, EVENT_NAME } from '../../constant';
import { AxiosCLI } from '../../axios';
import {  setPaginationMessage } from '../../reducers/chatReducer';
function Chat() {
    const [chatHeaderMenu, setChatHeaderMenu] = useState(false)
    const activeUserChat = useSelector((state) => state.chat.activeUserChat);
    const user = useSelector((state) => state.userData.user)
    const messages = useSelector((state) => state.chat.messages)
    const [page,setPage]=useState(1)
    const { register, handleSubmit, setValue } = useForm();
    const { sendRequest } = useContext(SocketContext);
    const dispatch = useDispatch();
    const sendMessage = (data) => {
        if (activeUserChat && activeUserChat._id && data && data.message.length >= 0) {
            sendRequest({ eventName: EVENT_NAME.MESSAGE, data: { receiverId: activeUserChat._id, message: data.message } });
            setValue("message", "");
        }
    }
    const scrollREF=useRef()


    const getChatTime = (dateStr) => {
        const date = new Date(dateStr);
        let op = { hour: 'numeric', minute: 'numeric', hour12: true }
        const time = date.toLocaleTimeString('en-US', op);
        return time;
    }

    async function scrollHandler(){
        if (scrollREF.current.scrollTop==0 && user._id && activeUserChat._id) {
            setPage(page+1);
            console.log('page', page)
            const messageResponse = await AxiosCLI.post(APP_URL.GET_MESSAGE, { senderId: user._id, receiverId: activeUserChat._id,page:page })
            console.log('messageResponse', messageResponse.data)
            dispatch(setPaginationMessage(messageResponse.data));
            
        }
    }

    if (!activeUserChat) {
        return (<>
            <div className="h-100 d-flex justify-content-center align-items-center">
                <h1>Chatty 𝝅</h1>
            </div>

        </>)
    }
    return (
        <>


            {activeUserChat && (
                <>
                    {/* chat header  */}
                    <div className="chatHeader d-flex justify-content-between align-items-center">
                        <div className="userProfile d-flex ">
                            <div className="img">
                                <img src="./image/profile1.jpg" alt="" />
                            </div>
                            <div className="userInfo ms-3">
                                <h2 className='mb-0'>{activeUserChat.userName}</h2>
                                <p >{activeUserChat.tagLine ?? "-"}</p>
                            </div>
                        </div>
                        <div className="menu position-relative">
                            <button className="menuButton" onClick={(e) => { setChatHeaderMenu(!chatHeaderMenu) }}>
                                <i className="fa-solid fa-ellipsis-vertical"></i>
                            </button>
                            <div className="chatHeaderUserMenu">
                                <ul className={`m-0 p-0 ${chatHeaderMenu && "show"}`}>
                                    <li className='m-0'>block</li>
                                    <li className='m-0'>mute</li>
                                    <li className='m-0'>un follow</li>
                                    {/* <li>report</li> */}
                                </ul>
                            </div>
                        </div>
                    </div>
                    {(messages && messages.length > 0) && (
                        <>

                            {/* chat show */}
                            <div className="chatBox flex-grow-1  justify-content-end" ref={scrollREF} onScroll={scrollHandler}>
                                {/*  */}
                                {messages.map((element, index) => (
                                    <>
                                    {console.log("test ")}
                                        {element.type && <DatePart text={element.date} />}
                                        {!element.type && (<>
                                            {(element.senderId === user._id) && (<SendMessage message={element.message} time={getChatTime(element.createdAt)} key={`${element._id}Message`} />)}
                                            {(element.senderId !== user._id) && (<ReceiveMessage message={element.message} key={`${element._id}Message`} time={getChatTime(element.createdAt)} />)}
                                        </>)}

                                    </>
                                ))}
                            </div>
                        </>
                    )}
                    {/* chat Input  */}
                    <div className="chatInput  mt-3">
                        <form action="" onSubmit={handleSubmit(sendMessage)}>
                            <div className="d-flex align-items-center">
                                <div className="input me-2 flex-grow-1"><Input type="text" placeholder="Enter Your message... " inputClass="inputBlack  " {...register("message")} /></div>
                                <div className="attachmentButton me-2"><button ><i className="fa-solid fa-paperclip" /></button></div>
                                <div className="sendButton"><button type='submit'><i className="fa-regular fa-paper-plane" /></button></div>
                            </div>
                        </form>
                    </div>
                </>
            )}
        </>
    )
}

export default Chat
