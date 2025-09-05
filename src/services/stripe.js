// Stripe payment service for subscription management
// Note: In production, most Stripe operations should be handled server-side for security

// Stripe configuration
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ''
const PREMIUM_PRICE_ID = import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID || ''

// Initialize Stripe (will be loaded dynamically)
let stripe = null

// Load Stripe.js dynamically
const loadStripe = async () => {
  if (!stripe && STRIPE_PUBLISHABLE_KEY) {
    try {
      const { loadStripe: stripeLoader } = await import('@stripe/stripe-js')
      stripe = await stripeLoader(STRIPE_PUBLISHABLE_KEY)
    } catch (error) {
      console.error('Failed to load Stripe:', error)
    }
  }
  return stripe
}

// Payment service functions
export const paymentService = {
  // Initialize Stripe checkout for premium subscription
  async createCheckoutSession(userId, userEmail, successUrl, cancelUrl) {
    try {
      // In a real app, this would call your backend API to create a Stripe checkout session
      // For demo purposes, we'll simulate the process
      
      if (!STRIPE_PUBLISHABLE_KEY || !PREMIUM_PRICE_ID) {
        throw new Error('Stripe configuration missing')
      }

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: PREMIUM_PRICE_ID,
          userId,
          userEmail,
          successUrl,
          cancelUrl
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { sessionId } = await response.json()
      
      const stripeInstance = await loadStripe()
      if (!stripeInstance) {
        throw new Error('Failed to load Stripe')
      }

      // Redirect to Stripe Checkout
      const { error } = await stripeInstance.redirectToCheckout({
        sessionId
      })

      if (error) {
        throw error
      }

      return { success: true, error: null }
    } catch (error) {
      console.error('Checkout error:', error)
      return { success: false, error: error.message }
    }
  },

  // Demo checkout function (for development/demo purposes)
  async demoCheckout(userId, userEmail) {
    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In demo mode, always succeed
      return {
        success: true,
        subscriptionId: `demo_sub_${Date.now()}`,
        customerId: `demo_cus_${userId}`,
        error: null
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Verify payment status (would typically be handled by webhooks)
  async verifyPayment(sessionId) {
    try {
      const response = await fetch(`/api/verify-payment/${sessionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (!response.ok) {
        throw new Error('Failed to verify payment')
      }

      const data = await response.json()
      return { data, error: null }
    } catch (error) {
      console.error('Payment verification error:', error)
      return { data: null, error: error.message }
    }
  },

  // Cancel subscription
  async cancelSubscription(subscriptionId) {
    try {
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscriptionId })
      })

      if (!response.ok) {
        throw new Error('Failed to cancel subscription')
      }

      const data = await response.json()
      return { data, error: null }
    } catch (error) {
      console.error('Subscription cancellation error:', error)
      return { data: null, error: error.message }
    }
  },

  // Get subscription details
  async getSubscription(subscriptionId) {
    try {
      const response = await fetch(`/api/subscription/${subscriptionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (!response.ok) {
        throw new Error('Failed to get subscription details')
      }

      const data = await response.json()
      return { data, error: null }
    } catch (error) {
      console.error('Get subscription error:', error)
      return { data: null, error: error.message }
    }
  },

  // Update payment method
  async updatePaymentMethod(customerId) {
    try {
      const stripeInstance = await loadStripe()
      if (!stripeInstance) {
        throw new Error('Failed to load Stripe')
      }

      // Create a setup intent for updating payment method
      const response = await fetch('/api/create-setup-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId })
      })

      if (!response.ok) {
        throw new Error('Failed to create setup intent')
      }

      const { clientSecret } = await response.json()

      // Redirect to payment method update
      const { error } = await stripeInstance.confirmCardSetup(clientSecret)

      if (error) {
        throw error
      }

      return { success: true, error: null }
    } catch (error) {
      console.error('Update payment method error:', error)
      return { success: false, error: error.message }
    }
  }
}

// Subscription management utilities
export const subscriptionUtils = {
  // Check if Stripe is configured
  isConfigured() {
    return !!(STRIPE_PUBLISHABLE_KEY && PREMIUM_PRICE_ID)
  },

  // Get pricing information
  getPricingInfo() {
    return {
      premium: {
        price: 5.00,
        currency: 'USD',
        interval: 'month',
        features: [
          'Multi-language scripts (Spanish, French)',
          'Cloud storage for recordings',
          'AI-generated incident cards',
          'Advanced state-specific guidance',
          'Priority support',
          'Unlimited script generation'
        ]
      }
    }
  },

  // Format price for display
  formatPrice(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount)
  },

  // Check subscription status
  isSubscriptionActive(subscription) {
    if (!subscription) return false
    
    const now = new Date()
    const expiryDate = new Date(subscription.currentPeriodEnd)
    
    return subscription.status === 'active' && expiryDate > now
  },

  // Calculate days until subscription expires
  getDaysUntilExpiry(subscription) {
    if (!subscription || !subscription.currentPeriodEnd) return null
    
    const now = new Date()
    const expiryDate = new Date(subscription.currentPeriodEnd)
    const diffTime = expiryDate - now
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    return diffDays > 0 ? diffDays : 0
  },

  // Generate success and cancel URLs
  getCheckoutUrls(baseUrl) {
    return {
      successUrl: `${baseUrl}/profile?payment=success`,
      cancelUrl: `${baseUrl}/profile?payment=cancelled`
    }
  }
}

// Demo payment functions for development
export const demoPayment = {
  // Simulate successful payment
  async simulateSuccess(userId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          subscriptionId: `demo_sub_${Date.now()}`,
          customerId: `demo_cus_${userId}`,
          status: 'active',
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        })
      }, 1500)
    })
  },

  // Simulate payment failure
  async simulateFailure() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: false,
          error: 'Payment failed - insufficient funds'
        })
      }, 1500)
    })
  },

  // Simulate subscription cancellation
  async simulateCancel(subscriptionId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          subscriptionId,
          status: 'cancelled',
          cancelledAt: new Date().toISOString()
        })
      }, 1000)
    })
  }
}

// Error handling utilities
export const paymentErrors = {
  // Common error messages
  messages: {
    CARD_DECLINED: 'Your card was declined. Please try a different payment method.',
    INSUFFICIENT_FUNDS: 'Insufficient funds. Please check your account balance.',
    EXPIRED_CARD: 'Your card has expired. Please update your payment method.',
    PROCESSING_ERROR: 'There was an error processing your payment. Please try again.',
    NETWORK_ERROR: 'Network error. Please check your connection and try again.',
    CONFIGURATION_ERROR: 'Payment system is not properly configured.',
    UNKNOWN_ERROR: 'An unexpected error occurred. Please contact support.'
  },

  // Map Stripe error codes to user-friendly messages
  getErrorMessage(error) {
    if (!error) return this.messages.UNKNOWN_ERROR
    
    const errorCode = error.code || error.type
    
    switch (errorCode) {
      case 'card_declined':
        return this.messages.CARD_DECLINED
      case 'insufficient_funds':
        return this.messages.INSUFFICIENT_FUNDS
      case 'expired_card':
        return this.messages.EXPIRED_CARD
      case 'processing_error':
        return this.messages.PROCESSING_ERROR
      case 'network_error':
        return this.messages.NETWORK_ERROR
      default:
        return error.message || this.messages.UNKNOWN_ERROR
    }
  }
}
