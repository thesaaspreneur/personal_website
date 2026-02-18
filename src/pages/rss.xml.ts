import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getAllPosts, getSiteSettings } from '../lib/content';

export function GET(context: APIContext) {
  const posts = getAllPosts();
  const settings = getSiteSettings();

  return rss({
    title: settings.title,
    description: settings.description,
    site: context.site!,
    items: posts.map((post) => ({
      title: post.title,
      pubDate: post.publishedAt ? new Date(post.publishedAt) : new Date(),
      description: post.excerpt || '',
      link: `/writing/${post.slug}/`,
    })),
  });
}
