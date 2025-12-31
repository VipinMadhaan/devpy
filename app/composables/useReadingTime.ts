export const calculateReadingTime = (
  content: string,
  wordsPerMinute = 200,
): number => {
  if (!content) return 0

  // Remove markdown syntax and HTML tags
  const cleanText = content
    .replace(/```[\s\S]*?```/g, "") // Remove code blocks
    .replace(/`[^`]*`/g, "") // Remove inline code
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/[#*_~[\]()]/g, "") // Remove markdown syntax
    .replace(/\n+/g, " ") // Replace newlines with spaces
    .trim()

  const wordCount = cleanText
    .split(/\s+/)
    .filter((word) => word.length > 0).length
  return Math.ceil(wordCount / wordsPerMinute)
}

export const formatReadingTime = (minutes: number): string => {
  if (minutes < 1) return "< 1 min read"
  if (minutes === 1) return "1 min read"
  return `${minutes} min read`
}
