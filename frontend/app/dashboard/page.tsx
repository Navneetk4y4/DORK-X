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
      completed: 'bg-green-100 text-green-800 border-green-300',
      running: 'bg-blue-100 text-blue-800 border-blue-300',
      failed: 'bg-red-100 text-red-800 border-red-300',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300'
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
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
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Scan Dashboard</h1>
            <p className="text-gray-600">Overview of all reconnaissance scans and findings</p>
          </div>

          {/* Summary Stats */}
          {analytics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Total Scans</p>
                    <p className="text-3xl font-bold text-gray-900">{analytics.summary.total_scans}</p>
                  </div>
                  <Search className="w-10 h-10 text-blue-500 opacity-50" />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {analytics.summary.completed_scans} completed, {analytics.summary.running_scans} running
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Total Findings</p>
                    <p className="text-3xl font-bold text-gray-900">{analytics.summary.total_findings}</p>
                  </div>
                  <Shield className="w-10 h-10 text-purple-500 opacity-50" />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Avg: {analytics.summary.average_findings_per_scan} per scan
                </p>
              </div>

              <div className="bg-white border border-red-200 rounded-lg p-6 shadow-sm bg-red-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-red-600 font-medium">Critical Findings</p>
                    <p className="text-3xl font-bold text-red-700">{analytics.risk_distribution.critical}</p>
                  </div>
                  <AlertCircle className="w-10 h-10 text-red-500 opacity-50" />
                </div>
                <p className="text-xs text-red-600 mt-2">
                  {analytics.risk_distribution.high} high risk
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Avg Query Time</p>
                    <p className="text-3xl font-bold text-gray-900">~2s</p>
                  </div>
                  <TrendingUp className="w-10 h-10 text-green-500 opacity-50" />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Per dork query execution
                </p>
              </div>
            </div>
          )}

          {/* Charts Row */}
          {analytics && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Risk Distribution Pie Chart */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Distribution</h3>
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
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Categories</h3>
                {categoryChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={categoryChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} fontSize={11} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center text-gray-500 py-20">No category data available</p>
                )}
              </div>

              {/* Scan Timeline */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Scan Timeline (Last 30 Days)</h3>
                {analytics.scan_timeline.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={analytics.scan_timeline}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" fontSize={11} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="count" stroke="#8B5CF6" name="Scans" />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center text-gray-500 py-20">No timeline data available</p>
                )}
              </div>

              {/* Profile Distribution */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Scan Profiles Used</h3>
                {profileChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={profileChartData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={80} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center text-gray-500 py-20">No profile data available</p>
                )}
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Domain</label>
                <input
                  type="text"
                  placeholder="Filter by domain..."
                  value={filter.domain}
                  onChange={(e) => setFilter({ ...filter, domain: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filter.status}
                  onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Statuses</option>
                  <option value="completed">Completed</option>
                  <option value="running">Running</option>
                  <option value="failed">Failed</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Profile</label>
                <select
                  value={filter.profile}
                  onChange={(e) => setFilter({ ...filter, profile: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Profiles</option>
                  <option value="quick">Quick</option>
                  <option value="standard">Standard</option>
                  <option value="deep">Deep</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => setFilter({ status: 'all', profile: 'all', domain: '' })}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* Scans List */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Recent Scans ({filteredScans.length})
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Domain</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Queries</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Findings</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredScans.map((scan) => (
                    <tr key={scan.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Shield className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-gray-900">{scan.target_domain}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600 uppercase font-semibold">{scan.scan_profile}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(scan.status)}`}>
                          {getStatusIcon(scan.status)}
                          {scan.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(scan.started_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {scan.total_queries}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          scan.total_findings > 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {scan.total_findings}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Link
                          href={`/scans/${scan.id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
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
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No scans found matching your filters</p>
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
