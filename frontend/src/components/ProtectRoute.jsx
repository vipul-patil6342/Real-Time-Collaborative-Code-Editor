import React from 'react'
import { useSelector } from 'react-redux'
import Loader from './Loader';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectRoute = () => {
    const { user, isAuthenticated, loading } = useSelector(state => state.auth);
    return (
        <>
            {loading && <Loader />}

            {!isAuthenticated && !loading && (
                <Navigate to="/login" replace />
            )}

            {isAuthenticated && <Outlet />}
        </>
    )
}

export default ProtectRoute