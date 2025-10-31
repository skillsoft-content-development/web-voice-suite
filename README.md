# Skillsoft Suite - Landing Page

A professional landing page for the Skillsoft Suite of text-to-speech and lexicon management tools.

## Overview

This landing page serves as the entry point for the Skillsoft Suite, providing:
- Overview of available tools
- Navigation to individual applications
- Getting started guide
- Consistent branding and styling

## Applications in the Suite

### Text-to-Speech App
- Convert text into natural-sounding speech
- Multiple voice options and styles
- Custom pronunciation with lexicons
- Audio export in multiple formats

### Lexicon Editor
- Create and manage pronunciation lexicons
- Visual pronunciation guide using IPA
- Import/Export PLS XML files
- Cloud storage integration with Azure

## Tech Stack

- **Framework**: Next.js 15 with React 19
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript
- **Deployment**: Standalone build for containerization

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Deployment Notes

- The app is configured for standalone deployment
- Update the href URLs in `app/page.tsx` to point to your deployed applications
- Ensure the header image (`public/images/6.jpg`) is copied from one of the other apps
- The styling is designed to match the other applications in the suite

## Configuration

Update the tool URLs in `app/page.tsx`:

```typescript
const tools = [
  {
    name: 'Text-to-Speech',
    href: 'https://your-tts-app-domain.com', // Update this
    // ... other properties
  },
  {
    name: 'Lexicon Editor', 
    href: 'https://your-lexicon-editor-domain.com', // Update this
    // ... other properties
  }
];
```

## Features

- Responsive design that works on all devices
- Consistent styling with other suite applications
- Professional presentation of tool capabilities
- Clear getting started workflow
- Accessibility-focused design 