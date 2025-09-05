# KnowYourRights Aid

A mobile-first web application providing essential information and tools for individuals to understand and exercise their rights during police interactions.

## 🚀 Features

### Core Features
- **State-Specific Legal Guides**: Concise, mobile-optimized summaries of user rights tailored to their current state
- **"What to Say" Scripts & Phrases**: Pre-written, calm, and effective communication scripts for common police interaction scenarios
- **One-Tap Incident Recording**: Discreet, easily accessible recording functionality with local and cloud storage options
- **Automated Shareable Incident Cards**: AI-generated summary cards for sharing encounter details

### Premium Features
- Multi-language scripts (Spanish, French)
- Cloud storage for recordings
- AI-generated incident cards
- Advanced state-specific guidance
- Unlimited script generation
- Priority support

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Supabase (Database, Auth, Storage)
- **AI**: OpenAI GPT-3.5 Turbo
- **Payments**: Stripe
- **Icons**: Lucide React
- **Routing**: React Router DOM

## 📋 Prerequisites

- Node.js 16+ and npm/yarn
- Supabase account and project
- OpenAI API key
- Stripe account (for payments)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/vistara-apps/this-is-a-3997.git
cd this-is-a-3997
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Setup

Copy the environment template:

```bash
cp .env.example .env
```

Fill in your API keys in `.env`:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# OpenAI Configuration
VITE_OPENAI_API_KEY=your-openai-api-key

# Stripe Configuration (Optional)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
VITE_STRIPE_PREMIUM_PRICE_ID=price_your-premium-price-id

# Feature Flags
VITE_DEMO_MODE=true
```

### 4. Database Setup

1. Create a new Supabase project
2. Run the SQL commands from `database/schema.sql` in your Supabase SQL editor
3. Create a storage bucket named `recordings` for file uploads

### 5. Start Development Server

```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:5173` to see the application.

## 🗄 Database Schema

The application uses the following main tables:

- `users` - User profiles and subscription status
- `guides` - Legal guides and information
- `scripts` - "What to Say" scripts
- `saved_guides` - User bookmarked guides
- `saved_scripts` - User bookmarked scripts
- `recorded_incidents` - User recorded interactions
- `ai_generations` - AI-generated content tracking
- `subscription_events` - Payment and subscription history

See `database/schema.sql` for the complete schema.

## 🔧 Configuration

### Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from Settings > API
3. Run the database schema from `database/schema.sql`
4. Create a storage bucket named `recordings`
5. Set up Row Level Security policies (included in schema)

### OpenAI Setup

1. Get an API key from [OpenAI](https://platform.openai.com)
2. Add it to your `.env` file as `VITE_OPENAI_API_KEY`
3. Monitor usage to control costs

### Stripe Setup (Optional)

1. Create a Stripe account
2. Get your publishable key from the dashboard
3. Create a product and price for the premium subscription
4. Add the keys to your `.env` file

## 🚀 Deployment

### Build for Production

```bash
npm run build
# or
yarn build
```

### Deploy to Vercel

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Deploy to Netlify

1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify
3. Configure environment variables in Netlify dashboard

## 📱 Mobile Optimization

The app is designed mobile-first with:

- Responsive design using Tailwind CSS
- Touch-friendly interface elements
- Optimized for various screen sizes
- Fast loading with Vite bundling
- Progressive Web App capabilities

## 🔒 Security Features

- Row Level Security (RLS) in Supabase
- Secure API key management
- Input validation and sanitization
- HTTPS enforcement
- Content Security Policy headers

## 🧪 Testing

### Demo Mode

The app includes a demo mode for testing without real payments:

- Set `VITE_DEMO_MODE=true` in your environment
- Use the demo payment option in the upgrade flow
- Test all features without API costs

### Manual Testing

1. Test user registration and login
2. Try recording functionality
3. Generate AI scripts (requires OpenAI key)
4. Test payment flow (demo mode)
5. Verify mobile responsiveness

## 📊 Analytics & Monitoring

The app supports optional analytics integration:

- Google Analytics (set `VITE_GOOGLE_ANALYTICS_ID`)
- Mixpanel (set `VITE_MIXPANEL_TOKEN`)
- Custom event tracking for user interactions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Email: support@knowyourrights.app
- Legal Aid Hotline: 1-800-LEGAL-AID
- GitHub Issues: [Create an issue](https://github.com/vistara-apps/this-is-a-3997/issues)

## ⚖️ Legal Disclaimer

This application provides general legal information and is not a substitute for legal advice. Laws vary by jurisdiction and situation. For specific legal matters, consult with a qualified attorney.

## 🔄 Version History

### v1.0.0 (Current)
- Initial release with core features
- State-specific guides and scripts
- Recording functionality
- AI-powered script generation
- Premium subscription model
- Mobile-optimized interface

## 🎯 Roadmap

- [ ] Multi-language support expansion
- [ ] Offline functionality
- [ ] Push notifications
- [ ] Legal aid directory integration
- [ ] Community features
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)

---

**Built with ❤️ for civil rights and community safety**
