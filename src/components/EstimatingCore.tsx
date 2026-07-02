/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TenderItem, TenderMapping, Assembly, CostItem, SystemSettings, RiskScenario } from '../types';
import { calculateTenderItem, calculateAssembly, SystemCalculatedSummary } from '../utils/calcEngine';
import { Calculator, ShieldAlert, FileText, ChevronRight, ChevronDown, CheckCircle2, Info, Printer, Download, Copy } from 'lucide-react';

interface EstimatingCoreProps {
  tenderItems: TenderItem[];
  mappings: TenderMapping[];
  assemblies: Assembly[];
  costLibrary: CostItem[];
  settings: SystemSettings;
  onChangeSettings: (s: SystemSettings) => void;
  risk: RiskScenario;
  onChangeRisk: (r: RiskScenario) => void;
  summary: SystemCalculatedSummary;
  activeTab: string;
}

export const EstimatingCore: React.FC<EstimatingCoreProps> = ({
  tenderItems,
  mappings,
  assemblies,
  costLibrary,
  settings,
  onChangeSettings,
  risk,
  onChangeRisk,
  summary,
  activeTab
}) => {
  // Expanded detailed items in Estimating Engine
  const [expandedEngineItem, setExpandedEngineItem] = useState<string | null>(null);

  // Sub-tab for Tender Output view
  const [outputSubTab, setOutputSubTab] = useState<'client' | 'internal' | 'trade' | 'summary'>('client');

  if (activeTab === '07_Estimate_Engine') {
    return (
      <div className="animate-fadeup space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Calculator className="w-5 h-5 text-[#2251FF]" />
            <h2 className="font-heading text-[22px] font-semibold text-[#051C2C]">Real-Time Estimating Engine</h2>
          </div>
          <div className="text-[11px] bg-[#00C853]/10 text-[#00C853] px-2.5 py-1 rounded-full font-bold">
            Live Calculation Mode Online
          </div>
        </div>

        <div className="insight-box text-[13px] text-neutral-600">
          This engine performs continuous cascading cost evaluations. Expand any row to audit the complete itemized composition of raw material wastes, labor hours, subcontractor quotes, and plant rental fractions.
        </div>

        {tenderItems.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center text-[#888888]">
            No client BOQ imported yet. Please load or paste items under the "Tender Import" tab first.
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="th-header w-12"></th>
                    <th className="th-header w-24">WBS Code</th>
                    <th className="th-header">BOQ Line Description</th>
                    <th className="th-header w-20 text-center">Unit</th>
                    <th className="th-header w-24 text-right">Qty</th>
                    <th className="th-header w-32 text-right">Direct Cost</th>
                    <th className="th-header w-32 text-right">Risk & Esc.</th>
                    <th className="th-header w-32 text-right">Overheads</th>
                    <th className="th-header w-32 text-right">Profit Margin</th>
                    <th className="th-header w-36 text-right">Final Sell Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {tenderItems.map((item) => {
                    const mapping = mappings.find((m) => m.tenderItemId === item.id);
                    const calc = calculateTenderItem(item, mapping, assemblies, costLibrary, settings, risk);
                    const isExpanded = expandedEngineItem === item.id;

                    return (
                      <React.Fragment key={item.id}>
                        <tr 
                          className={`hover:bg-neutral-50 cursor-pointer transition-colors ${calc.hasAnomaly ? 'bg-red-50/10' : ''}`}
                          onClick={() => setExpandedEngineItem(isExpanded ? null : item.id)}
                        >
                          <td className="p-3 text-center">
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4 text-[#2251FF]" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-neutral-400" />
                            )}
                          </td>
                          <td className="p-3 font-mono font-semibold text-[#051C2C] text-[12px]">{item.code}</td>
                          <td className="p-3">
                            <span className="font-semibold text-[#051C2C] block text-[13px]">{item.trade}</span>
                            <span className="text-[12px] text-neutral-600 block line-clamp-1">{item.description}</span>
                            {calc.hasAnomaly && (
                              <span className="inline-block mt-1 text-[11px] font-bold text-[#D32F2F]">
                                ⚠️ {calc.anomalyMessage}
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-center font-mono text-[12px] text-neutral-500">{item.unit}</td>
                          <td className="p-3 text-right font-mono font-semibold text-[12px]">{item.qty.toLocaleString()}</td>
                          <td className="p-3 text-right font-mono text-[12px]">
                            {settings.currency} {calc.totalDirectCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                          </td>
                          <td className="p-3 text-right font-mono text-[12px]">
                            {settings.currency} {(calc.risk + calc.escalation).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                          </td>
                          <td className="p-3 text-right font-mono text-[12px]">
                            {settings.currency} {calc.overhead.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                          </td>
                          <td className="p-3 text-right font-mono text-[12px] text-[#00C853] font-semibold">
                            {settings.currency} {calc.margin.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                          </td>
                          <td className="p-3 text-right font-mono font-semibold text-[13px] text-[#2251FF]">
                            {settings.currency} {calc.sellPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                        </tr>

                        {/* Audit Details dropdown panel */}
                        {isExpanded && (
                          <tr>
                            <td colSpan={10} className="p-4 bg-neutral-50/60 border-t border-b border-neutral-100">
                              <div className="pl-8 space-y-4 max-w-5xl">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-2">
                                  <h4 className="text-[12px] font-bold text-[#051C2C] uppercase tracking-wider">
                                    Engineering Sub-Item Cost Audit ({item.code})
                                  </h4>
                                  {calc.assembly && (
                                    <span className="text-[11px] text-[#888888]">
                                      Linked to Assembly: <span className="font-mono font-bold text-[#051C2C]">{calc.assembly.id}</span>
                                    </span>
                                  )}
                                </div>

                                {calc.assembly ? (
                                  <div className="space-y-4">
                                    {/* Cost breakdown table */}
                                    <div className="bg-white rounded-lg border border-neutral-100 overflow-hidden shadow-sm">
                                      <table className="w-full text-left border-collapse text-[12px]">
                                        <thead>
                                          <tr className="bg-neutral-50/80 font-bold text-neutral-500 uppercase text-[10px]">
                                            <th className="p-2 w-28">Ledger Code</th>
                                            <th className="p-2">Material / Hour Scope</th>
                                            <th className="p-2 text-center">Category</th>
                                            <th className="p-2 text-right">Standard Rate</th>
                                            <th className="p-2 text-center">Multiplier</th>
                                            <th className="p-2 text-center">Unit</th>
                                            <th className="p-2 text-right">Allocated Rate</th>
                                            <th className="p-2 text-right font-bold text-[#051C2C]">Extended Total Cost</th>
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-neutral-50">
                                          {calc.assembly.items.map((ai) => {
                                            const costItem = costLibrary.find((c) => c.code === ai.costCode);
                                            const rate = costItem ? costItem.rate : 0;
                                            const unitCost = ai.qty * rate * calc.factor;
                                            const totalCost = unitCost * item.qty;

                                            return (
                                              <tr key={ai.costCode} className={!costItem ? 'bg-red-50 text-[#D32F2F]' : ''}>
                                                <td className="p-2 font-mono font-semibold">{ai.costCode}</td>
                                                <td className="p-2">{costItem ? costItem.description : 'MISSING LEDGER CODE'}</td>
                                                <td className="p-2 text-center">
                                                  <span className="inline-block px-2 py-0.5 rounded bg-neutral-100 text-neutral-500 text-[10px] font-semibold">
                                                    {costItem ? costItem.category : '-'}
                                                  </span>
                                                </td>
                                                <td className="p-2 text-right font-mono">{settings.currency} {rate.toFixed(2)}</td>
                                                <td className="p-2 text-center font-mono">{ai.qty}</td>
                                                <td className="p-2 text-center font-mono">{costItem ? costItem.unit : '-'}</td>
                                                <td className="p-2 text-right font-mono">{settings.currency} {unitCost.toFixed(2)}</td>
                                                <td className="p-2 text-right font-mono font-semibold text-[#051C2C]">
                                                  {settings.currency} {totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </td>
                                              </tr>
                                            );
                                          })}
                                        </tbody>
                                      </table>
                                    </div>

                                    {/* Calculated add-ons list */}
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-[12px]">
                                      <div className="p-3 bg-white border rounded-lg shadow-sm">
                                        <span className="text-[10px] font-semibold text-neutral-400 block uppercase">Base Cost Additionals</span>
                                        <div className="flex justify-between items-center mt-1">
                                          <span>Escalation ({settings.escalationRate}%):</span>
                                          <span className="font-mono font-semibold">{settings.currency} {calc.escalation.toLocaleString(undefined, {maximumFractionDigits:2})}</span>
                                        </div>
                                        <div className="flex justify-between items-center mt-1">
                                          <span>Risk Contingency:</span>
                                          <span className="font-mono font-semibold text-[#D32F2F]">{settings.currency} {calc.risk.toLocaleString(undefined, {maximumFractionDigits:2})}</span>
                                        </div>
                                      </div>

                                      <div className="p-3 bg-white border rounded-lg shadow-sm">
                                        <span className="text-[10px] font-semibold text-neutral-400 block uppercase">Indirect Logistical Overheads</span>
                                        <div className="flex justify-between items-center mt-1">
                                          <span>Overhead Factor ({settings.overheadRate}%):</span>
                                          <span className="font-mono font-semibold">{settings.currency} {calc.overhead.toLocaleString(undefined, {maximumFractionDigits:2})}</span>
                                        </div>
                                      </div>

                                      <div className="p-3 bg-white border rounded-lg shadow-sm">
                                        <span className="text-[10px] font-semibold text-neutral-400 block uppercase">Gross Margin Loading</span>
                                        <div className="flex justify-between items-center mt-1">
                                          <span>Base Margin ({settings.defaultMarginRate}%):</span>
                                          <span className="font-mono font-semibold text-[#00C853]">{settings.currency} {calc.margin.toLocaleString(undefined, {maximumFractionDigits:2})}</span>
                                        </div>
                                      </div>

                                      <div className="p-3 bg-white border rounded-lg shadow-sm">
                                        <span className="text-[10px] font-semibold text-neutral-400 block uppercase">Commercial Sell Price Rollups</span>
                                        <div className="flex justify-between items-center mt-1">
                                          <span>Client Tender Rate:</span>
                                          <span className="font-mono font-bold text-[#2251FF]">{settings.currency} {calc.clientUnitRate.toFixed(2)} / {item.unit}</span>
                                        </div>
                                        <div className="flex justify-between items-center mt-1">
                                          <span>Extended Total Sell:</span>
                                          <span className="font-mono font-bold text-[#051C2C]">{settings.currency} {calc.sellPrice.toLocaleString(undefined, {maximumFractionDigits:2})}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <p className="text-[12px] text-[#D32F2F] italic">
                                    Warning: This BOQ row is completely offline. Navigate to "Tender Mapping" to map this line to a standard assembly.
                                  </p>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (activeTab === '08_Risk_Margin') {
    return (
      <div className="animate-fadeup space-y-6">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-[#2251FF]" />
          <h2 className="font-heading text-[22px] font-semibold text-[#051C2C]">Risk Allocation & Strategy Portal</h2>
        </div>

        <div className="insight-box text-[13px] text-neutral-600">
          Construction projects face site delivery delays, labor strikes, and raw material cost spikes. This workspace lets estimators model risk thresholds and profit loadings under three different scenarios.
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Risk Profile Picker */}
          <div className="lg:col-span-1 space-y-6">
            <div className="lift-card p-6 space-y-4">
              <h3 className="font-heading text-[18px] font-semibold text-[#051C2C] border-b pb-2">Risk Strategy Configurator</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-neutral-500 tracking-wider mb-2">Optimistic Risk Scenario (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="input-editable w-full"
                    value={risk.optimistic}
                    onChange={(e) => onChangeRisk({ ...risk, optimistic: parseFloat(e.target.value) || 0 })}
                  />
                  <p className="text-[11px] text-neutral-400 mt-1">Low weather delays, smooth ground compaction subgrade.</p>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-neutral-500 tracking-wider mb-2">Expected Risk Scenario (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="input-editable w-full"
                    value={risk.expected}
                    onChange={(e) => onChangeRisk({ ...risk, expected: parseFloat(e.target.value) || 0 })}
                  />
                  <p className="text-[11px] text-neutral-400 mt-1">Weighted standard site friction allowance.</p>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-neutral-500 tracking-wider mb-2">Conservative Risk Scenario (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="input-editable w-full"
                    value={risk.conservative}
                    onChange={(e) => onChangeRisk({ ...risk, conservative: parseFloat(e.target.value) || 0 })}
                  />
                  <p className="text-[11px] text-neutral-400 mt-1">Subgrade rock excavation delays, severe material logistics friction.</p>
                </div>
              </div>
            </div>

            {/* Selector block */}
            <div className="lift-card p-6 space-y-4">
              <h3 className="font-heading text-[16px] font-semibold text-[#051C2C] border-b pb-2">Active Strategic Target</h3>

              <div className="grid grid-cols-3 gap-2">
                {(['optimistic', 'expected', 'conservative'] as const).map((level) => {
                  const isActive = risk.selectedRisk === level;
                  const rateValue = level === 'optimistic' ? risk.optimistic : level === 'conservative' ? risk.conservative : risk.expected;

                  return (
                    <button
                      key={level}
                      onClick={() => onChangeRisk({ ...risk, selectedRisk: level })}
                      className={`p-3 rounded-lg flex flex-col items-center justify-center transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#051C2C] text-white shadow-md'
                          : 'bg-neutral-50 hover:bg-neutral-100 text-[#051C2C]'
                      }`}
                    >
                      <span className="text-[10px] uppercase font-bold tracking-wider">{level}</span>
                      <span className="font-heading font-semibold text-[16px] mt-1">{rateValue}%</span>
                    </button>
                  );
                })}
              </div>

              <div className="text-[12px] text-neutral-500 p-3 bg-neutral-50 rounded-lg">
                Selected risk rate is applied directly as a contingency multiplier to raw assembly direct costs across the entire workbook.
              </div>
            </div>
          </div>

          {/* Pricing Impact Matrix simulation */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-heading text-[18px] font-semibold text-[#051C2C] border-b pb-2 mb-4">Strategic Margin & Pricing Curves</h3>

              <div className="space-y-6">
                <p className="text-[12px] text-[#888888]">
                  Simulate bidding outcomes by adjusting the company base profit margin rate and see the immediate impacts on final tender price and pricing curves.
                </p>

                {/* Slider and inputs */}
                <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-neutral-50 rounded-lg">
                  <div className="flex-1 w-full">
                    <label className="block text-[11px] font-bold uppercase text-neutral-500 tracking-wider mb-2">
                      Base Net Profit Margin Target: {settings.defaultMarginRate}%
                    </label>
                    <input
                      type="range"
                      min="0.0"
                      max="30.0"
                      step="0.5"
                      className="w-full accent-[#2251FF] cursor-pointer"
                      value={settings.defaultMarginRate}
                      onChange={(e) => onChangeSettings({ ...settings, defaultMarginRate: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="w-28 text-center bg-[#051C2C] text-white p-3 rounded-lg">
                    <span className="text-[10px] uppercase block tracking-wider font-semibold opacity-75">Tender Price</span>
                    <span className="font-heading font-bold text-[18px]">
                      {settings.currency} {summary.totalSell > 1000 ? `${(summary.totalSell/1000).toFixed(0)}k` : summary.totalSell.toFixed(0)}
                    </span>
                  </div>
                </div>

                {/* Scenario Matrix */}
                <div className="space-y-3">
                  <h4 className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Pricing Curve Simulation Matrix</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Scenario 1 */}
                    <div className="p-4 rounded-lg bg-blue-50/50 border border-blue-100 flex flex-col justify-between">
                      <div>
                        <span className="inline-block px-2 py-0.5 rounded-full bg-[#2251FF] text-white text-[10px] font-bold mb-2">
                          Optimistic (Rate: {risk.optimistic}%)
                        </span>
                        <p className="text-[12px] text-neutral-600">Minimum site friction. Highly competitive submission.</p>
                      </div>
                      <div className="mt-4 pt-2 border-t border-blue-100">
                        <span className="text-[11px] text-[#888888] block">Projected Total Sell</span>
                        <span className="font-heading font-semibold text-[16px] text-[#051C2C]">
                          {settings.currency} {(summary.totalDirectCost * (1 + risk.optimistic/100) * (1 + settings.overheadRate/100) * (1 + settings.defaultMarginRate/100)).toLocaleString(undefined, {maximumFractionDigits:0})}
                        </span>
                      </div>
                    </div>

                    {/* Scenario 2 */}
                    <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-100 flex flex-col justify-between">
                      <div>
                        <span className="inline-block px-2 py-0.5 rounded-full bg-[#051C2C] text-white text-[10px] font-bold mb-2">
                          Expected (Rate: {risk.expected}%)
                        </span>
                        <p className="text-[12px] text-neutral-600">Standard friction. Safe margin baseline.</p>
                      </div>
                      <div className="mt-4 pt-2 border-t border-neutral-100">
                        <span className="text-[11px] text-[#888888] block">Projected Total Sell</span>
                        <span className="font-heading font-semibold text-[16px] text-[#051C2C]">
                          {settings.currency} {(summary.totalDirectCost * (1 + risk.expected/100) * (1 + settings.overheadRate/100) * (1 + settings.defaultMarginRate/100)).toLocaleString(undefined, {maximumFractionDigits:0})}
                        </span>
                      </div>
                    </div>

                    {/* Scenario 3 */}
                    <div className="p-4 rounded-lg bg-red-50/50 border border-red-100 flex flex-col justify-between">
                      <div>
                        <span className="inline-block px-2 py-0.5 rounded-full bg-[#D32F2F] text-white text-[10px] font-bold mb-2">
                          Conservative (Rate: {risk.conservative}%)
                        </span>
                        <p className="text-[12px] text-neutral-600">Protects margins but lowers win probability.</p>
                      </div>
                      <div className="mt-4 pt-2 border-t border-red-100">
                        <span className="text-[11px] text-[#888888] block">Projected Total Sell</span>
                        <span className="font-heading font-semibold text-[16px] text-[#051C2C]">
                          {settings.currency} {(summary.totalDirectCost * (1 + risk.conservative/100) * (1 + settings.overheadRate/100) * (1 + settings.defaultMarginRate/100)).toLocaleString(undefined, {maximumFractionDigits:0})}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === '09_Tender_Output') {
    return (
      <div className="animate-fadeup space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-[#2251FF]" />
            <h2 className="font-heading text-[22px] font-semibold text-[#051C2C]">Bid Schedule & Tender Report Output</h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-neutral-100 text-[#051C2C] hover:bg-neutral-200 text-[12px] font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Print PDF
            </button>
          </div>
        </div>

        {/* Horizontal Navigation for Report Sub-Tabs */}
        <div className="flex border-b border-neutral-200">
          <button
            onClick={() => setOutputSubTab('client')}
            className={`px-4 py-2 text-[13px] font-semibold transition-all border-b-2 cursor-pointer ${
              outputSubTab === 'client'
                ? 'border-[#2251FF] text-[#2251FF]'
                : 'border-transparent text-neutral-500 hover:text-[#051C2C]'
            }`}
          >
            Client Schedule (External)
          </button>
          <button
            onClick={() => setOutputSubTab('internal')}
            className={`px-4 py-2 text-[13px] font-semibold transition-all border-b-2 cursor-pointer ${
              outputSubTab === 'internal'
                ? 'border-[#2251FF] text-[#2251FF]'
                : 'border-transparent text-neutral-500 hover:text-[#051C2C]'
            }`}
          >
            Internal Estimate Detailed
          </button>
          <button
            onClick={() => setOutputSubTab('trade')}
            className={`px-4 py-2 text-[13px] font-semibold transition-all border-b-2 cursor-pointer ${
              outputSubTab === 'trade'
                ? 'border-[#2251FF] text-[#2251FF]'
                : 'border-transparent text-neutral-500 hover:text-[#051C2C]'
            }`}
          >
            WBS Trade Summary
          </button>
          <button
            onClick={() => setOutputSubTab('summary')}
            className={`px-4 py-2 text-[13px] font-semibold transition-all border-b-2 cursor-pointer ${
              outputSubTab === 'summary'
                ? 'border-[#2251FF] text-[#2251FF]'
                : 'border-transparent text-neutral-500 hover:text-[#051C2C]'
            }`}
          >
            Executive Summary Box
          </button>
        </div>

        {/* Render Selected Sub-Tab */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden p-6">
          {outputSubTab === 'client' && (
            <div className="space-y-6">
              <div className="flex justify-between items-start border-b pb-4">
                <div>
                  <h3 className="font-heading text-[20px] font-semibold text-[#051C2C]">FORM OF TENDER SCHEDULE</h3>
                  <span className="text-[11px] text-[#888888] uppercase font-bold tracking-wider">Client Bid Proposal Attachment</span>
                </div>
                <div className="text-right">
                  <span className="text-neutral-500 text-[12px]">Date: {new Date().toLocaleDateString()}</span>
                </div>
              </div>

              <div className="insight-box text-[12px] text-neutral-500">
                This external schedule completely hides all internal profit markups, logistics overhead rates, and escalation factors. It presents only standard units and rates, fulfilling standard public contract criteria.
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[12px]">
                  <thead>
                    <tr className="border-b-2 border-neutral-200">
                      <th className="p-3 w-28 font-bold text-[#051C2C]">WBS Code</th>
                      <th className="p-3 font-bold text-[#051C2C]">Scope / Trade / Work Description</th>
                      <th className="p-3 w-24 text-center font-bold text-[#051C2C]">Unit</th>
                      <th className="p-3 w-32 text-right font-bold text-[#051C2C]">Quantity</th>
                      <th className="p-3 w-36 text-right font-bold text-[#051C2C]">Unit Rate ({settings.currency})</th>
                      <th className="p-3 w-40 text-right font-bold text-[#051C2C]">Extended Price ({settings.currency})</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {tenderItems.map((item) => {
                      const mapping = mappings.find((m) => m.tenderItemId === item.id);
                      const calc = calculateTenderItem(item, mapping, assemblies, costLibrary, settings, risk);

                      return (
                        <tr key={item.id} className="hover:bg-neutral-50">
                          <td className="p-3 font-mono font-semibold text-neutral-700">{item.code}</td>
                          <td className="p-3 text-[#051C2C]">
                            <span className="font-bold block">{item.trade}</span>
                            <span className="text-neutral-600 block leading-normal">{item.description}</span>
                          </td>
                          <td className="p-3 text-center font-mono">{item.unit}</td>
                          <td className="p-3 text-right font-mono">{item.qty.toLocaleString()}</td>
                          <td className="p-3 text-right font-mono">{settings.currency} {calc.clientUnitRate.toFixed(2)}</td>
                          <td className="p-3 text-right font-mono font-bold text-[#051C2C]">
                            {settings.currency} {calc.sellPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                        </tr>
                      );
                    })}
                    {/* Totals */}
                    <tr className="bg-neutral-50/80 font-bold border-t-2 border-neutral-200 text-[13px]">
                      <td colSpan={4}></td>
                      <td className="p-3 text-right text-neutral-500 uppercase tracking-wider text-[11px]">Extended Bid Price:</td>
                      <td className="p-3 text-right font-heading text-[#051C2C] text-[16px]">
                        {settings.currency} {summary.totalSell.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                    <tr className="bg-neutral-50/80 font-bold border-t border-neutral-100 text-[13px]">
                      <td colSpan={4}></td>
                      <td className="p-3 text-right text-neutral-500 uppercase tracking-wider text-[11px]">Taxes ({settings.taxRate}%):</td>
                      <td className="p-3 text-right font-mono text-neutral-700">
                        {settings.currency} {summary.totalTax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                    <tr className="bg-[#051C2C] text-white font-bold border-t-2 border-neutral-200 text-[14px]">
                      <td colSpan={4}></td>
                      <td className="p-3 text-right text-neutral-300 uppercase tracking-wider text-[11px]">Total Tender Price:</td>
                      <td className="p-3 text-right font-heading text-white text-[18px]">
                        {settings.currency} {summary.totalPriceWithTax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {outputSubTab === 'internal' && (
            <div className="space-y-6">
              <div className="flex justify-between items-start border-b pb-4">
                <div>
                  <h3 className="font-heading text-[20px] font-semibold text-[#051C2C]">INTERNAL COST EVALUATION WORK SHEET</h3>
                  <span className="text-[11px] text-[#888888] uppercase font-bold tracking-wider">Confidential Estimating Ledger</span>
                </div>
                <div className="text-right">
                  <span className="text-[12px] bg-[#D32F2F]/10 text-[#D32F2F] font-bold px-2.5 py-1 rounded-full uppercase">For Internal Use Only</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="border-b-2 border-neutral-200">
                      <th className="p-3 w-20 font-bold text-[#051C2C]">WBS</th>
                      <th className="p-3 font-bold text-[#051C2C]">Work Scope Item</th>
                      <th className="p-3 w-16 text-center font-bold text-[#051C2C]">Unit</th>
                      <th className="p-3 w-20 text-right font-bold text-[#051C2C]">Qty</th>
                      <th className="p-3 w-28 text-right font-bold text-[#051C2C]">Direct Base</th>
                      <th className="p-3 w-24 text-right font-bold text-[#051C2C]">Escalation</th>
                      <th className="p-3 w-24 text-right font-bold text-[#051C2C]">Risk Cont.</th>
                      <th className="p-3 w-24 text-right font-bold text-[#051C2C]">Overheads</th>
                      <th className="p-3 w-24 text-right font-bold text-[#051C2C]">Margin</th>
                      <th className="p-3 w-28 text-right font-bold text-[#051C2C]">Extended Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {tenderItems.map((item) => {
                      const mapping = mappings.find((m) => m.tenderItemId === item.id);
                      const calc = calculateTenderItem(item, mapping, assemblies, costLibrary, settings, risk);

                      return (
                        <tr key={item.id} className="hover:bg-neutral-50 font-mono">
                          <td className="p-3 font-semibold text-[#051C2C]">{item.code}</td>
                          <td className="p-3 text-left font-body text-[#051C2C] font-semibold">{item.description}</td>
                          <td className="p-3 text-center">{item.unit}</td>
                          <td className="p-3 text-right">{item.qty.toLocaleString()}</td>
                          <td className="p-3 text-right">{settings.currency} {calc.totalDirectCost.toLocaleString(undefined, {maximumFractionDigits:0})}</td>
                          <td className="p-3 text-right">{settings.currency} {calc.escalation.toLocaleString(undefined, {maximumFractionDigits:0})}</td>
                          <td className="p-3 text-right">{settings.currency} {calc.risk.toLocaleString(undefined, {maximumFractionDigits:0})}</td>
                          <td className="p-3 text-right">{settings.currency} {calc.overhead.toLocaleString(undefined, {maximumFractionDigits:0})}</td>
                          <td className="p-3 text-right text-[#00C853] font-semibold">{settings.currency} {calc.margin.toLocaleString(undefined, {maximumFractionDigits:0})}</td>
                          <td className="p-3 text-right font-body font-bold text-[#2251FF]">{settings.currency} {calc.sellPrice.toLocaleString(undefined, {maximumFractionDigits:0})}</td>
                        </tr>
                      );
                    })}
                    <tr className="bg-neutral-50/80 font-bold font-mono border-t-2 border-neutral-200">
                      <td colSpan={4} className="p-3 text-left font-body uppercase tracking-wider text-[11px] text-neutral-400">Ledger Summary Totals:</td>
                      <td className="p-3 text-right">{settings.currency} {summary.totalDirectCost.toLocaleString(undefined, {maximumFractionDigits:0})}</td>
                      <td className="p-3 text-right">{settings.currency} {summary.totalEscalation.toLocaleString(undefined, {maximumFractionDigits:0})}</td>
                      <td className="p-3 text-right">{settings.currency} {summary.totalRisk.toLocaleString(undefined, {maximumFractionDigits:0})}</td>
                      <td className="p-3 text-right">{settings.currency} {summary.totalOverhead.toLocaleString(undefined, {maximumFractionDigits:0})}</td>
                      <td className="p-3 text-right text-[#00C853]">{settings.currency} {summary.totalMargin.toLocaleString(undefined, {maximumFractionDigits:0})}</td>
                      <td className="p-3 text-right font-body font-bold text-[#2251FF]">{settings.currency} {summary.totalSell.toLocaleString(undefined, {maximumFractionDigits:0})}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {outputSubTab === 'trade' && (
            <div className="space-y-6">
              <h3 className="font-heading text-[18px] font-semibold text-[#051C2C] border-b pb-2">TENDER PRICE SUMMARY BY TRADES</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[12px]">
                  <thead>
                    <tr className="border-b-2 border-neutral-200 uppercase text-[10px] text-neutral-500 font-bold">
                      <th className="p-3">Trade Group</th>
                      <th className="p-3 text-center">Items Count</th>
                      <th className="p-3 text-right">Rolled Direct Cost</th>
                      <th className="p-3 text-right">Escalation & Overheads</th>
                      <th className="p-3 text-right">Contingency / Risk Pool</th>
                      <th className="p-3 text-right">Net Profit Margin</th>
                      <th className="p-3 text-right font-bold text-[#051C2C]">Final Bid Selling Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {Array.from(new Set(tenderItems.map((item) => item.trade))).map((tradeName) => {
                      const tradeItems = tenderItems.filter((i) => i.trade === tradeName);
                      let direct = 0, escalation = 0, riskVal = 0, overhead = 0, margin = 0, sell = 0;

                      tradeItems.forEach((it) => {
                        const m = mappings.find((mp) => mp.tenderItemId === it.id);
                        const c = calculateTenderItem(it, m, assemblies, costLibrary, settings, risk);
                        direct += c.totalDirectCost;
                        escalation += c.escalation;
                        riskVal += c.risk;
                        overhead += c.overhead;
                        margin += c.margin;
                        sell += c.sellPrice;
                      });

                      return (
                        <tr key={tradeName} className="hover:bg-neutral-50 font-mono">
                          <td className="p-3 text-left font-body font-semibold text-[#051C2C]">{tradeName}</td>
                          <td className="p-3 text-center">{tradeItems.length} lines</td>
                          <td className="p-3 text-right">{settings.currency} {direct.toLocaleString(undefined, {maximumFractionDigits:0})}</td>
                          <td className="p-3 text-right">{settings.currency} {(escalation+overhead).toLocaleString(undefined, {maximumFractionDigits:0})}</td>
                          <td className="p-3 text-right text-[#D32F2F]">{settings.currency} {riskVal.toLocaleString(undefined, {maximumFractionDigits:0})}</td>
                          <td className="p-3 text-right text-[#00C853] font-semibold">{settings.currency} {margin.toLocaleString(undefined, {maximumFractionDigits:0})}</td>
                          <td className="p-3 text-right font-body font-bold text-[#2251FF]">{settings.currency} {sell.toLocaleString(undefined, {maximumFractionDigits:0})}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {outputSubTab === 'summary' && (
            <div className="space-y-6 max-w-4xl">
              <h3 className="font-heading text-[18px] font-semibold text-[#051C2C] border-b pb-2">EXECUTIVE STRATEGIC DIGEST</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <span className="text-[11px] uppercase font-bold text-neutral-400">Project Classification</span>
                    <p className="text-[14px] font-semibold text-[#051C2C] mt-1">Multi-Category Commercial Civil Tender</p>
                  </div>
                  <div>
                    <span className="text-[11px] uppercase font-bold text-neutral-400">Total Tender Selling Volume</span>
                    <p className="text-[18px] font-heading font-semibold text-[#2251FF] mt-1">
                      {settings.currency} {summary.totalSell.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] uppercase font-bold text-neutral-400">Net Estimated Margin loading</span>
                    <p className="text-[18px] font-heading font-semibold text-[#00C853] mt-1">
                      {settings.currency} {summary.totalMargin.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({summary.avgMarginRate.toFixed(1)}%)
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-neutral-50 rounded-lg space-y-3 border-l-4 border-[#2251FF]">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">Bidding Strategy recommendation</span>
                  <p className="text-[12px] text-neutral-600 leading-relaxed">
                    This bid proposal has a high standard structural reuse rate of <span className="font-semibold text-[#051C2C]">{Math.round(((tenderItems.length - summary.unmappedCount)/tenderItems.length)*100)}%</span>. This provides strong confidence in direct cost calculations. Company overhead loading ({settings.overheadRate}%) and risk allowances have been secured to protect the company margins.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};
