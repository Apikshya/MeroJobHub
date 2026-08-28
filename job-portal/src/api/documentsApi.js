import axiosInstance from './axiosInstance'

export const ASSOCIATION_TYPES = [
  'RESUME',
  'COVER_LETTER',
  'PORTFOLIO',
  'PROFILE_PHOTO',
  'PASSPORT',
  'NATIONAL_ID',
  'DRIVERS_LICENSE',
  'DEGREE_CERTIFICATE',
  'DIPLOMA',
  'ACADEMIC_TRANSCRIPT',
  'TRAINING_CERTIFICATE',
  'PROFESSIONAL_LICENSE',
  'WORK_PERMIT',
  'VISA',
  'EMPLOYMENT_CERTIFICATE',
  'EXPERIENCE_LETTER',
  'RECOMMENDATION_LETTER',
  'REFERENCE_LIST',
  'SKILL_CERTIFICATE',
  'LANGUAGE_CERTIFICATE',
  'TECHNICAL_CERTIFICATION',
  'BACKGROUND_CHECK',
  'POLICE_CLEARANCE',
  'OFFER_LETTER',
  'EMPLOYMENT_CONTRACT',
  'NDA',
  'SALARY_SLIP',
  'TAX_DOCUMENT',
  'BANK_DETAILS',
  'MEDICAL_CERTIFICATE',
  'FITNESS_CERTIFICATE',
  'JOINING_FORM',
  'COMPANY_POLICY_ACKNOWLEDGEMENT',
  'OTHER',
]

export const uploadDocument = (payload) => axiosInstance.post('/document/upload', payload)

export const getDocumentDetails = (fileName) =>
  axiosInstance.get(`/document/details/${encodeURIComponent(fileName)}`)

export const getDocumentsByEmail = (email) =>
  axiosInstance.get(`/document/email/${encodeURIComponent(email)}`)

// Now returns JSON: { data: { base64, file_name } } — not a raw file stream
export const getDocumentBase64 = (fileName) =>
  axiosInstance.get(`/document/view/${encodeURIComponent(fileName)}`)

// Convert a browser File object to a plain base64 string (no "data:...;base64," prefix)
export const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result.split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

export const getFileExtension = (fileName) => fileName.split('.').pop()?.toLowerCase() || ''

const MIME_TYPES_BY_EXTENSION = {
  pdf: 'application/pdf',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
  svg: 'image/svg+xml',
  txt: 'text/plain',
}

export const guessMimeType = (fileName) => MIME_TYPES_BY_EXTENSION[getFileExtension(fileName)] || 'application/octet-stream'

// A file type can be shown inline in the browser (iframe/img); everything else needs a download
export const canPreviewInline = (mimeType) => mimeType === 'application/pdf' || mimeType.startsWith('image/')

export const base64ToBlob = (base64, mimeType = 'application/octet-stream') => {
  const byteChars = atob(base64)
  const byteNumbers = new Array(byteChars.length)
  for (let i = 0; i < byteChars.length; i++) {
    byteNumbers[i] = byteChars.charCodeAt(i)
  }
  const byteArray = new Uint8Array(byteNumbers)
  return new Blob([byteArray], { type: mimeType })
}

// Triggers a browser download/open for a fetched blob
export const triggerBlobDownload = (blob, fileName) => {
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  a.remove()
  window.URL.revokeObjectURL(url)
}
