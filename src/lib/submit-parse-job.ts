import { db } from '@/db'
import { notebooks } from '@/db/schema/notebooks'
import { parsingStatus } from '@/db/schema/sources'
import { randomUUID } from 'crypto'

const API_KEY = process.env.LLAMA_CLOUD_API_KEY!
const BASE_URL = 'https://api.cloud.llamaindex.ai/api'

export const submitParseJob = async (file: File) => {
  return {
    id: `${randomUUID()}`,
    status: 'SUCCESS' as (typeof parsingStatus.enumValues)[number],
  }
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${BASE_URL}/parsing/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      Accept: 'application/json',
    },
    body: formData,
  })

  if (response.ok) {
    return (await response.json()) as {
      id: string
      status: (typeof parsingStatus.enumValues)[number]
    }
  } else {
    throw new Error(response.statusText)
  }
}

export const pollJobStatus = async (jobId: string) => {
  return {
    id: jobId,
    status: 'SUCCESS',
  }
  const response = await fetch(`${BASE_URL}/parsing/job/${jobId}`, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      Accept: 'application/json',
    },
  })

  if (response.ok) {
    return (await response.json()) as {
      id: string
      status: (typeof parsingStatus.enumValues)[number]
    }
  } else {
    throw new Error(response.statusText)
  }
}

export const getJobResultsInMarkdown = async (id: string) => {
  const note = await db.query.notebooks.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id)
    },
  })
  if (!note) throw new Error('note must be exist')
  return {
    markdown: note.summary,
    job_metadata: {},
  } as {
    markdown: string
    job_metadata: {
      credits_used: number
      job_credits_usage: number
      job_pages: number
      job_auto_mode_triggered_pages: number
      job_is_cache_hit: boolean
      credits_max: number
    }
  }
  //   const response = await fetch(`${BASE_URL}/parsing/job/${jobId}/result/markdown`, {
  //     headers: {
  //       Authorization: `Bearer ${API_KEY}`,
  //       Accept: 'application/json',
  //     },
  //   })
  //
  //   const res = await response.json()
  //
  //   if (response.ok) {
  //     return res as {
  //       markdown: string
  //       job_metadata: {
  //         credits_used: number
  //         job_credits_usage: number
  //         job_pages: number
  //         job_auto_mode_triggered_pages: number
  //         job_is_cache_hit: boolean
  //         credits_max: number
  //       }
  //     }
  //   } else {
  //     throw new Error(response.statusText)
  //   }
}
