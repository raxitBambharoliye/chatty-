//NOTE - this function was old (direct send register call and handle that)
const registerHandler = async (data) => {
    try {
        const response = await AxiosCLI.post(APP_URL.REGISTER, data);
        if (response.status === 200) {
            if(!response.data.userData.verifiedEmail){}
            if (response.data.token && response.data.token != "") {
                setDataInCookie(COOKIE_KEY.TOKEN, response.data.token);
            }
            if (response.data.userData) {
                setDataInCookie(COOKIE_KEY.USER, response.data.userData);
                dispatch(setUser(response.data.userData));
            }
            navigate(APP_URL.FE_HOME);
        }
    } catch (error) {
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