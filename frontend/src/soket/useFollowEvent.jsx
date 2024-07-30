import { useDispatch } from "react-redux";
import { setDataInCookie } from "../common";

export const useFollowEvent = (data) => {
    const dispatch = useDispatch();
    console.log('data', data)
    if (data.user) {
        setDataInCookie(COOKIE_KEY.USER, data.user);
        dispatch(setUser(data.user));
    }
}