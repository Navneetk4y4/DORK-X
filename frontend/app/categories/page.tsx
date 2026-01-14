'use client';

import React, { useEffect, useState } from 'react';
import { AlertCircle, Shield, TrendingUp, Zap } from 'lucide-react';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

interface Category {
  key: string;
  name: string;
  description: string;
  risk_level: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  what_can_be_found: string[];
  why_it_matters: string;
  query_count: number;
}

interface ApiResponse {
  total_categories: number;
  categories: Category[];
  summary: {
    critical_count: number;
    high_count: number;
    medium_count: number;
  };
}

const getRiskColor = (risk: string) => {
  switch (risk) {
    case 'CRITICAL':
      return 'bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-300 border-red-500/30';
    case 'HIGH':
      return 'bg-gradient-to-r from-orange-500/20 to-yellow-500/20 text-orange-300 border-orange-500/30';
    case 'MEDIUM':
      return 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-300 border-yellow-500/30';
    case 'LOW':
      return 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-green-500/30';
    default:
      return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  }
};

const getRiskIcon = (risk: string) => {
  switch (risk) {
    case 'CRITICAL':
      return <AlertCircle className="w-4 h-4" />;
    case 'HIGH':
      return <Zap className="w-4 h-4" />;
    case 'MEDIUM':
      return <TrendingUp className="w-4 h-4" />;
    default:
      return <Shield className="w-4 h-4" />;
  }
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [summary, setSummary] = useState({ critical_count: 0, high_count: 0, medium_count: 0 });
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/dork-categories`);
        if (response.ok) {
          const data: ApiResponse = await response.json();
          setCategories(data.categories);
          setSummary(data.summary);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <Navbar />
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          <p className="mt-4 text-gray-400">Loading dork categories...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 py-16">
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl translate-y-1/2 translate-x-1/2"></div>
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          {/* Header */}
          <div className="mb-16">
            <h1 className="text-5xl font-bold text-white mb-4">Google Dork Categories</h1>
            <p className="text-lg text-gray-400 max-w-3xl">
              DORK-X includes 20 detailed reconnaissance categories covering critical security areas.
              Each category contains specialized dork templates to uncover specific types of information.
            </p>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="rounded-2xl bg-gradient-to-br from-red-500/10 to-orange-500/10 backdrop-blur-xl border border-red-500/30 p-6 hover:border-red-400/50 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-400 font-medium">CRITICAL Categories</p>
                  <p className="text-3xl font-bold text-red-300 mt-2">{summary.critical_count}</p>
                </div>
                <AlertCircle className="w-12 h-12 text-red-400 opacity-40" />
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-orange-500/10 to-yellow-500/10 backdrop-blur-xl border border-orange-500/30 p-6 hover:border-orange-400/50 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-400 font-medium">HIGH Risk Categories</p>
                  <p className="text-3xl font-bold text-orange-300 mt-2">{summary.high_count}</p>
                </div>
                <Zap className="w-12 h-12 text-orange-400 opacity-40" />
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-yellow-500/10 to-amber-500/10 backdrop-blur-xl border border-yellow-500/30 p-6 hover:border-yellow-400/50 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-400 font-medium">MEDIUM Risk Categories</p>
                  <p className="text-3xl font-bold text-yellow-300 mt-2">{summary.medium_count}</p>
                </div>
                <TrendingUp className="w-12 h-12 text-yellow-400 opacity-40" />
              </div>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="space-y-4 mt-12">
            {categories.map((category) => (
              <div
                key={category.key}
                className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-purple-800/50 backdrop-blur-2xl border border-white/20 overflow-hidden hover:border-white/30 transition-all hover:shadow-lg hover:shadow-purple-500/20"
              >
                <button
                  onClick={() => setExpandedCategory(expandedCategory === category.key ? null : category.key)}
                  className="w-full px-8 py-6 flex items-start justify-between hover:bg-white/5 transition-colors"
                >
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getRiskColor(category.risk_level)}`}>
                        {getRiskIcon(category.risk_level)}
                        {category.risk_level}
                      </span>
                      <span className="text-sm text-gray-400 ml-auto">{category.query_count} queries</span>
                    </div>
                    <p className="text-sm text-gray-400">{category.description}</p>
                  </div>
                </button>

                {/* Expanded Details */}
                {expandedCategory === category.key && (
                  <div className="border-t border-white/10 bg-gradient-to-br from-purple-500/5 to-pink-500/5 px-8 py-6">
                    <div className="space-y-6">
                      {/* What Can Be Found */}
                      <div>
                        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                          <Shield className="w-4 h-4 text-blue-400" />
                          What Can Be Found
                        </h4>
                        <ul className="space-y-2 ml-6">
                          {category.what_can_be_found.map((item, idx) => (
                            <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                              <span className="text-purple-400 font-bold">•</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Why It Matters */}
                      <div>
                        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-red-400" />
                          Why It Matters
                        </h4>
                        <p className="text-sm text-gray-300 ml-6 italic">{category.why_it_matters}</p>
                      </div>

                      {/* Category Key */}
                      <div className="text-xs text-gray-400 font-mono">
                        Category ID: <span className="bg-white/10 px-2 py-1 rounded border border-white/20">{category.key}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Important Notes */}
          <div className="mt-16 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl border border-blue-500/30 p-8 hover:border-blue-400/50 transition-all">
            <h3 className="text-lg font-semibold text-blue-300 mb-4">⚠️ Important Notes (Ethical Use)</h3>
            <ul className="space-y-3 text-blue-200 text-sm">
              <li>✓ <strong>Google Dorking is passive reconnaissance</strong> - not exploitation or intrusion</li>
              <li>✓ <strong>Only perform scans on:</strong> Your own assets, authorized lab environments, or targets with written permission</li>
              <li>✓ <strong>Logging and consent checks</strong> are mandatory for responsible automation</li>
              <li>✓ <strong>Rate limiting</strong> protects target resources and respects service quotas</li>
              <li>✓ <strong>Legal compliance</strong> - Ensure all activities align with applicable laws and regulations</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
