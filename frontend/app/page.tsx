/**
 * DORK-X Homepage
 * Main landing page with scan initiation
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, Search, AlertTriangle, CheckCircle, BarChart3, List, FileText, ArrowRight, Zap, Target, Database } from 'lucide-react';
import { validateTarget, createScan } from '@/lib/api-service';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export default function Home() {
  const router = useRouter();
  const [targetDomain, setTargetDomain] = useState('');
  const [scanProfile, setScanProfile] = useState<'quick' | 'standard' | 'deep'>('standard');
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isCreatingScan, setIsCreatingScan] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleValidate = async () => {
    if (!targetDomain.trim()) {
      setError('Please enter a target domain');
      return;
    }

    setIsValidating(true);
    setError(null);
    setValidationResult(null);

    try {
      const result = await validateTarget(targetDomain);
      setValidationResult(result);
      
      if (result.valid) {
        setShowDisclaimer(true);
      } else {
        setError(result.reason || 'Invalid target domain');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to validate target');
    } finally {
      setIsValidating(false);
    }
  };

  const handleStartScan = async () => {
    if (!consentAccepted) {
      setError('You must accept the legal disclaimer to proceed');
      return;
    }

    setIsCreatingScan(true);
    setError(null);

    try {
      const scan = await createScan({
        target_domain: validationResult.normalized_target || targetDomain,
        scan_profile: scanProfile,
        consent_accepted: true,
        user_id: 'anonymous',
      });

      // Redirect to scan details page
      router.push(`/scans/${scan.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create scan');
    } finally {
      setIsCreatingScan(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black relative overflow-x-hidden">
      <Navbar />

      {/* Optimized animated background: smaller orbs, lighter blur, GPU hints */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Neon orbs - smaller, less blur, GPU-accelerated */}
        <div className="absolute top-[-8%] left-[-8%] w-[260px] h-[260px] bg-cyan-400/15 rounded-full blur-xl animate-pulse-slow will-change-transform" style={{ filter: 'blur(32px)' }} />
        <div className="absolute bottom-[-8%] right-[-8%] w-[260px] h-[260px] bg-lime-400/15 rounded-full blur-xl animate-pulse-slow will-change-transform" style={{ filter: 'blur(32px)' }} />
        {/* Animated scanlines - lower opacity, GPU-accelerated */}
        <div className="absolute inset-0 bg-[repeating-linear-gradient(180deg,rgba(0,255,247,0.03)_0_2px,transparent_2px_40px)] opacity-40 animate-scanlines will-change-opacity" />
      </div>

      {/* Hero Section with Navigation */}
      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-8">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-500/30 to-lime-500/30 backdrop-blur-2xl border-2 border-cyan-400/60 hover:border-lime-400/80 transition-all shadow-2xl shadow-cyan-500/40 animate-glow">
              <Shield className="w-16 h-16 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-lime-300 to-cyan-300 animate-neon" />
            </div>
          </div>
          <h1 className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-lime-300 to-cyan-300 mb-4 leading-tight animate-gradient-move" style={{ textShadow: '0 0 40px #00fff7, 0 0 80px #a8ff60' }}>
            DORK-X
          </h1>
          <p className="text-2xl text-cyan-200 mb-3 font-mono font-light animate-fadein">
            Automated OSINT Reconnaissance Platform
          </p>
          <div className="inline-block px-4 py-2 rounded-full bg-red-500/20 border-2 border-red-500/60 backdrop-blur-xl shadow-lg shadow-red-500/30 animate-pulse">
            <p className="text-sm text-red-300 font-semibold tracking-widest animate-flicker">
              ⚠️ FOR AUTHORIZED SECURITY TESTING ONLY ⚠️
            </p>
          </div>
        </div>

        {/* Quick Navigation Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          <Link href="/dashboard" className="group">
            <div className="relative p-8 rounded-2xl glass border-2 border-cyan-400/40 group-hover:border-cyan-300/80 transition-all duration-300 overflow-hidden shadow-xl shadow-cyan-500/20 group-hover:shadow-cyan-400/40 animate-card-float">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/0 to-blue-600/0 group-hover:from-cyan-600/10 group-hover:to-blue-600/10 transition-all duration-300 pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <BarChart3 className="w-10 h-10 text-cyan-300 group-hover:text-cyan-200 transition-colors animate-icon-bounce" />
                  <ArrowRight className="w-5 h-5 text-cyan-300/60 group-hover:text-cyan-200 group-hover:translate-x-1 transition-all animate-arrow-move" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-cyan-100 tracking-wide animate-fadein">Analytics Dashboard</h3>
                <p className="text-sm text-cyan-200/80 group-hover:text-cyan-100 transition-colors animate-fadein">
                  View scan history, statistics, and comprehensive analytics with interactive charts
                </p>
              </div>
            </div>
          </Link>

          <Link href="/categories" className="group">
            <div className="relative p-8 rounded-2xl glass border-2 border-lime-400/40 group-hover:border-lime-300/80 transition-all duration-300 overflow-hidden shadow-xl shadow-lime-500/20 group-hover:shadow-lime-400/40 animate-card-float">
              <div className="absolute inset-0 bg-gradient-to-br from-lime-600/0 to-green-600/0 group-hover:from-lime-600/10 group-hover:to-green-600/10 transition-all duration-300 pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <List className="w-10 h-10 text-lime-300 group-hover:text-lime-200 transition-colors animate-icon-bounce" />
                  <ArrowRight className="w-5 h-5 text-lime-300/60 group-hover:text-lime-200 group-hover:translate-x-1 transition-all animate-arrow-move" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-lime-100 tracking-wide animate-fadein">Dork Categories</h3>
                <p className="text-sm text-lime-200/80 group-hover:text-lime-100 transition-colors animate-fadein">
                  Explore 20 specialized reconnaissance categories with 200+ query templates
                </p>
              </div>
            </div>
          </Link>

          <Link href="http://localhost:8000/docs" target="_blank" rel="noopener noreferrer" className="group">
            <div className="relative p-8 rounded-2xl glass border-2 border-pink-400/40 group-hover:border-pink-300/80 transition-all duration-300 overflow-hidden shadow-xl shadow-pink-500/20 group-hover:shadow-pink-400/40 animate-card-float">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-600/0 to-red-600/0 group-hover:from-pink-600/10 group-hover:to-red-600/10 transition-all duration-300 pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <FileText className="w-10 h-10 text-pink-300 group-hover:text-pink-200 transition-colors animate-icon-bounce" />
                  <ArrowRight className="w-5 h-5 text-pink-300/60 group-hover:text-pink-200 group-hover:translate-x-1 transition-all animate-arrow-move" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-pink-100 tracking-wide animate-fadein">API Documentation</h3>
                <p className="text-sm text-pink-200/80 group-hover:text-pink-100 transition-colors animate-fadein">
                  Complete REST API reference with interactive Swagger documentation
                </p>
              </div>
            </div>
          </Link>
        </div>
      {/* Animations for cyberpunk/futuristic feel */}
      <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.04); }
        }
        .animate-pulse-slow { animation: pulse-slow 6s infinite cubic-bezier(.4,0,.2,1); will-change: transform, opacity; }
        @keyframes scanlines {
          0% { background-position-y: 0; }
          100% { background-position-y: 40px; }
        }
        .animate-scanlines { animation: scanlines 2.5s linear infinite; will-change: background-position-y, opacity; }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 32px 0 #00fff7, 0 0 8px 0 #a8ff60; }
          50% { box-shadow: 0 0 48px 4px #00fff7, 0 0 16px 4px #a8ff60; }
        }
        .animate-glow { animation: glow 3.5s infinite alternate; }
        @keyframes neon {
          0%, 100% { filter: drop-shadow(0 0 8px #00fff7) drop-shadow(0 0 2px #a8ff60); }
          50% { filter: drop-shadow(0 0 16px #00fff7) drop-shadow(0 0 4px #a8ff60); }
        }
        .animate-neon { animation: neon 2.5s infinite alternate; }
        @keyframes gradient-move {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        .animate-gradient-move { background-size: 200% 200%; animation: gradient-move 8s linear infinite; }
        @keyframes fadein {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: none; }
        }
        .animate-fadein { animation: fadein 1.2s cubic-bezier(.4,0,.2,1) both; }
        @keyframes flicker {
          0%, 100% { opacity: 1; }
          45% { opacity: 0.7; }
          50% { opacity: 0.3; }
          55% { opacity: 0.7; }
        }
        .animate-flicker { animation: flicker 2.5s infinite; }
        @keyframes card-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px) scale(1.01); }
        }
        .animate-card-float { animation: card-float 4s infinite cubic-bezier(.4,0,.2,1); }
        @keyframes icon-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px) scale(1.08); }
        }
        .animate-icon-bounce { animation: icon-bounce 2.2s infinite cubic-bezier(.4,0,.2,1); }
        @keyframes arrow-move {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(8px) scale(1.1); }
        }
        .animate-arrow-move { animation: arrow-move 1.8s infinite cubic-bezier(.4,0,.2,1); }
      `}</style>

        {/* Main Card */}
        <div className="max-w-2xl mx-auto">
          <div className="rounded-3xl bg-gradient-to-br from-slate-900/60 to-black/60 backdrop-blur-2xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/20 p-10 hover:border-cyan-400/50 transition-all">
            {!showDisclaimer ? (
              // Step 1: Target Input
              <>
                <h2 className="text-3xl font-bold text-cyan-400 mb-8" style={{ textShadow: '0 0 20px rgba(0,213,255,0.3)' }}>
                  Start New Scan
                </h2>

                <div className="space-y-6">
                  {/* Target Domain Input */}
                  <div>
                    <label className="block text-sm font-medium text-cyan-300 mb-3">
                      Target Domain
                    </label>
                    <input
                      type="text"
                      placeholder="example.com"
                      value={targetDomain}
                      onChange={(e) => setTargetDomain(e.target.value)}
                      className="w-full px-4 py-3 border border-cyan-500/30 rounded-xl bg-black/40 backdrop-blur-xl focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 text-cyan-400 placeholder-gray-500 transition-all shadow-lg shadow-cyan-500/10"
                      onKeyPress={(e) => e.key === 'Enter' && handleValidate()}
                    />
                    <p className="text-xs text-gray-400 mt-2">
                      Enter the domain you have authorization to scan
                    </p>
                  </div>

                  {/* Scan Profile */}
                  <div>
                    <label className="block text-sm font-medium text-lime-300 mb-3">
                      Scan Profile
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {['quick', 'standard', 'deep'].map((profile) => (
                        <button
                          key={profile}
                          onClick={() => setScanProfile(profile as any)}
                          className={`py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                            scanProfile === profile
                              ? 'border-lime-400 bg-gradient-to-br from-lime-500/30 to-cyan-500/30 text-lime-300 backdrop-blur-xl shadow-lg shadow-lime-500/20'
                              : 'border-cyan-500/30 bg-black/40 text-gray-400 hover:border-lime-400/50 hover:bg-black/60 backdrop-blur-xl'
                          }`}
                        >
                          {profile.charAt(0).toUpperCase() + profile.slice(1)}
                        </button>
                      ))}
                    </div>
                    <div className="mt-3 text-xs text-gray-400">
                      {scanProfile === 'quick' && '⚡ 15-20 queries, ~5 minutes'}
                      {scanProfile === 'standard' && '🎯 40-50 queries, ~10 minutes'}
                      {scanProfile === 'deep' && '🔍 80+ queries, ~20 minutes'}
                    </div>
                  </div>

                  {/* Validation Result */}
                  {validationResult && validationResult.valid && (
                    <div className="flex items-start space-x-3 p-4 bg-gradient-to-br from-lime-500/10 to-green-500/10 border border-lime-500/50 rounded-xl backdrop-blur-xl shadow-lg shadow-lime-500/20">
                      <CheckCircle className="w-5 h-5 text-lime-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-lime-300">
                          Target Validated
                        </p>
                        <p className="text-sm text-lime-400">
                          {validationResult.normalized_target}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {error && (
                    <div className="flex items-start space-x-3 p-4 bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/50 rounded-xl backdrop-blur-xl shadow-lg shadow-red-500/20">
                      <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-red-300">Error</p>
                        <p className="text-sm text-red-400">{error}</p>
                      </div>
                    </div>
                  )}

                  {/* Validate Button */}
                  <button
                    onClick={handleValidate}
                    disabled={isValidating || !targetDomain.trim()}
                    className="w-full bg-gradient-to-r from-cyan-500 to-lime-500 text-black py-3 px-6 rounded-xl font-semibold hover:from-cyan-400 hover:to-lime-400 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/50 hover:shadow-cyan-400/60"
                  >
                    <Search className="w-5 h-5" />
                    <span>{isValidating ? 'Validating...' : 'Validate Target'}</span>
                  </button>
                </div>
              </>
            ) : (
              // Step 2: Legal Disclaimer
              <>
                <h2 className="text-3xl font-bold text-cyan-400 mb-8" style={{ textShadow: '0 0 20px rgba(0,213,255,0.3)' }}>
                  Legal Disclaimer & Authorization
                </h2>

                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-red-500/15 to-orange-500/15 border-2 border-red-500/50 rounded-xl p-6 backdrop-blur-xl shadow-lg shadow-red-500/20">
                    <h3 className="font-bold text-red-400 mb-4" style={{ textShadow: '0 0 10px rgba(255,0,0,0.3)' }}>
                      ⚖️ IMPORTANT LEGAL NOTICE
                    </h3>
                    <div className="space-y-3 text-sm text-red-300/90">
                      <p>
                        By proceeding, you acknowledge and agree that:
                      </p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>You have <strong>written authorization</strong> to scan the target domain</li>
                        <li>Unauthorized scanning may violate laws including the Computer Fraud and Abuse Act (CFAA)</li>
                        <li>This tool is for <strong>ethical penetration testing</strong> and security research only</li>
                        <li>You will not use discovered information for malicious purposes</li>
                        <li>All scan activity is logged for audit purposes</li>
                        <li>You assume full legal responsibility for your actions</li>
                      </ul>
                    </div>
                  </div>

                  {/* Consent Checkbox */}
                  <div className="flex items-start space-x-3 p-4 rounded-xl bg-black/40 border border-cyan-500/30 backdrop-blur-xl">
                    <input
                      type="checkbox"
                      id="consent"
                      checked={consentAccepted}
                      onChange={(e) => setConsentAccepted(e.target.checked)}
                      className="mt-1 w-5 h-5 text-cyan-400 border-cyan-500/50 rounded focus:ring-cyan-400 accent-cyan-400"
                    />
                    <label htmlFor="consent" className="text-sm text-gray-300">
                      I have read and understand the legal disclaimer. I confirm that I have proper authorization to scan{' '}
                      <strong className="text-cyan-400">{validationResult.normalized_target}</strong> and will use the results responsibly and ethically.
                    </label>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="flex items-start space-x-3 p-4 bg-gradient-to-br from-red-500/15 to-orange-500/15 border border-red-500/50 rounded-xl backdrop-blur-xl shadow-lg shadow-red-500/20">
                      <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-red-400">{error}</p>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-4">
                    <button
                      onClick={() => {
                        setShowDisclaimer(false);
                        setConsentAccepted(false);
                      }}
                      className="flex-1 bg-gradient-to-r from-gray-700/60 to-slate-800/60 text-gray-300 py-3 px-6 rounded-xl font-semibold hover:from-gray-600/60 hover:to-slate-700/60 transition-all border border-cyan-500/20 backdrop-blur-xl shadow-lg hover:border-cyan-500/40"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleStartScan}
                      disabled={!consentAccepted || isCreatingScan}
                      className="flex-1 bg-gradient-to-r from-lime-500 to-cyan-500 text-black py-3 px-6 rounded-xl font-semibold hover:from-lime-400 hover:to-cyan-400 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all shadow-lg shadow-lime-500/50 hover:shadow-lime-400/60"
                    >
                      {isCreatingScan ? 'Initiating Scan...' : 'Start Scan'}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
          <div className="relative p-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-xl border border-cyan-500/30 hover:border-cyan-400/60 transition-all duration-300 group hover:from-cyan-500/20 hover:to-blue-500/20 hover:shadow-lg hover:shadow-cyan-500/30">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/0 to-blue-600/0 group-hover:from-cyan-600/5 group-hover:to-blue-600/5 transition-all duration-300 rounded-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-cyan-500/30 to-blue-500/30 rounded-xl mb-4 group-hover:from-cyan-500/50 group-hover:to-blue-500/50 transition-all">
                <Zap className="w-7 h-7 text-cyan-400" />
              </div>
              <h3 className="font-bold text-lg mb-3 text-white">Automated Dorking</h3>
              <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                20+ specialized reconnaissance categories with 200+ security-focused dork queries
              </p>
            </div>
          </div>
          <div className="relative p-6 rounded-2xl bg-gradient-to-br from-lime-500/10 to-green-500/10 backdrop-blur-xl border border-lime-500/30 hover:border-lime-400/60 transition-all duration-300 group hover:from-lime-500/20 hover:to-green-500/20 hover:shadow-lg hover:shadow-lime-500/30">
            <div className="absolute inset-0 bg-gradient-to-br from-lime-600/0 to-green-600/0 group-hover:from-lime-600/5 group-hover:to-green-600/5 transition-all duration-300 rounded-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-lime-500/30 to-green-500/30 rounded-xl mb-4 group-hover:from-lime-500/50 group-hover:to-green-500/50 transition-all">
                <Target className="w-7 h-7 text-lime-400" />
              </div>
              <h3 className="font-bold text-lg mb-3 text-white">Risk Classification</h3>
              <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                Automatic severity assessment (CRITICAL/HIGH/MEDIUM) with detailed risk analysis
              </p>
            </div>
          </div>
          <div className="relative p-6 rounded-2xl bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-xl border border-orange-500/30 hover:border-orange-400/60 transition-all duration-300 group hover:from-orange-500/20 hover:to-red-500/20 hover:shadow-lg hover:shadow-orange-500/30">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-600/0 to-red-600/0 group-hover:from-orange-600/5 group-hover:to-red-600/5 transition-all duration-300 rounded-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-orange-500/30 to-red-500/30 rounded-xl mb-4 group-hover:from-orange-500/50 group-hover:to-red-500/50 transition-all">
                <Database className="w-7 h-7 text-orange-400" />
              </div>
              <h3 className="font-bold text-lg mb-3 text-white">Comprehensive Reports</h3>
              <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                Professional pentesting-grade reports with detailed findings and remediation guidance
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
