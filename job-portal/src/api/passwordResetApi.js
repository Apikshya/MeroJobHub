import publicAxios from './publicAxios'

// Generates the values the backend wants auto-filled and hidden from the user
export const buildRequestContext = async () => {
  const referenceId =
    window.crypto?.randomUUID?.() || `ref-${Date.now()}-${Math.random().toString(16).slice(2)}`
  const deviceInfo = navigator.userAgent

  let ipAddress = ''
  try {
    const res = await fetch('https://api.ipify.org?format=json')
    const data = await res.json()
    ipAddress = data.ip || ''
  } catch {
    ipAddress = '' // best-effort only — request still proceeds without it
  }

  return { referenceId, ipAddress, deviceInfo }
}

export const requestPasswordOtp = (payload) => publicAxios.post('/auth/forget-password', payload)

export const resetPasswordWithOtp = (payload) => publicAxios.post('/auth/change-password', payload)
