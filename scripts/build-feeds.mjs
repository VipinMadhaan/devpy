#!/usr/bin/env node

import { generateRSSFeed, generateSitemap } from './generate-feeds.mjs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function main() {
  try {
    console.log('🚀 Generating RSS feed and sitemap...')
    
    const projectRoot = join(__dirname, '..')
    const contentDir = join(projectRoot, 'content')
    const publicDir = join(projectRoot, 'public')
    
    // Generate RSS feed
    const posts = await generateRSSFeed(contentDir, publicDir)
    
    // Generate sitemap
    await generateSitemap(posts, publicDir)
    
    console.log('✨ Feed generation completed!')
    
  } catch (error) {
    console.error('❌ Error during feed generation:', error)
    process.exit(1)
  }
}

main()