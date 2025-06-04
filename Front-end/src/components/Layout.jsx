import { Chat } from "./Chat"
import { Sidebar } from "./Sidebar"
import { Outlet } from 'react-router-dom';

export const Layout = ()=>{
    return(
        <>
            <Sidebar></Sidebar>
            <Outlet />
        </>
    )
}