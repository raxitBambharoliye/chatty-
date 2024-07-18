//NOTE - this function was old (direct send register call and handle that)
const registerHandler = async (data) => {
    try {
        console.log(data);
        const response = await AxiosCLI.post(APP_URL.REGISTER, data);
        if (response.status === 200) {
            SocketEvent.SocketConnection();
            if(!response.data.userData.verifiedEmail){}
            if (response.data.token && response.data.token != "") {
                console.log("set token works")
                setDataInCookie(COOKIE_KEY.TOKEN, response.data.token);
            }
            if (response.data.userData) {
                setDataInCookie(COOKIE_KEY.USER, response.data.userData);
                dispatch(setUser(response.data.userData));
                console.log('response.data.userData', response.data.userData)
            }
            navigate(APP_URL.FE_HOME);
        }
    } catch (error) {
        console.log('error.response.data.errors', error.response.data.errors.length)
        if (error.response.status === 400 && error.response.data.errors ) {
            for(let i = 0; i < error.response.data.errors.length;i++){
                let element = error.response.data.errors[i];
                setError(element.path, {
                    message:element.msg
                })
            }
        }
        console.log('CATCH ERROR IN : registerHandler', error);
    }
}