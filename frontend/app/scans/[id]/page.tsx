/**
 * Scan Details Page
 * Real-time scan monitoring and results display
 */

'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Shield,
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  AlertTriangle,
  FileText,
  Download
} from 'lucide-react';
import { getScan, getScanFindings, getScanStatistics, generateReport } from '@/lib/api-service';
import { formatDate, getRiskColor, getStatusColor } from '@/lib/utils';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import type { Scan, Finding, ScanStatistics } from '@/lib/api-service';

export default function ScanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [scan, setScan] = useState<Scan | null>(null);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [statistics, setStatistics] = useState<ScanStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string>('all');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  useEffect(() => {
    loadScanData();
    
    // Poll for updates if scan is running
    const interval = setInterval(() => {
      if (scan?.status === 'running' || scan?.status === 'pending') {
        loadScanData();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [id, scan?.status]);

  const loadScanData = async () => {
    try {
      // Load all data in parallel, but handle individual failures
      const [scanData, findingsData, statsData] = await Promise.all([
        getScan(id).catch(err => {
          console.warn('Failed to load scan details:', err.message);
          return null;
        }),
        getScanFindings(id).catch(err => {
          console.warn('Failed to load findings:', err.message);
          return { findings: [] };
        }),
        getScanStatistics(id).catch(err => {
          console.warn('Failed to load statistics:', err.message);
          return null;
        })
      ]);

      if (scanData) setScan(scanData);
      if (findingsData) setFindings(findingsData.findings || []);
      if (statsData) setStatistics(statsData);
      
      // Only set error if all requests failed
      if (!scanData && !findingsData && !statsData) {
        setError('Failed to load scan data');
      } else {
        setError(null);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load scan data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateReport = async (format: 'pdf' | 'html' | 'csv') => {
    setIsGeneratingReport(true);
    try {
      await generateReport(id, format);
      alert(`${format.toUpperCase()} report generated successfully!`);
    } catch (err: any) {
      alert('Failed to generate report');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const filteredFindings = selectedRiskFilter === 'all'
    ? findings
    : findings.filter((f: Finding) => f.risk_level === selectedRiskFilter);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 200px)' }}>
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading scan data...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !scan) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 200px)' }}>
          <div className="text-center">
            <XCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <p className="text-gray-800 font-semibold mb-2">Error Loading Scan</p>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Back to Home
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => router.push('/')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </button>

          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <Shield className="w-10 h-10 text-purple-600 mt-1" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{scan.target_domain}</h1>
                <p className="text-sm text-gray-600">
                  Scan ID: {scan.id}
                </p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(scan.status)}`}>
                    {scan.status.toUpperCase()}
                  </span>
                  <span className="text-sm text-gray-600">
                    <Clock className="w-4 h-4 inline mr-1" />
                    {formatDate(scan.started_at)}
                  </span>
                </div>
              </div>
            </div>

            {scan.status === 'completed' && (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleGenerateReport('pdf')}
                  disabled={isGeneratingReport}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>PDF Report</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border">
              <div className="text-3xl font-bold text-gray-900">{statistics.total_findings}</div>
              <div className="text-sm text-gray-600">Total Findings</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <div className="text-3xl font-bold text-red-600">{statistics.critical_findings}</div>
              <div className="text-sm text-red-700">Critical</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
              <div className="text-3xl font-bold text-orange-600">{statistics.high_findings}</div>
              <div className="text-sm text-orange-700">High</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <div className="text-3xl font-bold text-yellow-600">{statistics.medium_findings}</div>
              <div className="text-sm text-yellow-700">Medium</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="text-3xl font-bold text-blue-600">{statistics.low_findings}</div>
              <div className="text-sm text-blue-700">Low</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="text-3xl font-bold text-gray-600">{statistics.info_findings}</div>
              <div className="text-sm text-gray-700">Info</div>
            </div>
          </div>

          {/* Findings Table */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Findings</h2>
                <div className="flex space-x-2">
                  {['all', 'critical', 'high', 'medium', 'low', 'info'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setSelectedRiskFilter(filter)}
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        selectedRiskFilter === filter
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              {filteredFindings.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p>No findings to display</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">URL</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Discovered</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredFindings.map((finding) => (
                      <tr key={finding.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${getRiskColor(finding.risk_level)}`}>
                            {finding.risk_level.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {finding.category}
                        </td>
                        <td className="px-4 py-3">
                          <a
                            href={finding.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline break-all"
                          >
                            {finding.url.length > 60 ? finding.url.substring(0, 60) + '...' : finding.url}
                          </a>
                          {finding.title && (
                            <p className="text-xs text-gray-500 mt-1">{finding.title}</p>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {formatDate(finding.discovered_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
