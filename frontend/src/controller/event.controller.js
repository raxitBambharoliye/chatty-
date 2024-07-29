import { useDispatch } from "react-redux";
import { setDataInCookie } from "../common"
import { COOKIE_KEY } from "../constant"
import { setUser } from "../reducers/userReducer";

export const follow = (data) =>{
    console.log('data', data)
    if (data.user) {
        setDataInCookie(COOKIE_KEY.USER, data.user);
        const dispatch = useDispatch();
        dispatch(setUser(data.user));
    }
}