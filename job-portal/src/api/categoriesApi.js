const DEFAULT_CATEGORIES = [
  'Information Technology (IT)',
  'Software Development',
  'Artificial Intelligence (AI)',
  'Cloud & DevOps',
  'Cybersecurity',
  'Telecommunications',
  'Banking & Finance',
  'Healthcare & Medicine',
  'Education & Training',
  'E-commerce & Retail',
  'Marketing & Advertising',
  'Human Resources (HR)',
  'Design & Creative',
  'Customer Support',
  'Sales & Business Development',
]

const STORAGE_KEY = 'app_categories'

export const getCategories = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CATEGORIES))
      return DEFAULT_CATEGORIES
    }
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_CATEGORIES
  } catch (err) {
    console.error('Error reading categories from localStorage:', err)
    return DEFAULT_CATEGORIES
  }
}

export const addCategory = (categoryName) => {
  const trimmed = categoryName.trim()
  if (!trimmed) throw new Error('Category name cannot be empty')
  
  const categories = getCategories()
  const exists = categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())
  if (exists) throw new Error('Category already exists')
  
  const updated = [...categories, trimmed]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  return updated
}

export const updateCategory = (oldCategory, newCategory) => {
  const trimmedNew = newCategory.trim()
  if (!trimmedNew) throw new Error('Category name cannot be empty')
  
  const categories = getCategories()
  if (oldCategory.toLowerCase() !== trimmedNew.toLowerCase()) {
    const exists = categories.some((c) => c.toLowerCase() === trimmedNew.toLowerCase())
    if (exists) throw new Error('Another category with this name already exists')
  }
  
  const updated = categories.map((c) => (c === oldCategory ? trimmedNew : c))
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  return updated
}

export const deleteCategory = (categoryToDelete) => {
  const categories = getCategories()
  const updated = categories.filter((c) => c !== categoryToDelete)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  return updated
}
