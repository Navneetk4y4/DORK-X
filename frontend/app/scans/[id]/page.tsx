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
import { getScan, getScanFindings, getScanStatistics, generateReport, getScanReports } from '@/lib/api-service';
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
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    loadScanData();
    loadReports();
    // Poll for updates if scan is running
    const interval = setInterval(() => {
      if (scan?.status === 'running' || scan?.status === 'pending') {
        loadScanData();
        loadReports();
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

  const loadReports = async () => {
    try {
      const data = await getScanReports(id);
      setReports(data || []);
    } catch (err) {
      setReports([]);
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
      <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black">
        <Navbar />
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 200px)' }}>
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading scan data...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !scan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black">
        <Navbar />
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 200px)' }}>
          <div className="text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-white font-semibold mb-2">Error Loading Scan</p>
            <p className="text-gray-400 mb-4">{error}</p>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-lime-500 text-black rounded-lg hover:from-cyan-400 hover:to-lime-400 font-semibold"
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
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black">
      <Navbar />
      {/* Header */}
      <div className="bg-gradient-to-r from-black via-slate-900 to-black border-b border-cyan-500/20">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => router.push('/')}
            className="flex items-center text-cyan-400 hover:text-cyan-300 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </button>

          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <Shield className="w-10 h-10 text-cyan-400 mt-1" />
              <div>
                <h1 className="text-2xl font-bold text-white">{scan.target_domain}</h1>
                <p className="text-sm text-gray-400">
                  Scan ID: {scan.id}
                </p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(scan.status)}`}>
                    {scan.status.toUpperCase()}
                  </span>
                  <span className="text-sm text-gray-400">
                    <Clock className="w-4 h-4 inline mr-1" />
                    {formatDate(scan.started_at)}
                  </span>
                </div>
              </div>
            </div>

            {scan.status === 'completed' && (
              <div className="flex space-x-2">
                {/* Only one button for CSV: download if exists, else generate */}
                {(() => {
                  const csvReport = reports.find((r) => r.report_type === 'csv');
                  if (csvReport) {
                    return (
                      <a
                        href={`http://localhost:8000${csvReport.download_url}`}
                        download={`dorkx_report_${scan.id}.csv`}
                        className="px-4 py-2 bg-gradient-to-r from-lime-500 to-cyan-500 text-black rounded-lg hover:from-lime-400 hover:to-cyan-400 flex items-center space-x-2 font-semibold"
                        style={{ textDecoration: 'none' }}
                      >
                        <Download className="w-4 h-4" />
                        <span>Download CSV</span>
                      </a>
                    );
                  } else {
                    return (
                      <button
                        onClick={() => handleGenerateReport('csv')}
                        disabled={isGeneratingReport}
                        className="px-4 py-2 bg-gradient-to-r from-lime-500 to-cyan-500 text-black rounded-lg hover:from-lime-400 hover:to-cyan-400 disabled:from-gray-600 disabled:to-gray-700 flex items-center space-x-2 font-semibold"
                      >
                        <Download className="w-4 h-4" />
                        <span>Generate CSV</span>
                      </button>
                    );
                  }
                })()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
            <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg p-4 border border-cyan-500/30 shadow-lg shadow-cyan-500/10">
              <div className="text-3xl font-bold text-cyan-400">{statistics.total_findings}</div>
              <div className="text-sm text-gray-400">Total Findings</div>
            </div>
            <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-lg p-4 border border-red-500/30 shadow-lg shadow-red-500/10">
              <div className="text-3xl font-bold text-red-400">{statistics.critical_findings}</div>
              <div className="text-sm text-red-300">Critical</div>
            </div>
            <div className="bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-lg p-4 border border-orange-500/30 shadow-lg shadow-orange-500/10">
              <div className="text-3xl font-bold text-orange-400">{statistics.high_findings}</div>
              <div className="text-sm text-orange-300">High</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-500/20 to-amber-500/20 rounded-lg p-4 border border-yellow-500/30 shadow-lg shadow-yellow-500/10">
              <div className="text-3xl font-bold text-yellow-400">{statistics.medium_findings}</div>
              <div className="text-sm text-yellow-300">Medium</div>
            </div>
            <div className="bg-gradient-to-br from-lime-500/20 to-green-500/20 rounded-lg p-4 border border-lime-500/30 shadow-lg shadow-lime-500/10">
              <div className="text-3xl font-bold text-lime-400">{statistics.low_findings}</div>
              <div className="text-sm text-lime-300">Low</div>
            </div>
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg p-4 border border-blue-500/30 shadow-lg shadow-blue-500/10">
              <div className="text-3xl font-bold text-blue-400">{statistics.info_findings}</div>
              <div className="text-sm text-blue-300">Info</div>
            </div>
          </div>

          {/* Findings Table */}
          <div className="bg-gradient-to-br from-slate-900/60 to-black/60 rounded-lg shadow-lg shadow-cyan-500/10 border border-cyan-500/30">
            <div className="p-4 border-b border-cyan-500/20">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Findings</h2>
                <div className="flex space-x-2">
                  {['all', 'critical', 'high', 'medium', 'low', 'info'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setSelectedRiskFilter(filter)}
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        selectedRiskFilter === filter
                          ? 'bg-gradient-to-r from-cyan-500 to-lime-500 text-black font-semibold'
                          : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/50 border border-cyan-500/20'
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
                <div className="p-8 text-center text-gray-400">
                  <FileText className="w-12 h-12 mx-auto mb-2 text-gray-500" />
                  <p>No findings to display</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-cyan-500/10 to-lime-500/10 border-b border-cyan-500/20">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Risk</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Category</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Query</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">URL</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Discovered</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cyan-500/10">
                    {filteredFindings.map((finding) => (
                      <tr key={finding.id} className="hover:bg-cyan-500/5 transition-colors">
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${getRiskColor(finding.risk_level)}`}>
                            {finding.risk_level.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-300">
                          {finding.category}
                        </td>
                        <td className="px-4 py-3 text-xs text-cyan-300 max-w-xs truncate" title={finding.query || ''}>
                          {finding.query ? (finding.query.length > 40 ? finding.query.substring(0, 40) + '...' : finding.query) : <span className="text-gray-500">(N/A)</span>}
                        </td>
                        <td className="px-4 py-3">
                          <a
                            href={finding.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-cyan-400 hover:text-cyan-300 hover:underline break-all"
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
