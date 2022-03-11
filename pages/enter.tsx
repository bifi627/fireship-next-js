import debounce from "debounce";
import firebase from "firebase";
import { useCallback, useEffect, useState } from "react";
import { Firebase } from "../libs/firebase";
import { useUser } from "../libs/userContext";

const EnterPage = () =>
{
    const user = useUser();

    if ( user && user.firebaseUser && user.username !== "" )
    {
        return <SignOutButton></SignOutButton>;
    }

    if ( user && user.firebaseUser && user.username === "" )
    {
        return <UsernameForm></UsernameForm>;
    }

    return <SignInButton></SignInButton>;
};

const SignInButton = () =>
{
    return (
        <button className="btn-google" onClick={async () =>
        {
            await Firebase.Auth.signInWithPopup( new firebase.auth.GoogleAuthProvider() );
        }}>
            {"Google Login"}
        </button>
    );
}
const SignOutButton = () =>
{
    return (
        <button onClick={async () =>
        {
            await Firebase.Auth.signOut();
        }}>Signout</button>
    );
}

const UsernameForm = () => 
{
    const [ formValue, setFormValue ] = useState( '' );
    const [ isValid, setIsValid ] = useState( false );
    const [ loading, setLoading ] = useState( false );

    const user = useUser();

    if ( user === undefined || user?.firebaseUser === undefined )
    {
        return <></>;
    }

    const onSubmit = async ( e: React.FormEvent<HTMLFormElement> ) =>
    {
        e.preventDefault();

        // Create refs for both documents
        const userDoc = Firebase.Firestore.doc( `users/${user.firebaseUser.uid}` );
        const usernameDoc = Firebase.Firestore.doc( `usernames/${formValue}` );

        // Commit both docs together as a batch write.
        const batch = Firebase.Firestore.batch();
        batch.set( userDoc, { username: formValue, photoURL: user.firebaseUser.photoURL, displayName: user.firebaseUser.displayName } );
        batch.set( usernameDoc, { uid: user.firebaseUser.uid } );

        await batch.commit();
    };

    const onChange = ( e: React.ChangeEvent<HTMLInputElement> ) =>
    {
        // Force form value typed in form to match correct format
        const val = e.target.value.toLowerCase();
        const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

        // Only set form value if length is < 3 OR it passes regex
        if ( val.length < 3 )
        {
            setFormValue( val );
            setLoading( false );
            setIsValid( false );
        }

        if ( re.test( val ) )
        {
            setFormValue( val );
            setLoading( true );
            setIsValid( false );
        }
    };

    //

    useEffect( () =>
    {
        checkUsername( formValue );
    }, [ formValue ] );

    // Hit the database for username match after each debounced change
    // useCallback is required for debounce to work
    const checkUsername = useCallback(
        debounce( async ( username: string ) =>
        {
            if ( username.length >= 3 )
            {
                const ref = Firebase.Firestore.doc( `usernames/${username}` );
                const { exists } = await ref.get();
                console.log( 'Firestore read executed!' );
                setIsValid( !exists );
                setLoading( false );
            }
        }, 500 ),
        []
    );

    return (
        <>
            {!user.username &&
                <section>
                    <h3>Choose Username</h3>
                    <form onSubmit={onSubmit}>
                        <input name="username" placeholder="myname" value={formValue} onChange={onChange} />
                        {/* <UsernameMessage username={formValue} isValid={isValid} loading={loading} /> */}
                        <button type="submit" className="btn-green" disabled={!isValid}>
                            Choose
                        </button>

                        <h3>Debug State</h3>
                        <div>
                            Username: {formValue}
                            <br />
                            Loading: {loading.toString()}
                            <br />
                            Username Valid: {isValid.toString()}
                        </div>
                    </form>
                </section>}
        </>
    );
}

export default EnterPage;

