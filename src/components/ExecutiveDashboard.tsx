/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SystemSettings, RiskScenario, HistoryRecord } from '../types';
import { SystemCalculatedSummary } from '../utils/calcEngine';
import { Settings as SettingsIcon, TrendingUp, AlertTriangle, RefreshCw, BarChart3, Database } from 'lucide-react';

interface ExecutiveDashboardProps {
  settings: SystemSettings;
  onChangeSettings: (s: SystemSettings) => void;
  risk: RiskScenario;
  onChangeRisk: (r: RiskScenario) => void;
  summary: SystemCalculatedSummary;
  historyRecords: HistoryRecord[];
  activeTab: string;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  settings,
  onChangeSettings,
  risk,
  onChangeRisk,
  summary,
  historyRecords,
  activeTab
}) => {
  const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);

  if (activeTab === '12_Dashboard') {
    // Math for SVG Donut chart
    const breakdown = summary.categoryBreakdown;
    const totalCostCat = breakdown.Material + breakdown.Labour + breakdown.Equipment + breakdown.Subcontract + breakdown.Plant;
    const categories: Array<'Material' | 'Labour' | 'Equipment' | 'Subcontract' | 'Plant'> = [
      'Material', 'Labour', 'Equipment', 'Subcontract', 'Plant'
    ];
    
    let cumulativeAngle = 0;
    const donutSlices = categories.map((cat) => {
      const value = breakdown[cat];
      const percentage = totalCostCat > 0 ? (value / totalCostCat) * 100 : 0;
      const angle = (percentage / 100) * 360;
      const startAngle = cumulativeAngle;
      cumulativeAngle += angle;
      return {
        category: cat,
        value,
        percentage,
        startAngle,
        endAngle: cumulativeAngle
      };
    });

    // Helper to render SVG paths for donut slices
    const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
      const startAngleRad = ((startAngle - 90) * Math.PI) / 180.0;
      const endAngleRad = ((endAngle - 90) * Math.PI) / 180.0;

      const startX = x + radius * Math.cos(startAngleRad);
      const startY = y + radius * Math.sin(startAngleRad);
      const endX = x + radius * Math.cos(endAngleRad);
      const endY = y + radius * Math.sin(endAngleRad);

      const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

      return [
        "M", startX, startY,
        "A", radius, radius, 0, largeArcFlag, 1, endX, endY
      ].join(" ");
    };

    const catColors: Record<'Material' | 'Labour' | 'Equipment' | 'Subcontract' | 'Plant', string> = {
      Material: '#2251FF',      // Accent
      Labour: '#051C2C',        // Primary
      Equipment: '#888888',     // Muted
      Subcontract: '#5F7C8A',   // Secondary Muted
      Plant: '#99A9B9'          // Light Muted
    };

    // Calculate assembly reuse rate
    const reuseRate = summary.itemCount > 0 
      ? Math.round(((summary.itemCount - summary.unmappedCount) / summary.itemCount) * 100) 
      : 0;

    return (
      <div className="animate-fadeup space-y-6">
        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="lift-card p-6">
            <span className="text-[11px] font-semibold text-neutral-400 tracking-wider uppercase block">Total Tender Value</span>
            <div className="text-[36px] font-heading font-semibold tracking-[-0.03em] text-[#051C2C] mt-2">
              {settings.currency} {summary.totalSell.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-2 mt-2 text-[#888888] text-[12px]">
              <TrendingUp className="w-4 h-4 text-[#2251FF]" />
              <span>Inc. Escalation & Overheads</span>
            </div>
          </div>

          <div className="lift-card p-6">
            <span className="text-[11px] font-semibold text-neutral-400 tracking-wider uppercase block">Average Margin Rate</span>
            <div className="text-[36px] font-heading font-semibold tracking-[-0.03em] text-[#051C2C] mt-2">
              {summary.avgMarginRate.toFixed(2)}%
            </div>
            <div className="flex items-center gap-2 mt-2 text-[#888888] text-[12px]">
              <span>Base Margin: {settings.defaultMarginRate}%</span>
            </div>
          </div>

          <div className="lift-card p-6">
            <span className="text-[11px] font-semibold text-neutral-400 tracking-wider uppercase block">Risk Exposure Allowance</span>
            <div className="text-[36px] font-heading font-semibold tracking-[-0.03em] text-[#051C2C] mt-2">
              {settings.currency} {summary.totalRisk.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-2 mt-2 text-[#888888] text-[12px]">
              <AlertTriangle className="w-4 h-4 text-[#D32F2F]" />
              <span>Current Level: {risk.selectedRisk.toUpperCase()}</span>
            </div>
          </div>

          <div className="lift-card p-6">
            <span className="text-[11px] font-semibold text-neutral-400 tracking-wider uppercase block">Assembly Reuse Rate</span>
            <div className="text-[36px] font-heading font-semibold tracking-[-0.03em] text-[#051C2C] mt-2">
              {reuseRate}%
            </div>
            <div className="flex items-center gap-2 mt-2 text-[#888888] text-[12px]">
              <span>{summary.itemCount - summary.unmappedCount} of {summary.itemCount} items structured</span>
            </div>
          </div>
        </div>

        {/* Multi-role Operational Insights Block */}
        <div className="insight-box p-6 space-y-3">
          <h3 className="font-heading text-[18px] font-semibold text-[#051C2C] tracking-tight">Executive Intelligence Report</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[13px]">
            <div>
              <h4 className="font-semibold text-[#051C2C] mb-1">🎯 Bid Strategist Alert</h4>
              <p className="text-neutral-600">
                The current estimated sell price stands at <span className="font-semibold text-[#2251FF]">{settings.currency} {summary.totalSell.toLocaleString(undefined, {maximumFractionDigits:0})}</span> with a profit margin of <span className="font-semibold text-[#2251FF]">{summary.avgMarginRate.toFixed(1)}%</span>. Standardized assemblies are driving {reuseRate}% of this proposal, promoting high cost reliability.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-[#051C2C] mb-1">⚠️ Risk Contingency Insight</h4>
              {risk.selectedRisk === 'conservative' ? (
                <p className="text-neutral-600">
                  You are bidding with a <span className="text-[#D32F2F] font-semibold">CONSERVATIVE risk profile</span> ({risk.conservative}%). While this protects project margins from site volatility, it might raise your unit rates in a highly competitive market tender scenario.
                </p>
              ) : (
                <p className="text-neutral-600">
                  Risk profile is set to <span className="font-semibold text-[#2251FF]">{risk.selectedRisk.toUpperCase()}</span>. An allowance of {settings.currency} {summary.totalRisk.toLocaleString(undefined, {maximumFractionDigits:0})} has been pooled. This keeps the pricing competitive while securing raw material contingencies.
                </p>
              )}
            </div>
            <div>
              <h4 className="font-semibold text-[#051C2C] mb-1">🛠️ Operations Optimization</h4>
              <p className="text-neutral-600">
                {summary.anomalyCount > 0 ? (
                  <span className="text-[#D32F2F] font-semibold">
                    Anomalies Detected: {summary.anomalyCount} item(s) are either unmapped or have mismatched definitions. Resolve this on the Tender Mapping tab immediately to avoid losing bid integrity.
                  </span>
                ) : (
                  <span>
                    No calculation anomalies detected. All BOQ rows are clean and matched to active cost records, confirming 100% calculation integrity for export.
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Charts Zone */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Donut Chart */}
          <div className="lift-card p-6">
            <h3 className="font-heading text-[18px] font-semibold text-[#051C2C] mb-6 tracking-tight">Direct Cost Category Mix</h3>
            <div className="flex flex-col sm:flex-row items-center justify-around gap-6">
              {totalCostCat > 0 ? (
                <div className="relative w-48 h-48 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="45" fill="transparent" stroke="#E8E8E6" strokeWidth="15" />
                    {donutSlices.map((slice) => {
                      if (slice.value === 0) return null;
                      const pathData = describeArc(60, 60, 45, slice.startAngle, slice.endAngle);
                      const isHovered = hoveredSlice === slice.category;
                      return (
                        <path
                          key={slice.category}
                          d={pathData}
                          fill="transparent"
                          stroke={catColors[slice.category]}
                          strokeWidth={isHovered ? 18 : 15}
                          className="cursor-pointer transition-all duration-150"
                          onMouseEnter={() => setHoveredSlice(slice.category)}
                          onMouseLeave={() => setHoveredSlice(null)}
                        />
                      );
                    })}
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-[11px] text-neutral-400 font-semibold uppercase tracking-wider">Total Direct</span>
                    <span className="text-[18px] font-heading font-semibold text-[#051C2C]">
                      {settings.currency}{summary.totalDirectCost > 1000 ? `${(summary.totalDirectCost / 1000).toFixed(0)}k` : summary.totalDirectCost.toFixed(0)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-neutral-400">No costs to display. Map BOQ items to assemblies.</div>
              )}

              {/* Legend */}
              <div className="space-y-3 w-full max-w-xs">
                {donutSlices.map((slice) => {
                  const isHovered = hoveredSlice === slice.category;
                  return (
                    <div 
                      key={slice.category} 
                      className={`flex items-center justify-between p-2 rounded-lg transition-all duration-150 ${isHovered ? 'bg-neutral-50 scale-[1.02]' : ''}`}
                      onMouseEnter={() => setHoveredSlice(slice.category)}
                      onMouseLeave={() => setHoveredSlice(null)}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: catColors[slice.category] }} />
                        <span className="font-medium text-neutral-700">{slice.category}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold text-[#051C2C]">{slice.percentage.toFixed(1)}%</span>
                        <span className="block text-[11px] text-[#888888]">
                          {settings.currency} {slice.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bar Chart representing Cost Multipliers */}
          <div className="lift-card p-6">
            <h3 className="font-heading text-[18px] font-semibold text-[#051C2C] mb-6 tracking-tight">Tender Price Addition Waterfall Summary</h3>
            <div className="space-y-4">
              <p className="text-[12px] text-[#888888] mb-4">
                Visualizing how Base Direct Costs roll up into overheads, risk loading, and final sell price.
              </p>

              {/* Custom Stacked Bar Chart */}
              {summary.totalSell > 0 ? (
                <div className="space-y-6">
                  {/* Visual block */}
                  <div className="h-10 w-full flex rounded-lg overflow-hidden shadow-sm">
                    <div 
                      style={{ width: `${(summary.totalDirectCost / summary.totalSell) * 100}%` }} 
                      className="bg-[#2251FF] flex items-center justify-center text-white text-[11px] font-semibold"
                      title="Direct Cost"
                    >
                      Direct ({(summary.totalDirectCost / summary.totalSell * 100).toFixed(0)}%)
                    </div>
                    {summary.totalEscalation > 0 && (
                      <div 
                        style={{ width: `${(summary.totalEscalation / summary.totalSell) * 100}%` }} 
                        className="bg-[#5F7C8A] flex items-center justify-center text-white text-[11px] font-semibold"
                        title="Escalation"
                      >
                        Esc ({(summary.totalEscalation / summary.totalSell * 100).toFixed(0)}%)
                      </div>
                    )}
                    {summary.totalRisk > 0 && (
                      <div 
                        style={{ width: `${(summary.totalRisk / summary.totalSell) * 100}%` }} 
                        className="bg-[#D32F2F] flex items-center justify-center text-white text-[11px] font-semibold"
                        title="Risk"
                      >
                        Risk ({(summary.totalRisk / summary.totalSell * 100).toFixed(0)}%)
                      </div>
                    )}
                    {summary.totalOverhead > 0 && (
                      <div 
                        style={{ width: `${(summary.totalOverhead / summary.totalSell) * 100}%` }} 
                        className="bg-[#99A9B9] flex items-center justify-center text-[#051C2C] text-[11px] font-semibold"
                        title="Overheads"
                      >
                        Oh ({(summary.totalOverhead / summary.totalSell * 100).toFixed(0)}%)
                      </div>
                    )}
                    {summary.totalMargin > 0 && (
                      <div 
                        style={{ width: `${(summary.totalMargin / summary.totalSell) * 100}%` }} 
                        className="bg-[#00C853] flex items-center justify-center text-white text-[11px] font-semibold"
                        title="Margin"
                      >
                        Margin ({(summary.totalMargin / summary.totalSell * 100).toFixed(0)}%)
                      </div>
                    )}
                  </div>

                  {/* Detailed metrics table */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="p-3 bg-neutral-50 rounded-lg">
                      <span className="text-[11px] font-semibold text-[#888888] block uppercase">Direct Base</span>
                      <span className="font-semibold text-[#051C2C] text-[14px]">
                        {settings.currency} {summary.totalDirectCost.toLocaleString(undefined, {maximumFractionDigits:0})}
                      </span>
                    </div>
                    <div className="p-3 bg-neutral-50 rounded-lg">
                      <span className="text-[11px] font-semibold text-[#888888] block uppercase">Escalation ({settings.escalationRate}%)</span>
                      <span className="font-semibold text-neutral-700 text-[14px]">
                        {settings.currency} {summary.totalEscalation.toLocaleString(undefined, {maximumFractionDigits:0})}
                      </span>
                    </div>
                    <div className="p-3 bg-neutral-50 rounded-lg">
                      <span className="text-[11px] font-semibold text-[#888888] block uppercase">Risk Allowance</span>
                      <span className="font-semibold text-[#D32F2F] text-[14px]">
                        {settings.currency} {summary.totalRisk.toLocaleString(undefined, {maximumFractionDigits:0})}
                      </span>
                    </div>
                    <div className="p-3 bg-neutral-50 rounded-lg">
                      <span className="text-[11px] font-semibold text-[#888888] block uppercase">Overheads ({settings.overheadRate}%)</span>
                      <span className="font-semibold text-neutral-700 text-[14px]">
                        {settings.currency} {summary.totalOverhead.toLocaleString(undefined, {maximumFractionDigits:0})}
                      </span>
                    </div>
                    <div className="p-3 bg-neutral-50 rounded-lg">
                      <span className="text-[11px] font-semibold text-[#888888] block uppercase">Net Profit Margin</span>
                      <span className="font-semibold text-[#00C853] text-[14px]">
                        {settings.currency} {summary.totalMargin.toLocaleString(undefined, {maximumFractionDigits:0})}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-neutral-400">Map items to visualize the waterfall summary.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === '01_Settings') {
    return (
      <div className="animate-fadeup space-y-6">
        <div className="flex items-center gap-3">
          <SettingsIcon className="w-5 h-5 text-[#2251FF]" />
          <h2 className="font-heading text-[22px] font-semibold text-[#051C2C]">System Settings & Cost Drivers</h2>
        </div>

        <div className="insight-box text-[13px] text-neutral-600">
          This dashboard manages global structural cost factors. Any adjustments made here immediately update unit rates and client sell pricing across all worksheets and history.
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Rates Config Card */}
          <div className="lift-card p-6 space-y-4">
            <h3 className="font-heading text-[18px] font-semibold text-[#051C2C] border-b pb-2">Global Estimating Rules</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase text-neutral-500 tracking-wider mb-1">Company Overhead Allowance (%)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    className="input-editable w-32"
                    value={settings.overheadRate}
                    onChange={(e) => onChangeSettings({ ...settings, overheadRate: parseFloat(e.target.value) || 0 })}
                  />
                  <span className="text-neutral-500">Applied on cost base subtotal for corporate logistics.</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-neutral-500 tracking-wider mb-1">Escalation Contingency (%)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    className="input-editable w-32"
                    value={settings.escalationRate}
                    onChange={(e) => onChangeSettings({ ...settings, escalationRate: parseFloat(e.target.value) || 0 })}
                  />
                  <span className="text-neutral-500">Secures tender pricing against multi-month market price spikes.</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-neutral-500 tracking-wider mb-1">Tender Base Profit Margin (%)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    className="input-editable w-32"
                    value={settings.defaultMarginRate}
                    onChange={(e) => onChangeSettings({ ...settings, defaultMarginRate: parseFloat(e.target.value) || 0 })}
                  />
                  <span className="text-neutral-500">Standard net margin loading added onto estimated project cost.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Currency / Tax config Card */}
          <div className="lift-card p-6 space-y-4">
            <h3 className="font-heading text-[18px] font-semibold text-[#051C2C] border-b pb-2">Regional Financials & Currency</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase text-neutral-500 tracking-wider mb-1">Currency Symbol</label>
                <div className="flex items-center gap-2">
                  <select
                    className="input-editable w-32"
                    value={settings.currency}
                    onChange={(e) => onChangeSettings({ ...settings, currency: e.target.value })}
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="AUD">AUD ($)</option>
                    <option value="CAD">CAD ($)</option>
                  </select>
                  <span className="text-neutral-500">Symbol prepended to all rates, subtotals, and export outputs.</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-neutral-500 tracking-wider mb-1">Tax / GST / VAT Rate (%)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    className="input-editable w-32"
                    value={settings.taxRate}
                    onChange={(e) => onChangeSettings({ ...settings, taxRate: parseFloat(e.target.value) || 0 })}
                  />
                  <span className="text-neutral-500">Calculated after profit margin to determine the total client pricing.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
