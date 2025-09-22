// Blog utilities for path transformation and content helpers

/**
 * Transform blog paths to remove number prefix for clean URLs
 * @param path - The original blog path (e.g., "/blog/1-my-post")
 * @returns Clean path without number prefix (e.g., "/blog/my-post")
 */
export const transformBlogPath = (path: string | undefined): string | undefined => {
  if (!path) return path
  // Remove number prefix from blog paths (e.g., "/blog/1-my-post" -> "/blog/my-post")
  return path.replace(/\/blog\/\d+-/, '/blog/')
}

/**
 * Calculate reading time for blog post content
 * @param content - The blog post content (string or MarkdownRoot)
 * @returns Reading time in minutes
 */
export const calculateReadingTime = (content: string | any): number => {
  if (!content) return 0
  
  // Handle MarkdownRoot objects by converting to string
  let textContent = ''
  if (typeof content === 'string') {
    textContent = content
  } else if (content && typeof content === 'object') {
    // For MarkdownRoot objects, try to extract text or use approximate
    textContent = JSON.stringify(content).replace(/[{}[\]",:]/g, ' ')
  } else {
    return 0
  }
  
  // Average reading speed: 200 words per minute
  const wordsPerMinute = 200
  const words = textContent.trim().split(/\s+/).length
  const readingTime = Math.ceil(words / wordsPerMinute)
  
  return readingTime
}

/**
 * Format date for display
 * @param date - Date string or Date object
 * @returns Formatted date string
 */
export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

/**
 * Get related posts based on tags and category
 * @param currentPost - The current blog post
 * @param allPosts - Array of all blog posts
 * @param limit - Number of related posts to return (default: 3)
 * @returns Array of related posts
 */
export const getRelatedPosts = (
  currentPost: any,
  allPosts: any[],
  limit: number = 3
): any[] => {
  if (!currentPost || !allPosts.length) return []
  
  // Filter out the current post
  const otherPosts = allPosts.filter(post => post.path !== currentPost.path)
  
  // Score posts based on shared tags and category
  const scoredPosts = otherPosts.map(post => {
    let score = 0
    
    // Same category gets higher score
    if (post.category === currentPost.category) {
      score += 3
    }
    
    // Shared tags
    if (currentPost.tags && post.tags) {
      const sharedTags = currentPost.tags.filter((tag: string) => 
        post.tags.includes(tag)
      )
      score += sharedTags.length * 2
    }
    
    // Recent posts get slight boost
    const postDate = new Date(post.date).getTime()
    const currentDate = new Date(currentPost.date).getTime()
    const daysDiff = Math.abs(currentDate - postDate) / (1000 * 60 * 60 * 24)
    
    if (daysDiff < 90) { // Within 3 months
      score += 1
    }
    
    return { ...post, score }
  })
  
  // Sort by score (highest first) and return limited results
  return scoredPosts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

/**
 * Generate social share URLs
 * @param title - Post title
 * @param url - Full URL of the post
 * @returns Object with social share URLs
 */
export const generateShareUrls = (title: string, url: string) => {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  
  return {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&via=VipinMadhaan`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
  }
}