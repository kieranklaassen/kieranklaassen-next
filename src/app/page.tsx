import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}`
}

export default function Home() {
  const posts = getAllPosts()
  const featuredPost = posts[0]
  const otherPosts = posts.slice(1)

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <h1 className="hero-title">
            <span>Thoughts on</span>
            <span>creativity<span className="accent">,</span></span>
            <span>code<span className="accent">,</span></span>
            <span>& craft<span className="accent">.</span></span>
          </h1>
          <p className="hero-intro">
            Building software with intention. Writing about the intersection of technology, creativity, and personal growth.
          </p>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="featured">
          <div className="container">
            <div className="featured-grid">
              <span className="featured-label">Latest</span>
              <Link href={`/posts/${featuredPost.slug}`}>
                <h2 className="featured-title">{featuredPost.title}</h2>
                <p className="featured-excerpt">{featuredPost.description}</p>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Articles List */}
      <section className="articles-section">
        <div className="container">
          <div className="section-header">
            <span className="section-title">Selected Writing</span>
          </div>

          <div className="articles-list">
            {otherPosts.map((post, index) => (
              <Link key={post.slug} href={`/posts/${post.slug}`} className="article-row">
                <span className="article-number">{String(index + 1).padStart(2, '0')}</span>
                <div className="article-content">
                  <h3 className="article-title">{post.title}</h3>
                  <p className="article-excerpt">{post.description}</p>
                </div>
                <div className="article-meta">
                  <span className="article-category">{post.categories[0] || 'Article'}</span>
                  <span className="article-date">{formatDate(post.date)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
