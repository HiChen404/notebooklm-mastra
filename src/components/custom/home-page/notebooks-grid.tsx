import { db } from '@/db'
import { Feature, FEATURES } from './feature'
import { NotebookContent } from './notebook-content'

interface NotebooksGridProps {
  sessionId: string
}

export const NotebooksGrid: React.FC<NotebooksGridProps> = async ({ sessionId }) => {
  const notebooks = await db.query.notebooks.findMany({
    where: (t, h) => h.eq(t.userId, sessionId),
    columns: {
      id: true,
      name: true,
      title: true,
      emoji: true,
      summary: true,
    },
  })

  const hasNotebooks = notebooks.length > 0

  if (!hasNotebooks) {
    return (
      <div className='gap-4 grid grid-cols-1 md:grid-cols-3 mb-14 p-4'>
        {FEATURES.map(feat => (
          <Feature key={feat.text} {...feat} />
        ))}
      </div>
    )
  }

  return <NotebookContent notebooks={notebooks} />
}
