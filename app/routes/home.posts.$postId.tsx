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
  const [modalIsOpen, setModalIsOpen] = useState(true)
  
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setFormData(form => ({...form, [field]: event.target.value}))
  }
  
  const handleEditorChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
    setFormData(form => ({ ...form, [field]: event }))
  }
  
  const hideModal = () => {
    setModalIsOpen(false)
  }
  
  return (
    <Modal isOpen={ modalIsOpen } className="w-2/3 p-10">
      <div className="text-xs font-semibold text-center tracking-wide text-red-500 w-full mb-2">{ formError }</div>
      <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">Edit selected post</h3>
      <button
        type="button"
        className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
        data-modal-hide="authentication-modal"
        onClick={ hideModal }
      >
        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
             xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"></path>
        </svg>
        <span className="sr-only">Close modal</span>
      </button>
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
