import kebabCase from 'lodash.kebabcase';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import toast from 'react-hot-toast';
import AuthCheck from '../../components/AuthCheck';
import PostFeed from '../../components/PostFeed';
import { Firebase, serverTimestamp } from "../../libs/firebase";
import { useUser } from "../../libs/userContext";

export default function AdminPostsPage( props: any )
{
    return (
        <main>
            <AuthCheck>
                <PostList />
                <CreateNewPost />
            </AuthCheck>
        </main>
    );
}

function PostList()
{
    const ref = Firebase.Firestore.collection( 'users' ).doc( Firebase.Auth.currentUser?.uid ).collection( 'posts' );
    const query = ref.orderBy( 'createdAt' );
    const [ querySnapshot ] = useCollection( query );

    const posts = querySnapshot?.docs.map( ( doc ) => doc.data() );

    return (
        <>
            <h1>Manage your Posts</h1>
            <PostFeed posts={posts ?? []} admin />
        </>
    );
}

function CreateNewPost()
{
    const router = useRouter();
    const user = useUser();
    const username = user?.username
    const [ title, setTitle ] = useState( '' );

    // Ensure slug is URL safe
    const slug = encodeURI( kebabCase( title ) );

    // Validate length
    const isValid = title.length > 3 && title.length < 100;

    // Create a new post in firestore
    const createPost = async ( e: React.FormEvent<HTMLFormElement> ) =>
    {
        e.preventDefault();
        const uid = Firebase.Auth.currentUser?.uid;
        const ref = Firebase.Firestore.collection( 'users' ).doc( uid ).collection( 'posts' ).doc( slug );

        // Tip: give all fields a default value here
        const data = {
            title,
            slug,
            uid,
            username,
            published: false,
            content: '# hello world!',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            heartCount: 0,
        };

        await ref.set( data );

        toast.success( 'Post created!' )

        // Imperative navigation after doc is set
        router.push( `/admin/${slug}` );

    };

    return (
        <form onSubmit={createPost}>
            <input
                value={title}
                onChange={( e ) => setTitle( e.target.value )}
                placeholder="My Awesome Article!"
            />
            <p>
                <strong>Slug:</strong> {slug}
            </p>
            <button type="submit" disabled={!isValid} className="btn-green">
                Create New Post
            </button>
        </form>
    );
}