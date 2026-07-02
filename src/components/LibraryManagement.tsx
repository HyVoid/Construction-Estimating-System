/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CostItem, Assembly, CostCategory, SystemSettings } from '../types';
import { calculateAssembly } from '../utils/calcEngine';
import { Database, Plus, Trash2, Layers, SlidersHorizontal, ChevronRight, ChevronDown } from 'lucide-react';

interface LibraryManagementProps {
  costLibrary: CostItem[];
  onChangeCostLibrary: (list: CostItem[]) => void;
  assemblies: Assembly[];
  onChangeAssemblies: (list: Assembly[]) => void;
  settings: SystemSettings;
  activeTab: string;
}

export const LibraryManagement: React.FC<LibraryManagementProps> = ({
  costLibrary,
  onChangeCostLibrary,
  assemblies,
  onChangeAssemblies,
  settings,
  activeTab
}) => {
  // Filters & State for Cost Library
  const [selectedCategory, setSelectedCategory] = useState<CostCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newUnit, setNewUnit] = useState('hr');
  const [newRate, setNewRate] = useState(0);
  const [newCat, setNewCat] = useState<CostCategory>('Material');

  // Expanded assemblies
  const [expandedAssembly, setExpandedAssembly] = useState<string | null>(null);

  // Add new assembly state
  const [newAsmId, setNewAsmId] = useState('');
  const [newAsmDesc, setNewAsmDesc] = useState('');
  const [newAsmUnit, setNewAsmUnit] = useState('m3');

  // Max rate in Cost Library for calculating direct inline data bars
  const maxRate = costLibrary.reduce((max, item) => (item.rate > max ? item.rate : max), 1);

  const handleAddCostItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || !newDesc) return;

    // Avoid duplicate codes
    if (costLibrary.some((item) => item.code.toUpperCase() === newCode.toUpperCase())) {
      alert('Cost code already exists! Must be unique.');
      return;
    }

    const newItem: CostItem = {
      code: newCode.toUpperCase(),
      description: newDesc,
      unit: newUnit,
      rate: newRate,
      category: newCat
    };

    onChangeCostLibrary([...costLibrary, newItem]);
    setNewCode('');
    setNewDesc('');
    setNewRate(0);
  };

  const handleUpdateRate = (code: string, val: number) => {
    const updated = costLibrary.map((item) => (item.code === code ? { ...item, rate: val } : item));
    onChangeCostLibrary(updated);
  };

  const handleUpdateUnit = (code: string, unit: string) => {
    const updated = costLibrary.map((item) => (item.code === code ? { ...item, unit } : item));
    onChangeCostLibrary(updated);
  };

  const handleUpdateDescription = (code: string, desc: string) => {
    const updated = costLibrary.map((item) => (item.code === code ? { ...item, description: desc } : item));
    onChangeCostLibrary(updated);
  };

  const handleDeleteCostItem = (code: string) => {
    if (confirm(`Are you sure you want to remove cost code "${code}"? This will affect any Assemblies using it.`)) {
      onChangeCostLibrary(costLibrary.filter((item) => item.code !== code));
    }
  };

  const handleAddAssembly = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsmId || !newAsmDesc) return;

    if (assemblies.some((a) => a.id.toUpperCase() === newAsmId.toUpperCase())) {
      alert('Assembly template ID already exists!');
      return;
    }

    const newAsm: Assembly = {
      id: newAsmId.toUpperCase(),
      description: newAsmDesc,
      unit: newAsmUnit,
      items: []
    };

    onChangeAssemblies([...assemblies, newAsm]);
    setNewAsmId('');
    setNewAsmDesc('');
  };

  const handleDeleteAssembly = (id: string) => {
    if (confirm(`Are you sure you want to delete assembly "${id}"?`)) {
      onChangeAssemblies(assemblies.filter((a) => a.id !== id));
    }
  };

  // Filtered Cost Library items
  const filteredCosts = costLibrary.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  if (activeTab === '02_Cost_Library') {
    return (
      <div className="animate-fadeup space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Database className="w-5 h-5 text-[#2251FF]" />
            <h2 className="font-heading text-[22px] font-semibold text-[#051C2C]">Corporate Master Cost Library</h2>
          </div>
          <div className="text-[11px] text-[#888888]">
            {costLibrary.length} Active Pricing Units
          </div>
        </div>

        <div className="insight-box text-[13px] text-neutral-600">
          This library serves as the single source of truth for raw materials, plant hires, subcontractor rates, and labor hourly trades. Value rows display standard inline magnitude data bars scaled relative to the highest rate in the database (<span className="font-semibold text-[#051C2C]">{settings.currency} {maxRate.toFixed(2)}</span>).
        </div>

        {/* Filters Panel */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              placeholder="Search by code or description..."
              className="input-editable flex-grow"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap">
            <span className="text-[11px] font-semibold text-neutral-400 tracking-wider uppercase">Category:</span>
            {(['All', 'Material', 'Labour', 'Equipment', 'Subcontract', 'Plant'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-[12px] font-medium rounded-lg transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#051C2C] text-white shadow-sm'
                    : 'text-[#051C2C] hover:bg-neutral-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Add Row Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-[#051C2C]">
          <h3 className="font-heading text-[16px] font-semibold text-[#051C2C] mb-4">Register New Cost Ledger Code</h3>
          <form onSubmit={handleAddCostItem} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#888888] font-bold mb-1">Code</label>
              <input
                type="text"
                placeholder="e.g. MAT-REBAR-16"
                className="input-editable w-full"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#888888] font-bold mb-1">Description</label>
              <input
                type="text"
                placeholder="N16 Structural Deformed Rebar"
                className="input-editable w-full"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#888888] font-bold mb-1">Category</label>
              <select
                className="input-editable w-full"
                value={newCat}
                onChange={(e) => setNewCat(e.target.value as CostCategory)}
              >
                <option value="Material">Material</option>
                <option value="Labour">Labour</option>
                <option value="Equipment">Equipment</option>
                <option value="Subcontract">Subcontract</option>
                <option value="Plant">Plant</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#888888] font-bold mb-1">Unit / Rate</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="t"
                  className="input-editable w-16 text-center"
                  value={newUnit}
                  onChange={(e) => setNewUnit(e.target.value)}
                  required
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="1350.00"
                  className="input-editable flex-grow"
                  value={newRate || ''}
                  onChange={(e) => setNewRate(parseFloat(e.target.value) || 0)}
                  required
                />
              </div>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-[#051C2C] hover:bg-neutral-800 text-white font-medium text-[12px] py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Code
              </button>
            </div>
          </form>
        </div>

        {/* Database Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="th-header w-24">Code</th>
                  <th className="th-header">Description</th>
                  <th className="th-header w-32">Category</th>
                  <th className="th-header w-24 text-center">Unit</th>
                  <th className="th-header w-56 text-right">Unit Rate ({settings.currency})</th>
                  <th className="th-header w-16 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredCosts.length > 0 ? (
                  filteredCosts.map((item) => {
                    const relativePct = (item.rate / maxRate) * 100;
                    return (
                      <tr key={item.code} className="hover:bg-neutral-50 transition-colors">
                        <td className="p-3 font-mono font-semibold text-[#051C2C] text-[12px]">
                          {item.code}
                        </td>
                        <td className="p-3">
                          <input
                            type="text"
                            className="input-editable w-full bg-transparent border-none p-0 focus:bg-yellow-50 focus:p-1"
                            value={item.description}
                            onChange={(e) => handleUpdateDescription(item.code, e.target.value)}
                          />
                        </td>
                        <td className="p-3">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                            item.category === 'Material' ? 'bg-blue-50 text-[#2251FF]' :
                            item.category === 'Labour' ? 'bg-slate-50 text-[#051C2C]' :
                            item.category === 'Equipment' ? 'bg-neutral-50 text-neutral-600' :
                            'bg-stone-50 text-stone-700'
                          }`}>
                            {item.category}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <input
                            type="text"
                            className="input-editable w-12 text-center"
                            value={item.unit}
                            onChange={(e) => handleUpdateUnit(item.code, e.target.value)}
                          />
                        </td>
                        <td className="p-3 text-right">
                          <div className="space-y-1">
                            <input
                              type="number"
                              step="0.01"
                              className="input-editable w-32 text-right"
                              value={item.rate}
                              onChange={(e) => handleUpdateRate(item.code, parseFloat(e.target.value) || 0)}
                            />
                            {/* Inline Data Bar */}
                            <div className="databar-track ml-auto max-w-[130px]">
                              <div className="databar-fill" style={{ width: `${relativePct}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleDeleteCostItem(item.code)}
                            className="text-neutral-400 hover:text-[#D32F2F] p-1 rounded transition-colors cursor-pointer"
                            title="Delete Item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-[#888888]">
                      No cost codes found matching filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === '03_Assembly_Library') {
    return (
      <div className="animate-fadeup space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Layers className="w-5 h-5 text-[#2251FF]" />
            <h2 className="font-heading text-[22px] font-semibold text-[#051C2C]">Corporate Master Assembly Templates</h2>
          </div>
          <div className="text-[11px] text-[#888888]">
            {assemblies.length} Pre-built Templates
          </div>
        </div>

        <div className="insight-box text-[13px] text-neutral-600">
          Assemblies group labor, machinery, and materials together to estimate typical project components per unit (e.g., m3 concrete, m2 wall). Expanding templates reveals live cost rollups calculated directly from current Cost Library rates.
        </div>

        {/* Create Assembly Template Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-[#051C2C]">
          <h3 className="font-heading text-[16px] font-semibold text-[#051C2C] mb-4">Register New Assembly Shell</h3>
          <form onSubmit={handleAddAssembly} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#888888] font-bold mb-1">Assembly ID / Code</label>
              <input
                type="text"
                placeholder="e.g. ASM-WALL-150"
                className="input-editable w-full"
                value={newAsmId}
                onChange={(e) => setNewAsmId(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#888888] font-bold mb-1">Standard Work Scope Description</label>
              <input
                type="text"
                placeholder="150mm Structural Retaining Wall per m2"
                className="input-editable w-full"
                value={newAsmDesc}
                onChange={(e) => setNewAsmDesc(e.target.value)}
                required
              />
            </div>
            <div className="flex gap-4">
              <div className="w-24">
                <label className="block text-[10px] uppercase tracking-wider text-[#888888] font-bold mb-1">Work Unit</label>
                <input
                  type="text"
                  placeholder="m2"
                  className="input-editable w-full text-center"
                  value={newAsmUnit}
                  onChange={(e) => setNewAsmUnit(e.target.value)}
                  required
                />
              </div>
              <div className="flex-1 flex items-end">
                <button
                  type="submit"
                  className="w-full bg-[#051C2C] hover:bg-neutral-800 text-white font-medium text-[12px] py-2 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Create Assembly
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Assemblies Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="th-header w-12"></th>
                  <th className="th-header w-32">Assembly ID</th>
                  <th className="th-header">Template Scope / Description</th>
                  <th className="th-header w-24 text-center">Unit</th>
                  <th className="th-header w-40 text-center">Sub-Items</th>
                  <th className="th-header w-44 text-right">Rolled Direct Cost</th>
                  <th className="th-header w-20 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {assemblies.map((asm) => {
                  const calcResult = calculateAssembly(asm, costLibrary);
                  const isExpanded = expandedAssembly === asm.id;

                  return (
                    <React.Fragment key={asm.id}>
                      <tr 
                        className={`hover:bg-neutral-50 transition-colors cursor-pointer ${isExpanded ? 'bg-neutral-50/50' : ''}`}
                        onClick={() => setExpandedAssembly(isExpanded ? null : asm.id)}
                      >
                        <td className="p-3 text-center">
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-[#2251FF]" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-neutral-400" />
                          )}
                        </td>
                        <td className="p-3 font-mono font-semibold text-[#051C2C] text-[12px]">
                          {asm.id}
                        </td>
                        <td className="p-3 font-medium text-[#051C2C]">
                          {asm.description}
                        </td>
                        <td className="p-3 text-center font-mono">
                          {asm.unit}
                        </td>
                        <td className="p-3 text-center">
                          <span className="inline-block px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 text-[11px] font-semibold">
                            {asm.items.length} items
                          </span>
                        </td>
                        <td className="p-3 text-right font-heading font-semibold text-[14px] text-[#2251FF]">
                          {settings.currency} {calcResult.unitDirectCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleDeleteAssembly(asm.id)}
                            className="text-neutral-400 hover:text-[#D32F2F] p-1 rounded transition-colors cursor-pointer"
                            title="Delete Template"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Sub-Items Details */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={7} className="p-4 bg-neutral-50/70 border-t border-b border-neutral-100">
                            <div className="space-y-3 pl-8">
                              <h4 className="text-[11px] font-semibold text-neutral-400 tracking-wider uppercase">Assembly Bill of Materials composition</h4>
                              {asm.items.length > 0 ? (
                                <div className="bg-white rounded-lg border border-neutral-100 overflow-hidden shadow-sm max-w-4xl">
                                  <table className="w-full text-left border-collapse">
                                    <thead>
                                      <tr className="bg-neutral-50/80">
                                        <th className="p-2 text-[10px] font-semibold uppercase text-neutral-500">Ledger Code</th>
                                        <th className="p-2 text-[10px] font-semibold uppercase text-neutral-500">Item Name</th>
                                        <th className="p-2 text-[10px] font-semibold uppercase text-neutral-500 text-center">Category</th>
                                        <th className="p-2 text-[10px] font-semibold uppercase text-neutral-500 text-right">Standard Qty</th>
                                        <th className="p-2 text-[10px] font-semibold uppercase text-neutral-500 text-center">Unit</th>
                                        <th className="p-2 text-[10px] font-semibold uppercase text-neutral-500 text-right">Rate</th>
                                        <th className="p-2 text-[10px] font-semibold uppercase text-neutral-500 text-right">Allocated Subtotal</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-50">
                                      {calcResult.items.map((subItem) => (
                                        <tr key={subItem.costCode} className={subItem.isMissing ? 'bg-red-50/40 text-[#D32F2F]' : ''}>
                                          <td className="p-2 font-mono text-[11px] font-semibold">{subItem.costCode}</td>
                                          <td className="p-2 text-[12px]">{subItem.description}</td>
                                          <td className="p-2 text-center text-[11px]">{subItem.category}</td>
                                          <td className="p-2 text-right font-mono text-[11px]">{subItem.qty}</td>
                                          <td className="p-2 text-center font-mono text-[11px]">{subItem.unit}</td>
                                          <td className="p-2 text-right font-mono text-[11px]">
                                            {settings.currency} {subItem.rate.toFixed(2)}
                                          </td>
                                          <td className="p-2 text-right font-mono font-semibold text-[11px] text-[#051C2C]">
                                            {settings.currency} {subItem.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              ) : (
                                <p className="text-[12px] text-[#888888] italic">
                                  No items inside this assembly template. Navigate to the "Assembly Builder" tab to select items and link them.
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
      </div>
    );
  }

  return null;
};
