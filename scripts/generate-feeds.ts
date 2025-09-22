import { promises as fs } from 'fs'
import { join } from 'path'

// Generate RSS feed from blog content
export async function generateRSSFeed(contentDir: string, publicDir: string) {
  const baseURL = 'https://devpy.de'
  
  try {
    const blogDir = join(contentDir, 'blog')
    const files = await fs.readdir(blogDir)
    const posts: any[] = []
    
    // Read all blog files
    for (const file of files) {
      if (file.endsWith('.md')) {
        try {
          const content = await fs.readFile(join(blogDir, file), 'utf-8')
          const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/)
          
          if (frontmatterMatch) {
            // Basic YAML parsing for frontmatter
            const frontmatter = frontmatterMatch[1]
            const lines = frontmatter.split('\n')
            const post: any = {}
            
            lines.forEach(line => {
              const colonIndex = line.indexOf(':')
              if (colonIndex > 0) {
                const key = line.substring(0, colonIndex).trim()
                let value = line.substring(colonIndex + 1).trim()
                
                // Remove quotes if present
                if (value.startsWith('"') && value.endsWith('"')) {
                  value = value.slice(1, -1)
                }
                if (value.startsWith("'") && value.endsWith("'")) {
                  value = value.slice(1, -1)
                }
                
                post[key] = value
              }
            })
            
            // Add file-based path
            post._path = `/blog/${file.replace('.md', '')}`
            posts.push(post)
          }
        } catch (error) {
          console.warn(`Error reading blog file ${file}:`, error)
        }
      }
    }
    
    // Sort posts by date (newest first)
    posts.sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0
      const dateB = b.date ? new Date(b.date).getTime() : 0
      return dateB - dateA
    })
    
    // Transform blog path to remove numbers
    const transformBlogPath = (path: string): string => {
      if (!path) return path
      return path.replace(/\/blog\/\d+-/, '/blog/')
    }
    
    // Generate RSS XML
    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Vipin Kumar Madhaan - DevPy Blog</title>
    <description>Latest blog posts from Vipin Kumar Madhaan on web development, technology, and programming. Senior Software Engineer sharing insights on modern web technologies, Vue.js, TypeScript, and full-stack development.</description>
    <link>${baseURL}</link>
    <atom:link href="${baseURL}/rss.xml" rel="self" type="application/rss+xml"/>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>Nuxt 4.1.2</generator>
    <managingEditor>Vipin.Madhaan@gmail.com (Vipin Kumar Madhaan)</managingEditor>
    <webMaster>Vipin.Madhaan@gmail.com (Vipin Kumar Madhaan)</webMaster>
    <image>
      <url>${baseURL}/vipin.webp</url>
      <title>Vipin Kumar Madhaan - DevPy Blog</title>
      <link>${baseURL}</link>
      <width>144</width>
      <height>144</height>
    </image>
    ${posts.slice(0, 20).map(post => `
    <item>
      <title><![CDATA[${post.title || 'Untitled'}]]></title>
      <description><![CDATA[${post.description || post.excerpt || ''}]]></description>
      <link>${baseURL}${transformBlogPath(post._path)}</link>
      <guid>${baseURL}${transformBlogPath(post._path)}</guid>
      <pubDate>${post.date ? new Date(post.date).toUTCString() : new Date().toUTCString()}</pubDate>
      <dc:creator>${post.author || 'Vipin Kumar Madhaan'}</dc:creator>
      ${post.tags ? (Array.isArray(post.tags) ? post.tags : [post.tags]).map((tag: string) => `<category>${tag}</category>`).join('') : ''}
      ${post.category ? `<category>${post.category}</category>` : ''}
    </item>
    `).join('')}
  </channel>
</rss>`
    
    // Write RSS file
    const rssPath = join(publicDir, 'rss.xml')
    await fs.writeFile(rssPath, rss, 'utf-8')
    
    console.log(`✅ Generated RSS feed with ${posts.length} posts`)
    return posts
    
  } catch (error) {
    console.error('Error generating RSS feed:', error)
    return []
  }
}

// Generate sitemap content
export async function generateSitemap(posts: any[], publicDir: string) {
  const baseURL = 'https://devpy.de'
  
  try {
    // Transform blog path to remove numbers
    const transformBlogPath = (path: string): string => {
      if (!path) return path
      return path.replace(/\/blog\/\d+-/, '/blog/')
    }
    
    // Static pages
    const staticPages = [
      { loc: '/', changefreq: 'weekly', priority: '1.0' },
      { loc: '/about', changefreq: 'monthly', priority: '0.8' },
      { loc: '/blog', changefreq: 'daily', priority: '0.9' }
    ]
    
    // Blog post pages
    const blogPages = posts.map(post => ({
      loc: transformBlogPath(post._path),
      changefreq: 'monthly',
      priority: '0.7',
      lastmod: post.dateUpdated || post.date || new Date().toISOString().split('T')[0]
    }))
    
    const allPages: Array<{loc: string, changefreq: string, priority: string, lastmod?: string}> = [...staticPages, ...blogPages]
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allPages.map(page => `
  <url>
    <loc>${baseURL}${page.loc}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ''}
  </url>
  `).join('')}
</urlset>`
    
    // Write sitemap file
    const sitemapPath = join(publicDir, 'sitemap.xml')
    await fs.writeFile(sitemapPath, sitemap, 'utf-8')
    
    console.log(`✅ Generated sitemap with ${allPages.length} URLs`)
    
  } catch (error) {
    console.error('Error generating sitemap:', error)
  }
}