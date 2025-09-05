# KnowYourRights Aid - Deployment Guide

This guide covers the complete deployment process for the KnowYourRights Aid application, from development to production.

## 📋 Pre-Deployment Checklist

### Required Services
- [ ] Supabase project created and configured
- [ ] OpenAI API key obtained
- [ ] Stripe account set up (optional)
- [ ] Domain name registered (for production)
- [ ] SSL certificate configured

### Environment Variables
- [ ] All required environment variables defined
- [ ] API keys secured and not exposed in client code
- [ ] Feature flags configured appropriately
- [ ] Database connection strings verified

## 🗄 Database Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Choose a region close to your users
3. Set a strong database password
4. Wait for the project to be provisioned

### 2. Configure Database Schema

1. Open the SQL Editor in your Supabase dashboard
2. Copy and paste the contents of `database/schema.sql`
3. Execute the SQL commands to create all tables and policies
4. Verify all tables were created successfully

### 3. Set Up Storage

1. Go to Storage in your Supabase dashboard
2. Create a new bucket named `recordings`
3. Set the bucket to private (not public)
4. Configure the storage policies (included in schema.sql)

### 4. Configure Authentication

1. Go to Authentication > Settings
2. Enable email authentication
3. Configure email templates (optional)
4. Set up any additional auth providers if needed

## 🔧 Environment Configuration

### Development Environment

Create a `.env` file in your project root:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# OpenAI Configuration
VITE_OPENAI_API_KEY=sk-your-openai-key-here

# Stripe Configuration (Optional)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-key
VITE_STRIPE_PREMIUM_PRICE_ID=price_your-price-id

# App Configuration
VITE_APP_NAME=KnowYourRights Aid
VITE_APP_URL=http://localhost:5173

# Feature Flags
VITE_ENABLE_AI_FEATURES=true
VITE_ENABLE_CLOUD_STORAGE=true
VITE_ENABLE_PAYMENTS=true
VITE_DEMO_MODE=true

# Support Configuration
VITE_SUPPORT_EMAIL=support@knowyourrights.app
VITE_LEGAL_AID_HOTLINE=1-800-LEGAL-AID
```

### Production Environment

For production, update the following:

```env
# Production URLs
VITE_APP_URL=https://your-domain.com
VITE_DEMO_MODE=false

# Use production Stripe keys
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your-live-key
```

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

Vercel provides excellent React/Vite support with automatic deployments.

#### Setup Steps:

1. **Connect Repository**
   ```bash
   # Push your code to GitHub
   git add .
   git commit -m "Complete PRD implementation"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure build settings:
     - Framework Preset: Vite
     - Build Command: `npm run build`
     - Output Directory: `dist`

3. **Configure Environment Variables**
   - Go to Project Settings > Environment Variables
   - Add all your environment variables
   - Make sure to use production values

4. **Custom Domain (Optional)**
   - Go to Project Settings > Domains
   - Add your custom domain
   - Configure DNS records as instructed

#### Vercel Configuration File

Create `vercel.json` in your project root:

```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### Option 2: Netlify

Netlify is another excellent option for static site hosting.

#### Setup Steps:

1. **Build the Project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop your `dist` folder
   - Or connect your GitHub repository for automatic deployments

3. **Configure Redirects**
   Create `public/_redirects`:
   ```
   /*    /index.html   200
   ```

4. **Environment Variables**
   - Go to Site Settings > Environment Variables
   - Add all your production environment variables

### Option 3: AWS S3 + CloudFront

For enterprise deployments with AWS infrastructure.

#### Setup Steps:

1. **Create S3 Bucket**
   ```bash
   aws s3 mb s3://your-app-bucket-name
   ```

2. **Build and Upload**
   ```bash
   npm run build
   aws s3 sync dist/ s3://your-app-bucket-name --delete
   ```

3. **Configure CloudFront**
   - Create a CloudFront distribution
   - Point to your S3 bucket
   - Configure custom error pages for SPA routing

## 🔒 Security Configuration

### Content Security Policy

Add to your `index.html`:

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://js.stripe.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://api.openai.com https://*.supabase.co https://api.stripe.com;
  frame-src https://js.stripe.com;
">
```

### HTTPS Configuration

Ensure HTTPS is enforced:

1. **Vercel/Netlify**: Automatic HTTPS
2. **Custom Server**: Configure SSL certificates
3. **CloudFront**: Enable HTTPS redirect

### API Key Security

- Never expose API keys in client-side code
- Use environment variables for all sensitive data
- Rotate keys regularly
- Monitor API usage for anomalies

## 📊 Monitoring & Analytics

### Error Monitoring

Consider integrating error monitoring:

```bash
npm install @sentry/react @sentry/tracing
```

### Performance Monitoring

Monitor Core Web Vitals:
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)
- First Input Delay (FID)

### Analytics Setup

If using Google Analytics:

```javascript
// Add to index.html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🧪 Testing in Production

### Pre-Launch Testing

1. **Functionality Testing**
   - [ ] User registration/login
   - [ ] Guide browsing and saving
   - [ ] Script generation (AI)
   - [ ] Recording functionality
   - [ ] Payment flow (if enabled)

2. **Performance Testing**
   - [ ] Page load times < 3 seconds
   - [ ] Mobile responsiveness
   - [ ] Offline functionality (if implemented)

3. **Security Testing**
   - [ ] HTTPS enforcement
   - [ ] API endpoint security
   - [ ] Data validation
   - [ ] XSS protection

### Load Testing

For high-traffic scenarios:

```bash
# Using Artillery.js
npm install -g artillery
artillery quick --count 100 --num 10 https://your-domain.com
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
      env:
        VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
        VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
        VITE_OPENAI_API_KEY: ${{ secrets.VITE_OPENAI_API_KEY }}
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Environment Variable Issues**
   - Ensure all required variables are set
   - Check variable naming (VITE_ prefix required)
   - Verify no spaces in variable values

3. **API Connection Issues**
   - Verify Supabase URL and keys
   - Check CORS settings
   - Validate network connectivity

4. **Payment Issues**
   - Verify Stripe keys are correct
   - Check webhook endpoints
   - Validate price IDs

### Debug Commands

```bash
# Check build output
npm run build -- --debug

# Verify environment variables
npm run dev -- --debug

# Check bundle size
npm run build && npx vite-bundle-analyzer dist
```

## 📈 Post-Deployment

### Monitoring Checklist

- [ ] Set up uptime monitoring
- [ ] Configure error alerting
- [ ] Monitor API usage and costs
- [ ] Track user analytics
- [ ] Monitor database performance

### Maintenance Tasks

- [ ] Regular dependency updates
- [ ] Security patch management
- [ ] Database backup verification
- [ ] Performance optimization
- [ ] User feedback collection

## 🆘 Support & Maintenance

### Regular Updates

1. **Weekly**: Check for security updates
2. **Monthly**: Review analytics and performance
3. **Quarterly**: Update dependencies and review costs

### Backup Strategy

1. **Database**: Supabase automatic backups
2. **Code**: Git repository with multiple remotes
3. **Environment**: Document all configurations

### Rollback Plan

1. Keep previous deployment artifacts
2. Document rollback procedures
3. Test rollback process regularly

---

**Need help with deployment? Contact support@knowyourrights.app**
