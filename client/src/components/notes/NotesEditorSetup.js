import React, { useEffect } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import Document from '@tiptap/extension-document'
import Heading from '@tiptap/extension-heading'
import Image from '@tiptap/extension-image'
import Paragraph from '@tiptap/extension-paragraph'
import TextStyle from '@tiptap/extension-text-style'
import Text from '@tiptap/extension-text'
import Bold from '@tiptap/extension-bold'
import Highlight from '@tiptap/extension-highlight'
import Italic from '@tiptap/extension-italic'
import Underline from '@tiptap/extension-underline'
import CharacterCount from '@tiptap/extension-character-count'
import { Color } from '@tiptap/extension-color'
import Placeholder from '@tiptap/extension-placeholder'
import History from '@tiptap/extension-history'

const MenuBar = ({ editor }) => {

    if (!editor) return null

    return (
        <div className="relative">
            <div className="control-group flex fixed bottom-6 right-32 z-10">
                <div className="button-group flex justfiy-start gap-4 p-4 bg-gray-50 rounded-lg shadow-md">
                    <div className='flex flex-col gap-1'>
                        <h2 className='text-sm text-gray-500'>
                            Headings
                        </h2>
                        <div className='flex gap-2 text-sm'>
                            <button
                                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                                className={`px-3 py-1 rounded-md transition ${editor.isActive('heading', { level: 1 })
                                    ? 'bg-fuchsia-500 text-white font-bold'
                                    : 'bg-gray-200 text-black hover:bg-gray-300'
                                    }`}
                            >
                                H<sub>1</sub>
                            </button>
                            <button
                                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                                className={`px-3 py-1 rounded-md transition ${editor.isActive('heading', { level: 2 })
                                    ? 'bg-fuchsia-500 text-white font-bold'
                                    : 'bg-gray-200 text-black hover:bg-gray-300'
                                    }`}
                            >
                                H<sub>2</sub>
                            </button>
                            <button
                                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                                className={`px-3 py-1 rounded-md transition ${editor.isActive('heading', { level: 3 })
                                    ? 'bg-fuchsia-500 text-white font-bold'
                                    : 'bg-gray-200 text-black hover:bg-gray-300'
                                    }`}
                            >
                                H<sub>3</sub>
                            </button>
                        </div>
                    </div>
                    <div className='flex flex-col gap-1'>
                        <h2 className='text-sm text-gray-500'>
                            Text Color
                        </h2>
                        <div className='flex gap-2 text-sm'>
                            <button
                                onClick={() => editor.chain().focus().setColor('#e63946').run()}
                                className={`px-3 py-1 rounded-md transition ${editor.isActive('textStyle', { color: '#e63946' })
                                    ? 'bg-[#e63946] text-white'
                                    : 'bg-gray-200 text-black hover:bg-gray-300'
                                    }`}
                            >
                                Red
                            </button>
                            <button
                                onClick={() => editor.chain().focus().setColor('#2a9d8f').run()}
                                className={`px-3 py-1 rounded-md transition ${editor.isActive('textStyle', { color: '#2a9d8f' })
                                    ? 'bg-[#2a9d8f] text-white'
                                    : 'bg-gray-200 text-black hover:bg-gray-300'
                                    }`}
                            >
                                Green
                            </button>
                            <button
                                onClick={() => editor.chain().focus().setColor('#457b9d').run()}
                                className={`px-3 py-1 rounded-md transition ${editor.isActive('textStyle', { color: '#457b9d' })
                                    ? 'bg-[#457b9d] text-white'
                                    : 'bg-gray-200 text-black hover:bg-gray-300'
                                    }`}
                            >
                                Blue
                            </button>
                            <button
                                onClick={() => editor.chain().focus().setColor('#333333').run()}
                                className={`px-3 py-1 rounded-md transition ${editor.isActive('textStyle', { color: '#333333' })
                                    ? 'bg-[#333333] text-white'
                                    : 'bg-gray-200 text-black hover:bg-gray-300'
                                    }`}
                            >
                                Black
                            </button>
                        </div>
                    </div>
                    <div className='flex flex-col gap-1'>
                        <h2 className='text-sm text-gray-500'>
                            Text Styles
                        </h2>
                        <div className='flex gap-2 text-sm'>
                            <button
                                onClick={() => editor.chain().focus().toggleBold().run()}
                                disabled={
                                    !editor.can()
                                        .chain()
                                        .focus()
                                        .toggleBold()
                                        .run()
                                }
                                className={`px-3 py-1 rounded-md transition font-bold ${editor.isActive('bold')
                                    ? 'bg-fuchsia-500 text-white font-bold'
                                    : 'bg-gray-200 text-black hover:bg-gray-300'
                                    }`}
                            >
                                Bold
                            </button>
                            <button
                                onClick={() => editor.chain().focus().toggleItalic().run()}
                                disabled={
                                    !editor.can()
                                        .chain()
                                        .focus()
                                        .toggleItalic()
                                        .run()
                                }
                                className={`px-3 py-1 rounded-md transition italic ${editor.isActive('italic')
                                    ? 'bg-fuchsia-500 text-white font-bold'
                                    : 'bg-gray-200 text-black hover:bg-gray-300'
                                    }`}
                            >
                                Italic
                            </button>
                            <button
                                onClick={() => editor.chain().focus().toggleUnderline().run()}
                                className={`px-3 py-1 rounded-md transition underline underline-offset-2 ${editor.isActive('underline')
                                    ? 'bg-fuchsia-500 text-white font-bold'
                                    : 'bg-gray-200 text-black hover:bg-gray-300'
                                    }`}
                            >
                                Underline
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

const NotesEditorSetup = ({ content, setContent }) => {
    const editor = useEditor({
        extensions:
            [
                Document, Image, Paragraph, Text, Bold, Highlight, Italic, Underline, TextStyle, Color,
                Heading.configure({ levels: [1, 2, 3] }),
                CharacterCount.configure({ limit: 1000 }),
                Placeholder.configure({ placeholder: 'Start typing...' }),
                History.configure({ depth: 15 })
            ],
        content: content,
        onUpdate: ({ editor }) => {
            setContent(editor.getJSON());
        }
    });

    useEffect(() => {
        if (editor && content !== editor.getJSON()) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    return (
        <>
            {editor && <MenuBar editor={editor} />}
            <EditorContent editor={editor} />
        </>
    )
};

export default NotesEditorSetup;