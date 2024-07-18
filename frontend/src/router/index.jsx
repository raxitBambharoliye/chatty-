import { Route, createBrowserRouter, createRoutesFromChildren } from "react-router-dom";
import { Login, Register } from "../pages";
import Home from "../pages/Home";
import Private from "../components/Private";
import LogOut from "../pages/LogOut";
import { APP_URL } from "../constant";
import EmailVerify from "../pages/EmailVerify";


const router = createBrowserRouter(
    createRoutesFromChildren(
        <Route path="/" >
                {/* <Route path={APP_URL.FE_HOME} element={<Home />} /> */}

            <Route path="" element={<Login />} />
            <Route path={APP_URL.FE_REGISTER} element={<Register/>} />
            <Route path={APP_URL.FE_EMAIL_VERIFY} element={<EmailVerify/>} />
            <Route path="" element={<Private />}>
                <Route path={APP_URL.FE_HOME} element={<Home />} />
            </Route>
            <Route path={APP_URL.FE_LOGOUT} element={<LogOut/>} />
        </Route>
    )
)



export default router;