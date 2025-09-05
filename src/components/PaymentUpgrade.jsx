import React, { useState } from 'react'
import { Star, Check, Loader, AlertCircle, CreditCard, Shield } from 'lucide-react'
import { useUser } from '../contexts/UserContext'
import { paymentService, subscriptionUtils, demoPayment, paymentErrors } from '../services/stripe'

const PaymentUpgrade = ({ onUpgradeSuccess, onCancel }) => {
  const { user, upgradeSubscription } = useUser()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('demo') // 'demo' or 'stripe'

  const pricingInfo = subscriptionUtils.getPricingInfo()
  const isStripeConfigured = subscriptionUtils.isConfigured()

  const handleUpgrade = async () => {
    try {
      setIsProcessing(true)
      setError(null)

      if (paymentMethod === 'demo') {
        // Demo payment flow
        const result = await demoPayment.simulateSuccess(user?.id || 'demo-user')
        
        if (result.success) {
          upgradeSubscription()
          if (onUpgradeSuccess) {
            onUpgradeSuccess(result)
          }
        } else {
          setError(result.error)
        }
      } else if (paymentMethod === 'stripe' && isStripeConfigured) {
        // Real Stripe payment flow
        const baseUrl = window.location.origin
        const { successUrl, cancelUrl } = subscriptionUtils.getCheckoutUrls(baseUrl)
        
        const result = await paymentService.createCheckoutSession(
          user?.id || 'anonymous',
          user?.email || 'user@example.com',
          successUrl,
          cancelUrl
        )

        if (!result.success) {
          setError(paymentErrors.getErrorMessage(result.error))
        }
        // If successful, user will be redirected to Stripe Checkout
      } else {
        setError('Payment system is not properly configured.')
      }
    } catch (error) {
      console.error('Payment error:', error)
      setError(paymentErrors.getErrorMessage(error))
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDemoFailure = async () => {
    try {
      setIsProcessing(true)
      setError(null)
      
      const result = await demoPayment.simulateFailure()
      setError(result.error)
    } catch (error) {
      setError('Demo failure simulation failed')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="bg-surface rounded-lg p-6 shadow-card border border-border max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-accent to-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <Star className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-textPrimary mb-2">Upgrade to Premium</h2>
        <p className="text-textSecondary">
          Unlock advanced features and enhanced protection
        </p>
      </div>

      {/* Pricing */}
      <div className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-lg p-4 mb-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-textPrimary">
            {subscriptionUtils.formatPrice(pricingInfo.premium.price)}
          </div>
          <div className="text-textSecondary">per {pricingInfo.premium.interval}</div>
        </div>
      </div>

      {/* Features */}
      <div className="space-y-3 mb-6">
        <h3 className="font-semibold text-textPrimary mb-3">Premium Features:</h3>
        {pricingInfo.premium.features.map((feature, index) => (
          <div key={index} className="flex items-start space-x-3">
            <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
            <span className="text-textSecondary text-sm">{feature}</span>
          </div>
        ))}
      </div>

      {/* Payment Method Selection */}
      <div className="mb-6">
        <h4 className="font-medium text-textPrimary mb-3">Payment Method:</h4>
        <div className="space-y-2">
          <label className="flex items-center space-x-3 p-3 border border-border rounded-md cursor-pointer hover:bg-bg">
            <input
              type="radio"
              name="paymentMethod"
              value="demo"
              checked={paymentMethod === 'demo'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="text-primary"
            />
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-blue-500" />
              <span className="text-sm">Demo Mode (No actual payment)</span>
            </div>
          </label>
          
          {isStripeConfigured && (
            <label className="flex items-center space-x-3 p-3 border border-border rounded-md cursor-pointer hover:bg-bg">
              <input
                type="radio"
                name="paymentMethod"
                value="stripe"
                checked={paymentMethod === 'stripe'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="text-primary"
              />
              <div className="flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-green-500" />
                <span className="text-sm">Credit Card (Stripe)</span>
              </div>
            </label>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleUpgrade}
          disabled={isProcessing}
          className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
            isProcessing
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-primary text-white hover:bg-primary/90'
          }`}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center space-x-2">
              <Loader className="w-4 h-4 animate-spin" />
              <span>Processing...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <Star className="w-4 h-4" />
              <span>
                {paymentMethod === 'demo' ? 'Try Premium (Demo)' : 'Upgrade Now'}
              </span>
            </div>
          )}
        </button>

        {/* Demo failure button (for testing) */}
        {paymentMethod === 'demo' && (
          <button
            onClick={handleDemoFailure}
            disabled={isProcessing}
            className="w-full py-2 px-4 rounded-md font-medium text-red-600 border border-red-300 hover:bg-red-50 transition-colors"
          >
            Test Payment Failure
          </button>
        )}

        {onCancel && (
          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="w-full py-2 px-4 rounded-md font-medium text-textSecondary border border-border hover:bg-bg transition-colors"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Security Notice */}
      <div className="mt-6 p-3 bg-bg rounded-md">
        <div className="flex items-start space-x-2">
          <Shield className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-textSecondary">
            <p className="mb-1">
              <strong>Secure Payment:</strong> All payments are processed securely through Stripe.
            </p>
            <p className="mb-1">
              <strong>Cancel Anytime:</strong> You can cancel your subscription at any time.
            </p>
            <p>
              <strong>Money-Back Guarantee:</strong> 30-day money-back guarantee for new subscribers.
            </p>
          </div>
        </div>
      </div>

      {/* Legal Disclaimer */}
      <div className="mt-4 text-xs text-textSecondary text-center">
        By upgrading, you agree to our Terms of Service and Privacy Policy. 
        Subscription will auto-renew monthly unless cancelled.
      </div>
    </div>
  )
}

// Success component for after payment
export const PaymentSuccess = ({ subscriptionData, onContinue }) => {
  return (
    <div className="bg-surface rounded-lg p-6 shadow-card border border-border max-w-md mx-auto text-center">
      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <Check className="w-8 h-8 text-white" />
      </div>
      
      <h2 className="text-2xl font-bold text-textPrimary mb-2">Welcome to Premium!</h2>
      <p className="text-textSecondary mb-6">
        Your subscription is now active. Enjoy all premium features!
      </p>

      {subscriptionData && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6 text-left">
          <h3 className="font-semibold text-green-800 mb-2">Subscription Details:</h3>
          <div className="text-sm text-green-700 space-y-1">
            <p>Plan: Premium Monthly</p>
            <p>Amount: {subscriptionUtils.formatPrice(5.00)}/month</p>
            {subscriptionData.currentPeriodEnd && (
              <p>Next billing: {new Date(subscriptionData.currentPeriodEnd).toLocaleDateString()}</p>
            )}
          </div>
        </div>
      )}

      <button
        onClick={onContinue}
        className="w-full py-3 px-4 bg-primary text-white rounded-md font-medium hover:bg-primary/90 transition-colors"
      >
        Continue to App
      </button>
    </div>
  )
}

export default PaymentUpgrade
