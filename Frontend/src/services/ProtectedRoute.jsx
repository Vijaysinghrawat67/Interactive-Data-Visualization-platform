import { Navigate, Outlet } from "react-router-dom";
import {isAuthenticated} from "@/services/auth.js";


export default function ProtectedRoute(){
    return isAuthenticated() ? <Outlet/> : <Navigate to="/login" />
}