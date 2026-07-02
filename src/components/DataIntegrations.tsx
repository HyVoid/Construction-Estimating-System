/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TenderItem, TenderMapping, Assembly, CostItem, SystemSettings, RiskScenario, HistoryRecord } from '../types';
import { calculateTenderItem, SystemCalculatedSummary } from '../utils/calcEngine';
import { Share2, History, Copy, Download, Save, CheckCircle2, Trash2, FolderSync } from 'lucide-react';

interface DataIntegrationsProps {
  tenderItems: TenderItem[];
  mappings: TenderMapping[];
  assemblies: Assembly[];
  costLibrary: CostItem[];
  settings: SystemSettings;
  risk: RiskScenario;
  summary: SystemCalculatedSummary;
  historyRecords: HistoryRecord[];
  onSaveToHistory: (record: HistoryRecord) => void;
  onDeleteHistory: (id: string) => void;
  activeTab: string;
}

export const DataIntegrations: React.FC<DataIntegrationsProps> = ({
  tenderItems,
  mappings,
  assemblies,
  costLibrary,
  settings,
  risk,
  summary,
  historyRecords,
  onSaveToHistory,
  onDeleteHistory,
  activeTab
}) => {
  const [copiedStatus, setCopiedStatus] = useState(false);
  const [newHistoryName, setNewHistoryName] = useState('');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Generate Procore CSV text block
  const generateProcoreCSV = (): string => {
    // Header
    const headers = ['WBS Code', 'Cost Code', 'Description', 'Quantity', 'Unit', 'Budget Allocation', 'Trade Group'];
    const rows: string[][] = [];

    tenderItems.forEach((item) => {
      const mapping = mappings.find((m) => m.tenderItemId === item.id);
      const calc = calculateTenderItem(item, mapping, assemblies, costLibrary, settings, risk);
      
      // Determine cost code (using mapped assembly ID or fallback)
      const costCode = mapping ? mapping.assemblyId : 'UNMAPPED';
      
      rows.push([
        item.code,
        costCode,
        item.description.replace(/,/g, ';'), // sanitise comma
        item.qty.toString(),
        item.unit,
        calc.sellPrice.toFixed(2),
        item.trade
      ]);
    });

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(','))
    ].join('\n');

    return csvContent;
  };

  const handleCopyToClipboard = () => {
    const csv = generateProcoreCSV();
    navigator.clipboard.writeText(csv);
    setCopiedStatus(true);
    setTimeout(() => setCopiedStatus(false), 2000);
  };

  const handleDownloadCSVFile = () => {
    const csv = generateProcoreCSV();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `procore_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleArchiveCurrentTender = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHistoryName.trim()) return;

    if (tenderItems.length === 0) {
      alert('Cannot archive an empty tender. Import or map items first.');
      return;
    }

    const newRecord: HistoryRecord = {
      id: `HIST-${Date.now()}`,
      tenderName: newHistoryName,
      date: new Date().toISOString().split('T')[0],
      totalCost: summary.totalCost,
      totalSell: summary.totalSell,
      margin: summary.avgMarginRate,
      itemCount: tenderItems.length,
      assemblyReuseCount: tenderItems.length - summary.unmappedCount
    };

    onSaveToHistory(newRecord);
    setNewHistoryName('');
    setSaveStatus('Tender saved to master History Repository!');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  if (activeTab === '10_Procore_Export') {
    const csvContent = generateProcoreCSV();

    return (
      <div className="animate-fadeup space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Share2 className="w-5 h-5 text-[#2251FF]" />
            <h2 className="font-heading text-[22px] font-semibold text-[#051C2C]">Procore Integration Exporter</h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCopyToClipboard}
              className="px-3 py-1.5 bg-neutral-100 text-[#051C2C] hover:bg-neutral-200 text-[12px] font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Copy className="w-4 h-4" /> {copiedStatus ? 'Copied!' : 'Copy to Clipboard'}
            </button>
            <button
              onClick={handleDownloadCSVFile}
              className="px-4 py-1.5 bg-[#2251FF] hover:bg-[#1C41CC] text-white text-[12px] font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" /> Download Procore CSV Pack
            </button>
          </div>
        </div>

        <div className="insight-box text-[13px] text-neutral-600">
          Export estimated items mapped with standard WBS codes, corporate assembly IDs, and sell budgets directly into Procore. Below is the preview of the standardized comma-separated layout required by Procore's budget upload engine.
        </div>

        {tenderItems.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center text-[#888888]">
            No client BOQ loaded. Please import some items before attempting an export.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Field mapping definitions */}
            <div className="lg:col-span-1 lift-card p-6 space-y-4">
              <h3 className="font-heading text-[16px] font-semibold text-[#051C2C] border-b pb-2">Procore Field Mapping</h3>
              <div className="space-y-3 text-[12px]">
                <div className="p-3 bg-neutral-50 rounded-lg">
                  <span className="font-semibold text-[#051C2C] block">WBS Segment</span>
                  <span className="text-neutral-500">BOQ reference codes map onto Procore budget segment levels.</span>
                </div>
                <div className="p-3 bg-neutral-50 rounded-lg">
                  <span className="font-semibold text-[#051C2C] block">Cost Code Identifier</span>
                  <span className="text-neutral-500">Corporate Assembly ID links onto Procore standard cost ledger records.</span>
                </div>
                <div className="p-3 bg-neutral-50 rounded-lg">
                  <span className="font-semibold text-[#051C2C] block">Original Budget Amount</span>
                  <span className="text-neutral-500">Calculated Sell Price serves as the initial project baseline budget.</span>
                </div>
              </div>
            </div>

            {/* CSV File text preview */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-xl border border-neutral-100 overflow-hidden shadow-sm">
                <div className="p-3 bg-neutral-50 font-semibold border-b flex justify-between items-center text-[12px]">
                  <span>procore_budget_import.csv Preview</span>
                  <span className="text-[#00C853] flex items-center gap-1 text-[11px] font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Ready for Export
                  </span>
                </div>
                <pre className="p-4 font-mono text-[11px] text-neutral-600 bg-neutral-50/50 overflow-x-auto max-h-96 whitespace-pre-wrap leading-relaxed">
                  {csvContent}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (activeTab === '11_History_Repository') {
    return (
      <div className="animate-fadeup space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <History className="w-5 h-5 text-[#2251FF]" />
            <h2 className="font-heading text-[22px] font-semibold text-[#051C2C]">Corporate Tender History Repository</h2>
          </div>
          <div className="text-[11px] text-[#888888]">
            {historyRecords.length} Archived Bids
          </div>
        </div>

        <div className="insight-box text-[13px] text-neutral-600">
          This secure ledger holds archived tenders submitted in previous bidding cycles. Archiving new tenders lets estimators audit historic reuse rates and cross-verify unit price shifts over time.
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Archive Action Form */}
          <div className="lg:col-span-1 space-y-4">
            <div className="lift-card p-6 space-y-4 border-l-4 border-[#2251FF]">
              <h3 className="font-heading text-[16px] font-semibold text-[#051C2C] flex items-center gap-2">
                <FolderSync className="w-4 h-4 text-[#2251FF]" />
                Archive Current Estimate
              </h3>

              <form onSubmit={handleArchiveCurrentTender} className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-neutral-400 font-bold mb-1">Tender Project Name</label>
                  <input
                    type="text"
                    className="input-editable w-full text-[12px]"
                    placeholder="e.g. Greenwood Phase 2 foundations"
                    value={newHistoryName}
                    onChange={(e) => setNewHistoryName(e.target.value)}
                    required
                  />
                </div>

                <div className="p-3 bg-neutral-50 rounded-lg text-[12px] space-y-1 text-neutral-600">
                  <div className="flex justify-between">
                    <span>Active Bid Items:</span>
                    <span className="font-semibold font-mono">{tenderItems.length} items</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Archiving Sell Price:</span>
                    <span className="font-semibold font-mono text-[#2251FF]">
                      {settings.currency} {summary.totalSell.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Margin:</span>
                    <span className="font-semibold font-mono text-[#00C853]">{summary.avgMarginRate.toFixed(1)}%</span>
                  </div>
                </div>

                {saveStatus && (
                  <div className="p-2 bg-green-50 text-[#00C853] text-[12px] font-medium rounded text-center">
                    {saveStatus}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={tenderItems.length === 0}
                  className={`w-full py-2 px-4 rounded-lg text-[12px] font-semibold flex items-center justify-center gap-2 transition-all ${
                    tenderItems.length > 0
                      ? 'bg-[#051C2C] hover:bg-neutral-800 text-white cursor-pointer'
                      : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                  }`}
                >
                  <Save className="w-4 h-4" /> Archive Bid Package
                </button>
              </form>
            </div>
          </div>

          {/* Archive Table list */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="th-header">Project Name</th>
                    <th className="th-header w-28 text-center">Date</th>
                    <th className="th-header w-20 text-center">Lines</th>
                    <th className="th-header w-28 text-right">Raw Cost</th>
                    <th className="th-header w-32 text-right">Tender Value</th>
                    <th className="th-header w-20 text-right">Margin</th>
                    <th className="th-header w-12 text-center">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-[12px]">
                  {historyRecords.length > 0 ? (
                    historyRecords.map((rec) => (
                      <tr key={rec.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="p-3 font-semibold text-[#051C2C]">{rec.tenderName}</td>
                        <td className="p-3 text-center text-neutral-500 font-mono">{rec.date}</td>
                        <td className="p-3 text-center font-semibold text-neutral-600">{rec.itemCount} rows</td>
                        <td className="p-3 text-right font-mono">
                          {settings.currency} {rec.totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-[#2251FF]">
                          {settings.currency} {rec.totalSell.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </td>
                        <td className="p-3 text-right text-[#00C853] font-semibold font-mono">{rec.margin.toFixed(1)}%</td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => {
                              if (confirm('Are you sure you want to remove this archived bid record?')) {
                                onDeleteHistory(rec.id);
                              }
                            }}
                            className="text-neutral-400 hover:text-[#D32F2F] p-1 rounded transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-12 text-center text-[#888888]">
                        The History Repository is currently empty. Use the left panel to archive your active proposal.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
