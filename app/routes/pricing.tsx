import Navbar from "../../components/Navbar";
import { Check } from "lucide-react";

export default function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "$0",
      description: "Perfect for exploring AI design.",
      features: ["5 Renders / month", "Standard quality", "Community access"],
      cta: "Get Started",
      featured: false
    },
    {
      name: "Pro",
      price: "$29",
      description: "For professionals and enthusiasts.",
      features: ["Unlimited Renders", "4K Ultra-HD quality", "Private projects", "Priority support"],
      cta: "Upgrade to Pro",
      featured: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "Tailored solutions for architecture firms.",
      features: ["API access", "Team collaboration", "Custom AI models", "Dedicated account manager"],
      cta: "Contact Sales",
      featured: false
    }
  ];

  return (
    <div className="pricing-page">
      <Navbar />
      <main className="container">
        <header className="page-header">
          <h1>Simple, Transparent Pricing</h1>
          <p className="subtitle">Choose the plan that fits your creative needs.</p>
        </header>

        <div className="pricing-grid">
          {plans.map((plan) => (
            <div key={plan.name} className={`pricing-card ${plan.featured ? 'featured' : ''}`}>
              <div className="card-header">
                <h3>{plan.name}</h3>
                <div className="price">
                  <span className="amount">{plan.price}</span>
                  {plan.price !== "Custom" && <span className="period">/mo</span>}
                </div>
                <p>{plan.description}</p>
              </div>
              <ul className="features">
                {plan.features.map(f => (
                  <li key={f}><Check size={16} /> {f}</li>
                ))}
              </ul>
              <button className={`cta ${plan.featured ? 'primary' : 'outline'}`}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
