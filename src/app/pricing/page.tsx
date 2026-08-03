'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { PADDLE_PRICES, PADDLE_CLIENT_TOKEN } from '../../config/paddle';
import { Check, Shield, Zap, Sparkles, ArrowLeft, CreditCard, Copy, CheckCircle2, X, Send } from 'lucide-react';

declare global {
  interface Window {
    Paddle?: any;
  }
}

export default function PricingPage() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isPkModalOpen, setIsPkModalOpen] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const initPaddle = () => {
    if (typeof window !== 'undefined' && window.Paddle) {
      if (!window.Paddle.Setup) {
        window.Paddle.Environment.set('production');
        window.Paddle.Initialize({
          token: PADDLE_CLIENT_TOKEN,
        });
      }
    }
  };

  useEffect(() => {
    if (window.Paddle) {
      initPaddle();
    }
  }, []);

  const handleCheckout = (priceId: string, tierName: string) => {
    if (!window.Paddle) {
      alert('Paddle payment gateway is loading. Please try again in a moment.');
      return;
    }

    // Open Paddle Checkout with proper overlay settings & lifecycle events to prevent freeze/lockup
    window.Paddle.Checkout.open({
      items: [{ priceId: priceId, quantity: 1 }],
      customData: {
        tier: tierName,
      },
      settings: {
        displayMode: 'overlay',
        theme: 'dark',
      },
      events: {
        onClose: () => {
          console.log('Paddle checkout closed by user.');
        },
        onError: (error: any) => {
          console.error('Paddle checkout error:', error);
        },
      },
    });
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white py-12 px-6 relative overflow-hidden">
      {/* Load Paddle V2 CDN Script */}
      <Script
        src="https://cdn.paddle.com/paddle/v2/paddle.js"
        onLoad={initPaddle}
        strategy="afterInteractive"
      />

      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-cyan-500/10 blur-[150px] pointer-events-none -z-10" />

      {/* Top Bar */}
      <div className="max-w-5xl mx-auto mb-8 flex justify-between items-center">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-cyan-400 transition-colors bg-neutral-900/80 border border-neutral-800 px-3.5 py-2 rounded-xl backdrop-blur-md hover:border-cyan-500/30 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {/* Local Payment Trigger Button */}
        <button
          onClick={() => setIsPkModalOpen(true)}
          className="inline-flex items-center gap-2 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-4 py-2 rounded-xl hover:bg-emerald-500/20 transition-all cursor-pointer"
        >
          <CreditCard className="w-4 h-4" />
          <span>Pay via JazzCash / EasyPaisa (PK)</span>
        </button>
      </div>

      {/* Main Header & System Alert */}
      <div className="max-w-4xl mx-auto text-center mb-16 space-y-4">
        {/* Payment Methods Notice Banner */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium backdrop-blur-md mb-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
          <span>
            <b>Card Checkout Maintenance:</b> Direct card payments are currently down. Please use the <b>Pay via JazzCash / EasyPaisa (PK)</b> button above to complete manual payment.
          </span>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-xs font-mono text-cyan-400">
          <Sparkles className="w-3.5 h-3.5" /> Perpetual Hardware License Engine
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Flexible Pricing for{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
            Power Creators
          </span>
        </h1>

        <p className="text-neutral-400 text-sm md:text-base max-w-xl mx-auto">
          Scale your video assembly workflow with localized AI script parsing and hardware-bound activation management.
        </p>

        {/* Toggle Switch */}
        <div className="flex items-center justify-center gap-4 pt-6">
          <span className={`text-xs font-medium ${billingCycle === 'monthly' ? 'text-white' : 'text-neutral-500'}`}>
            Monthly
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            aria-label="Toggle billing cycle"
            className="w-12 h-6 bg-neutral-900 rounded-full p-1 border border-neutral-800 transition-colors flex items-center cursor-pointer"
          >
            <div
              className={`w-4 h-4 bg-cyan-400 rounded-full transition-transform shadow-md shadow-cyan-500/50 ${
                billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
          <span className={`text-xs font-medium ${billingCycle === 'yearly' ? 'text-white' : 'text-neutral-500'}`}>
            Yearly <span className="text-emerald-400 font-semibold">(Save up to 43%)</span>
          </span>
        </div>
      </div>

      {/* Pricing Grid */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Professional Card */}
        <div className="glass-card rounded-2xl p-8 flex flex-col justify-between border border-neutral-800 hover:border-cyan-500/40 transition-all">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-cyan-400" /> Professional
                </h2>
                <p className="text-xs text-neutral-400 mt-1">Ideal for solo creators and freelancers.</p>
              </div>
            </div>

            <div className="my-6">
              <span className="text-4xl font-extrabold text-white">
                {billingCycle === 'monthly' ? '$12' : '$99.9'}
              </span>
              <span className="text-neutral-500 text-xs ml-1">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
            </div>

            <ul className="space-y-3 text-xs text-neutral-300 mb-8 border-t border-neutral-800/80 pt-6">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>
                  <b>3 Active Device Seats</b> (HWID Linked)
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Unlimited Batch Video Builds</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>AI Asset Matching Engine</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>FFmpeg Local GPU Acceleration</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Standard Email Support</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() =>
              handleCheckout(
                billingCycle === 'monthly' ? PADDLE_PRICES.PRO_MONTHLY : PADDLE_PRICES.PRO_YEARLY,
                'PRO'
              )
            }
            className="w-full bg-cyan-400 hover:bg-cyan-300 text-neutral-950 font-semibold py-3 rounded-xl transition-all shadow-lg shadow-cyan-500/20 text-xs cursor-pointer"
          >
            Activate Professional License
          </button>
        </div>

        {/* Enterprise Card */}
        <div className="glass-card rounded-2xl p-8 flex flex-col justify-between border border-purple-500/30 hover:border-purple-500/60 transition-all relative">
          <span className="absolute -top-3 right-6 bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold px-3 py-0.5 rounded-full border border-purple-500/40 backdrop-blur-md">
            POWER USER
          </span>

          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-400" /> Enterprise
                </h2>
                <p className="text-xs text-neutral-400 mt-1">For production teams and high-volume rendering.</p>
              </div>
            </div>

            <div className="my-6">
              <span className="text-4xl font-extrabold text-white">
                {billingCycle === 'monthly' ? '$29' : '$199.9'}
              </span>
              <span className="text-neutral-500 text-xs ml-1">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
            </div>

            <ul className="space-y-3 text-xs text-neutral-300 mb-8 border-t border-neutral-800/80 pt-6">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-400 shrink-0" />
                <span>
                  <b>10 Active Device Seats</b> (HWID Linked)
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Everything in Professional</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Priority License Key Reset Support</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Commercial & Agency License Rights</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Early Access to Automation Plugins</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() =>
              handleCheckout(
                billingCycle === 'monthly' ? PADDLE_PRICES.ENT_MONTHLY : PADDLE_PRICES.ENT_YEARLY,
                'ENTERPRISE'
              )
            }
            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-purple-500/25 text-xs cursor-pointer"
          >
            Activate Enterprise License
          </button>
        </div>
      </div>

      {/* Pakistani Local Payment Modal */}
      {isPkModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md w-full p-6 relative space-y-6 text-left shadow-2xl">
            <button
              onClick={() => setIsPkModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-mono mb-2">
                Local Payment Method (PK)
              </div>
              <h3 className="text-xl font-bold text-white">Manual Local Payment</h3>
              <p className="text-xs text-neutral-400 mt-1">
                Transfer payment directly via JazzCash or EasyPaisa to activate your license manually.
              </p>
            </div>

            <div className="space-y-3">
              {/* JazzCash Box */}
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-red-400 font-bold uppercase tracking-wider block">
                    JazzCash Account
                  </span>
                  <p className="text-sm font-semibold text-white mt-0.5">Muhammad Qasim</p>
                  <p className="text-xs text-neutral-400 font-mono">03040378760</p>
                </div>
                <button
                  onClick={() => copyToClipboard('03040378760', 'jazzcash')}
                  className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-cyan-500/40 transition-colors cursor-pointer"
                  title="Copy Number"
                >
                  {copiedField === 'jazzcash' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* EasyPaisa Box */}
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">
                    EasyPaisa Account
                  </span>
                  <p className="text-sm font-semibold text-white mt-0.5">Muhammad Qasim</p>
                  <p className="text-xs text-neutral-400 font-mono">03164621295</p>
                </div>
                <button
                  onClick={() => copyToClipboard('03164621295', 'easypaisa')}
                  className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-cyan-500/40 transition-colors cursor-pointer"
                  title="Copy Number"
                >
                  {copiedField === 'easypaisa' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Verification Steps */}
            <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20 space-y-2">
              <h4 className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5" /> Required Verification Step:
              </h4>
              <p className="text-[11px] text-neutral-300 leading-relaxed">
                After completing the payment, please send a message with:
              </p>
              <ul className="text-[11px] text-neutral-400 list-disc list-inside space-y-1 font-mono">
                <li>Payment Screenshot (Receipt)</li>
                <li>Your Account Email</li>
                <li>Desired License Tier (Pro or Enterprise)</li>
              </ul>
            </div>

            <button
              onClick={() => setIsPkModalOpen(false)}
              className="w-full bg-neutral-800 hover:bg-neutral-700 text-white font-medium py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}