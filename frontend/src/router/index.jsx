import { Route, createBrowserRouter, createRoutesFromChildren } from "react-router-dom";
import { Login } from "../pages";
import Footer from "../components/Footer";


const router = createBrowserRouter(
    createRoutesFromChildren(
        <Route path="/" >
            <Route path="" element={<Login />} />
            <Route path="/test" element={<Footer/>}/>
        </Route>
    )
)



export default router;