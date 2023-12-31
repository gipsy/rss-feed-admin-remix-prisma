import { Modal }                        from "~/components/modal";
import { LoaderFunction, ActionFunction,
  json, redirect }                      from "@remix-run/node";
import { createPost }                   from "~/utils/post.server";
import React, { useState }              from "react";
import { useActionData, useLoaderData } from "@remix-run/react";
import { FormField }                    from "~/components/form-field";
import { getUser }                      from "~/utils/auth.server";
import { TinyMceEditor }                from "~/components/tiny-mce-editor";

export const loader: LoaderFunction = async ({ request }) => {
  return json(await getUser(request))
}

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData()
  const title = form.get('title')
  const content = form.get('content')
  const link = form.get('link')
  const creator = form.get('creator')
  
  const url = new URL(request.url)
  const filter = url.searchParams.get('filter')
  return await createPost({title, content, link, creator, published: true})
    && redirect(`/home${ !!filter ? '?filter=' + filter : '' }`)
}

export default function PostModal() {
  const { profile } = useLoaderData()
  const actionData = useActionData()
  
  const [formError] = useState(actionData?.error || '')
  const [formData, setFormData] = useState({
    link: actionData?.fields?.link || '',
    title: actionData?.fields?.title || '',
    content: actionData?.fields?.content || '',
    creator: actionData?.fields?.creator || '',
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
      <h3 className="mb-4 text-xl font-medium text-gray-900">Create the new post</h3>
      <form method="post" className="space-y-6">
        <input type="hidden" name="content" value={formData.content} />
        <input type="hidden" name="creator" value={`${profile.firstName} ${profile.lastName}`} />
        <div>
          <FormField
            htmlFor="title"
            label="Title"
            onChange={ e => handleInputChange( e, 'title' ) }
            placeholder="Please enter a title..."
            value={ formData.title }
          />
        </div>
        <div>
          <TinyMceEditor
            onChange={e => handleEditorChange( e, 'content' )}
          />
        </div>
        <div>
          <FormField
            htmlFor="link"
            label="Link"
            onChange={ e => handleInputChange( e, 'link' ) }
            placeholder="Post URL should go here..."
            value={ formData.link }
          />
        </div>
        <div>
          <button
            type="submit"
            className="rounded-xl bg-yellow-300 font-semibold text-blue-600 w-full h-12 transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1"
          >
            Create
          </button>
        </div>
      </form>
    </Modal>
  )
}
