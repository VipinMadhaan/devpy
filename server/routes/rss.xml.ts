import { defineEventHandler, setHeader } from "h3"
import { queryCollection } from "@nuxt/content/server"
import { cleanBlogPath } from "~/utils/blogPaths"

type BlogPost = {
  path?: string
  title?: string
  description?: string
  date?: string
  dateUpdated?: string
  tags?: string[]
}

const escapeXml = (value: string) => {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;")
}

export default defineEventHandler(async (event) => {
  const { public: cfg } = useRuntimeConfig()
  const siteUrl = cfg.siteUrl || "https://devpy.de"
  const siteName = cfg.siteName || "Site"
  const siteDescription = cfg.siteDescription || ""

  const posts = (await queryCollection(event, "blog")
    .order("date", "DESC")
    .all()) as BlogPost[]

  const itemsXml = posts
    .filter((post) => typeof post.path === "string" && post.path.length > 0)
    .map((post) => {
      const decodedPath = decodeURI(post.path as string)
      const path = cleanBlogPath(decodedPath)
      const url = new URL(path, siteUrl).toString()

      const title = escapeXml(post.title || "Untitled")
      const description = escapeXml(post.description || "")
      const pubDate = post.date ? new Date(post.date).toUTCString() : new Date().toUTCString()
      const guid = escapeXml(url)

      const categories = Array.isArray(post.tags)
        ? post.tags
            .filter(Boolean)
            .map((t) => `<category>${escapeXml(t)}</category>`)
            .join("")
        : ""

      return [
        "<item>",
        `<title>${title}</title>`,
        `<link>${escapeXml(url)}</link>`,
        `<guid isPermaLink=\"true\">${guid}</guid>`,
        `<pubDate>${escapeXml(pubDate)}</pubDate>`,
        description ? `<description>${description}</description>` : "",
        categories,
        "</item>",
      ]
        .filter(Boolean)
        .join("")
    })
    .join("")

  const channelXml = [
    "<channel>",
    `<title>${escapeXml(siteName)}</title>`,
    `<link>${escapeXml(siteUrl)}</link>`,
    siteDescription ? `<description>${escapeXml(siteDescription)}</description>` : "",
    `<lastBuildDate>${escapeXml(new Date().toUTCString())}</lastBuildDate>`,
    itemsXml,
    "</channel>",
  ]
    .filter(Boolean)
    .join("")

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">${channelXml}</rss>\n`

  setHeader(event, "content-type", "application/rss+xml; charset=utf-8")
  return rssXml
})
