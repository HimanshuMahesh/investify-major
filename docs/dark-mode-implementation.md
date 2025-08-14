# Dark Mode Implementation Plan

## Overview
Implement a system-wide dark mode toggle with theme persistence and system preference detection.

## Components to Create

### 1. ThemeProvider
- Create `src/contexts/ThemeContext.tsx`
- Implement theme state management
- Add localStorage persistence
- Add system theme detection
- Export useTheme hook for components

### 2. Theme Toggle UI
- Add theme toggle button to DashboardLayout
- Include icons for sun/moon
- Show visual feedback for current theme

### 3. CSS Updates
The project already has dark mode CSS variables defined in index.css. We need to:
- Ensure dark mode class is properly applied to root element
- Update existing color utilities to respect dark mode
- Verify all UI components properly use CSS variables

## Implementation Steps

1. Create Theme Context & Provider:
```typescript
// src/contexts/ThemeContext.tsx
export type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}
```

2. Add Theme Toggle Component:
```typescript
// src/components/ui/theme-toggle.tsx
interface ThemeToggleProps {
  className?: string;
}
```

3. Update DashboardLayout:
- Add theme toggle to header section
- Ensure proper styling in both themes

## Testing Checklist
- [ ] Theme persistence across page reloads
- [ ] System theme detection
- [ ] Smooth theme transitions
- [ ] All components properly styled in both themes
- [ ] Mobile responsiveness
- [ ] Accessibility (proper contrast ratios)

## Technical Details

### Local Storage Keys
- Theme preference: 'investify-theme'
- Values: 'light' | 'dark' | 'system'

### CSS Classes
- Use existing dark mode variables defined in index.css
- Toggle 'dark' class on root element

### Browser Support
- Support modern browsers with CSS variables
- Fallback to light theme for older browsers