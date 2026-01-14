/**
 * DORK-X Homepage
 * Main landing page with scan initiation
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Search, AlertTriangle, CheckCircle } from 'lucide-react';
import { validateTarget, createScan } from '@/lib/api-service';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Shield className="w-16 h-16 text-purple-400" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            DORK-X
          </h1>
          <p className="text-xl text-gray-300 mb-2">
            Automated OSINT Reconnaissance Platform
          </p>
          <p className="text-sm text-red-400 font-semibold">
            ⚠️ FOR AUTHORIZED SECURITY TESTING ONLY ⚠️
          </p>
        </div>

        {/* Main Card */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-2xl p-8">
            {!showDisclaimer ? (
              // Step 1: Target Input
              <>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Start New Scan
                </h2>

                <div className="space-y-6">
                  {/* Target Domain Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Domain
                    </label>
                    <input
                      type="text"
                      placeholder="example.com"
                      value={targetDomain}
                      onChange={(e) => setTargetDomain(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                      onKeyPress={(e) => e.key === 'Enter' && handleValidate()}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter the domain you have authorization to scan
                    </p>
                  </div>

                  {/* Scan Profile */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Scan Profile
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {['quick', 'standard', 'deep'].map((profile) => (
                        <button
                          key={profile}
                          onClick={() => setScanProfile(profile as any)}
                          className={`py-3 px-4 rounded-lg border-2 font-medium transition-all ${
                            scanProfile === profile
                              ? 'border-purple-500 bg-purple-50 text-purple-700'
                              : 'border-gray-300 bg-white text-gray-700 hover:border-purple-300'
                          }`}
                        >
                          {profile.charAt(0).toUpperCase() + profile.slice(1)}
                        </button>
                      ))}
                    </div>
                    <div className="mt-2 text-xs text-gray-600">
                      {scanProfile === 'quick' && '⚡ 15-20 queries, ~5 minutes'}
                      {scanProfile === 'standard' && '🎯 40-50 queries, ~10 minutes'}
                      {scanProfile === 'deep' && '🔍 80+ queries, ~20 minutes'}
                    </div>
                  </div>

                  {/* Validation Result */}
                  {validationResult && validationResult.valid && (
                    <div className="flex items-start space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-green-800">
                          Target Validated
                        </p>
                        <p className="text-sm text-green-700">
                          {validationResult.normalized_target}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {error && (
                    <div className="flex items-start space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-red-800">Error</p>
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  )}

                  {/* Validate Button */}
                  <button
                    onClick={handleValidate}
                    disabled={isValidating || !targetDomain.trim()}
                    className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                  >
                    <Search className="w-5 h-5" />
                    <span>{isValidating ? 'Validating...' : 'Validate Target'}</span>
                  </button>
                </div>
              </>
            ) : (
              // Step 2: Legal Disclaimer
              <>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Legal Disclaimer & Authorization
                </h2>

                <div className="space-y-6">
                  <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6">
                    <h3 className="font-bold text-yellow-900 mb-4">
                      ⚖️ IMPORTANT LEGAL NOTICE
                    </h3>
                    <div className="space-y-3 text-sm text-yellow-900">
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
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="consent"
                      checked={consentAccepted}
                      onChange={(e) => setConsentAccepted(e.target.checked)}
                      className="mt-1 w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="consent" className="text-sm text-gray-700">
                      I have read and understand the legal disclaimer. I confirm that I have proper authorization to scan{' '}
                      <strong>{validationResult.normalized_target}</strong> and will use the results responsibly and ethically.
                    </label>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="flex items-start space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-red-700">{error}</p>
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
                      className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleStartScan}
                      disabled={!consentAccepted || isCreatingScan}
                      className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
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
        <div className="grid md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
            <h3 className="font-bold mb-2">🎯 Automated Dorking</h3>
            <p className="text-sm text-gray-300">
              12+ categories of security-focused dork queries
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
            <h3 className="font-bold mb-2">🛡️ Risk Classification</h3>
            <p className="text-sm text-gray-300">
              Automatic severity assessment and OWASP mapping
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
            <h3 className="font-bold mb-2">📄 Professional Reports</h3>
            <p className="text-sm text-gray-300">
              Pentesting-grade reports in PDF/HTML/CSV
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            To get started, edit the page.tsx file.
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
