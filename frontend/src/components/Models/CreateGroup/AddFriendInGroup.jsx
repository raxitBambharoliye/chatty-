import React from 'react'
import { useSelector } from 'react-redux';
import { Input } from '../../Form';

function AddFriendInGroup() {
    const friendsSet = useSelector((state) => state.chat.friends);

    let friends = friendsSet?.concat(friendsSet)
    console.log('friends', friends)
    return (
        <div className={`inputBlack addFriendsInGroup`}>
            <label htmlFor="" className="form-label">Select Friends</label>
            <Input inputClass='inputBlack mx-2' placeholder="Search User Name ... " ></Input>
            <div className="selectedFriends">
                <div className="row flex-nowrap">
                    <div className="col-2">
                        <div className="selectedFriendsItem d-flex flex-column align-items-center">
                            <div className="userProfile ">
                                <img src="./image/dummyProfile.png" alt="" />
                            </div>
                            <h6>Test User</h6>
                        </div>
                    </div>
                    <div className="col-2">
                        <div className="selectedFriendsItem d-flex flex-column align-items-center">
                            <div className="userProfile ">
                                <img src="./image/dummyProfile.png" alt="" />
                            </div>
                            <h6>Test User</h6>
                        </div>
                    </div>
                    <div className="col-2">
                        <div className="selectedFriendsItem d-flex flex-column align-items-center">
                            <div className="userProfile ">
                                <img src="./image/dummyProfile.png" alt="" />
                            </div>
                            <h6>Test User</h6>
                        </div>
                    </div>
                    <div className="col-2">
                        <div className="selectedFriendsItem d-flex flex-column align-items-center">
                            <div className="userProfile ">
                                <img src="./image/dummyProfile.png" alt="" />
                            </div>
                            <h6>Test User</h6>
                        </div>
                    </div>
                    
                    <div className="col-2">
                        <div className="selectedFriendsItem d-flex flex-column align-items-center">
                            <div className="userProfile ">
                                <img src="./image/dummyProfile.png" alt="" />
                            </div>
                            <h6>Test User</h6>
                        </div>
                    </div>
                    <div className="col-2">
                        <div className="selectedFriendsItem d-flex flex-column align-items-center">
                            <div className="userProfile ">
                                <img src="./image/dummyProfile.png" alt="" />
                            </div>
                            <h6>Test User</h6>
                        </div>
                    </div>
                    <div className="col-2">
                        <div className="selectedFriendsItem d-flex flex-column align-items-center">
                            <div className="userProfile ">
                                <img src="./image/dummyProfile.png" alt="" />
                            </div>
                            <h6>Test User</h6>
                        </div>
                    </div>
                    <div className="col-2">
                        <div className="selectedFriendsItem d-flex flex-column align-items-center">
                            <div className="userProfile ">
                                <img src="./image/dummyProfile.png" alt="" />
                            </div>
                            <h6>Test User</h6>
                        </div>
                    </div>
                </div>
            </div>
            <div className="friends">
                {friends && friends.map((element, index) => {
                    return (
                        <>
                            <label className='friendsItem' htmlFor={element._id}>
                                <div className="d-flex align-items-center">
                                    <div className="userProfile me-2">
                                        <img src={element.profilePicture ?? "./image/dummyProfile.png"} alt="" />
                                    </div>
                                    <div className="userDetails">

                                        <h6 className='m-0'>{element.userName}</h6>

                                    </div>
                                </div>
                            </label>
                            <input type="checkBox" id={element._id} hidden />
                        </>
                    )
                })}
            </div>
        </div>
    )
}

export default AddFriendInGroup
