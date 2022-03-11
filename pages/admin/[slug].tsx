import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import AuthCheck from '../../components/AuthCheck';
import { Firebase, serverTimestamp } from "../../libs/firebase";

export default function AdminPostEdit( props: any )
{
    return (
        <AuthCheck>
            <PostManager />
        </AuthCheck>
    );
}

function PostManager()
{
    const [ preview, setPreview ] = useState( false );

    const router = useRouter();
    const { slug } = router.query;

    const postRef = Firebase.Firestore.collection( 'users' ).doc( Firebase.Auth.currentUser?.uid ).collection( 'posts' ).doc( Array.isArray( slug ) ? slug[ 0 ] : slug );
    const [ post ] = useDocumentData( postRef );

    return (
        <main>
            {post && (
                <>
                    <section>
                        <h1>{post.title}</h1>
                        <p>ID: {post.slug}</p>

                        <PostForm postRef={postRef} defaultValues={post} preview={preview} />
                    </section>

                    <aside>
                        <h3>Tools</h3>
                        <button onClick={() => setPreview( !preview )}>{preview ? 'Edit' : 'Preview'}</button>
                        <Link href={`/${post.username}/${post.slug}`}>
                            <button className="btn-blue">Live view</button>
                        </Link>
                    </aside>
                </>
            )}
        </main>
    );
}

function PostForm( { defaultValues, postRef, preview }: any )
{
    const { register, handleSubmit, reset, watch, formState } = useForm( { defaultValues, mode: 'onChange' } );

    const { isValid, isDirty, errors } = formState;

    const updatePost = async ( { content, published }: any ) =>
    {
        await postRef.update( {
            content,
            published,
            updatedAt: serverTimestamp(),
        } );

        reset( { content, published } );

        toast.success( 'Post updated successfully!' )
    };

    return (
        <form onSubmit={handleSubmit( updatePost )}>
            {preview && (
                <div className="card">
                    <ReactMarkdown>{watch( 'content' )}</ReactMarkdown>
                </div>
            )}

            <div>

                <textarea {...register( "content", {
                    maxLength: {
                        value: 20000, message: "content is too long",
                    },
                    minLength: {
                        value: 10, message: "content is too short",
                    },
                    required: {
                        value: true, message: "content is required"
                    }
                } )}></textarea>

                {errors.content && <p className="text-danger">{errors.content.message}</p>}

                <fieldset>
                    <input type="checkbox"  {...register( "published" )} />
                    <label>Published</label>
                </fieldset>

                <button type="submit" disabled={!isDirty || !isValid} className="btn-green">
                    Save Changes
                </button>
            </div>
        </form>
    );
}