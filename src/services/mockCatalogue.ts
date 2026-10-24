import type { CatalogueItem } from '../types/softwareCatalogue';

export const CATALOGUE_CATEGORIES = ['AI Tools', 'Cloud Infrastructure', 'Productivity', 'Design', 'Development', 'Entertainment', 'Marketing', 'Security'];

export const mockCatalogue: CatalogueItem[] = [
  {
    id: 'cat_1', name: 'ChatGPT', vendor: 'OpenAI', category: 'AI Tools',
    description: 'Conversational AI assistant for writing, coding, and analysis.',
    website: 'https://openai.com', logo: '🤖', tags: ['ai', 'chat'],
    plans: [
      { id: 'p1', name: 'Free', price: 0, billingCycle: 'free', type: 'free', features: ['GPT-4o mini', 'Limited messages', 'Web access'], limits: 'Rate limited' },
      { id: 'p2', name: 'Plus', price: 20, billingCycle: 'monthly', type: 'paid', features: ['GPT-4o', 'DALL·E', 'Advanced voice', 'More messages'], recommended: true },
      { id: 'p3', name: 'Team', price: 25, billingCycle: 'monthly', type: 'paid', features: ['Everything in Plus', 'Admin console', 'Higher limits'], limits: 'Per user' },
    ],
    subscribedPlanId: 'p2',
  },
  {
    id: 'cat_2', name: 'Claude', vendor: 'Anthropic', category: 'AI Tools',
    description: 'Helpful, harmless, honest AI assistant.',
    website: 'https://anthropic.com', logo: '🧠', tags: ['ai', 'assistant'],
    plans: [
      { id: 'p1', name: 'Free', price: 0, billingCycle: 'free', type: 'free', features: ['Claude 3.5 Sonnet', 'Limited usage'] },
      { id: 'p2', name: 'Pro', price: 20, billingCycle: 'monthly', type: 'paid', features: ['5x more usage', 'Priority access', 'Projects'], recommended: true },
    ],
    subscribedPlanId: 'p2',
  },
  {
    id: 'cat_3', name: 'GitHub', vendor: 'GitHub', category: 'Development',
    description: 'Code hosting, collaboration, and CI/CD.',
    website: 'https://github.com', logo: '🐙', tags: ['dev', 'git'],
    plans: [
      { id: 'p1', name: 'Free', price: 0, billingCycle: 'free', type: 'free', features: ['Unlimited public repos', '2000 CI minutes'] },
      { id: 'p2', name: 'Pro', price: 4, billingCycle: 'monthly', type: 'paid', features: ['Unlimited private repos', '3000 CI minutes', 'Advanced tools'] },
      { id: 'p3', name: 'Copilot', price: 10, billingCycle: 'monthly', type: 'paid', features: ['AI code completion', 'Chat in IDE'], recommended: true },
    ],
    subscribedPlanId: 'p3',
  },
  {
    id: 'cat_4', name: 'AWS', vendor: 'Amazon', category: 'Cloud Infrastructure',
    description: 'Cloud computing services.',
    website: 'https://aws.amazon.com', logo: '☁️', tags: ['cloud', 'infra'],
    plans: [
      { id: 'p1', name: 'Free Tier', price: 0, billingCycle: 'free', type: 'free', features: ['750 hrs EC2', '5GB S3', '1M Lambda requests'] },
      { id: 'p2', name: 'Pay as you go', price: 0, billingCycle: 'monthly', type: 'paid', features: ['On-demand pricing', 'All services'], limits: 'Usage-based' },
    ],
    subscribedPlanId: 'p2',
  },
  {
    id: 'cat_5', name: 'Vercel', vendor: 'Vercel', category: 'Cloud Infrastructure',
    description: 'Frontend cloud platform.',
    website: 'https://vercel.com', logo: '▲', tags: ['hosting', 'deploy'],
    plans: [
      { id: 'p1', name: 'Hobby', price: 0, billingCycle: 'free', type: 'free', features: ['100GB bandwidth', 'Unlimited sites'] },
      { id: 'p2', name: 'Pro', price: 20, billingCycle: 'monthly', type: 'paid', features: ['1TB bandwidth', 'Team collaboration', 'Analytics'], recommended: true },
    ],
    subscribedPlanId: 'p2',
  },
  {
    id: 'cat_6', name: 'Notion', vendor: 'Notion Labs', category: 'Productivity',
    description: 'All-in-one workspace for notes and docs.',
    website: 'https://notion.so', logo: '📝', tags: ['notes', 'docs'],
    plans: [
      { id: 'p1', name: 'Free', price: 0, billingCycle: 'free', type: 'free', features: ['Unlimited pages', '10 guests'] },
      { id: 'p2', name: 'Plus', price: 8, billingCycle: 'monthly', type: 'paid', features: ['Unlimited file uploads', '30-day history', 'Custom automations'] },
      { id: 'p3', name: 'Business', price: 15, billingCycle: 'monthly', type: 'paid', features: ['SAML SSO', 'Advanced permissions', '90-day history'] },
    ],
    subscribedPlanId: 'p2',
  },
  {
    id: 'cat_7', name: 'Figma', vendor: 'Figma', category: 'Design',
    description: 'Collaborative interface design tool.',
    website: 'https://figma.com', logo: '🎨', tags: ['design', 'ui'],
    plans: [
      { id: 'p1', name: 'Starter', price: 0, billingCycle: 'free', type: 'free', features: ['3 Figma files', 'Unlimited viewers'] },
      { id: 'p2', name: 'Professional', price: 12, billingCycle: 'monthly', type: 'paid', features: ['Unlimited files', 'Dev mode', 'Version history'], recommended: true },
    ],
  },
  {
    id: 'cat_8', name: 'Linear', vendor: 'Linear', category: 'Productivity',
    description: 'Issue tracking and project management.',
    website: 'https://linear.app', logo: '📐', tags: ['pm', 'issues'],
    plans: [
      { id: 'p1', name: 'Free', price: 0, billingCycle: 'free', type: 'free', features: ['250 issues', '10MB storage'] },
      { id: 'p2', name: 'Basic', price: 8, billingCycle: 'monthly', type: 'paid', features: ['Unlimited issues', 'Priority support'] },
    ],
  },
  {
    id: 'cat_9', name: '1Password', vendor: 'AgileBits', category: 'Security',
    description: 'Password manager.',
    website: 'https://1password.com', logo: '🔐', tags: ['security', 'passwords'],
    plans: [
      { id: 'p1', name: 'Individual', price: 2.99, billingCycle: 'monthly', type: 'paid', features: ['All devices', 'Watchtower'] },
      { id: 'p2', name: 'Family', price: 4.99, billingCycle: 'monthly', type: 'paid', features: ['5 family members', 'Shared vaults'], recommended: true },
    ],
    subscribedPlanId: 'p2',
  },
  {
    id: 'cat_10', name: 'Adobe Creative Cloud', vendor: 'Adobe', category: 'Design',
    description: 'All Adobe creative apps.',
    website: 'https://adobe.com', logo: '🅰️', tags: ['design', 'creative'],
    plans: [
      { id: 'p1', name: 'All Apps', price: 54.99, billingCycle: 'monthly', type: 'paid', features: ['20+ apps', '100GB cloud storage', 'Adobe Fonts'], recommended: true },
    ],
    subscribedPlanId: 'p1',
  },
  {
    id: 'cat_11', name: 'Spotify', vendor: 'Spotify', category: 'Entertainment',
    description: 'Music streaming.',
    website: 'https://spotify.com', logo: '🎵', tags: ['music'],
    plans: [
      { id: 'p1', name: 'Free', price: 0, billingCycle: 'free', type: 'free', features: ['Ad-supported', 'Shuffle play'] },
      { id: 'p2', name: 'Premium', price: 10.99, billingCycle: 'monthly', type: 'paid', features: ['Ad-free', 'Offline', 'High quality'], recommended: true },
    ],
    subscribedPlanId: 'p2',
  },
  {
    id: 'cat_12', name: 'Mailchimp', vendor: 'Intuit', category: 'Marketing',
    description: 'Email marketing platform.',
    website: 'https://mailchimp.com', logo: '🐵', tags: ['marketing', 'email'],
    plans: [
      { id: 'p1', name: 'Free', price: 0, billingCycle: 'free', type: 'free', features: ['500 contacts', '1000 emails/mo'] },
      { id: 'p2', name: 'Essentials', price: 13, billingCycle: 'monthly', type: 'paid', features: ['5000 contacts', 'Email scheduling'] },
    ],
  },
];
