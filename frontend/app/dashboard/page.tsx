'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, AlertCircle, CheckCircle, Clock, Search, TrendingUp, Zap, FileText, Shield } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface Scan {
  id: string;
  target_domain: string;
  scan_profile: string;
  status: string;
  started_at: string;
  completed_at: string | null;
  total_queries: number;
  total_findings: number;
}

interface Analytics {
  summary: {
    total_scans: number;
    completed_scans: number;
    failed_scans: number;
    running_scans: number;
    total_findings: number;
    average_findings_per_scan: number;
  };
  risk_distribution: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
  };
  most_scanned_domains: Array<{ domain: string; count: number }>;
  category_distribution: Record<string, number>;
  scan_timeline: Array<{ date: string; count: number }>;
  profile_distribution: Record<string, number>;
}

const COLORS = {
  critical: '#DC2626',
  high: '#EA580C',
  medium: '#FACC15',
  low: '#22C55E',
  info: '#3B82F6',
};

export default function DashboardPage() {
  const [scans, setScans] = useState<Scan[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    status: 'all',
    profile: 'all',
    domain: ''
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [scansRes, analyticsRes] = await Promise.all([
        fetch(`${API_URL}/api/v1/scans?page=1&page_size=50`),
        fetch(`${API_URL}/api/v1/scans/analytics/overview`)
      ]);

      if (scansRes.ok) {
        const scansData = await scansRes.json();
        setScans(scansData.scans || []);
      }

      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json();
        setAnalytics(analyticsData);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      completed: 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-green-500/30',
      running: 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border-blue-500/30',
      failed: 'bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-300 border-red-500/30',
      pending: 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border-yellow-500/30'
    };
    return styles[status as keyof typeof styles] || 'bg-gray-500/20 text-gray-300';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'running':
        return <Activity className="w-4 h-4 animate-pulse" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const filteredScans = scans.filter(scan => {
    if (filter.status !== 'all' && scan.status !== filter.status) return false;
    if (filter.profile !== 'all' && scan.scan_profile !== filter.profile) return false;
    if (filter.domain && !scan.target_domain.toLowerCase().includes(filter.domain.toLowerCase())) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <Navbar />
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          <p className="mt-4 text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const riskChartData = analytics ? [
    { name: 'Critical', value: analytics.risk_distribution.critical, color: COLORS.critical },
    { name: 'High', value: analytics.risk_distribution.high, color: COLORS.high },
    { name: 'Medium', value: analytics.risk_distribution.medium, color: COLORS.medium },
    { name: 'Low', value: analytics.risk_distribution.low, color: COLORS.low },
    { name: 'Info', value: analytics.risk_distribution.info, color: COLORS.info },
  ].filter(item => item.value > 0) : [];

  const categoryChartData = analytics ? Object.entries(analytics.category_distribution).map(([name, value]) => ({
    name: name.replace(/_/g, ' '),
    value
  })).slice(0, 8) : [];

  const profileChartData = analytics ? Object.entries(analytics.profile_distribution).map(([name, value]) => ({
    name: name.toUpperCase(),
    value
  })) : [];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 py-12">
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl translate-y-1/2 translate-x-1/2"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-2">Scan Dashboard</h1>
            <p className="text-gray-400">Overview of all reconnaissance scans and findings</p>
          </div>

          {/* Summary Stats */}
          {analytics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl border border-white/10 hover:border-blue-400/50 p-6 transition-all duration-300 group hover:from-blue-500/20 hover:to-cyan-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 font-medium">Total Scans</p>
                    <p className="text-3xl font-bold text-white mt-2">{analytics.summary.total_scans}</p>
                  </div>
                  <Search className="w-12 h-12 text-blue-400 opacity-40 group-hover:opacity-60 transition-opacity" />
                </div>
                <p className="text-xs text-gray-400 mt-3">
                  {analytics.summary.completed_scans} completed, {analytics.summary.running_scans} running
                </p>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl border border-white/10 hover:border-green-400/50 p-6 transition-all duration-300 group hover:from-green-500/20 hover:to-emerald-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 font-medium">Total Findings</p>
                    <p className="text-3xl font-bold text-white mt-2">{analytics.summary.total_findings}</p>
                  </div>
                  <Shield className="w-12 h-12 text-green-400 opacity-40 group-hover:opacity-60 transition-opacity" />
                </div>
                <p className="text-xs text-gray-400 mt-3">
                  Avg: {analytics.summary.average_findings_per_scan} per scan
                </p>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-red-500/10 to-orange-500/10 backdrop-blur-xl border border-white/10 hover:border-red-400/50 p-6 transition-all duration-300 group hover:from-red-500/20 hover:to-orange-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 font-medium">Critical Findings</p>
                    <p className="text-3xl font-bold text-red-300 mt-2">{analytics.risk_distribution.critical}</p>
                  </div>
                  <AlertCircle className="w-12 h-12 text-red-400 opacity-40 group-hover:opacity-60 transition-opacity" />
                </div>
                <p className="text-xs text-gray-400 mt-3">
                  {analytics.risk_distribution.high} high risk
                </p>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-white/10 hover:border-purple-400/50 p-6 transition-all duration-300 group hover:from-purple-500/20 hover:to-pink-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 font-medium">Avg Query Time</p>
                    <p className="text-3xl font-bold text-white mt-2">~2s</p>
                  </div>
                  <TrendingUp className="w-12 h-12 text-purple-400 opacity-40 group-hover:opacity-60 transition-opacity" />
                </div>
                <p className="text-xs text-gray-400 mt-3">
                  Per dork query execution
                </p>
              </div>
            </div>
          )}

          {/* Charts Row */}
          {analytics && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Risk Distribution Pie Chart */}
              <div className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-purple-800/50 backdrop-blur-2xl border border-white/20 p-8 hover:border-white/30 transition-all">
                <h3 className="text-xl font-semibold text-white mb-6">Risk Distribution</h3>
                {riskChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={riskChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {riskChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center text-gray-500 py-20">No findings data available</p>
                )}
              </div>

              {/* Category Distribution Bar Chart */}
              <div className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-purple-800/50 backdrop-blur-2xl border border-white/20 p-8 hover:border-white/30 transition-all">
                <h3 className="text-xl font-semibold text-white mb-6">Top Categories</h3>
                {categoryChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={categoryChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} fontSize={11} tick={{ fill: '#9CA3AF' }} />
                      <YAxis tick={{ fill: '#9CA3AF' }} />
                      <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
                      <Bar dataKey="value" fill="#A78BFA" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center text-gray-400 py-20">No category data available</p>
                )}
              </div>

              {/* Scan Timeline */}
              <div className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-purple-800/50 backdrop-blur-2xl border border-white/20 p-8 hover:border-white/30 transition-all">
                <h3 className="text-xl font-semibold text-white mb-6">Scan Timeline (Last 30 Days)</h3>
                {analytics.scan_timeline.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={analytics.scan_timeline}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="date" fontSize={11} tick={{ fill: '#9CA3AF' }} />
                      <YAxis tick={{ fill: '#9CA3AF' }} />
                      <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
                      <Legend wrapperStyle={{ color: '#9CA3AF' }} />
                      <Line type="monotone" dataKey="count" stroke="#A78BFA" name="Scans" />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center text-gray-400 py-20">No timeline data available</p>
                )}
              </div>

              {/* Profile Distribution */}
              <div className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-purple-800/50 backdrop-blur-2xl border border-white/20 p-8 hover:border-white/30 transition-all">
                <h3 className="text-xl font-semibold text-white mb-6">Scan Profiles Used</h3>
                {profileChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={profileChartData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis type="number" tick={{ fill: '#9CA3AF' }} />
                      <YAxis dataKey="name" type="category" width={80} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center text-gray-400 py-20">No profile data available</p>
                )}
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-purple-800/50 backdrop-blur-2xl border border-white/20 p-6 mb-8 hover:border-white/30 transition-all">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Domain</label>
                <input
                  type="text"
                  placeholder="Filter by domain..."
                  value={filter.domain}
                  onChange={(e) => setFilter({ ...filter, domain: e.target.value })}
                  className="w-full px-4 py-2 border border-white/20 rounded-lg bg-white/5 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-xl transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                <select
                  value={filter.status}
                  onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                  className="w-full px-4 py-2 border border-white/20 rounded-lg bg-white/5 text-white focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-xl transition-all"
                >
                  <option value="all" style={{ backgroundColor: '#1f2937' }}>All Statuses</option>
                  <option value="completed" style={{ backgroundColor: '#1f2937' }}>Completed</option>
                  <option value="running" style={{ backgroundColor: '#1f2937' }}>Running</option>
                  <option value="failed" style={{ backgroundColor: '#1f2937' }}>Failed</option>
                  <option value="pending" style={{ backgroundColor: '#1f2937' }}>Pending</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Profile</label>
                <select
                  value={filter.profile}
                  onChange={(e) => setFilter({ ...filter, profile: e.target.value })}
                  className="w-full px-4 py-2 border border-white/20 rounded-lg bg-white/5 text-white focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-xl transition-all"
                >
                  <option value="all" style={{ backgroundColor: '#1f2937' }}>All Profiles</option>
                  <option value="quick" style={{ backgroundColor: '#1f2937' }}>Quick</option>
                  <option value="standard" style={{ backgroundColor: '#1f2937' }}>Standard</option>
                  <option value="deep" style={{ backgroundColor: '#1f2937' }}>Deep</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => setFilter({ status: 'all', profile: 'all', domain: '' })}
                  className="w-full px-4 py-2 bg-gradient-to-r from-gray-700/50 to-slate-700/50 text-white rounded-lg hover:from-gray-600/50 hover:to-slate-600/50 transition-all border border-white/10"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* Scans List */}
          <div className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-purple-800/50 backdrop-blur-2xl border border-white/20 shadow-2xl overflow-hidden hover:border-white/30 transition-all">
            <div className="px-8 py-6 border-b border-white/10">
              <h2 className="text-2xl font-semibold text-white">
                Recent Scans ({filteredScans.length})
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Domain</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Profile</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Queries</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Findings</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredScans.map((scan) => (
                    <tr key={scan.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Shield className="w-4 h-4 text-purple-400 mr-2" />
                          <span className="text-sm font-medium text-white">{scan.target_domain}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-300 uppercase font-semibold">{scan.scan_profile}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(scan.status)}`}>
                          {getStatusIcon(scan.status)}
                          {scan.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {new Date(scan.started_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {scan.total_queries}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                          scan.total_findings > 0 ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border-blue-500/30' : 'bg-gray-500/20 text-gray-300 border-gray-500/30'
                        }`}>
                          {scan.total_findings}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Link
                          href={`/scans/${scan.id}`}
                          className="text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredScans.length === 0 && (
                <div className="text-center py-16">
                  <Search className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No scans found matching your filters</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
