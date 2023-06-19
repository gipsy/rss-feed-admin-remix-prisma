import { json, LoaderFunction, redirect } from '@remix-run/node'
import { useLoaderData }                  from '@remix-run/react'
import { getPostById }                    from '~/utils/post.server'
import { Portal }                         from "~/components/portal";
import { Modal }                          from "~/components/modal";

export const loader: LoaderFunction = async ({ request, params }) => {
  const { postId } = params
  
  if (typeof postId !== 'string') {
    return redirect('/home')
  }
  
  const post = await getPostById(postId)
  return json({ post })
}

export default function PostModal() {
  const { post } = useLoaderData()
  return (
    <Modal isOpen={true} className="w-2/3 p-10">
      <h2> Post: {post.id} </h2>
    </Modal>
  )
}
