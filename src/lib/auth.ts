export function saveToken(token: string) {
  if (typeof window === 'undefined') return
  localStorage.setItem('token', token)
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('token')
}

export function removeToken() {
  if (typeof window === 'undefined') return
  return localStorage.removeItem('token')
}

export function isLoggedIn(): boolean {
  return !!getToken()
}