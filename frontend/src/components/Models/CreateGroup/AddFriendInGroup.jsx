import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Input } from '../../Form';

function AddFriendInGroup({ selectedFriendsIds, setSelectedFriendsIds }) {
    const friendsSate = useSelector((state) => state.chat.friends);
    const [selectedFriends, setSelectedFriends] = useState([])
    // const [selectedFriendsIds, setSelectedFriendsIds] = useState([]);
    const [friends, setFriends] = useState(friendsSate);
    const [searchFriends, setSearchFriends] = useState("");
    useEffect(() => {
        if (friendsSate)
            setFriends(friendsSate)
        else
            setFriends([])
    }, [friendsSate])

    const handleSelectFriend = (element) => {
        if (selectedFriendsIds.length > 0 && selectedFriendsIds.includes(element._id)) {
            setSelectedFriends((value) => value.filter((arrayElement) => arrayElement._id !== element._id))
            setSelectedFriendsIds((value) => value.filter((id) => id !== element._id))
        } else {
            setSelectedFriends((value) => [...value, element])
            setSelectedFriendsIds((value) => [...value, element._id])
        }
    }

    useEffect(() => {
        if (searchFriends) {
            console.log("searchFriends", searchFriends)
            let newFriends = friends.filter(user => user.userName.toLowerCase().includes(searchFriends.toLowerCase()));
            setFriends(newFriends);
        } else {
            setFriends(friendsSate);
            setSearchFriends("");
        }
    }, [searchFriends])

    return (
        <div className={`inputBlack addFriendsInGroup`}>
            <label htmlFor="" className="form-label">Select Friends</label>
            <div className="d-flex align-items-center">
                <div className="searchIcon mb-3 me-2">
                    <i className="fa-solid fa-magnifying-glass"></i>
                </div>
                <Input inputClass='inputBlack mx-2 w-100' placeholder="Search User Name ... " onChange={(e) => { setSearchFriends(e.target.value) }}></Input>
            </div>
            <div className="selectedFriends">
                <div className="row flex-nowrap justify-content-start">
                    {(selectedFriends && selectedFriends.length > 0) && selectedFriends.map((element, index) => (
                        <div className="col-2" key={`selectedFriends${index}`}>
                            <div className="selectedFriendsItem d-flex flex-column align-items-center ">
                                <div className="userProfile position-relative ">
                                    <div className="closeButton" onClick={(e) => { handleSelectFriend(element) }}><i className="fa-solid fa-xmark"></i></div>
                                    <img src={element.profilePicture ? element.profilePicture : "./image/dummyProfile.png"} alt="" />
                                </div>
                                <h6>{element.userName}</h6>
                            </div>
                        </div>
                    ))}
                    {(!selectedFriends || selectedFriends.length <= 0) && (<h2 className='text-center second-heading'>NO FRIENDS SELECTED</h2>)}
                </div>
            </div>
            <div className="friends mt-2">
                {friends && friends.map((element, index) => {

                    return (

                            <div className={`friendsItem ${(selectedFriendsIds.length > 0 && selectedFriendsIds.includes(element._id)) ? "selected" : ''}`} key={`groupFiendSelection${index}`} onClick={(e) => { handleSelectFriend(element) }}>
                                <div className="d-flex align-items-center">
                                    <div className="userProfile me-2">
                                        <img src={element.profilePicture ?? "./image/dummyProfile.png"} alt="" />
                                    </div>
                                    <div className="userDetails">

                                        <h6 className='m-0'>{element.userName}</h6>

                                    </div>
                                </div>
                            </div>
                    )
                })}
            </div>
        </div>
    )
}

export default AddFriendInGroup
