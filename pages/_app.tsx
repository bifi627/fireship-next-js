import type { AppProps } from 'next/app'
import React from "react"
import { Toaster } from "react-hot-toast"
import Navbar from "../components/Navbar"
import useUserDate from "../hooks/useUserDate"
import { UserContext } from "../libs/userContext"
import '../styles/globals.css'


function MyApp( { Component, pageProps }: AppProps )
{
    const appUser = useUserDate();

    return (
        <UserContext.Provider value={appUser}>
            <Navbar></Navbar>
            <Component {...pageProps} />
            <Toaster></Toaster>
        </UserContext.Provider>
    )
}

export default MyApp
