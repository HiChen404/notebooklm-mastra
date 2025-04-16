import { pollJobStatusAction } from '@/actions/sources/poll-job-status-action'
import { summarizeSourceAction } from '@/actions/sources/summarize-source-action'
import { SourceProcessingStatus } from '@/db/schema/sources'
import { useAction } from 'next-safe-action/hooks'
import { useEffect } from 'react'

export const usePollForParsingJobStatus = ({
  jobId,
  notebookId,
  processingStatus,
  sourceId,
}: {
  jobId: string
  notebookId: string
  processingStatus: SourceProcessingStatus
  sourceId: string
  sourceName: string
}) => {
  const { execute: pollJobStatus } = useAction(pollJobStatusAction)

  useEffect(() => {
    if (processingStatus !== 'queued') return

    const intervalId = setInterval(() => pollJobStatus({ jobId, notebookId, sourceId }), 5000)

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [jobId, notebookId, pollJobStatus, processingStatus, sourceId])
}

export const useSummarizeSource = ({
  id,
  notebookId,
  processingStatus,
  sourceId,
}: {
  id: string
  notebookId: string
  processingStatus: SourceProcessingStatus
  sourceId: string
  sourceName: string
}) => {
  const { execute: summarizeSource } = useAction(summarizeSourceAction, {})

  useEffect(() => {
    if (processingStatus === 'parsed') {
      summarizeSource({ sourceId, id, notebookId })
    }
  }, [id, notebookId, processingStatus, sourceId, summarizeSource])
}

export const useProcessSource = ({
  jobId,
  notebookId,
  processingStatus,
  sourceId,
  sourceName,
  id,
}: {
  jobId: string
  id: string
  notebookId: string
  processingStatus: SourceProcessingStatus
  sourceId: string
  sourceName: string
}) => {
  usePollForParsingJobStatus({
    jobId,
    notebookId,
    processingStatus,
    sourceId,
    sourceName,
  })

  useSummarizeSource({
    id,
    notebookId,
    processingStatus,
    sourceId,
    sourceName,
  })
}
