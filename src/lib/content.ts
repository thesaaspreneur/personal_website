import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';

const contentDir = path.resolve('content');

// --- Types ---

export interface Post {
  slug: string;
  title: string;
  publishedAt: string;
  excerpt: string;
  tags: string[];
  coverImage?: string;
  body: string; // raw markdown
  html: string; // rendered HTML
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  category: string;
  status: string;
  url?: string;
  repoUrl?: string;
  techStack: string[];
  startYear?: string;
  endYear?: string;
  logo?: string;
  coverImage?: string;
  body: string;
  html: string;
}

export interface Page {
  slug: string;
  title: string;
  lastUpdated: string;
  body: string;
  html: string;
}

export interface SiteSettings {
  title: string;
  description: string;
  bio: string;
  socialLinks: { platform: string; url: string }[];
  interests: string[];
}

export interface ChecklistItem {
  text: string;
  done: boolean;
  category: string;
}

export interface StoryBlock {
  type: 'hero' | 'text' | 'image' | 'quote' | 'chapter' | 'divider';
  headline?: string;
  subtitle?: string;
  content?: string;
  src?: string;
  alt?: string;
  caption?: string;
  layout?: 'full' | 'wide' | 'normal';
  attribution?: string;
  label?: string;
}

export interface Story {
  title: string;
  description?: string;
  blocks: StoryBlock[];
}

// --- Helpers ---

function readMarkdownFiles(dir: string) {
  const fullDir = path.join(contentDir, dir);
  if (!fs.existsSync(fullDir)) return [];

  return fs.readdirSync(fullDir)
    .filter((f) => f.endsWith('.md'))
    .map((filename) => {
      const filePath = path.join(fullDir, filename);
      const raw = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(raw);
      const slug = filename.replace(/\.md$/, '');
      return { slug, data, content };
    });
}

// --- Queries ---

export function getAllPosts(): Post[] {
  return readMarkdownFiles('posts')
    .map(({ slug, data, content }) => ({
      slug,
      title: data.title || slug,
      publishedAt: data.publishedAt || '',
      excerpt: data.excerpt || '',
      tags: data.tags || [],
      coverImage: data.coverImage,
      body: content,
      html: marked.parse(content) as string,
    }))
    .sort((a, b) => {
      if (!a.publishedAt) return 1;
      if (!b.publishedAt) return -1;
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
}

export function getPostBySlug(slug: string): Post | null {
  const posts = getAllPosts();
  return posts.find((p) => p.slug === slug) || null;
}

export function getLatestPosts(count = 5): Post[] {
  return getAllPosts().slice(0, count);
}

export function getAllProjects(): Project[] {
  const statusOrder: Record<string, number> = { Active: 0, 'On Hold': 1, Completed: 2, Archived: 3 };
  return readMarkdownFiles('projects')
    .map(({ slug, data, content }) => ({
      slug,
      title: data.title || slug,
      description: data.description || '',
      category: data.category || '',
      status: data.status || '',
      url: data.url,
      repoUrl: data.repoUrl,
      techStack: data.techStack || [],
      startYear: data.startYear,
      endYear: data.endYear,
      logo: data.logo,
      coverImage: data.coverImage,
      body: content,
      html: marked.parse(content) as string,
    }))
    .sort((a, b) => {
      const sa = statusOrder[a.status] ?? 99;
      const sb = statusOrder[b.status] ?? 99;
      if (sa !== sb) return sa - sb;
      return (parseInt(b.startYear || '0') || 0) - (parseInt(a.startYear || '0') || 0);
    });
}

export function getProjectBySlug(slug: string): Project | null {
  const projects = getAllProjects();
  return projects.find((p) => p.slug === slug) || null;
}

export function getPageBySlug(slug: string): Page | null {
  const files = readMarkdownFiles('pages');
  const found = files.find((f) => f.slug === slug);
  if (!found) return null;

  return {
    slug: found.slug,
    title: found.data.title || found.slug,
    lastUpdated: found.data.lastUpdated || '',
    body: found.content,
    html: marked.parse(found.content) as string,
  };
}

export function getChecklist(): ChecklistItem[] {
  const filePath = path.join(contentDir, 'checklist.json');
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(raw);
  return data.items || [];
}

export function getStory(): Story | null {
  const filePath = path.join(contentDir, 'story.json');
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

export function getSiteSettings(): SiteSettings {
  const filePath = path.join(contentDir, 'settings.json');
  if (!fs.existsSync(filePath)) {
    return {
      title: "Rahul's Website",
      description: 'Personal website',
      bio: '',
      socialLinks: [],
      interests: [],
    };
  }
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}
