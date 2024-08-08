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

function Chat() {
    const [chatHeaderMenu, setChatHeaderMenu] = useState(false);
    const activeUserChat = useSelector((state) => state.chat.activeUserChat);
    const user = useSelector((state) => state.userData.user);
    const messages = useSelector((state) => state.chat.messages);
    const [page, setPage] = useState(2);
    const { register, handleSubmit, setValue } = useForm();
    const { sendRequest } = useContext(SocketContext);
    const dispatch = useDispatch();
    const chatLoader = useSelector((state) => state.chat.loader.chatLoader);
    const bottomRef = useRef();
    const scrollREF = useRef();
    const [prevScrollHeight, setPrevScrollHeight] = useState(0);

    const sendMessage = (data) => {
        if (activeUserChat && activeUserChat._id && data && data.message.length >= 0) {
            sendRequest({ eventName: EVENT_NAME.MESSAGE, data: { receiverId: activeUserChat._id, message: data.message } });
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
        if (scrollREF.current.scrollTop === 0 && user._id && activeUserChat._id) {
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
            <div className="h-100 d-flex justify-content-center align-items-center">
                <h1>Chatty 𝝅</h1>
            </div>
        );
    }

    return (
        <>
            {activeUserChat && (
                <>
                    {/* chat header */}
                    <div className="chatHeader d-flex justify-content-between align-items-center">
                        <div className="userProfile d-flex">
                            <div className="img">
                                <img src="./image/profile1.jpg" alt="" />
                            </div>
                            <div className="userInfo ms-3">
                                <h2 className="mb-0">{activeUserChat.userName}</h2>
                                <p>{activeUserChat.tagLine ?? "-"}</p>
                            </div>
                        </div>
                        <div className="menu position-relative">
                            <button className="menuButton" onClick={() => setChatHeaderMenu(!chatHeaderMenu)}>
                                <i className="fa-solid fa-ellipsis-vertical"></i>
                            </button>
                            <div className="chatHeaderUserMenu">
                                <ul className={`m-0 p-0 ${chatHeaderMenu && "show"}`}>
                                    <li className="m-0">block</li>
                                    <li className="m-0">mute</li>
                                    <li className="m-0">unfollow</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    {messages && messages.length > 0 && (
                        <>
                            {chatLoader && (
                                <div className="w-100 d-flex align-items-center justify-content-center">
                                    <div className="asideLoader"></div>
                                </div>
                            )}
                            {/* chat show */}
                            <div className="chatBox flex-grow-1 justify-content-end" ref={scrollREF} onScroll={scrollHandler}>
                                {messages.map((element, index) => {
                                    let previousIndex = index - 1 > 0 ? index - 1 : 0;
                                    const previousDate = messages[previousIndex].createdAt;
                                    const datePrint = checkDatePrint(element.createdAt, previousDate, index === 0);
                                    return (
                                        <React.Fragment key={element._id}>
                                            {datePrint && <DatePart text={datePrint} />}
                                            {!element.type && (
                                                <>
                                                    {element.senderId === user._id && <SendMessage message={element.message} time={getChatTime(element.createdAt)} />}
                                                    {element.senderId !== user._id && <ReceiveMessage message={element.message} time={getChatTime(element.createdAt)} />}
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
                    </div>
                </>
            )}
        </>
    );
}

export default Chat;
