'use client'
import { useRef } from 'react'

import { cn } from '@/lib/utils'
import { Editor } from '@tinymce/tinymce-react'

export interface TextEditorProps {
  label?: string
  setFieldValue?: (field?: any, name?: any, shouldValidate?: boolean) => void
  value?: string
  required?: boolean
  name?: string
  uploader?: 'webhusl' | 'default'
  skin?: 'oxide' | 'oxide-dark'
}

const webHuslAssetUploader = (blobInfo: any, progress: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.withCredentials = false
    const url = process.env.WEBHUSL_API_URL + '/blogs/upload_image?token=' + process.env.WEBHUSL_API_MASTER_KEY
    xhr.open('POST', url)
    xhr.upload.onprogress = function (e) {
      progress((e.loaded / e.total) * 100)
    }
    xhr.onload = function () {
      if (xhr.status < 200 || xhr.status >= 300 || xhr.status === 403) {
        reject('HTTP Error: ' + xhr.status)
        return
      }
      const json = JSON.parse(xhr.responseText)
      if (!json || typeof json.location != 'string') {
        reject('Invalid JSON: ' + xhr.responseText)
        return
      }
      resolve(json.location)
    }
    xhr.onerror = function () {
      reject('Image upload failed due to a XHR Transport error. Code: ' + xhr.status)
    }
    const formData = new FormData()
    formData.append('file', blobInfo.blob(), blobInfo.filename())

    xhr.send(formData)
  })
}
const defaultAssetUploader = (blobInfo: any, progress: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.withCredentials = false
    const url = process.env.API_URL + '/files/upload'
    xhr.open('POST', url)
    xhr.upload.onprogress = function (e) {
      progress((e.loaded / e.total) * 100)
    }
    xhr.onload = function () {
      if (xhr.status < 200 || xhr.status >= 300 || xhr.status === 403) {
        reject('HTTP Error: ' + xhr.status)
        return
      }
      const json = JSON.parse(xhr.responseText)
      if (!json || typeof json?.data?.url != 'string') {
        reject('Invalid JSON: ' + xhr.responseText)
        return
      }
      resolve(json?.data?.url)
    }
    xhr.onerror = function () {
      reject('Image upload failed due to a XHR Transport error. Code: ' + xhr.status)
    }
    const formData = new FormData()
    formData.append('file', blobInfo.blob(), blobInfo.filename())

    xhr.send(formData)
  })
}
export const TextEditor: React.FC<TextEditorProps> = ({
  label,
  setFieldValue,
  value,
  name,
  required,
  uploader = 'default',
  skin = 'oxide-dark'
}) => {
  const editorRef = useRef<any>(null)

  const uploadHandler = (blobInfo: any, progress: any): Promise<string> => {
    if (uploader === 'webhusl') {
      return webHuslAssetUploader(blobInfo, progress)
    }
    return defaultAssetUploader(blobInfo, progress)
  }

  return (
    <div className="flex flex-col">
      {label && (
        <label className={cn('text-sm text-left')}>
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <Editor
        apiKey={process.env.TINYMCE_API_KEY}
        onInit={(_, editor) => (editorRef.current = editor)}
        initialValue={value}
        onChange={(props) => setFieldValue?.(name, props.target.getContent())}
        init={{
          height: 300,
          menubar: false,
          skin,
          content_css: 'dark',
          plugins: [
            'advlist',
            'autolink',
            'lists',
            'link',
            'image',
            'charmap',
            'preview',
            'anchor',
            'searchreplace',
            'visualblocks',
            'fullscreen',
            'insertdatetime',
            'media',
            'table',
            'help',
            'wordcount'
          ],
          toolbar:
            'undo redo | casechange blocks | bold italic backcolor | link | ' +
            'alignleft aligncenter alignright alignjustify | ' +
            'bullist numlist checklist outdent indent | removeformat | image code table help',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
          images_upload_handler: uploadHandler
        }}
      />
    </div>
  )
}
