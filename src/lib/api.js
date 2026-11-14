const KEY = 'sinow-session-v1'

export const getSession = () => {
  try {
    const s = JSON.parse(localStorage.getItem(KEY)) ?? JSON.parse(sessionStorage.getItem(KEY))
    return s?.token ? s : null
  } catch {
    return null
  }
}

export async function api(path, { method = 'GET', body, auth = true } = {}) {
  const s = getSession()
  let res
  try {
    res = await fetch(path, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(auth && s ? { Authorization: `Bearer ${s.token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new Error('Tidak bisa terhubung ke server.')
  }

  let data = null
  try { data = await res.json() } catch { /* respons tanpa JSON */ }

  if (!res.ok) {
    if (res.status === 401 && auth) window.dispatchEvent(new Event('auth:expired'))
    const err = new Error(data?.message || `Permintaan gagal (${res.status})`)
    err.status = res.status
    throw err
  }
  return data
}