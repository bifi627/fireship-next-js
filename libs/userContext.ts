import firebase from "firebase/app";
import { createContext, useContext } from "react";

export interface AppUser
{
    firebaseUser: firebase.User;
    username: string;
}

export const UserContext = createContext<AppUser | undefined>( undefined );

export const useUser = () =>
{
    return useContext( UserContext );
}
