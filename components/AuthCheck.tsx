import Link from 'next/link';
import { useUser } from "../libs/userContext";

// Component's children only shown to logged-in users
export default function AuthCheck( props: any )
{
    const user = useUser();

    console.log( user );

    return user?.username ? props.children : props.fallback || <Link href="/enter">You must be signed in</Link>;
}