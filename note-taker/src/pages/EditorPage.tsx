import { useParams } from 'react-router-dom'

export function EditorPage() {
  const { id } = useParams()

  return (
    <section aria-labelledby="editor-heading">
      <h1 id="editor-heading">Editor</h1>
      <p>
        {id !== undefined
          ? `Editing note ${id}.`
          : 'Create a new note or pick one from the list.'}
      </p>
    </section>
  )
}
