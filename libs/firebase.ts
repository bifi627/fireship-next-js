import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyA9Em7aUiMozzPvfRnmuxV5IAvI8dIYZkk",
    authDomain: "fireship-next-js-d2535.firebaseapp.com",
    projectId: "fireship-next-js-d2535",
    storageBucket: "fireship-next-js-d2535.appspot.com",
    messagingSenderId: "1069819867599",
    appId: "1:1069819867599:web:93e806738259efbe5122ba"
};


if ( !firebase.apps.length )
{
    firebase.initializeApp( firebaseConfig )
}

export module Firebase
{
    export const Auth = firebase.auth();
    export const Firestore = firebase.firestore();
    export const Storage = firebase.storage();
}

/**`
 * Gets a users/{uid} document with username
 * @param  {string} username
 */
export async function getUserWithUsername( username: string )
{
    const usersRef = Firebase.Firestore.collection( 'users' );
    const query = usersRef.where( 'username', '==', username ).limit( 1 );
    const userDoc = ( await query.get() ).docs[ 0 ];
    return userDoc;
}

/**`
 * Converts a firestore document to JSON
 * @param  {DocumentSnapshot} doc
 */
export function postToJSON( doc: any )
{
    const data = doc.data();
    return {
        ...data,
        // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
        createdAt: data.createdAt.toMillis(),
        updatedAt: data.updatedAt.toMillis(),
    };
}

export const fromMillis = firebase.firestore.Timestamp.fromMillis;

export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;
