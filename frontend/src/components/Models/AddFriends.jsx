import React, { useState } from 'react'
import { Button, Input } from '../Form'
import '../../assets/css/modal.css'
function AddFriends({ id, modalClass = '' }) {

    const [isLoading,setLoader]=useState(true);
    const [searchResult,setSearchResult]=useState([]);

    const handleOnChange=async ()=>{
        console.log('test ')
    }

    return (
        <div>
            <div className={`modal fade  ${modalClass}`} id={id} tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                <form className="modal-dialog modal-dialog-centered modal-xl" action='' >
                    <div className={`modal-content`}>
                        <div className="modal-header ">
                            <h1 className="modal-title fs-5 " id="exampleModalLabel">Find New Friend's</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                        </div>
                        <div className="modal-body d-flex flex-column flex-grow-1">
                            <div className="d-flex flex-column h-100 flex-grow-1">

                                <div className="searchBox">
                                    <Input inputClass="addFriendSearch" placeHolder="Search User Name ..." onChange={handleOnChange}></Input>
                                </div>
                                <div className="searchResult px-3 d-flex align-items-center flex-column justify-content-center">
                                    {isLoading && 
                                    <>
                                    <div class="loaderSearch "></div> 
                                    <h2 className='mt-4'>SearchIng...</h2>
                                    </>}
                                    {!isLoading && [1, 2, 0, 0, 0, 0, 0, 0,].map((element) => (
                                        <div className="searchResultItem w-100">
                                            <div className="d-flex align-items-center">
                                                <div className="userProfile me-4">
                                                    <img src="./image/dummyProfile.png" alt="" />
                                                </div>
                                                <div className="userData flex-grow-1 ">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div className="userName">
                                                            <h3 className='m-0'>testUser</h3>
                                                            <p className='m-0'>enjoy Your Life</p>
                                                        </div>
                                                        <Button type="button" value="follow" buttonClass="btn-outline-primary hover" />
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
                </form>
            </div>
        </div>


    )
}

export default AddFriends
