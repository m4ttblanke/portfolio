import type { MetadataRoute } from "next";

/* One page: the portfolio is the homepage (the résumé PDF stays out). */
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: "https://matthewblanke.com/" }];
}
