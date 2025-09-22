# RSS Feed & Sitemap Auto-Generation

This project includes automatic RSS feed and sitemap generation that processes all blog posts and pages.

## Features

### RSS Feed (`/rss.xml`)
- **Auto-discovery**: RSS feed is automatically linked in the HTML head for browser detection
- **Complete blog coverage**: Includes all blog posts from `/content/blog/`
- **Clean URLs**: Uses number-free URLs (e.g., `/blog/vue-composition-api` instead of `/blog/5-vue-composition-api`)
- **Rich metadata**: Includes author, categories, tags, publication dates
- **Standards compliant**: Valid RSS 2.0 with Dublin Core and Content namespaces

### Sitemap (`/sitemap.xml`)
- **Static pages**: Includes home, about, blog index with proper priorities
- **All blog posts**: Dynamically includes every blog post with clean URLs
- **SEO optimized**: Proper changefreq, priority, and lastmod values
- **XML standards**: Valid sitemap format for search engines

## How It Works

### Build Process
1. **Pre-build**: `npm run build:feeds` processes all content files
2. **Content parsing**: Reads frontmatter from all `.md` files in `/content/blog/`
3. **URL transformation**: Applies the same number-removal logic as the frontend
4. **File generation**: Updates `/public/rss.xml` and `/public/sitemap.xml`

### Scripts
- `scripts/generate-feeds.mjs`: Core generation logic
- `scripts/build-feeds.mjs`: Build runner script

### Automatic Execution
- **Build**: Runs before `nuxt build` 
- **Generate**: Runs before `nuxt generate`
- **Manual**: `npm run build:feeds`

## Generated Content

### RSS Feed Structure
```xml
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" 
     xmlns:content="http://purl.org/rss/1.0/modules/content/" 
     xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Vipin Kumar Madhaan - DevPy Blog</title>
    <description>Latest blog posts...</description>
    <link>https://devpy.de</link>
    <atom:link href="https://devpy.de/rss.xml" rel="self" type="application/rss+xml"/>
    <!-- Rich metadata -->
    <managingEditor>Vipin.Madhaan@gmail.com</managingEditor>
    <image>
      <url>https://devpy.de/vipin.webp</url>
      <!-- ... -->
    </image>
    
    <!-- Blog posts (up to 20 latest) -->
    <item>
      <title><![CDATA[Post Title]]></title>
      <description><![CDATA[Post Description]]></description>
      <link>https://devpy.de/blog/clean-url</link>
      <guid>https://devpy.de/blog/clean-url</guid>
      <pubDate>Date in RFC format</pubDate>
      <dc:creator>Author Name</dc:creator>
      <category>Tag1</category>
      <category>Tag2</category>
    </item>
  </channel>
</rss>
```

### Sitemap Structure
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Static pages -->
  <url>
    <loc>https://devpy.de/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Dynamic blog posts -->
  <url>
    <loc>https://devpy.de/blog/post-slug</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <lastmod>2025-02-22</lastmod>
  </url>
</urlset>
```

## Configuration

### Blog Post Frontmatter
The generator reads these fields from blog post frontmatter:
```yaml
---
title: "Post Title"
description: "Post description for RSS"
date: "2025-02-22T16:45:00.000Z"
dateUpdated: "2025-02-23T10:00:00.000Z"  # Optional
author: "Author Name"  # Optional, defaults to "Vipin Kumar Madhaan"
category: "Category Name"  # Optional
tags: ["tag1", "tag2"]  # Optional array
---
```

### URL Transformation
Both RSS and sitemap use the same URL transformation:
- Input: `/blog/5-vue-composition-api-best-practices`
- Output: `/blog/vue-composition-api-best-practices`

## Adding New Content

### New Blog Posts
1. Create `.md` file in `/content/blog/` with proper frontmatter
2. Run `npm run build:feeds` to update feeds
3. Files are automatically included in next build

### New Static Pages
1. Add URL to `staticPages` array in `scripts/generate-feeds.mjs`
2. Set appropriate `changefreq` and `priority`
3. Run `npm run build:feeds`

## Troubleshooting

### Missing Posts in Feed
- Check frontmatter syntax in blog post
- Ensure file has `.md` extension
- Verify frontmatter has `---` delimiters

### Invalid XML
- Check for special characters in titles/descriptions
- Ensure dates are in valid ISO format
- Test with XML validator

### Build Errors
- Check Node.js version (requires >= 18)
- Verify file permissions on `/public/` directory
- Check console for specific error messages

## SEO Benefits

### RSS Feed
- **Syndication**: Easy content distribution
- **Feed readers**: Automatic subscriber notifications  
- **Social media**: Auto-posting capabilities
- **Podcast platforms**: Can be adapted for audio content

### Sitemap
- **Search indexing**: Helps search engines discover all pages
- **Update frequency**: Signals content freshness to crawlers
- **Priority guidance**: Indicates important pages to search engines
- **Last modified**: Helps with incremental crawling

The feeds are automatically submitted to search engines via the sitemap, and the RSS feed is discoverable via the HTML `<link>` tag for maximum compatibility and SEO benefit.