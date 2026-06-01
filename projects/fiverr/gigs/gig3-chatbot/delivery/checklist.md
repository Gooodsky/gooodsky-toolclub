# Delivery Checklist — Custom AI Chatbot (RAG)

Use this checklist before marking any order as delivered. Check off each item as it is completed.

---

## Basic Package — $500 (Single Knowledge Base + Embeddable Widget)

### Included
- [ ] Knowledge base ingestion: up to 50 pages / documents
- [ ] Knowledge sources processed: PDFs, web pages, text files
- [ ] Single LLM integration (GPT-4o mini or Claude Haiku)
- [ ] PGVector vector database (managed, shared instance)
- [ ] Basic RAG pipeline: chunking → retrieval → generation
- [ ] Embeddable iframe chat widget
- [ ] English language support
- [ ] Manual deployment guide (step-by-step)
- [ ] 1 round of revisions
- [ ] 7 days post-launch support
- [ ] Delivery within 5 days

### Not Included
- Over 50 knowledge source documents
- Advanced retrieval with re-ranking
- Custom-branded chat widget
- Source citations in responses
- Human handoff / live agent routing
- Analytics dashboard
- Platform integrations (Shopify, Zendesk, Slack)
- Multi-language support
- Cloud hosting (guide only)
- Conversation memory beyond session

---

## Standard Package — $1,500 (Multi-KB + API + Branding)

### Included
- [ ] Knowledge base ingestion: up to 500 pages / documents
- [ ] Full LLM: GPT-4o or Claude (full model)
- [ ] Pinecone / Weaviate serverless vector database
- [ ] Advanced RAG with re-ranking for higher accuracy
- [ ] Custom-branded chat widget (colors, logo, fonts)
- [ ] Manual handoff to email / ticket system
- [ ] Inline source citations in responses
- [ ] Up to 3 language support
- [ ] Basic analytics: conversation count, satisfaction rating, topic clustering
- [ ] Integration with 1 platform (Shopify / Zendesk / Slack)
- [ ] Cloud-hosted on shared infrastructure
- [ ] 2 rounds of revisions
- [ ] 14 days post-launch support
- [ ] Delivery within 10 days

### Not Included
- Unlimited documents with dynamic sync
- Multi-model with auto-fallback
- Dedicated vector database instance
- Multi-hop retrieval or hybrid search
- Full white-label widget with mobile SDK
- Live agent handoff with transcript
- Clickable source citations
- Unlimited languages with auto-detection
- Dedicated hosting with SLA
- Post-launch optimization pass

---

## Premium Package — $3,000 (Full-Featured + Admin Dashboard + Optimization)

### Included
- [ ] Unlimited documents with dynamic content sync (auto-refresh)
- [ ] Multi-model setup with auto-fallback (if primary fails, secondary takes over)
- [ ] Dedicated Pinecone / Weaviate vector database instance
- [ ] Multi-hop retrieval + hybrid search (keyword + vector) + re-ranking
- [ ] Full white-label chat widget + mobile SDK (iOS/Android)
- [ ] Live agent handoff with full chat transcript forwarding
- [ ] Clickable source citations linking directly to original documents
- [ ] Unlimited languages with automatic language detection
- [ ] Advanced analytics: user paths, drop-off points, CSAT scores, ROI tracking
- [ ] Up to 3 platform integrations + custom webhooks
- [ ] Dedicated cloud hosting with 99.9% SLA + auto-scaling
- [ ] Full documentation + team training session
- [ ] Unlimited revisions
- [ ] 30 days post-launch support + 1 optimization pass (re-evaluate and tune after real usage data)
- [ ] Delivery within 15 days

### Not Included
- Custom AI model training (uses fine-tuned prompting, not model retraining)
- Ongoing content strategy for knowledge base expansion
- Voice/video chat interface (text-only by default; voice available as gig extra)
- 24/7 on-call support (covered during business hours; after-hours best-effort)

---

## Shared Deliverables (All Packages)

Regardless of package, every delivery includes:

- [ ] Full source code (Git repository or ZIP)
- [ ] README with setup instructions
- [ ] Environment variable template (`.env.example`)
- [ ] Knowledge base preprocessing scripts
- [ ] Test queries document (sample Q&A pairs used during calibration)
- [ ] License + ownership transfer confirmation

---

## Pre-Delivery Validation Checklist

Run through these checks before handing over:

### Knowledge Base
- [ ] All provided documents ingested successfully (0 errors)
- [ ] Chunk sizes are appropriate for document type (500-1500 tokens)
- [ ] Metadata tags applied correctly (source, date, category)

### Accuracy
- [ ] Tested with 20+ real-world questions
- [ ] Accuracy rate above 90% on knowledge base questions
- [ ] Chatbot correctly says "I don't know" for out-of-scope questions
- [ ] No hallucinated URLs, prices, or facts

### Chat Widget
- [ ] Loads within 2 seconds on target website
- [ ] Responsive on mobile (375px) through desktop (1920px)
- [ ] Brand colors and logo render correctly
- [ ] Conversation history persists within session

### Security
- [ ] Rate limiting configured (max 20 requests/minute per user)
- [ ] Content moderation filter active (no harmful outputs)
- [ ] API keys stored as environment variables, not in source code
- [ ] CORS configured for allowed domains only

### Documentation
- [ ] README covers: setup, deploy, customize, troubleshoot
- [ ] All environment variables documented with descriptions
- [ ] Knowledge base update procedure documented
