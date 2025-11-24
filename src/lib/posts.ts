import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'content/posts')

export interface Post {
  slug: string
  title: string
  date: string
  description: string
  categories: string[]
  content: string
}

export function getAllPosts(): Post[] {
  const fileNames = fs.readdirSync(postsDirectory)
  const posts = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      // Parse categories from string or array
      let categories: string[] = []
      if (data.categories) {
        if (typeof data.categories === 'string') {
          categories = data.categories.split(',').map((c: string) => c.trim())
        } else if (Array.isArray(data.categories)) {
          categories = data.categories
        }
      }

      return {
        slug,
        title: data.title || slug,
        date: data.date || '',
        description: data.description || '',
        categories,
        content,
      }
    })
    .sort((a, b) => (a.date > b.date ? -1 : 1))

  return posts
}

export function getPostBySlug(slug: string): Post | null {
  const fullPath = path.join(postsDirectory, `${slug}.md`)

  if (!fs.existsSync(fullPath)) {
    return null
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  let categories: string[] = []
  if (data.categories) {
    if (typeof data.categories === 'string') {
      categories = data.categories.split(',').map((c: string) => c.trim())
    } else if (Array.isArray(data.categories)) {
      categories = data.categories
    }
  }

  return {
    slug,
    title: data.title || slug,
    date: data.date || '',
    description: data.description || '',
    categories,
    content,
  }
}

export function getAllPostSlugs(): string[] {
  const fileNames = fs.readdirSync(postsDirectory)
  return fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => fileName.replace(/\.md$/, ''))
}
