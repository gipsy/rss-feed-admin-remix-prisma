import { ClientOnly } from "remix-utils";
import { Editor }        from "@tinymce/tinymce-react";
import React, { useRef } from "react";

interface TinyMceEditorProps {
  onChange?: (...args: any) => any
}

export function TinyMceEditor({
  onChange = () => {},
}: TinyMceEditorProps) {
  const editorRef = useRef(null)
  
  return (
    <ClientOnly fallback="">
      { () => (
        <Editor
          apiKey={window.ENV.TINYMCE_API_KEY}
          onInit={(evt, editor) => editorRef.current = editor}
          init={{
            height: 500,
            menubar: false,
            plugins: 'lists link image code help',
            toolbar: 'undo redo | link image | code | blocks | bold italic | alignleft aligncenter alignright' +
              ' alignjustify' +
              ' |' +
              ' bullist numlist outdent indent | help'
          }}
          onEditorChange={e => onChange(e, 'content')}
        />
      ) }
    </ClientOnly>
  )
}
