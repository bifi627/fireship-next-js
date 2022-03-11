import { useDocumentData } from 'react-firebase-hooks/firestore';
import Metatags from "../../components/Metatabs";
import PostContent from "../../components/PostContent";
import { Firebase, getUserWithUsername, postToJSON } from "../../libs/firebase";


export async function getStaticProps( { params }: any )
{
    const { username, slug } = params;
    const userDoc = await getUserWithUsername( username );

    let post;
    let path;

    if ( userDoc )
    {
        const postRef = userDoc.ref.collection( 'posts' ).doc( slug );

        const data = await postRef.get();

        if ( !data.exists )
        {
            return {
                notFound: true,
            }
        }

        post = postToJSON( data );

        path = postRef.path;
    }
    else
    {
        return {
            notFound: true,
        }
    }

    return {
        props: { post, path },
        revalidate: 5000,
    };
}

export async function getStaticPaths()
{
    // Improve my using Admin SDK to select empty docs
    const snapshot = await Firebase.Firestore.collectionGroup( 'posts' ).get();

    const paths = snapshot.docs.map( ( doc: any ) =>
    {
        const { slug, username } = doc.data();
        return {
            params: { username, slug },
        };
    } );

    return {
        // must be in this format:
        // paths: [
        //   { params: { username, slug }}
        // ],
        paths,
        fallback: 'blocking',
    };
}


export default function Post( props: any )
{
    const postRef = Firebase.Firestore.doc( props.path );
    const [ realtimePost ] = useDocumentData( postRef );

    const post = realtimePost || props.post;

    return (
        <main>
            <Metatags title={post?.title}></Metatags>
            <section>
                <PostContent post={post} />
            </section>

            <aside className="card">
                <p>
                    <strong>{post.heartCount || 0} 🤍</strong>
                </p>

            </aside>
        </main>
    );
}