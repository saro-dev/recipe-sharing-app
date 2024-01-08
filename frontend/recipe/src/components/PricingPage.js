// PricingPage.js

import React from 'react';
import './PricingPage.css';

const PricingPage = () => {
  const pricingPlans = [
    {
      title: 'Basic Plan',
      price: '₹99/month',
      features: ['Access to 100+ recipes', 'Weekly newsletter', 'Basic customer support'],
    },
    {
      title: 'Standard Plan',
      price: '₹199/month',
      features: ['Access to premium recipes', 'Personalized meal plans', '24/7 customer support'],
    },
    {
      title: 'Premium Plan',
      price: '₹299/month',
      features: [
        'Access to all recipes and features',
        'Priority customer support',
        'Exclusive cooking workshops',
      ],
    },
  ];

  return (
    <div className="pricing-page">
      <h2 className="pricing-title">Choose Your Plan</h2>

      <div className="pricing-plans">
        {pricingPlans.map((plan, index) => (
          <div className={`pricing-card ${index === 2 ? 'gold' : ''}`} key={index}>
            <h3 className="plan-title">{plan.title}</h3>
            <p className="plan-price">{plan.price}</p>
            <ul className="plan-features">
              {plan.features.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>
            <button className="plan-button">Select Plan</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingPage;
