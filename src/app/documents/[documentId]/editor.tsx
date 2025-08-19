'use client';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { BulletList, ListItem } from '@tiptap/extension-list'
import { TaskItem, TaskList } from '@tiptap/extension-list'
import Heading from '@tiptap/extension-heading'
import { TableKit } from '@tiptap/extension-table'
import Image from '@tiptap/extension-image'
import FileHandler from '@tiptap/extension-file-handler'
import ImageResize from "tiptap-extension-resize-image";
import { useEditorStore } from '@/store/use-editor-store';
import { Color,TextStyleKit } from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align';
import { Ruler } from './Ruler'
const Editor = () => {
    const { setEditor } = useEditorStore();


    const editor = useEditor({
        onCreate({editor}) {
            setEditor(editor);
        },
        onDestroy() {
            setEditor(null);
        },
        onUpdate({editor}){
            setEditor(editor);
        },
        onSelectionUpdate({editor}){
            setEditor(editor);
        },
        onTransaction({editor}){
            setEditor(editor);
        },
        onFocus({editor}){
            setEditor(editor);
        },
        onBlur({editor}){
            setEditor(editor);
        },
        onContentError({editor}){
            setEditor(editor);
        },
        editorProps: {
            attributes: {
                style: 'padding-left: 56px; padding-right: 56px;',
                class: 'focus:outline-none print:border-0 bg-white  border border-[#C7C7C7] flex flex-col min-h-[1054px] w-[816px] pt-10 pr-14 pb-10 cursor-text',
            },
        },

    extensions: [
        Color, 
        
        Highlight.configure({ multicolor: true }),
        StarterKit,
        BulletList,
        ListItem,
        TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Heading,
      TableKit,
      Image,
      ImageResize.configure({
      inline: true,
    }),
       FileHandler.configure({
        allowedMimeTypes: [
          'image/png',
          'image/jpeg',
          'image/gif',
          'image/webp',
        ],
        onDrop: (currentEditor, files, pos) => {
          files.forEach((file) => {
            const fileReader = new FileReader()
            fileReader.readAsDataURL(file)
            fileReader.onload = () => {
              currentEditor
                .chain()
                .insertContentAt(pos, {
                  type: 'image',
                  attrs: { src: fileReader.result },
                })
                .focus()
                .run()
            }
          })
        },
        onPaste: (currentEditor, files, htmlContent) => {
          files.forEach((file) => {
            if (htmlContent) {
              console.log(htmlContent)
              return false
            }
            const fileReader = new FileReader()
            fileReader.readAsDataURL(file)
            fileReader.onload = () => {
              currentEditor
                .chain()
                .insertContentAt(currentEditor.state.selection.anchor, {
                  type: 'image',
                  attrs: { src: fileReader.result },
                })
                .focus()
                .run()
            }
          })
        },
      }),
      TextStyleKit,
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
        protocols: ['http', 'https'],
        isAllowedUri: (url, ctx) => {
          try {
            // construct URL
            const parsedUrl = url.includes(':') ? new URL(url) : new URL(`${ctx.defaultProtocol}://${url}`)

            // use default validation
            if (!ctx.defaultValidate(parsedUrl.href)) {
              return false
            }

            // disallowed protocols
            const disallowedProtocols = ['ftp', 'file', 'mailto']
            const protocol = parsedUrl.protocol.replace(':', '')

            if (disallowedProtocols.includes(protocol)) {
              return false
            }

            // only allow protocols specified in ctx.protocols
            const allowedProtocols = ctx.protocols.map(p => (typeof p === 'string' ? p : p.scheme))

            if (!allowedProtocols.includes(protocol)) {
              return false
            }

            // disallowed domains
            const disallowedDomains = ['example-phishing.com', 'malicious-site.net']
            const domain = parsedUrl.hostname

            if (disallowedDomains.includes(domain)) {
              return false
            }

            // all checks have passed
            return true
          } catch {
            return false
          }
        },
        shouldAutoLink: url => {
          try {
            // construct URL
            const parsedUrl = url.includes(':') ? new URL(url) : new URL(`https://${url}`)

            // only auto-link if the domain is not in the disallowed list
            const disallowedDomains = ['example-no-autolink.com', 'another-no-autolink.com']
            const domain = parsedUrl.hostname

            return !disallowedDomains.includes(domain)
          } catch {
            return false
          }
        },
      }),
       TextAlign.configure({
      types: ['heading', 'paragraph'], 
    }),

    
    ],
    content: `
        <table>
          <tbody>
            <tr>
              <th>Name</th>
              <th colspan="3">Description</th>
            </tr>
            <tr>
              <td>Cyndi Lauper</td>
              <td>Singer</td>
              <td>Songwriter</td>
              <td>Actress</td>
            </tr>
          </tbody>
        </table>

        <img src="https://placehold.co/800x400" />

        <img src="https://placehold.co/800x400/6A00F5/white" />


      `,
    // Don't render immediately on the server to avoid SSR issues
    immediatelyRender: false,
  })

    return (
        <div className="size-full overflow-x-auto px-4 bg-#f9fbfd print:p-0 print:bg-white print:overflow-visible">  
        <Ruler />
            <div className='min-w-max flex justify-center w-[816px] py-4 print:py-0 mx-auto print:w-full print:min-w-0'>
            <EditorContent editor={editor} />
            </div>
        </div>
        
    );
}

export default Editor;