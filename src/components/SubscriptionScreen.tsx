import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Crown, Check, Zap, Book, MessageCircle, Award, Star } from 'lucide-react';
import { Button } from './ui/button';

export default function SubscriptionScreen() {
  const [selectedPlan, setSelectedPlan] = useState('monthly');

  const plans = [
    {
      id: 'monthly',
      name: 'Monthly',
      price: 9.99,
      period: 'month',
      popular: false
    },
    {
      id: 'yearly',
      name: 'Yearly',
      price: 79.99,
      period: 'year',
      popular: true,
      savings: 'Save 33%'
    }
  ];

  const features = {
    free: [
      'Access to basic courses',
      'Limited AI chat queries',
      'Basic flashcards',
      'Community support'
    ],
    premium: [
      'Unlimited access to all courses',
      'Unlimited AI chat queries',
      'Advanced flashcard features',
      'Priority support',
      'Offline content access',
      'Advanced analytics',
      'Custom study plans',
      'Ad-free experience',
      'Early access to new features'
    ]
  };

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Software Developer',
      rating: 5,
      comment: 'The AI tutor is incredible! It explains complex topics so clearly.'
    },
    {
      name: 'Mike Chen',
      role: 'Student',
      rating: 5,
      comment: 'Best investment for my studies. The personalized learning is amazing.'
    },
    {
      name: 'Emily Davis',
      role: 'Designer',
      rating: 5,
      comment: 'Love the offline feature. I can study anywhere without internet.'
    }
  ];

  return (
    <div className="h-full bg-gradient-to-br from-gray-50 to-gray-100 overflow-y-auto">
      {/* Header */}
      <div className="p-6 pt-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div 
            className="w-20 h-20 mx-auto bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mb-4"
            style={{
              boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.15), -4px -4px 8px rgba(255, 255, 255, 0.9)'
            }}
          >
            <Crown className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Upgrade to Premium</h1>
          <p className="text-gray-600 mb-6">Unlock the full power of AI-driven learning</p>
        </motion.div>
      </div>

      {/* Plan Selection */}
      <div className="px-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h2 className="text-lg font-medium text-gray-900 mb-4 text-center">Choose Your Plan</h2>
          <div className="flex space-x-4">
            {plans.map((plan) => (
              <motion.div
                key={plan.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedPlan(plan.id)}
                className={`flex-1 p-4 rounded-xl cursor-pointer transition-all duration-200 relative ${
                  selectedPlan === plan.id 
                    ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white' 
                    : 'bg-white text-gray-900'
                }`}
                style={{
                  boxShadow: selectedPlan === plan.id
                    ? '8px 8px 16px rgba(0, 0, 0, 0.2), inset 1px 1px 0 rgba(255, 255, 255, 0.2)'
                    : '6px 6px 12px rgba(0, 0, 0, 0.1), -6px -6px 12px rgba(255, 255, 255, 0.9)'
                }}
              >
                {plan.popular && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center">
                  <h3 className="font-medium mb-2">{plan.name}</h3>
                  <div className="mb-2">
                    <span className="text-2xl font-bold">${plan.price}</span>
                    <span className="text-sm">/{plan.period}</span>
                  </div>
                  {plan.savings && (
                    <span className={`text-sm ${
                      selectedPlan === plan.id ? 'text-yellow-200' : 'text-green-600'
                    }`}>
                      {plan.savings}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Feature Comparison */}
      <div className="px-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-white rounded-xl overflow-hidden"
          style={{
            boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.1), -8px -8px 16px rgba(255, 255, 255, 0.9)'
          }}
        >
          <div className="p-6">
            <h3 className="font-medium text-gray-900 mb-4">What's Included</h3>
            
            {/* Premium Features */}
            <div className="space-y-3 mb-6">
              <h4 className="text-sm font-medium text-blue-600 mb-2">Premium Features</h4>
              {features.premium.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.05, duration: 0.3 }}
                  className="flex items-center space-x-3"
                >
                  <div 
                    className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center"
                    style={{
                      boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <Check className="text-white" size={12} />
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </motion.div>
              ))}
            </div>

            {/* Free Features */}
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Free Features</h4>
              {features.free.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.05, duration: 0.3 }}
                  className="flex items-center space-x-3 mb-2"
                >
                  <div 
                    className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center"
                    style={{
                      boxShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <Check className="text-white" size={12} />
                  </div>
                  <span className="text-gray-500">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Testimonials */}
      <div className="px-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <h3 className="font-medium text-gray-900 mb-4">What our users say</h3>
          <div className="space-y-4">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
                className="bg-white p-4 rounded-xl"
                style={{
                  boxShadow: '6px 6px 12px rgba(0, 0, 0, 0.1), -6px -6px 12px rgba(255, 255, 255, 0.9)'
                }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div 
                    className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
                    style={{
                      boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <span className="text-white font-medium">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                  <div className="flex ml-auto">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="text-yellow-500 fill-current" size={14} />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">"{testimonial.comment}"</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* CTA Button */}
      <div className="px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <Button
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-4 rounded-xl text-lg font-medium transition-all duration-200"
            style={{
              boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.2), -2px -2px 4px rgba(255, 255, 255, 0.1)'
            }}
          >
            <Crown className="mr-2" size={20} />
            Upgrade Now - ${plans.find(p => p.id === selectedPlan)?.price}/{plans.find(p => p.id === selectedPlan)?.period}
          </Button>
          
          <p className="text-center text-xs text-gray-500 mt-4 leading-relaxed">
            Cancel anytime. 7-day free trial. No commitments.
          </p>
        </motion.div>
      </div>
    </div>
  );
}