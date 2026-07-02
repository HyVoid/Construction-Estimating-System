/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TenderItem, TenderMapping, Assembly, SystemSettings } from '../types';
import { UploadCloud, CheckCircle2, AlertTriangle, Layers, Plus, Trash2, ArrowRightLeft, FileSpreadsheet } from 'lucide-react';

interface TenderFlowProps {
  tenderItems: TenderItem[];
  onChangeTenderItems: (items: TenderItem[]) => void;
  mappings: TenderMapping[];
  onChangeMappings: (mappings: TenderMapping[]) => void;
  assemblies: Assembly[];
  settings: SystemSettings;
  activeTab: string;
}

export const TenderFlow: React.FC<TenderFlowProps> = ({
  tenderItems,
  onChangeTenderItems,
  mappings,
  onChangeMappings,
  assemblies,
  settings,
  activeTab
}) => {
  // Import States
  const [bulkText, setBulkText] = useState('');
  const [delimiter, setDelimiter] = useState<',' | '\t'>(',');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Manual entry states
  const [newCode, setNewCode] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newQty, setNewQty] = useState(0);
  const [newUnit, setNewUnit] = useState('m3');
  const [newTrade, setNewTrade] = useState('General');

  // Parse and import CSV/TSV
  const handleBulkImport = () => {
    if (!bulkText.trim()) return;

    try {
      const lines = bulkText.split(/\r?\n/);
      const parsedItems: TenderItem[] = [];

      lines.forEach((line, index) => {
        if (!line.trim()) return;
        // Simple splitting, taking care of some quotes if any
        const cols = line.split(delimiter);
        
        if (cols.length >= 3) {
          const code = cols[0].trim();
          const description = cols[1].trim();
          const qty = parseFloat(cols[2].trim()) || 0;
          const unit = cols[3] ? cols[3].trim() : 'ea';
          const trade = cols[4] ? cols[4].trim() : 'Unassigned';

          parsedItems.push({
            id: `TND-IMP-${Date.now()}-${index}`,
            code,
            description,
            qty,
            unit,
            trade
          });
        }
      });

      if (parsedItems.length === 0) {
        setImportStatus('No valid data parsed. Ensure at least 3 columns: Code, Description, Quantity.');
        return;
      }

      // Merge or overwrite
      onChangeTenderItems([...tenderItems, ...parsedItems]);
      setBulkText('');
      setImportStatus(`Successfully imported ${parsedItems.length} BOQ items!`);
      setTimeout(() => setImportStatus(null), 4000);
    } catch (err) {
      setImportStatus('Failed to parse text. Please check format. Expected: Code,Description,Qty,Unit,Trade');
    }
  };

  const handleAddManualItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || !newDesc || newQty <= 0) return;

    const newItem: TenderItem = {
      id: `TND-MAN-${Date.now()}`,
      code: newCode,
      description: newDesc,
      qty: newQty,
      unit: newUnit,
      trade: newTrade
    };

    onChangeTenderItems([...tenderItems, newItem]);
    setNewCode('');
    setNewDesc('');
    setNewQty(0);
  };

  const handleDeleteItem = (id: string) => {
    onChangeTenderItems(tenderItems.filter((item) => item.id !== id));
    onChangeMappings(mappings.filter((m) => m.tenderItemId !== id));
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear the entire client BOQ?')) {
      onChangeTenderItems([]);
      onChangeMappings([]);
    }
  };

  const handleUpdateMapping = (tenderItemId: string, assemblyId: string) => {
    const existingIndex = mappings.findIndex((m) => m.tenderItemId === tenderItemId);
    let updated = [...mappings];

    if (existingIndex > -1) {
      if (!assemblyId) {
        updated.splice(existingIndex, 1); // remove
      } else {
        updated[existingIndex] = { ...updated[existingIndex], assemblyId };
      }
    } else if (assemblyId) {
      updated.push({ tenderItemId, assemblyId, factor: 1.0 });
    }

    onChangeMappings(updated);
  };

  const handleUpdateFactor = (tenderItemId: string, factor: number) => {
    const existingIndex = mappings.findIndex((m) => m.tenderItemId === tenderItemId);
    if (existingIndex > -1) {
      const updated = [...mappings];
      updated[existingIndex] = { ...updated[existingIndex], factor };
      onChangeMappings(updated);
    }
  };

  // Auto-Map function: matches BOQ description keywords or units with Assembly template names
  const handleAutoMap = () => {
    let autoMappedCount = 0;
    const newMappings = [...mappings];

    tenderItems.forEach((item) => {
      // Check if already mapped
      if (newMappings.some((m) => m.tenderItemId === item.id)) return;

      // Simple keyword matching
      let bestMatch: Assembly | null = null;
      const descLower = item.description.toLowerCase();

      assemblies.forEach((asm) => {
        const asmNameLower = asm.description.toLowerCase();
        // Look for matches on key engineering disciplines
        if (
          (descLower.includes('slab') && asm.id.includes('SLAB')) ||
          (descLower.includes('footing') && asm.id.includes('FOOT')) ||
          (descLower.includes('excav') && asm.id.includes('EXCV')) ||
          (descLower.includes('retaining') && asm.id.includes('WALL'))
        ) {
          bestMatch = asm;
        }
      });

      if (bestMatch) {
        newMappings.push({
          tenderItemId: item.id,
          assemblyId: (bestMatch as Assembly).id,
          factor: 1.0
        });
        autoMappedCount++;
      }
    });

    if (autoMappedCount > 0) {
      onChangeMappings(newMappings);
      alert(`Auto-Mapping complete! Linked ${autoMappedCount} BOQ rows to standard assemblies using semantic keywords.`);
    } else {
      alert('Could not find semantic matches. Please map items manually.');
    }
  };

  if (activeTab === '04_Tender_Import') {
    return (
      <div className="animate-fadeup space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <UploadCloud className="w-5 h-5 text-[#2251FF]" />
            <h2 className="font-heading text-[22px] font-semibold text-[#051C2C]">Client Tender BOQ Import</h2>
          </div>
          {tenderItems.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-3 py-1.5 border border-red-200 text-[#D32F2F] hover:bg-red-50 text-[12px] font-medium rounded-lg transition-all cursor-pointer"
            >
              Clear Entire BOQ
            </button>
          )}
        </div>

        <div className="insight-box text-[13px] text-neutral-600">
          Paste the Bill of Quantities (BOQ) or scope tables from your client's tender document. 
          The system accepts standard CSV formatting or Tab-Delimited text copied directly from Excel spreadsheets.
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Paste Input Panel */}
          <div className="lg:col-span-1 lift-card p-6 space-y-4">
            <h3 className="font-heading text-[16px] font-semibold text-[#051C2C] flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-[#2251FF]" />
              Spreadsheet Paste Portal
            </h3>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">Paste Format</label>
              <div className="flex gap-4 mb-4">
                <label className="flex items-center gap-2 cursor-pointer text-[12px]">
                  <input
                    type="radio"
                    name="delimiter"
                    checked={delimiter === ','}
                    onChange={() => setDelimiter(',')}
                    className="accent-[#2251FF]"
                  />
                  <span>Comma Separated (CSV)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-[12px]">
                  <input
                    type="radio"
                    name="delimiter"
                    checked={delimiter === '\t'}
                    onChange={() => setDelimiter('\t')}
                    className="accent-[#2251FF]"
                  />
                  <span>Tab-Delimited (Excel Copy)</span>
                </label>
              </div>

              <textarea
                className="input-editable w-full h-48 font-mono text-[11px] bg-neutral-50/50 p-3 rounded-lg"
                placeholder={`e.g. For Tab-Delimited, paste columns directly:\nBOQ-1.1\tReady Mix concrete slab\t350\tm3\tSlab-work\nBOQ-1.2\tStrip foundations\t120\tm3\tFooting-work`}
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
              />
            </div>

            {importStatus && (
              <div className={`p-3 rounded-lg text-[12px] font-medium flex items-center gap-2 ${
                importStatus.includes('Successfully') ? 'bg-green-50 text-[#00C853]' : 'bg-red-50 text-[#D32F2F]'
              }`}>
                <CheckCircle2 className="w-4 h-4" />
                <span>{importStatus}</span>
              </div>
            )}

            <button
              onClick={handleBulkImport}
              className="w-full bg-[#051C2C] hover:bg-neutral-800 text-white py-2 px-4 rounded-lg font-medium text-[12px] flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              Parse & Load BOQ Rows
            </button>
          </div>

          {/* Inline Add & Table Panel */}
          <div className="lg:col-span-2 space-y-4">
            {/* Quick add manual form */}
            <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-[#051C2C]">
              <h3 className="font-heading text-[15px] font-semibold text-[#051C2C] mb-3">Add BOQ Row Manually</h3>
              <form onSubmit={handleAddManualItem} className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                <div>
                  <input
                    type="text"
                    placeholder="WBS Code"
                    className="input-editable w-full text-[12px]"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    placeholder="Detailed Description of Works"
                    className="input-editable w-full text-[12px]"
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Qty"
                    className="input-editable w-16 text-center text-[12px]"
                    value={newQty || ''}
                    onChange={(e) => setNewQty(parseFloat(e.target.value) || 0)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Unit"
                    className="input-editable w-12 text-center text-[12px]"
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full bg-[#051C2C] hover:bg-neutral-800 text-white font-semibold py-1.5 rounded-lg text-[12px] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Append Row
                  </button>
                </div>
              </form>
            </div>

            {/* Current Loaded BOQ */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 bg-neutral-50/50 border-b flex justify-between items-center">
                <span className="font-semibold text-[#051C2C] text-[13px]">Active Tender Scope Checklist</span>
                <span className="text-[11px] bg-[#051C2C] text-white px-2 py-0.5 rounded-full font-bold">
                  {tenderItems.length} lines total
                </span>
              </div>
              <div className="overflow-y-auto max-h-96">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="th-header w-28">WBS Code</th>
                      <th className="th-header">Work Scope Description</th>
                      <th className="th-header w-20 text-center">Unit</th>
                      <th className="th-header w-24 text-right">Quantity</th>
                      <th className="th-header w-16 text-center">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 text-[13px]">
                    {tenderItems.length > 0 ? (
                      tenderItems.map((item) => (
                        <tr key={item.id} className="hover:bg-neutral-50 transition-colors">
                          <td className="p-3 font-mono font-semibold text-[#051C2C]">{item.code}</td>
                          <td className="p-3 text-neutral-700">{item.description}</td>
                          <td className="p-3 text-center font-mono text-neutral-500">{item.unit}</td>
                          <td className="p-3 text-right font-mono font-semibold">{item.qty.toLocaleString()}</td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              className="text-neutral-300 hover:text-[#D32F2F] p-1 rounded transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-12 text-center text-[#888888]">
                          No client scope imported. Type above manually or copy-paste spreadsheet columns.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === '05_Tender_Mapping') {
    return (
      <div className="animate-fadeup space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ArrowRightLeft className="w-5 h-5 text-[#2251FF]" />
            <h2 className="font-heading text-[22px] font-semibold text-[#051C2C]">BOQ to Assembly Blueprint Engine</h2>
          </div>
          {tenderItems.length > 0 && (
            <button
              onClick={handleAutoMap}
              className="px-4 py-1.5 bg-[#051C2C] hover:bg-neutral-800 text-white text-[12px] font-medium rounded-lg flex items-center gap-2 shadow-sm transition-all cursor-pointer animate-pulse"
            >
              <Layers className="w-4 h-4" /> Smart Auto-Map
            </button>
          )}
        </div>

        <div className="insight-box text-[13px] text-neutral-600">
          Map client tender rows (left) to corporate Estimating Assemblies (right). You can apply a 
          <span className="font-semibold text-[#051C2C]"> Scale Factor </span> to adjust assembly quantities to match specific bid scope complexities (e.g. 1.25 for higher difficulty, 0.85 for bulk efficiency). Clickable cells scale and highlight on hover.
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
                    <th className="th-header w-24">Code</th>
                    <th className="th-header w-1/3">BOQ Line Items</th>
                    <th className="th-header w-20 text-center">Unit</th>
                    <th className="th-header w-24 text-right">Qty</th>
                    <th className="th-header w-64 text-center">Matched Assembly Target</th>
                    <th className="th-header w-28 text-center">Scale Factor</th>
                    <th className="th-header text-center">Status Alignment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {tenderItems.map((item) => {
                    const currentMapping = mappings.find((m) => m.tenderItemId === item.id);
                    const isMapped = !!currentMapping?.assemblyId;
                    const matchedAsm = isMapped ? assemblies.find((a) => a.id === currentMapping.assemblyId) : null;

                    // Warn on unit mismatch as an anomaly
                    const unitMismatch = matchedAsm && matchedAsm.unit.toLowerCase() !== item.unit.toLowerCase();

                    return (
                      <tr key={item.id} className={`hover:bg-neutral-50/50 transition-colors ${!isMapped ? 'bg-red-50/20' : ''}`}>
                        <td className="p-3 font-mono text-[12px] text-neutral-500 font-semibold">{item.code}</td>
                        <td className="p-3">
                          <span className="font-semibold text-[#051C2C] block text-[13px]">{item.trade}</span>
                          <span className="text-[12px] text-neutral-600 block leading-tight">{item.description}</span>
                        </td>
                        <td className="p-3 text-center font-mono text-[12px] text-neutral-500">{item.unit}</td>
                        <td className="p-3 text-right font-mono font-semibold text-[12px]">{item.qty.toLocaleString()}</td>
                        <td className="p-3 text-center">
                          {/* Scale scale on hover cell */}
                          <div className="interactive-cell">
                            <select
                              className="input-editable w-full text-[12px] font-semibold cursor-pointer"
                              value={currentMapping?.assemblyId || ''}
                              onChange={(e) => handleUpdateMapping(item.id, e.target.value)}
                            >
                              <option value="">-- [Select Assembly] --</option>
                              {assemblies.map((asm) => (
                                <option key={asm.id} value={asm.id}>
                                  {asm.id} : {asm.description} ({asm.unit})
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          {isMapped ? (
                            <input
                              type="number"
                              step="0.05"
                              className="input-editable w-20 text-center font-mono font-semibold"
                              value={currentMapping?.factor || 1.0}
                              onChange={(e) => handleUpdateFactor(item.id, parseFloat(e.target.value) || 1.0)}
                            />
                          ) : (
                            <span className="text-[#888888] font-mono text-[12px]">-</span>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          {isMapped ? (
                            unitMismatch ? (
                              <div className="inline-flex items-center gap-1 text-[#D32F2F] bg-red-50 px-2 py-1 rounded-full text-[11px] font-semibold" title="Unit mismatch! Scaling factor applied.">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                <span>Unit Diff</span>
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-1 text-[#00C853] bg-green-50 px-2 py-1 rounded-full text-[11px] font-semibold">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Linked</span>
                              </div>
                            )
                          ) : (
                            <div className="inline-flex items-center gap-1 text-[#D32F2F] bg-red-50 px-2.5 py-1 rounded-full text-[11px] font-semibold animate-pulse">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              <span>Offline</span>
                            </div>
                          )}
                        </td>
                      </tr>
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

  return null;
};
