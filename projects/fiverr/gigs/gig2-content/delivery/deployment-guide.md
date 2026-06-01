# Deployment Guide — AI Content Generation System

This guide covers deploying the content generation system to Vercel (recommended) or any Node.js host. Follow these steps in order.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                  Client (Browser)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │ CSV      │  │ Manual   │  │ Web Dashboard    │  │
│  │ Upload   │  │ Input    │  │ (Premium only)   │  │
│  └────┬─────┘  └────┬─────┘  └────────┬─────────┘  │
│       │              │                 │             │
│       └──────────────┼─────────────────┘             │
│                      ▼                               │
│  ┌──────────────────────────────────────────────┐   │
│  │         Next.js API Routes / Server Actions    │   │
│  │  ┌─────────┐  ┌──────────┐  ┌────────────┐  │   │
│  │  │ Input   │  │ Prompt   │  │ Output     │  │   │
│  │  │ Parser  │─▶│ Builder  │─▶│ Formatter  │  │   │
│  │  └─────────┘  └──────────┘  └────────────┘  │   │
│  └──────────────────────────────────────────────┘   │
│                      │                               │
│                      ▼                               │
│  ┌──────────────────────────────────────────────┐   │
│  │            AI Provider (external)              │   │
│  │  OpenAI GPT-4o / Claude / DeepSeek            │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

---

## Prerequisites

Before deploying, ensure you have:

1. **GitHub account** — for repository hosting
2. **Vercel account** (https://vercel.com) — free tier is sufficient for Basic/Standard
3. **AI Provider API key** — one of:
   - OpenAI API key: https://platform.openai.com/api-keys
   - Anthropic API key: https://console.anthropic.com/
   - DeepSeek API key: https://platform.deepseek.com/
4. **Node.js 18+** installed locally (for testing before deploy)

---

## Step 1: Clone & Setup Locally

```bash
# Clone the delivered repository
git clone <your-repo-url> content-generator
cd content-generator

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local
```

---

## Step 2: Configure Environment Variables

Open `.env.local` and fill in your values:

```env
# Required — AI Provider (at least one)
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
# ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxx
# DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Required — which model to use by default
AI_DEFAULT_PROVIDER=openai          # openai | anthropic | deepseek
AI_DEFAULT_MODEL=gpt-4o             # gpt-4o | claude-sonnet-4-20250514 | deepseek-chat

# Brand Voice Configuration
BRAND_NAME="Your Brand Name"
BRAND_TONE=professional             # professional | casual | witty | luxury | technical
BRAND_INDUSTRY=ecommerce
BRAND_TARGET_AUDIENCE="Small business owners aged 25-45"

# Content Generation Limits
MAX_GENERATIONS_PER_MONTH=200       # Basic: 200, Standard: 1000, Premium: 0 (unlimited)
MAX_TOKENS_PER_GENERATION=2000

# Output Configuration
DEFAULT_OUTPUT_FORMAT=markdown      # markdown | json | csv
ENABLE_QUALITY_CHECK=true           # Standard + Premium only
ENABLE_SEO_SCORING=false            # Premium only
ENABLE_PLAGIARISM_CHECK=false       # Premium only

# Platform Integrations (Standard + Premium)
# SHOPIFY_STOREFRONT_TOKEN=xxxxxxxx
# SHOPIFY_STORE_URL=https://your-store.myshopify.com
# WORDPRESS_API_URL=https://your-site.com/wp-json
# WORDPRESS_APP_PASSWORD=xxxx xxxx xxxx xxxx

# Analytics (Standard + Premium)
ENABLE_ANALYTICS=false
# ANALYTICS_DATABASE_URL=postgresql://...

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

---

## Step 3: Test Locally

```bash
# Start development server
npm run dev

# Open http://localhost:3000
# Test a simple generation
npm run test:generate
```

Verify:
- [ ] App loads at http://localhost:3000
- [ ] Can input a product name and get a description
- [ ] Output matches brand tone
- [ ] No errors in console

---

## Step 4: Deploy to Vercel

### 4.1 Push to GitHub

```bash
git add .
git commit -m "Initial deployment"
git push origin main
```

### 4.2 Connect to Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Vercel auto-detects Next.js — no framework config needed

### 4.3 Add Environment Variables

In Vercel dashboard: **Settings > Environment Variables**

Add every variable from `.env.example` that has a value. Mark secret variables (API keys) as "Sensitive."

```
Key                          Value                    Environment
OPENAI_API_KEY               sk-xxxx                  Production, Preview, Development
AI_DEFAULT_PROVIDER          openai                   Production, Preview, Development
BRAND_NAME                   "Your Brand"             Production, Preview, Development
BRAND_TONE                   professional             Production, Preview, Development
... (all other env vars)
```

### 4.4 Deploy

Click **Deploy**. Vercel builds and deploys automatically (~2-3 minutes).

Your app is now live at: `https://your-project.vercel.app`

### 4.5 Custom Domain (Optional)

**Settings > Domains** — add your custom domain and update DNS records as instructed.

---

## Step 5: Daily Usage

### Basic Usage — Web Interface

1. Open `https://your-project.vercel.app`
2. Select content type from the dropdown
3. Upload a CSV with product data, or type manually
4. Click **Generate**
5. Download results as Markdown / CSV / JSON

### Batch Processing — CSV Upload

Prepare a CSV file with these columns:

```csv
product_name,product_category,key_features,target_keyword
Ergonomic Desk Chair,Furniture,"adjustable armrest, lumbar support, mesh back",best office chair 2026
Wireless Earbuds,Electronics,"noise cancelling, 30hr battery, IPX5 waterproof",premium wireless earbuds
```

Upload via the web dashboard. The system processes all rows and returns a downloadable file.

### API Access (Premium Only)

```bash
# Generate product descriptions
curl -X POST https://your-project.vercel.app/api/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "type": "product_description",
    "data": {
      "product_name": "Ergonomic Desk Chair",
      "category": "Furniture",
      "features": ["adjustable armrest", "lumbar support", "mesh back"]
    },
    "format": "markdown"
  }'
```

### Checking Usage & Remaining Quota

- **Dashboard** (Standard/Premium): Visit `/dashboard` to see generation count, remaining quota, and cost breakdown.
- **API** (Premium): `GET /api/usage` returns JSON with current month stats.

```json
{
  "month": "2026-05",
  "generations_used": 142,
  "generations_limit": 1000,
  "remaining": 858,
  "estimated_cost": 4.23
}
```

---

## Troubleshooting

| Problem | Likely Cause | Solution |
|---|---|---|
| "No API key configured" | Missing env var | Check Vercel > Settings > Environment Variables |
| Generation returns empty | Token limit exceeded | Increase `MAX_TOKENS_PER_GENERATION` in env |
| Rate limit errors | Too many requests | Add delay between batch rows; upgrade API tier |
| "Model not available" | Wrong model name | Verify `AI_DEFAULT_MODEL` matches provider's available models |
| Shopify sync fails | Invalid token | Regenerate Storefront API token in Shopify admin |
| Dashboard shows 0 usage | Analytics disabled | Set `ENABLE_ANALYTICS=true` and redeploy |

---

## Maintenance

- **Update AI models:** Change `AI_DEFAULT_MODEL` in env vars when new models release. Redeploy.
- **Add new content types:** Edit `src/config/content-types.ts` — no code changes needed.
- **Scale capacity:** For Premium with dedicated hosting, contact support to upgrade the Vercel plan.
- **Backup:** Repository is version-controlled on GitHub. Export analytics data monthly via the dashboard.

---

## Support

For issues not covered here:
- Check the `README.md` in the project root
- Refer to the video tutorial (Standard/Premium)
- Contact post-delivery support (7-30 days depending on package)
