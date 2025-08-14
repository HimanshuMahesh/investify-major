# Investify Match Forge

A modern investment matching platform that connects businesses seeking funding with potential investors. Built with React, TypeScript, and shadcn/ui components.

## 🚀 Features

- **Dual Dashboard System**: Separate interfaces for businesses and investors
- **Smart Matching**: Algorithm-based matching between businesses and investors
- **Real-time Messaging**: Secure communication between matched parties
- **Analytics Dashboard**: Track performance metrics and engagement
- **Profile Management**: Comprehensive profiles for businesses and investors
- **Dark Mode Support**: Modern UI with light/dark theme switching
- **Responsive Design**: Mobile-first approach with seamless desktop experience

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript
- **Routing**: React Router v6
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with custom animations
- **State Management**: React Query for server state
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite
- **Package Manager**: npm/bun

## 📦 Installation

### Prerequisites

- Node.js 18+ or Bun
- npm, yarn, or bun package manager

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd investify-match-forge
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── analytics/       # Analytics dashboard components
│   ├── auth/           # Authentication forms
│   ├── dashboard/      # Dashboard layouts
│   ├── home/           # Landing page sections
│   ├── layout/         # Layout components
│   ├── matches/        # Matching system UI
│   ├── messages/       # Messaging interface
│   ├── profile/        # Profile management
│   ├── settings/       # Settings panels
│   └── ui/             # shadcn/ui components
├── data/               # Mock data and types
├── hooks/              # Custom React hooks
├── lib/                # Utilities and helpers
├── pages/              # Route components
└── main.tsx           # Application entry point
```

## 🎯 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 🔐 Authentication

The application uses a simple localStorage-based authentication system with two user types:

- **Business**: Companies seeking investment
- **Investor**: Individuals or firms looking to invest

## 🎨 UI Components

Built with shadcn/ui providing:

- Consistent design system
- Accessible components
- Dark mode support
- Customizable themes
- Mobile-responsive layouts

## 🔄 Routing

Protected routes ensure proper access control:

- Public routes: Home, Login, Signup
- Protected routes: Dashboards, Messages, Analytics
- User-type specific routes: Business Profile (business only)

## 📱 Features Overview

### For Businesses
- Create detailed business profiles
- Upload pitch decks and financial documents
- Browse and connect with investors
- Track investor engagement
- Manage funding rounds

### For Investors
- Discover investment opportunities
- Filter businesses by industry, stage, funding amount
- Review business profiles and documents
- Connect with promising startups
- Track portfolio performance

## 🚀 Deployment

### Production Build
```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

### Recommended Platforms
- Vercel
- Netlify
- AWS S3 + CloudFront
- GitHub Pages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the documentation
- Review existing issues for solutions

## 🔮 Roadmap

- [ ] Real-time notifications
- [ ] Advanced filtering and search
- [ ] Document management system
- [ ] Video conferencing integration
- [ ] API integration for real backend
- [ ] Mobile application
- [ ] AI-powered matching algorithms