import {
  LoaderFunction, ActionFunction,
  json, redirect, ActionArgs
}                                       from '@remix-run/node'
import { useActionData, useLoaderData } from '@remix-run/react'
import { getPostById, updatePost }      from '~/utils/post.server'
import { Modal }                        from "~/components/modal"
import React, { useState }              from "react"
import { FormField }                    from "~/components/form-field"
import { TinyMceEditor }                from "~/components/tiny-mce-editor";
import { Post }                         from "~/utils/types.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  const { postId } = params
  
  if (typeof postId !== 'string') {
    return redirect('/home')
  }
  
  const post = await getPostById(postId)
  return json({ post })
}

export const action: ActionFunction = async ({ request }: ActionArgs) => {
  const form = await request.formData()
  const id = form.get('id')
  const link = form.get('link')
  const title = form.get('title')
  const content = form.get('content')
  
  return await updatePost({id, link, title, content}) && redirect('/home')
}

export default function PostModal() {
  const { post } = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()
  const [formError] = useState(actionData?.error || '')
  const [formData, setFormData] = useState({
    link: post.link || actionData?.fields?.link || '',
    title: post.title || actionData?.fields?.title || '',
    content: post.content || actionData?.fields?.content || '',
  })
  
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setFormData(form => ({...form, [field]: event.target.value}))
  }
  
  const handleEditorChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
    setFormData(form => ({ ...form, [field]: event }))
  }
  
  return (
    <Modal isOpen={ true } className="w-2/3 p-10">
      <div className="text-xs font-semibold text-center tracking-wide text-red-500 w-full mb-2">{ formError }</div>
      <div className="flex flex-row">
        <h3 className="flex-1 text-xl font-medium text-gray-900">Edit selected post</h3>
        <form
          style={{width: '100px'}}
          action={`/home/posts/unpublish/${post.id}`}
          method="post"
        >
          <button
            type="submit"
            className="rounded-xl bg-red-900 font-semibold text-white w-full h-12 transition duration-300 ease-in-out hover:bg-red-700 hover:-translate-y-1"
          >
            Unpublish
          </button>
        </form>
      </div>
      <form method="post" className="space-y-6">
        <input type="hidden" name="id" value={post.id}/>
        <input type="hidden" name="content" value={formData.content} />
        <div>
          <FormField
            htmlFor="title"
            label="Title"
            onChange={ e => handleInputChange( e, 'title' ) }
            value={ formData.title }
          />
        </div>
        <div>
          <TinyMceEditor
            onChange={e => handleEditorChange( e, 'content' )}
            initialValue={post.content}
          />
        </div>
        <div>
          <FormField
            htmlFor="link"
            label="Link"
            onChange={ e => handleInputChange( e, 'link' ) }
            value={ formData.link }
          />
        </div>
        <div>
          <button
            type="submit"
            className="rounded-xl bg-yellow-300 font-semibold text-blue-600 w-full h-12 transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1"
          >
            Update
          </button>
        </div>
      </form>
    </Modal>
  );
}
