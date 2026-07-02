/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Assembly, CostItem, SystemSettings, AssemblyItem } from '../types';
import { calculateAssembly } from '../utils/calcEngine';
import { Hammer, Plus, Save, Trash2, Search, Sliders, PlayCircle } from 'lucide-react';

interface AssemblyBuilderViewProps {
  assemblies: Assembly[];
  onChangeAssemblies: (list: Assembly[]) => void;
  costLibrary: CostItem[];
  settings: SystemSettings;
}

export const AssemblyBuilderView: React.FC<AssemblyBuilderViewProps> = ({
  assemblies,
  onChangeAssemblies,
  costLibrary,
  settings
}) => {
  const [selectedAsmId, setSelectedAsmId] = useState<string>('');
  const [asmDesc, setAsmDesc] = useState('');
  const [asmUnit, setAsmUnit] = useState('m3');
  const [items, setItems] = useState<AssemblyItem[]>([]);

  // Add sub-item state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCostCode, setSelectedCostCode] = useState('');
  const [itemQty, setItemQty] = useState(1.0);

  // Load the assembly into local editing state
  useEffect(() => {
    if (selectedAsmId) {
      const asm = assemblies.find((a) => a.id === selectedAsmId);
      if (asm) {
        setAsmDesc(asm.description);
        setAsmUnit(asm.unit);
        setItems([...asm.items]);
      }
    } else {
      setAsmDesc('');
      setAsmUnit('m3');
      setItems([]);
    }
  }, [selectedAsmId, assemblies]);

  // Handle adding an item to the local assembly composition
  const handleAddCompositionItem = () => {
    if (!selectedCostCode) return;

    // Check if code already in composition
    if (items.some((it) => it.costCode === selectedCostCode)) {
      alert('This cost code is already part of the assembly. Please edit its quantity multiplier instead.');
      return;
    }

    const newItem: AssemblyItem = {
      costCode: selectedCostCode,
      qty: itemQty
    };

    setItems([...items, newItem]);
    setSelectedCostCode('');
    setItemQty(1.0);
    setSearchQuery('');
  };

  const handleUpdateQty = (code: string, qty: number) => {
    const updated = items.map((it) => (it.costCode === code ? { ...it, qty } : it));
    setItems(updated);
  };

  const handleRemoveItem = (code: string) => {
    setItems(items.filter((it) => it.costCode !== code));
  };

  // Commit changes to master assembly list
  const handleSaveAssembly = () => {
    if (!selectedAsmId) return;

    const updatedAssemblies = assemblies.map((asm) => {
      if (asm.id === selectedAsmId) {
        return {
          ...asm,
          description: asmDesc,
          unit: asmUnit,
          items: items
        };
      }
      return asm;
    });

    onChangeAssemblies(updatedAssemblies);
    alert('Assembly Template successfully synchronized with master Cost Database!');
  };

  // Filter cost library based on query
  const filteredCostCodes = costLibrary.filter(
    (c) =>
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Compute live direct cost of the edited composition
  const liveDirectCost = items.reduce((sum, it) => {
    const costItem = costLibrary.find((c) => c.code === it.costCode);
    const rate = costItem ? costItem.rate : 0;
    return sum + it.qty * rate;
  }, 0);

  return (
    <div className="animate-fadeup space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Hammer className="w-5 h-5 text-[#2251FF]" />
          <h2 className="font-heading text-[22px] font-semibold text-[#051C2C]">Assembly Factory Builder</h2>
        </div>
        <div>
          <select
            className="input-editable font-bold text-[#051C2C] bg-white text-[13px]"
            value={selectedAsmId}
            onChange={(e) => setSelectedAsmId(e.target.value)}
          >
            <option value="">-- [Select Assembly to Edit] --</option>
            {assemblies.map((a) => (
              <option key={a.id} value={a.id}>
                {a.id} : {a.description}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="insight-box text-[13px] text-neutral-600">
        Choose an Assembly from the dropdown above to edit its parameters. Add cost items, adjust standard material quantities, and tune labor productivity formulas. Calculations update in real-time as you type.
      </div>

      {!selectedAsmId ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center text-[#888888]">
          No assembly template selected. Choose a template from the top-right selector to begin building.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Edit Parameters & Sub-Items additions */}
          <div className="lg:col-span-1 space-y-6">
            <div className="lift-card p-6 space-y-4">
              <h3 className="font-heading text-[16px] font-semibold text-[#051C2C] border-b pb-2">Assembly Parameters</h3>
              
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-neutral-400 font-bold mb-1">Assembly ID / Code</label>
                <input
                  type="text"
                  className="input-editable w-full bg-neutral-100 cursor-not-allowed text-neutral-500 text-[12px]"
                  value={selectedAsmId}
                  disabled
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-neutral-400 font-bold mb-1">Scope Description</label>
                <input
                  type="text"
                  className="input-editable w-full text-[12px]"
                  value={asmDesc}
                  onChange={(e) => setAsmDesc(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-neutral-400 font-bold mb-1">Work Unit</label>
                <input
                  type="text"
                  className="input-editable w-full text-center text-[12px]"
                  value={asmUnit}
                  onChange={(e) => setAsmUnit(e.target.value)}
                />
              </div>
            </div>

            {/* Selector panel to append cost item */}
            <div className="lift-card p-6 space-y-4">
              <h3 className="font-heading text-[16px] font-semibold text-[#051C2C] border-b pb-2">Append Cost Ledger Code</h3>
              
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-neutral-400 font-bold mb-1">Search Cost Library</label>
                <div className="relative mb-2">
                  <input
                    type="text"
                    placeholder="Search keyword..."
                    className="input-editable w-full pl-8 text-[12px]"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSelectedCostCode('');
                    }}
                  />
                  <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-neutral-400" />
                </div>

                <select
                  className="input-editable w-full text-[12px]"
                  value={selectedCostCode}
                  onChange={(e) => setSelectedCostCode(e.target.value)}
                  size={5}
                >
                  {filteredCostCodes.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} ({c.category}): {c.description} [{settings.currency} {c.rate}/{c.unit}]
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-neutral-400 font-bold mb-1">Standard Quantity (Multiplier)</label>
                <div className="flex gap-4">
                  <input
                    type="number"
                    step="0.01"
                    className="input-editable w-24 text-center font-semibold text-[13px]"
                    value={itemQty}
                    onChange={(e) => setItemQty(parseFloat(e.target.value) || 1.0)}
                  />
                  <button
                    type="button"
                    onClick={handleAddCompositionItem}
                    disabled={!selectedCostCode}
                    className={`flex-1 font-semibold py-1.5 px-4 rounded-lg text-[12px] flex items-center justify-center gap-1.5 transition-all ${
                      selectedCostCode
                        ? 'bg-[#051C2C] hover:bg-neutral-800 text-white cursor-pointer'
                        : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                    }`}
                  >
                    <Plus className="w-4 h-4" /> Add Item
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Current Composition Sheet */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 bg-[#051C2C] text-white flex justify-between items-center">
                <span className="font-semibold text-[13px] font-mono tracking-wider">COMPOSITION SHEET: {selectedAsmId}</span>
                <span className="font-heading font-semibold text-[15px]">
                  Direct Rollup: <span className="text-[#00C853]">{settings.currency} {liveDirectCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="th-header w-28">Ledger Code</th>
                      <th className="th-header">Description</th>
                      <th className="th-header w-20 text-center font-mono">Category</th>
                      <th className="th-header w-28 text-center">Multiplier</th>
                      <th className="th-header w-16 text-center">Unit</th>
                      <th className="th-header w-24 text-right">Rate</th>
                      <th className="th-header w-28 text-right">Cost Subtotal</th>
                      <th className="th-header w-12 text-center">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {items.length > 0 ? (
                      items.map((it) => {
                        const costItem = costLibrary.find((c) => c.code === it.costCode);
                        const rate = costItem ? costItem.rate : 0;
                        const total = it.qty * rate;

                        return (
                          <tr key={it.costCode} className="hover:bg-neutral-50 transition-colors">
                            <td className="p-3 font-mono font-semibold text-[#051C2C] text-[12px]">
                              {it.costCode}
                            </td>
                            <td className="p-3 text-[12px]">
                              {costItem ? costItem.description : <span className="text-[#D32F2F] font-bold">MISSING CODE</span>}
                            </td>
                            <td className="p-3 text-center text-[11px] font-medium text-neutral-500">
                              {costItem ? costItem.category : '-'}
                            </td>
                            <td className="p-3 text-center">
                              <input
                                type="number"
                                step="0.01"
                                className="input-editable w-20 text-center font-mono font-semibold"
                                value={it.qty}
                                onChange={(e) => handleUpdateQty(it.costCode, parseFloat(e.target.value) || 0)}
                              />
                            </td>
                            <td className="p-3 text-center font-mono text-[12px] text-neutral-500">
                              {costItem ? costItem.unit : '-'}
                            </td>
                            <td className="p-3 text-right font-mono text-[12px]">
                              {settings.currency} {rate.toFixed(2)}
                            </td>
                            <td className="p-3 text-right font-mono font-semibold text-[#051C2C] text-[12px]">
                              {settings.currency} {total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </td>
                            <td className="p-3 text-center">
                              <button
                                onClick={() => handleRemoveItem(it.costCode)}
                                className="text-neutral-400 hover:text-[#D32F2F] p-1 rounded transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={8} className="p-12 text-center text-[#888888]">
                          Composition list is empty. Add ledger codes on the left panel to load materials and hours.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {items.length > 0 && (
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleSaveAssembly}
                  className="bg-[#2251FF] hover:bg-[#1C41CC] text-white py-2 px-6 rounded-lg font-semibold text-[13px] flex items-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" /> Synchronize Template Changes
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
