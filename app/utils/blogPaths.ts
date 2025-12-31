export const stripNumericPrefix = (slug: string) => {
  return slug.replace(/^\d+-/, "")
}

export const cleanBlogPath = (path: string) => {
  // Expected inputs:
  // - /blog/12-my-post
  // - /blog/my-post
  // Keep everything except a leading "N-" prefix in the last segment.
  const withoutQuery = path.split("?").at(0) ?? ""
  const trimmed = withoutQuery.split("#").at(0) ?? ""
  const segments = trimmed.split("/").filter(Boolean)

  if (segments.length < 2 || segments[0] !== "blog") {
    return path
  }

  const last = segments.at(-1)
  if (!last) return path
  const cleanedLast = stripNumericPrefix(last)

  const next = ["blog", ...segments.slice(1, -1), cleanedLast]
  return `/${next.join("/")}`
}

export const normalizeRoutePath = (path: string) => {
  const withoutQuery = path.split("?").at(0) ?? ""
  const trimmed = withoutQuery.split("#").at(0) ?? ""

  if (!trimmed) return "/"

  // Collapse multiple slashes and remove a trailing slash (except root)
  const collapsed = trimmed.replace(/\/{2,}/g, "/")
  if (collapsed !== "/" && collapsed.endsWith("/")) {
    return collapsed.slice(0, -1)
  }
  return collapsed
}
