# Spiritual Counseling Platform - Design Guidelines

## Design Approach
**Reference-Based:** Drawing from Calm, Headspace, and premium wellness platforms. Emphasis on spacious layouts, gentle sophistication, and trust-building through visual clarity.

**Core Principles:**
- Generous whitespace creates mental space
- Professional warmth through refined typography and thoughtful imagery
- Trust through visual consistency and polish

## Typography System
**Font Families:**
- Primary: Inter or Montserrat (headings, UI elements)
- Secondary: Lora or Crimson Text (subheadings, quotes)

**Hierarchy:**
- H1: 3xl/4xl, medium weight
- H2: 2xl/3xl, medium weight
- H3: xl/2xl, regular weight
- Body: base/lg, regular weight, increased line-height (1.7)
- Small text: sm, regular weight

## Layout System
**Spacing Primitives:** Use Tailwind units of 4, 8, 12, 16, 20, 24 (as in p-4, mb-8, py-20)

**Section Padding:** py-16 mobile, py-24 desktop

**Container:** max-w-7xl with px-6 mobile, px-8 desktop

## Component Library

### Navigation
Fixed header with subtle backdrop blur, logo left, primary CTA right ("Start Your Journey"), minimal navigation links center

### Hero Section
Full-width, 85vh height with hero image (described below). Content overlay with centered layout: Large headline, supporting subheadline, dual CTA (primary + secondary ghost button). Semi-transparent gradient overlay for text legibility.

### Course Grid
3-column desktop (2-col tablet, 1-col mobile). Cards with course image top, title, brief description, instructor name, duration badge, "Learn More" button. Subtle hover elevation.

### Awakened Miracles Section
Two-column layout (stacks mobile): Left - compelling headline + descriptive text explaining the program benefits. Right - Email signup form with single input field, submit button below, privacy reassurance text underneath. Background with subtle gradient or texture.

### Features Section
3-column grid with icon/image top, feature title, concise description. Icons should be simple line illustrations or photographic elements related to spiritual growth.

### Testimonials
2-column cards with student photo (circular), quote text, name and transformation result. Alternating layout for visual interest.

### Footer
Multi-column: Brand info + mission statement, Course categories, Quick links, Newsletter signup, Social icons. Subdued background treatment.

## Images

**Hero Image:** 
Serene nature scene - sunrise/sunset over peaceful landscape (mountains, ocean, or meditation garden). Soft, ethereal quality with natural lighting. Should evoke peace and possibility. Position: Full-width background with gradient overlay (dark to transparent bottom-to-top).

**Course Cards:**
Each course thumbnail should show relevant spiritual imagery - meditation poses, nature elements, sacred geometry, or abstract light patterns. Professional photography style.

**Awakened Miracles Section:**
Supportive background image or subtle pattern - could be mandala, soft light rays, or ethereal clouds. Lower opacity to maintain focus on form.

**Feature Icons:**
Simple, elegant line icons or small photographic elements representing: Community, Guidance, Growth, Transformation

## Interaction Patterns
Smooth scroll behavior, subtle fade-in animations on scroll (sparingly), gentle hover states on cards (slight scale or shadow increase), form inputs with focus states (border accent)

## Unique Design Elements
- Soft-edged cards with generous padding
- Gradient accents sparingly used
- Quote sections with elegant typography treatment
- Progress indicators for course completion
- Badges for course features (Video, PDF, Community Access)
- Blurred-background buttons when overlaying images (as specified)