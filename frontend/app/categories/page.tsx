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
      return 'bg-red-100 text-red-800 border-red-300';
    case 'HIGH':
      return 'bg-orange-100 text-orange-800 border-orange-300';
    case 'MEDIUM':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'LOW':
      return 'bg-green-100 text-green-800 border-green-300';
    default:
      return 'bg-gray-100 text-gray-800';
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading dork categories...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Google Dork Categories</h1>
            <p className="text-lg text-gray-600 max-w-3xl">
              DORK-X includes 20 detailed reconnaissance categories covering critical security areas.
              Each category contains specialized dork templates to uncover specific types of information.
            </p>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-600 font-medium">CRITICAL Categories</p>
                  <p className="text-3xl font-bold text-red-700">{summary.critical_count}</p>
                </div>
                <AlertCircle className="w-10 h-10 text-red-500 opacity-50" />
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600 font-medium">HIGH Risk Categories</p>
                  <p className="text-3xl font-bold text-orange-700">{summary.high_count}</p>
                </div>
                <Zap className="w-10 h-10 text-orange-500 opacity-50" />
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-600 font-medium">MEDIUM Risk Categories</p>
                  <p className="text-3xl font-bold text-yellow-700">{summary.medium_count}</p>
                </div>
                <TrendingUp className="w-10 h-10 text-yellow-500 opacity-50" />
              </div>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="space-y-4">
            {categories.map((category) => (
              <div
                key={category.key}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <button
                  onClick={() => setExpandedCategory(expandedCategory === category.key ? null : category.key)}
                  className="w-full px-6 py-4 flex items-start justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getRiskColor(category.risk_level)}`}>
                        {getRiskIcon(category.risk_level)}
                        {category.risk_level}
                      </span>
                      <span className="text-sm text-gray-500 ml-auto">{category.query_count} queries</span>
                    </div>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                </button>

                {/* Expanded Details */}
                {expandedCategory === category.key && (
                  <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
                    <div className="space-y-4">
                      {/* What Can Be Found */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <Shield className="w-4 h-4 text-blue-600" />
                          What Can Be Found
                        </h4>
                        <ul className="space-y-1 ml-6">
                          {category.what_can_be_found.map((item, idx) => (
                            <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                              <span className="text-blue-600 font-bold">•</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Why It Matters */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-red-600" />
                          Why It Matters
                        </h4>
                        <p className="text-sm text-gray-700 ml-6 italic">{category.why_it_matters}</p>
                      </div>

                      {/* Category Key */}
                      <div className="text-xs text-gray-500 font-mono">
                        Category ID: <span className="bg-gray-200 px-2 py-1 rounded">{category.key}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Important Notes */}
          <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">⚠️ Important Notes (Ethical Use)</h3>
            <ul className="space-y-2 text-blue-800 text-sm">
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
