const extractErrorMessage = async (response: Response): Promise<string> => {
  try {
    const body = (await response.json()) as { error?: string }
    if (typeof body.error === 'string' && body.error.length > 0) return body.error
  } catch {
    // response body was not JSON
  }
  return `Error ${response.status} al comunicarse con el servidor.`
}

const assertOk = async (response: Response): Promise<Response> => {
  if (!response.ok) throw new Error(await extractErrorMessage(response))
  return response
}

export const apiGet = async <T>(path: string): Promise<T> => {
  const response = await fetch(path)
  await assertOk(response)
  return (await response.json()) as T
}

export const apiPostJson = async <T>(path: string, body: unknown): Promise<T> => {
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  await assertOk(response)
  return (await response.json()) as T
}

export const apiPostForm = async <T>(path: string, formData: FormData): Promise<T> => {
  const response = await fetch(path, { method: 'POST', body: formData })
  await assertOk(response)
  return (await response.json()) as T
}

export const apiPatchJson = async <T>(path: string, body: unknown): Promise<T> => {
  const response = await fetch(path, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  await assertOk(response)
  return (await response.json()) as T
}
