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
      const result = await validateTarget({ target: targetDomain });
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <Navbar />
      
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl translate-y-1/2 translate-x-1/2"></div>
      </div>
      
      {/* Hero Section with Navigation */}
      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-8">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all">
              <Shield className="w-16 h-16 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400" />
            </div>
          </div>
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-white mb-4 leading-tight">
            DORK-X
          </h1>
          <p className="text-2xl text-gray-300 mb-3 font-light">
            Automated OSINT Reconnaissance Platform
          </p>
          <div className="inline-block px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 backdrop-blur-xl">
            <p className="text-sm text-red-400 font-semibold">
              ⚠️ FOR AUTHORIZED SECURITY TESTING ONLY ⚠️
            </p>
          </div>
        </div>

        {/* Quick Navigation Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
          <Link href="/dashboard" className="group">
            <div className="relative p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-white/10 hover:border-purple-400/50 transition-all duration-300 group-hover:from-purple-500/20 group-hover:to-pink-500/20 group-hover:shadow-lg group-hover:shadow-purple-500/20 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-pink-600/0 group-hover:from-purple-600/10 group-hover:to-pink-600/10 transition-all duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <BarChart3 className="w-10 h-10 text-purple-400 group-hover:text-purple-300 transition-colors" />
                  <ArrowRight className="w-5 h-5 text-purple-400/60 group-hover:text-purple-300 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-white">Analytics Dashboard</h3>
                <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                  View scan history, statistics, and comprehensive analytics with interactive charts
                </p>
              </div>
            </div>
          </Link>

          <Link href="/categories" className="group">
            <div className="relative p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-white/10 hover:border-purple-400/50 transition-all duration-300 group-hover:from-purple-500/20 group-hover:to-pink-500/20 group-hover:shadow-lg group-hover:shadow-purple-500/20 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-pink-600/0 group-hover:from-purple-600/10 group-hover:to-pink-600/10 transition-all duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <List className="w-10 h-10 text-purple-400 group-hover:text-purple-300 transition-colors" />
                  <ArrowRight className="w-5 h-5 text-purple-400/60 group-hover:text-purple-300 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-white">Dork Categories</h3>
                <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                  Explore 20 specialized reconnaissance categories with 200+ query templates
                </p>
              </div>
            </div>
          </Link>

          <Link href="http://localhost:8000/docs" target="_blank" rel="noopener noreferrer" className="group">
            <div className="relative p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-white/10 hover:border-purple-400/50 transition-all duration-300 group-hover:from-purple-500/20 group-hover:to-pink-500/20 group-hover:shadow-lg group-hover:shadow-purple-500/20 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-pink-600/0 group-hover:from-purple-600/10 group-hover:to-pink-600/10 transition-all duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <FileText className="w-10 h-10 text-purple-400 group-hover:text-purple-300 transition-colors" />
                  <ArrowRight className="w-5 h-5 text-purple-400/60 group-hover:text-purple-300 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-white">API Documentation</h3>
                <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                  Complete REST API reference with interactive Swagger documentation
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Main Card */}
        <div className="max-w-2xl mx-auto">
          <div className="rounded-3xl bg-gradient-to-br from-slate-800/50 to-purple-800/50 backdrop-blur-2xl border border-white/20 shadow-2xl p-10 hover:border-white/30 transition-all">
            {!showDisclaimer ? (
              // Step 1: Target Input
              <>
                <h2 className="text-3xl font-bold text-white mb-8">
                  Start New Scan
                </h2>

                <div className="space-y-6">
                  {/* Target Domain Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-3">
                      Target Domain
                    </label>
                    <input
                      type="text"
                      placeholder="example.com"
                      value={targetDomain}
                      onChange={(e) => setTargetDomain(e.target.value)}
                      className="w-full px-4 py-3 border border-white/20 rounded-xl bg-white/5 backdrop-blur-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent text-white placeholder-gray-400 transition-all"
                      onKeyPress={(e) => e.key === 'Enter' && handleValidate()}
                    />
                    <p className="text-xs text-gray-400 mt-2">
                      Enter the domain you have authorization to scan
                    </p>
                  </div>

                  {/* Scan Profile */}
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-3">
                      Scan Profile
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {['quick', 'standard', 'deep'].map((profile) => (
                        <button
                          key={profile}
                          onClick={() => setScanProfile(profile as any)}
                          className={`py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                            scanProfile === profile
                              ? 'border-purple-400 bg-gradient-to-br from-purple-500/40 to-pink-500/40 text-white backdrop-blur-xl'
                              : 'border-white/20 bg-white/5 text-gray-300 hover:border-purple-400/50 hover:bg-white/10 backdrop-blur-xl'
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
                    <div className="flex items-start space-x-3 p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl backdrop-blur-xl">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-green-300">
                          Target Validated
                        </p>
                        <p className="text-sm text-green-400">
                          {validationResult.normalized_target}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {error && (
                    <div className="flex items-start space-x-3 p-4 bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-xl backdrop-blur-xl">
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
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-500 hover:to-pink-500 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-purple-500/50"
                  >
                    <Search className="w-5 h-5" />
                    <span>{isValidating ? 'Validating...' : 'Validate Target'}</span>
                  </button>
                </div>
              </>
            ) : (
              // Step 2: Legal Disclaimer
              <>
                <h2 className="text-3xl font-bold text-white mb-8">
                  Legal Disclaimer & Authorization
                </h2>

                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-2 border-yellow-500/30 rounded-xl p-6 backdrop-blur-xl">
                    <h3 className="font-bold text-yellow-300 mb-4">
                      ⚖️ IMPORTANT LEGAL NOTICE
                    </h3>
                    <div className="space-y-3 text-sm text-yellow-200/90">
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
                  <div className="flex items-start space-x-3 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl">
                    <input
                      type="checkbox"
                      id="consent"
                      checked={consentAccepted}
                      onChange={(e) => setConsentAccepted(e.target.checked)}
                      className="mt-1 w-5 h-5 text-purple-400 border-white/20 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="consent" className="text-sm text-gray-300">
                      I have read and understand the legal disclaimer. I confirm that I have proper authorization to scan{' '}
                      <strong className="text-white">{validationResult.normalized_target}</strong> and will use the results responsibly and ethically.
                    </label>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="flex items-start space-x-3 p-4 bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-xl backdrop-blur-xl">
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
                      className="flex-1 bg-gradient-to-r from-gray-700/50 to-slate-700/50 text-white py-3 px-6 rounded-xl font-semibold hover:from-gray-600/50 hover:to-slate-600/50 transition-all border border-white/10 backdrop-blur-xl"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleStartScan}
                      disabled={!consentAccepted || isCreatingScan}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-500 hover:to-pink-500 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-purple-500/50"
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
          <div className="relative p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-white/10 hover:border-purple-400/50 transition-all duration-300 group hover:from-purple-500/20 hover:to-pink-500/20 hover:shadow-lg hover:shadow-purple-500/20">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-pink-600/0 group-hover:from-purple-600/5 group-hover:to-pink-600/5 transition-all duration-300 rounded-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-xl mb-4 group-hover:from-purple-500/50 group-hover:to-pink-500/50 transition-all">
                <Zap className="w-7 h-7 text-purple-300" />
              </div>
              <h3 className="font-bold text-lg mb-3 text-white">Automated Dorking</h3>
              <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                20+ specialized reconnaissance categories with 200+ security-focused dork queries
              </p>
            </div>
          </div>
          <div className="relative p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-white/10 hover:border-purple-400/50 transition-all duration-300 group hover:from-purple-500/20 hover:to-pink-500/20 hover:shadow-lg hover:shadow-purple-500/20">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-pink-600/0 group-hover:from-purple-600/5 group-hover:to-pink-600/5 transition-all duration-300 rounded-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-xl mb-4 group-hover:from-purple-500/50 group-hover:to-pink-500/50 transition-all">
                <Target className="w-7 h-7 text-purple-300" />
              </div>
              <h3 className="font-bold text-lg mb-3 text-white">Risk Classification</h3>
              <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                Automatic severity assessment (CRITICAL/HIGH/MEDIUM) with detailed risk analysis
              </p>
            </div>
          </div>
          <div className="relative p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-white/10 hover:border-purple-400/50 transition-all duration-300 group hover:from-purple-500/20 hover:to-pink-500/20 hover:shadow-lg hover:shadow-purple-500/20">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-pink-600/0 group-hover:from-purple-600/5 group-hover:to-pink-600/5 transition-all duration-300 rounded-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-xl mb-4 group-hover:from-purple-500/50 group-hover:to-pink-500/50 transition-all">
                <Database className="w-7 h-7 text-purple-300" />
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
