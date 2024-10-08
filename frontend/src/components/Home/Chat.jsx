import React, { useContext, useEffect, useRef, useState } from 'react';
import { DatePart, ReceiveMessage, SendMessage } from '../Message';
import { Input } from '../Form';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { SocketContext } from '../../socket/SocketProvider';
import { APP_URL, EVENT_NAME } from '../../constant';
import { AxiosCLI } from '../../axios';
import { setChatLoader, setPaginationMessage } from '../../reducers/chatReducer';
import { checkDatePrint } from '../../utility/logic/formatMessage';
import { ChatHeader } from './ChatComponents';
/* with of full picture 767 */
function Chat() {
    const bottomRef = useRef();
    const { activeUserChat, messages, friends, maxPageOfChat } = useSelector((state) => state.chat);
    const { changeChatLoader, chatLoader } = useSelector((state) => state.chat.loader)
    const { blockedByUsers, blockedUserId } = useSelector((state) => state.chat.userFriendsData)
    const user = useSelector((state) => state.userData.user);
    const { sendRequest } = useContext(SocketContext);
    const [page, setPage] = useState(2);
    const [prevScrollHeight, setPrevScrollHeight] = useState(0);
    const dispatch = useDispatch();
    const scrollREF = useRef();
    const { register, handleSubmit, setValue } = useForm();

    const sendMessage = (data) => {
        if (activeUserChat && activeUserChat._id && data && data.message.length >= 0) {
            sendRequest({ eventName: EVENT_NAME.MESSAGE, data: { receiverId: activeUserChat._id, message: data.message, isGroup: (activeUserChat.type && activeUserChat.type == 'GROUP') ? true : false } });
            setValue("message", "");
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    };

    const getChatTime = (dateStr) => {
        const date = new Date(dateStr);
        let op = { hour: 'numeric', minute: 'numeric', hour12: true };
        const time = date.toLocaleTimeString('en-US', op);
        return time;
    };

    async function scrollHandler() {
        if (scrollREF.current.scrollTop === 0 && user._id && activeUserChat._id && page+1 < maxPageOfChat) {
            setPrevScrollHeight(scrollREF.current.scrollHeight);
            setPage((prevPage) => prevPage + 1);
            dispatch(setChatLoader(true));
            const messageResponse = await AxiosCLI.post(APP_URL.GET_MESSAGE, { senderId: user._id, receiverId: activeUserChat._id, page: page });
            dispatch(setPaginationMessage(messageResponse.data));
            dispatch(setChatLoader(false));
        }
    }

    useEffect(() => {
        setPage(2);
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [activeUserChat]);

    useEffect(() => {
        if (prevScrollHeight && !chatLoader) {
            scrollREF.current.scrollTop = scrollREF.current.scrollHeight - prevScrollHeight;
        }
    }, [messages, chatLoader, prevScrollHeight]);

    if (!activeUserChat) {
        return (
            <div className="h-100 d-flex flex-column justify-content-center align-items-center homeChat">
                <div className="logo">
                    <img src="./image/logo.png" alt="" />
                </div>
                <h1>Chatty π</h1>
                <p>No boundaries, just free-flowing chat.</p>
            </div>
        );
    }

    return (
        <>
            {changeChatLoader && (<>
                <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                    <div className="asideLoader"></div>
                </div>
            </>)}
            {(activeUserChat && !changeChatLoader) && (
                <>
                    {/* chat header */}
                    <ChatHeader />
                    {messages && messages.length > 0 && (
                        <>
                            {chatLoader && (
                                <div className="w-100 d-flex align-items-center justify-content-center">
                                    <div className="asideLoader"></div>
                                </div>
                            )}
                            {/* chat show */}
                            <div className="chatBox flex-grow-1 justify-content-end" ref={scrollREF} onScroll={scrollHandler}>
                                {/* {(page > maxPageOfChat) &&
                                    <div className='end'>
                                        <div className="logo">
                                        <img src="./image/logo.png" alt="" />
                                        </div>   
                                </div>} */}
                                {messages.map((element, index) => {
                                    let previousIndex = index - 1 > 0 ? index - 1 : 0;
                                    const previousDate = messages[previousIndex].createdAt;
                                    const datePrint = checkDatePrint(element.createdAt, previousDate, index === 0);
                                    let profile = friends.findIndex((val) => val._id == element.senderId);
                                    if (profile >= 0) {
                                        profile = friends[profile].profilePicture;
                                    }
                                    let userProfile = user.profilePicture;
                                    return (
                                        <React.Fragment key={element._id}>
                                            {datePrint && <DatePart text={datePrint} />}
                                            {!element.type && (
                                                <>
                                                    {element.senderId === user._id && <SendMessage message={element.message} profile={userProfile} time={getChatTime(element.createdAt)} />}
                                                    {element.senderId !== user._id && <ReceiveMessage message={element.message} profile={profile ?? "./image/dummyProfile.png"} time={getChatTime(element.createdAt)} />}
                                                </>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                                <div className="bottomRef mt-5" ref={bottomRef}></div>
                            </div>
                        </>
                    )}
                    {/* chat Input */}
                    <div className="chatInput">
                        {(!blockedUserId.includes(activeUserChat._id) && !blockedByUsers.includes(activeUserChat._id) /* */) &&
                            <form onSubmit={handleSubmit(sendMessage)}>
                                <div className="d-flex align-items-center">
                                    <div className="input me-2 flex-grow-1">
                                        <Input type="text" placeholder="Enter Your message..." inputClass="inputBlack" {...register("message")} />
                                    </div>
                                    <div className="attachmentButton me-2">
                                        <button type="button"><i className="fa-solid fa-paperclip" /></button>
                                    </div>
                                    <div className="sendButton">
                                        <button type="submit"><i className="fa-regular fa-paper-plane" /></button>
                                    </div>
                                </div>
                            </form>
                        }

                        {blockedUserId.includes(activeUserChat._id) &&
                            <div className="blockedPopUp d-flex align-items-center justify-content-center">
                                <p className='m-0'> you blocked this  User</p>
                            </div>
                        }
                        {blockedByUsers.includes(activeUserChat._id) &&
                            <div className="blockedPopUp d-flex align-items-center justify-content-center">
                                <p className='m-0'> you blocked by {activeUserChat.userName}</p>
                            </div>
                        }

                    </div>

                </>
            )}
        </>
    );
}

export default Chat;
