import Link from "next/link";
import React from "react";
import { useUser } from "../libs/userContext";

export default () =>
{
    const user = useUser();

    console.log( user );

    return (
        <nav className="navbar">
            <ul>
                <li>
                    <Link href="/">
                        <button className="btn-logo">{"Feed"}</button>
                    </Link>
                </li>

                {user?.firebaseUser && (
                    <>
                        <li className="push-left">
                            <Link href="/admin">
                                <button className="btn-blue">{"Write Posts"}</button>
                            </Link>
                        </li>

                        <li>
                            <Link href={`/${user.username}`}>
                                <img src={user.firebaseUser?.photoURL ?? ""}></img>
                            </Link>
                        </li>
                    </>
                )}
                {!user?.firebaseUser && (
                    <li>
                        <Link href="/enter">
                            <button className="btn-blue">{"Login"}</button>
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    );
}
