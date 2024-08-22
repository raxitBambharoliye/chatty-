import React, { useContext, useEffect, useState } from 'react'
import '../../../assets/css/modal.css'
import { Button } from '../../Form';
import { useDispatch, useSelector } from 'react-redux';
import { SocketContext } from '../../../socket/SocketProvider';
import { EVENT_NAME } from '../../../constant';
import { changeEditGroupAdminLoader, removeFriends } from '../../../reducers/chatReducer';

export default function AddFriendsInGroup({ id, modalClass = '' }) {
    const activeChatInfo = useSelector((state) => state.chat.activeUserChat);
    const friends = useSelector((state) => state.chat.friends);
    const [newFriends, setNewFriends] = useState([]);
    const userData = useSelector((state) => state.userData.user);
    const { sendRequest } = useContext(SocketContext);
    const dispatch = useDispatch();
    const editGroupAdminLoader = useSelector((state) => state.chat.loader.editGroupAdminLoader);

    if (!(activeChatInfo.type && activeChatInfo.type == 'GROUP')) {
        return <></>
    }

    const [friendsList, setFriendsList] = useState(activeChatInfo.groupMembers);
    const [activeSubmitButton, setActiveSubmitButton] = useState(true);
    useEffect(() => {
        if (friendsList.join("-") != activeChatInfo.groupMembers.join("-")) {
            setActiveSubmitButton(false);
        }
    }, [friendsList, setFriendsList])
    const removeFriends = (id) => {
        const removed = newFriends.filter((element => element != id));
        setNewFriends(removed);
        const newFriendsList = friendsList.filter((element) => element._id != id);
        setFriendsList(newFriendsList);
    }
    const updateFriends = async () => {
        dispatch(changeEditGroupAdminLoader(true))
        sendRequest({ eventName: EVENT_NAME.ADD_FRIENDS_IN_GROUP, data: { editor: userData._id, groupId: activeChatInfo._id, newFriendsList: newFriends } });
    }
    return (
        <div className={`modal fade  ${modalClass}`} id={id} tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-xl"  >
                <div className={`modal-content position-relative`}>
                    {editGroupAdminLoader &&
                        <div className="loader position-absolute top-0 bottom-0 start-0 end-0 d-flex align-items-center justify-content-center">
                            <div className="asideLoader"></div>
                        </div>}
                    <div className="modal-header ">
                        <h1 className="modal-title fs-5 " id="exampleModalLabel">Add new Friends </h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                    </div>
                    <div className="modal-body d-flex flex-column flex-grow-1">
                        <div className="adminList">
                            <div className="row justify-content-center">
                                {[...friends, ...activeChatInfo.groupMembers].map((element, index) => {
                                    if (friendsList.includes(element)) {
                                        return (
                                            <div className='col-2' key={`groupAdmins-${index}`}>
                                                <div className="adminItem d-flex flex-column align-items-center">

                                                    <div className="adminProfile position-relative">
                                                    {newFriends.includes(element._id) && <div className="closeButton" onClick={(e) => { removeFriends(element._id) }}><i className="fa-solid fa-xmark"></i></div>}
                                                        <img src={element.profilePicture ?? "./image/dummyProfile.png"} alt="" />
                                                    </div>
                                                    <p>{element.userName}</p>
                                                </div>
                                            </div>
                                        )
                                    }
                                })}
                            </div>
                        </div>
                        <div className="otherGroupMembers">
                            <div className="groupMember">
                                {friends.map((element, index) => {
                                    if (activeChatInfo.groupMembers.findIndex((val) => val._id == element._id) < 0 && element.type !== "GROUP" && friendsList.findIndex((val) => val._id == element._id) < 0) {
                                        return (
                                            <div className="groupMemberItem d-flex align-items-center justify-content-between" key={`addFriendsInGroup-${index}`} onClick={(e) => { setFriendsList((value) => [...value, element]); setNewFriends((value) => [...value, element._id]) }}>
                                                <div className="userInfo d-flex align-items-center">
                                                    <div className="profileImage">
                                                        <img src={element.profilePicture ?? "./image/dummyProfile.png"} alt="" />
                                                    </div>
                                                    <p className='m-0'>{element.userName}</p>
                                                </div>
                                            </div>
                                        )
                                    }
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <Button buttonClass='buttonBlack hover btnRounded me-2' type='button' value='Close' data-bs-dismiss="modal" />
                        <Button buttonClass='themBlueBordered btnRounded' type='button' value='Save' disabled={activeSubmitButton} onClick={updateFriends} />
                    </div>
                </div>
            </div>
        </div>
    )
}
