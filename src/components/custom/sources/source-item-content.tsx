import { DialogContent, DialogTitle, DialogDescription, DialogHeader } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { db } from '@/db'
import { Suspense } from 'react'
import { Skeleton } from '../../ui/skeleton'
import { SourceProcessing } from './source-processing'

interface SourceItemContentProps {
  sourceId: string
  name: string
}
export const SourceItemContent: React.FC<SourceItemContentProps> = ({ sourceId, name }) => {
  return (
    <DialogContent>
      <DialogHeader className='space-y-4'>
        <DialogTitle className='leading-normal tracking-normal'>{name}</DialogTitle>
        <Suspense fallback={<Skeleton className='w-full h-40' />}>
          <SourceSummary sourceId={sourceId} />
        </Suspense>
      </DialogHeader>

      <hr />

      <Suspense fallback={<SourceTopicsSkeleton />}>
        <SourceTopics sourceId={sourceId} />
      </Suspense>
    </DialogContent>
  )
}

const SourceSummary = async ({ sourceId }: { sourceId: string }) => {
  const summary = await db.query.sourceSummaries.findFirst({
    where: (t, h) => h.eq(t.sourceId, sourceId),
  })

  return <DialogDescription>{summary?.summary}</DialogDescription>
}

const SourceTopics = async ({ sourceId }: { sourceId: string }) => {
  const topics = await db.query.sourceTopics.findMany({
    where: (t, h) => h.eq(t.sourceId, sourceId),
  })

  return (
    <div className='flex flex-wrap gap-2'>
      {topics?.map(topic => (
        <Badge variant='default' key={topic.id}>
          {topic.topic}
        </Badge>
      ))}
    </div>
  )
}

const SourceTopicsSkeleton = () => {
  return (
    <div className='flex flex-wrap gap-2'>
      {Array.from({ length: 10 }).map((_, i) => (
        <Skeleton key={i} className='w-20 h-6' />
      ))}
    </div>
  )
}

export const SourceProcessingWrapper = async ({ sourceId }: { sourceId: string }) => {
  // const res = await db.query.parsingJobs.findFirst({
  //   where: (t, h) => h.eq(t.sourceId, sourceId),
  //   with: {
  //     source: {
  //       columns: {
  //         notebookId: true,
  //         name: true,
  //         processingStatus: true,
  //       },
  //     },
  //   },
  // })
  const res = await db.query.notebooks.findFirst({
    with: {
      sources: {
        where: (t, o) => o.eq(t.id, sourceId),
        limit: 1,
      },
    },
  })

  if (!res) return null

  const props = {
    jobId: '',
    id: res.id,
    notebookId: res.id,
    sourceId,
    sourceName: res.sources[0].name,
    processingStatus: res.sources[0].processingStatus,
  }

  return <SourceProcessing {...props} />
}
