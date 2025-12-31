export const generateRSS = (posts: any[]) => {
  const baseURL = 'https://devpy.de'
  
  // Transform blog path to remove numbers
  const transformBlogPath = (path: string): string => {
    return path.replace(/\/blog\/\d+[-_]?/, '/blog/')
  }
  
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Vipin Kumar Madhaan - DevPy Blog</title>
    <description>Latest blog posts from Vipin Kumar Madhaan on web development, technology, and programming.</description>
    <link>${baseURL}</link>
    <atom:link href="${baseURL}/rss.xml" rel="self" type="application/rss+xml"/>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>Nuxt Content</generator>
    ${posts.slice(0, 20).map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.description || ''}]]></description>
      <link>${baseURL}${transformBlogPath(post._path)}</link>
      <guid>${baseURL}${transformBlogPath(post._path)}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      ${post.author ? `<author>${post.author}</author>` : ''}
      ${post.tags ? post.tags.map((tag: string) => `<category>${tag}</category>`).join('') : ''}
    </item>
    `).join('')}
  </channel>
</rss>`

  return rss
}

// For static generation - this will be called during build
export const generateStaticRSS = async () => {
  try {
    // This is a placeholder - in a real build, you'd query your content here
    const samplePosts = [
      {
        title: 'Sample Blog Post',
        description: 'This is a sample blog post for RSS generation.',
        _path: '/blog/01-sample-post',
        date: new Date().toISOString(),
        author: 'Vipin Kumar Madhaan',
        tags: ['web-development', 'technology']
      }
    ]
    
    return generateRSS(samplePosts)
  } catch (error) {
    console.error('Error generating RSS:', error)
    return generateRSS([]) // Return empty RSS feed on error
  }
}