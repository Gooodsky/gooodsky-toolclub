# Client Onboarding Template — AI Chatbot (RAG)

This is the questionnaire to send to clients immediately after order placement. It gathers everything needed to build their chatbot.

---

## Part 1: Client Intake Questionnaire

Copy and send this section to the client:

```
Hi [Client Name],

Thanks for ordering your custom AI chatbot! To build a bot that truly understands your
business, I need to learn about what you do and how you want the bot to behave.

Please answer as many questions as you can. Partial answers are fine — we will fill in
the gaps together during the discovery call.

---

### A. About Your Business

1. What does your business do? (1-3 sentences)

2. What is your website URL?

3. Who is your target audience / typical customer?

4. What are the top 3-5 questions customers ask you repeatedly?

  1.
  2.
  3.
  4.
  5.

5. What is the ONE thing you want this chatbot to do better than anything else?
   (e.g., answer shipping questions, recommend products, troubleshoot issues)

---

### B. Knowledge Sources

6. Where does your existing knowledge live? (check all that apply)

   [ ] Website pages (provide URLs)
   [ ] PDF documents / user manuals
   [ ] Internal wiki or Notion
   [ ] Google Docs / shared drive
   [ ] FAQ page (provide URL)
   [ ] Product catalog / database
   [ ] Customer support ticket history
   [ ] Email templates / playbooks
   [ ] Training materials / onboarding docs
   [ ] Other: ______

7. Roughly how many documents/pages of content do you have?
   [ ] Under 50 (fits Basic)
   [ ] 50-500 (fits Standard)
   [ ] 500+ (needs Premium)

8. Do you have content in languages other than English?
   [ ] No — English only
   [ ] Yes — list languages: ______

9. Does your knowledge base change frequently (weekly updates)?
   [ ] No — mostly static
   [ ] Yes — needs regular updates → Premium recommended

---

### C. Brand & Tone

10. How would you describe your brand voice? (choose one or write your own)

    [ ] Professional & authoritative
    [ ] Friendly & approachable
    [ ] Witty & playful
    [ ] Luxury & premium
    [ ] Technical & precise
    [ ] Empathetic & supportive
    [ ] Other: ______

11. Should the chatbot use your company name? If so, what name?
    (e.g., "I'm Sam, the Acme support assistant")

12. Do you have brand guidelines (colors, fonts, logo)?

    [ ] Yes — I will share them
    [ ] No — use a clean default style

13. Are there any topics the chatbot should NEVER discuss?
    (e.g., pricing negotiations, legal advice, competitor comparisons)

---

### D. Chatbot Behavior

14. What should the chatbot do when it does NOT know the answer?

    [ ] Say "I don't know, please contact support"
    [ ] Offer to create a support ticket
    [ ] Transfer to a human agent (Standard/Premium)
    [ ] Say "I'm still learning — check our FAQ at [link]"

15. Should the chatbot be proactive (greeting visitors) or reactive (wait for questions)?

    [ ] Proactive — greet after 5-10 seconds with "Hi! How can I help?"
    [ ] Reactive — only respond when asked

16. Where will the chatbot be placed?

    [ ] Bottom-right corner widget (standard)
    [ ] Full-page chat interface
    [ ] Embedded in a specific page (provide URL)
    [ ] Mobile app (Premium only)
    [ ] Other: ______

---

### E. Integrations & Handoff

17. Do you use any of these platforms?

    [ ] Shopify
    [ ] Zendesk
    [ ] Slack
    [ ] Intercom
    [ ] HubSpot
    [ ] Salesforce
    [ ] Custom CRM / ticketing system
    [ ] None — standalone chatbot

18. If the chatbot cannot resolve an issue, what should happen?

    [ ] Collect email and create a support ticket
    [ ] Show your support email / phone number
    [ ] Transfer to live chat agent (Premium)
    [ ] Other: ______

---

### F. Technical (if known)

19. Do you have a preferred AI provider?

    [ ] OpenAI (GPT-4o)
    [ ] Anthropic (Claude)
    [ ] No preference

20. Do you already have an API key for the above?

    [ ] Yes — I'll provide it (required for Basic package)
    [ ] No — please use managed access (Standard/Premium)

21. Any other requirements or questions for me?


Thank you! I will review your answers and follow up with any clarifying questions
before starting the build.

Best,
[Your Name]
```

---

## Part 2: Deliverables Checklist Template

Use this internally to track what will be included in the final delivery package. Copy and fill out per project.

```
═══════════════════════════════════════════════════════
  DELIVERABLES CHECKLIST
  Project: [Client Name] — [Package Level]
  Order Date: YYYY-MM-DD
  Target Delivery: YYYY-MM-DD
═══════════════════════════════════════════════════════

FILES:
├── source-code.zip .......................... [ ] Full project repository
├── README.md ................................ [ ] Setup + usage instructions
├── .env.example ............................. [ ] Environment variable template
├── knowledge-base/
│   ├── ingest-script.ts ..................... [ ] Document ingestion script
│   └── processed/ ........................... [ ] Processed & chunked documents
├── chat-widget/
│   ├── embed.js ............................. [ ] Embeddable widget script
│   └── customization.css .................... [ ] Brand styling overrides
├── docs/
│   ├── user-guide.pdf ....................... [ ] End-user documentation
│   ├── admin-guide.md ....................... [ ] Admin dashboard guide (if applicable)
│   └── test-queries.md ...................... [ ] Calibration test results
├── deployment/
│   ├── vercel.json .......................... [ ] Vercel deployment config
│   └── dns-setup.md ......................... [ ] Custom domain instructions
└── LICENSE .................................. [ ] Ownership transfer

CREDENTIALS (deliver via secure channel):
├── Vercel Dashboard login ................... [ ] (if managed hosting)
├── Vector DB Dashboard ...................... [ ] (Pinecone/Weaviate, if applicable)
└── API key summary .......................... [ ] (list of keys + rotation instructions)

VALIDATION:
├── 20+ test queries passed .................. [ ]
├── Accuracy > 90% ........................... [ ]
├── Responsive on all breakpoints ............ [ ]
├── Rate limiting active ..................... [ ]
├── Content moderation active ................ [ ]
└── Client approval received ................. [ ]

POST-DELIVERY:
├── Support period: [7 / 14 / 30] days ....... Start: YYYY-MM-DD  End: YYYY-MM-DD
├── Revision rounds remaining: [1 / 2 / ∞] ... [ ]
└── Optimization pass scheduled (Premium) .... [ ] Date: YYYY-MM-DD
```

---

## Part 3: Post-Delivery Handoff Message

Send this message when delivering the final package:

```
Hi [Client Name],

Your AI chatbot is ready! Here is what you received:

✅ DELIVERABLES
- Full source code and documentation (attached)
- Live chatbot deployed at: [URL]
- Embed code to add to your website (see README)
- Knowledge base with [N] documents indexed

📋 NEXT STEPS
1. Review the README for setup instructions
2. Add the embed code to your website (2 lines of HTML)
3. Test with real questions — try asking anything from your FAQ
4. Check the analytics dashboard at [URL]/dashboard (Standard/Premium)

🛡️ SUPPORT
Your [7/14/30]-day support window starts today. If anything isn't working as
expected, reply to this message and I'll fix it — usually within 24 hours.

🔄 REVISIONS
You have [1/2/unlimited] revision round(s) remaining. If you want adjustments
to the bot's tone, behavior, or knowledge base, just let me know.

📈 OPTIMIZATION (Premium only)
I've scheduled a 30-day check-in to review real usage data and fine-tune the
bot based on actual customer conversations.

Thank you for trusting me with your project!

Best,
[Your Name]
```
