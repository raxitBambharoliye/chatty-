import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Button, Input } from '../Form'
import { AxiosCLI } from '../../axios'
import '../../assets/css/modal.css'
import { APP_URL, EVENT_NAME } from '../../constant';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import { SocketContext } from '../../socket/SocketProvider';

function AddFriends({ id, modalClass = '' }) {
    const { sendRequest } = useContext(SocketContext);

    const [isLoading, setLoader] = useState(false);
    const [searchResult, setSearchResult] = useState([]);
    const [search, setSearch] = useState("");
    const [searchCache, setSearchCache] = useState({});
    const user = useSelector((state) => state.userData.user)
    const { sendedRequest, friendRequest } = useSelector((state) => state.chat.userFriendsData);
    const friends = useSelector((state) => state.chat.friends);
    const debouncedSearch = useCallback(
        _.debounce((searchQuery) => {
            if (searchQuery === '') {
                setSearchResult([]);
                return;
            }
            setLoader(true);
            if (searchCache[searchQuery]) {
                setSearchResult(searchCache[searchQuery]);
                setLoader(false);
            } else {
                AxiosCLI.get(`${APP_URL.SEARCH_USER}/${searchQuery}`)
                    .then((response) => {
                        if (response.status === 200 && response.data.searchResult) {
                            setSearchCache({ ...searchCache, [searchQuery]: response.data.searchResult });
                            setSearchResult(response.data.searchResult);
                            setLoader(false);
                        }
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                        setLoader(false);
                    });
            }
        }, 500), []);

    useEffect(() => {
        debouncedSearch(search);
    }, [search, debouncedSearch]);
    const SendFollowRequest = (id) => {
        let sendData = {
            eventName: EVENT_NAME.FOLLOW,
            data: {
                receiverId: id,
                senderId: user._id
            }
        }
        sendRequest(sendData);
        console.log("send request ", id)
    }

    return (
        <div>
            <div className={`modal fade  ${modalClass}`} id={id} tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-xl"  >
                    <div className={`modal-content`}>
                        <div className="modal-header ">
                            <h1 className="modal-title fs-5 " id="exampleModalLabel">Find New Friend's</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                        </div>
                        <div className="modal-body d-flex flex-column flex-grow-1">
                            <div className="d-flex flex-column h-100 flex-grow-1">

                                <div className="searchBox">
                                    <Input inputClass="addFriendSearch" placeholder="Search User Name ..." onChange={(e) => { setSearch(e.target.value) }}></Input>
                                </div>
                                <div className="searchResult px-3 d-flex align-items-center flex-column justify-content-center">
                                    {isLoading &&
                                        <>
                                            <div className="loaderSearch "></div>
                                            <h2 className='mt-4'>SearchIng...</h2>
                                        </>}
                                    {(!isLoading && searchResult.length == 0) && (<>
                                        <h1>No data found</h1></>)}
                                    {!isLoading && searchResult.map((element, index) => (
                                        <div className="searchResultItem w-100" key={`${index}AddFriendITem`}>
                                            <div className="d-flex align-items-center">
                                                <div className="userProfile me-4">
                                                    <img src={element.profilePicture ?? "./image/dummyProfile.png"} alt="" />
                                                </div>
                                                <div className="userData flex-grow-1 ">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div className="userName">
                                                            <h3 className='m-0'>{element.userName}</h3>
                                                            <p className='m-0'>{element.tagLine ? element.tagLine : "---"}</p>
                                                        </div>
                                                        {friends.findIndex((val) => val._id == element._id) == -1 &&
                                                            <Button type="button" value={sendedRequest.includes(element._id) ? "requested" : friendRequest.includes(element._id) ? "follow back" : "follow"} buttonClass="btn-outline-primary hover" disabled={sendedRequest.includes(element._id) ? true : false} onClick={(e) => { SendFollowRequest(element._id) }} />
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <Button buttonClass='buttonBlack hover btnRounded me-2' type='button' value='Close' data-bs-dismiss="modal" />
                        </div>
                    </div>
                </div>
            </div>
        </div>


    )
}

export default AddFriends
