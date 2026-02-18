import { defineConfig } from 'tinacms';

export default defineConfig({
  branch: process.env.TINA_BRANCH || 'main',
  clientId: process.env.TINA_CLIENT_ID || '',
  token: process.env.TINA_TOKEN || '',

  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },

  media: {
    tina: {
      mediaRoot: 'uploads',
      publicFolder: 'public',
    },
  },

  schema: {
    collections: [
      // --- Blog Posts ---
      {
        name: 'post',
        label: 'Blog Posts',
        path: 'content/posts',
        format: 'md',
        fields: [
          {
            name: 'title',
            label: 'Title',
            type: 'string',
            required: true,
            isTitle: true,
          },
          {
            name: 'publishedAt',
            label: 'Published Date',
            type: 'datetime',
          },
          {
            name: 'excerpt',
            label: 'Excerpt',
            type: 'string',
            ui: { component: 'textarea' },
          },
          {
            name: 'tags',
            label: 'Tags',
            type: 'string',
            list: true,
          },
          {
            name: 'coverImage',
            label: 'Cover Image',
            type: 'image',
          },
          {
            name: 'body',
            label: 'Body',
            type: 'rich-text',
            isBody: true,
          },
        ],
        defaultItem: () => ({
          publishedAt: new Date().toISOString(),
        }),
        ui: {
          filename: {
            readonly: false,
            slugify: (values) =>
              (values?.title || '')
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, ''),
          },
        },
      },

      // --- Projects ---
      {
        name: 'project',
        label: 'Projects',
        path: 'content/projects',
        format: 'md',
        fields: [
          {
            name: 'title',
            label: 'Title',
            type: 'string',
            required: true,
            isTitle: true,
          },
          {
            name: 'description',
            label: 'Description',
            type: 'string',
            ui: { component: 'textarea' },
          },
          {
            name: 'category',
            label: 'Category',
            type: 'string',
            options: ['Side Project', 'Open Source', 'Research'],
          },
          {
            name: 'status',
            label: 'Status',
            type: 'string',
            options: ['Active', 'Completed', 'On Hold', 'Archived'],
          },
          {
            name: 'url',
            label: 'Live URL',
            type: 'string',
          },
          {
            name: 'repoUrl',
            label: 'Repository URL',
            type: 'string',
          },
          {
            name: 'techStack',
            label: 'Tech Stack',
            type: 'string',
            list: true,
          },
          {
            name: 'coverImage',
            label: 'Cover Image',
            type: 'image',
          },
          {
            name: 'body',
            label: 'Body',
            type: 'rich-text',
            isBody: true,
          },
        ],
        defaultItem: () => ({
          status: 'Active',
          category: 'Side Project',
        }),
        ui: {
          filename: {
            readonly: false,
            slugify: (values) =>
              (values?.title || '')
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, ''),
          },
        },
      },

      // --- Pages (Now, About) ---
      {
        name: 'page',
        label: 'Pages',
        path: 'content/pages',
        format: 'md',
        fields: [
          {
            name: 'title',
            label: 'Title',
            type: 'string',
            required: true,
            isTitle: true,
          },
          {
            name: 'lastUpdated',
            label: 'Last Updated',
            type: 'datetime',
          },
          {
            name: 'body',
            label: 'Body',
            type: 'rich-text',
            isBody: true,
          },
        ],
        ui: {
          filename: {
            readonly: false,
            slugify: (values) =>
              (values?.title || '')
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, ''),
          },
        },
      },

      // --- Site Settings (singleton-like) ---
      {
        name: 'siteSettings',
        label: 'Site Settings',
        path: 'content',
        format: 'json',
        match: {
          include: 'settings',
        },
        fields: [
          {
            name: 'title',
            label: 'Site Title',
            type: 'string',
          },
          {
            name: 'description',
            label: 'Site Description',
            type: 'string',
            ui: { component: 'textarea' },
          },
          {
            name: 'bio',
            label: 'Bio',
            type: 'string',
            ui: { component: 'textarea' },
          },
          {
            name: 'socialLinks',
            label: 'Social Links',
            type: 'object',
            list: true,
            fields: [
              {
                name: 'platform',
                label: 'Platform',
                type: 'string',
                options: ['Twitter', 'GitHub', 'LinkedIn', 'Email', 'Substack', 'YouTube', 'Instagram'],
              },
              {
                name: 'url',
                label: 'URL',
                type: 'string',
              },
            ],
          },
          {
            name: 'interests',
            label: 'Interests',
            type: 'string',
            list: true,
          },
        ],
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
      },
    ],
  },
});
