import { LoaderFunction, ActionFunction,
  json, redirect }                              from '@remix-run/node'
import { useActionData, useLoaderData }         from '@remix-run/react'
import { getPostById, updatePost }              from '~/utils/post.server'
import { Modal }                                from "~/components/modal"
import React, { useState, useRef }              from "react"
import { FormField }                            from "~/components/form-field"
import { ClientOnly }                           from "remix-utils"
import { Editor }                               from '@tinymce/tinymce-react'

export const loader: LoaderFunction = async ({ request, params }) => {
  const { postId } = params
  
  if (typeof postId !== 'string') {
    return redirect('/home')
  }
  
  const post = await getPostById(postId)
  return json({ post })
}

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData()
  const id = form.get('id')
  const link = form.get('link')
  const title = form.get('title')
  const content = form.get('content')
  
  return await updatePost({id, link, title, content}) && redirect('/home')
}

export default function PostModal() {
  const editorRef = useRef(null)
  const { post } = useLoaderData()
  const actionData = useActionData()
  const [formError] = useState(actionData?.error || '')
  const [formData, setFormData] = useState({
    id: post.id,
    link: post.link || actionData?.fields?.link || '',
    title: post.title || actionData?.fields?.title || '',
    content: post.content || actionData?.fields?.content || '',
    //creator: post.creator || actionData?.fields?.creator || '',
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
      <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">Edit selected post</h3>
      <form method="post" className="space-y-6">
        <input type="hidden" name="id" value={formData.id} />
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
          <ClientOnly fallback="">
            { () => (
              <Editor
                onInit={(evt, editor) => editorRef.current = editor}
                initialValue={post.content}
                init={{
                  height: 500,
                  menubar: false,
                  //plugins: [
                  //  'advlist autolink lists link image charmap print preview anchor',
                  //  'searchreplace visualblocks code fullscreen',
                  //  'insertdatetime media table paste code help wordcount'
                  //],
                  //toolbar: 'undo redo | formatselect | ' +
                  //  'bold italic backcolor | alignleft aligncenter ' +
                  //  'alignright alignjustify | bullist numlist outdent indent | ' +
                  //  'removeformat | help',
                  //content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                }}
                onEditorChange={e => handleEditorChange(e, 'content')}
              />
            ) }
          </ClientOnly>
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
