# Viral Auto-Product System (JDC)

**Non-negotiables**
- System continuously identifies **viral-potential digital products** (not placeholders).
- Funnels **must match** the selected product type (copy, offer structure, upsells/downsells, delivery).
- Images/media must **match the product** (curated or AI-generated), not generic stock.

**Inputs (live sources)**
- Social trend signals (shortform virality, mentions, engagement velocity).
- Marketplace momentum (listings, sales velocity where available).
- Search trend deltas (spikes, breakout keywords).
- Competitor/funnel teardowns (headline patterns, guarantees, bonuses).

**Selection logic**
- Score = (Velocity × Audience Size × Monetization Fit × Difficulty Inference).
- Pick top N per tier (low/mid/high) with diversity (no duplicates/copies).

**Generation**
- Product page: title, hook, bullets, risk-reversal, FAQ, delivery notes.
- Media: on-topic mockups/demos matching the product niche (no random placeholders).
- Funnel: checkout step + thank-you + one-click upsell + optional downsell.
- Payments: Square (live), ready to take money.

**Publishing cadence**
- 11 products per tier (33 total) on first run; subsequent runs rotate least-performing items.
- Auto-replace if CTR or CR falls below threshold.

**Flags**
- `AUTO_PRODUCT_MODE=live` enables live generation instead of static fallbacks.
- Safe fallback route shows static inventory only if generation errors.

_Last reviewed: 2025-08-09 06:23 UTC_
