import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPostBySlug, getAllPostSlugs } from '@/lib/posts'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = getAllPostSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    return { title: 'Post Not Found' }
  }

  return {
    title: `${post.title} | Kieran Klaassen`,
    description: post.description,
  }
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  return date.toLocaleDateString('en-US', options)
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <article>
      <header className="post-header">
        <div className="container">
          <div className="post-meta">
            <Link href="/">← Back</Link>
            <span> · </span>
            <time>{formatDate(post.date)}</time>
            {post.categories.length > 0 && (
              <>
                <span> · </span>
                <span>{post.categories.join(', ')}</span>
              </>
            )}
          </div>
          <h1 className="post-title">{post.title}</h1>
          {post.description && (
            <p className="post-description">{post.description}</p>
          )}
        </div>
      </header>

      <div className="container">
        <div className="prose">
          <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
            {post.content}
          </Markdown>
        </div>
      </div>
    </article>
  )
}
