/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CostItem, Assembly, TenderItem, TenderMapping, SystemSettings, RiskScenario } from '../types';

export interface CalculatedAssemblyItem {
  costCode: string;
  description: string;
  unit: string;
  category: string;
  rate: number;
  qty: number;
  totalCost: number;
  isMissing: boolean;
}

export interface CalculatedAssembly {
  id: string;
  description: string;
  unit: string;
  items: CalculatedAssemblyItem[];
  unitDirectCost: number;
}

export interface CalculatedTenderItem {
  tenderItem: TenderItem;
  assembly: Assembly | null;
  factor: number;
  unitDirectCost: number;
  totalDirectCost: number;
  escalation: number;
  risk: number;
  overhead: number;
  totalEstimatedCost: number;
  margin: number;
  sellPrice: number;
  clientUnitRate: number;
  tax: number;
  totalPriceWithTax: number;
  categoryBreakdown: {
    Material: number;
    Labour: number;
    Equipment: number;
    Subcontract: number;
    Plant: number;
  };
  hasAnomaly: boolean;
  anomalyMessage?: string;
}

export interface SystemCalculatedSummary {
  totalDirectCost: number;
  totalEscalation: number;
  totalRisk: number;
  totalOverhead: number;
  totalCost: number;
  totalSell: number;
  totalMargin: number;
  avgMarginRate: number;
  totalTax: number;
  totalPriceWithTax: number;
  categoryBreakdown: {
    Material: number;
    Labour: number;
    Equipment: number;
    Subcontract: number;
    Plant: number;
  };
  itemCount: number;
  unmappedCount: number;
  anomalyCount: number;
}

/**
 * Resolves and calculates details for a single Assembly.
 */
export function calculateAssembly(
  assembly: Assembly,
  costLibrary: CostItem[]
): CalculatedAssembly {
  let unitDirectCost = 0;
  const items: CalculatedAssemblyItem[] = assembly.items.map((item) => {
    const costItem = costLibrary.find((c) => c.code === item.costCode);
    const rate = costItem ? costItem.rate : 0;
    const totalCost = item.qty * rate;
    unitDirectCost += totalCost;

    return {
      costCode: item.costCode,
      description: costItem ? costItem.description : 'MISSING FROM COST LIBRARY',
      unit: costItem ? costItem.unit : 'N/A',
      category: costItem ? costItem.category : 'Material',
      rate,
      qty: item.qty,
      totalCost,
      isMissing: !costItem
    };
  });

  return {
    id: assembly.id,
    description: assembly.description,
    unit: assembly.unit,
    items,
    unitDirectCost
  };
}

/**
 * Calculates a single Tender item and all its cost additions.
 */
export function calculateTenderItem(
  item: TenderItem,
  mapping: TenderMapping | undefined,
  assemblies: Assembly[],
  costLibrary: CostItem[],
  settings: SystemSettings,
  riskScenario: RiskScenario
): CalculatedTenderItem {
  const assembly = mapping ? (assemblies.find((a) => a.id === mapping.assemblyId) || null) : null;
  const factor = mapping ? mapping.factor : 1.0;

  let unitDirectCost = 0;
  let hasAnomaly = false;
  let anomalyMessage = '';

  const categoryBreakdown = {
    Material: 0,
    Labour: 0,
    Equipment: 0,
    Subcontract: 0,
    Plant: 0
  };

  if (mapping && !assembly) {
    hasAnomaly = true;
    anomalyMessage = `Mapped Assembly ID "${mapping.assemblyId}" not found in database.`;
  }

  if (assembly) {
    // Check if there is a unit mismatch
    if (assembly.unit.toLowerCase() !== item.unit.toLowerCase()) {
      // It's a mild unit warning, but let's highlight as anomaly
      hasAnomaly = true;
      anomalyMessage = `Unit mismatch: BOQ is "${item.unit}", Assembly is "${assembly.unit}". Factor multiplier applied.`;
    }

    // Sum up items
    assembly.items.forEach((ai) => {
      const costItem = costLibrary.find((c) => c.code === ai.costCode);
      const rate = costItem ? costItem.rate : 0;
      if (!costItem) {
        hasAnomaly = true;
        anomalyMessage = `Assembly "${assembly.id}" references missing cost code "${ai.costCode}".`;
      }
      const itemCost = ai.qty * rate * factor;
      unitDirectCost += itemCost;

      if (costItem) {
        categoryBreakdown[costItem.category] += itemCost * item.qty;
      } else {
        categoryBreakdown['Material'] += itemCost * item.qty; // fallback
      }
    });
  } else if (mapping) {
    // No assembly resolved
    hasAnomaly = true;
    anomalyMessage = `No matched Assembly template is assigned.`;
  } else {
    hasAnomaly = true;
    anomalyMessage = `Unmapped BOQ row. Price calculation is offline.`;
  }

  const totalDirectCost = unitDirectCost * item.qty;
  const escalation = totalDirectCost * (settings.escalationRate / 100);

  // Determine selected risk rate
  const riskRate =
    riskScenario.selectedRisk === 'optimistic'
      ? riskScenario.optimistic
      : riskScenario.selectedRisk === 'conservative'
      ? riskScenario.conservative
      : riskScenario.expected;

  const risk = totalDirectCost * (riskRate / 100);

  // Overhead is computed on (Direct + Escalation + Risk) subtotal
  const baseSubtotal = totalDirectCost + escalation + risk;
  const overhead = baseSubtotal * (settings.overheadRate / 100);

  const totalEstimatedCost = baseSubtotal + overhead;
  const margin = totalEstimatedCost * (settings.defaultMarginRate / 100);
  const sellPrice = totalEstimatedCost + margin;

  const clientUnitRate = item.qty > 0 ? sellPrice / item.qty : 0;
  const tax = sellPrice * (settings.taxRate / 100);
  const totalPriceWithTax = sellPrice + tax;

  return {
    tenderItem: item,
    assembly,
    factor,
    unitDirectCost,
    totalDirectCost,
    escalation,
    risk,
    overhead,
    totalEstimatedCost,
    margin,
    sellPrice,
    clientUnitRate,
    tax,
    totalPriceWithTax,
    categoryBreakdown,
    hasAnomaly,
    anomalyMessage
  };
}

/**
 * Calculates a complete project summary from a list of Tender Items.
 */
export function calculateSystemSummary(
  tenderItems: TenderItem[],
  mappings: TenderMapping[],
  assemblies: Assembly[],
  costLibrary: CostItem[],
  settings: SystemSettings,
  riskScenario: RiskScenario
): SystemCalculatedSummary {
  let totalDirectCost = 0;
  let totalEscalation = 0;
  let totalRisk = 0;
  let totalOverhead = 0;
  let totalCost = 0;
  let totalSell = 0;
  let totalMargin = 0;
  let totalTax = 0;
  let totalPriceWithTax = 0;
  let unmappedCount = 0;
  let anomalyCount = 0;

  const categoryBreakdown = {
    Material: 0,
    Labour: 0,
    Equipment: 0,
    Subcontract: 0,
    Plant: 0
  };

  tenderItems.forEach((item) => {
    const mapping = mappings.find((m) => m.tenderItemId === item.id);
    if (!mapping || !mapping.assemblyId) {
      unmappedCount++;
    }

    const calc = calculateTenderItem(item, mapping, assemblies, costLibrary, settings, riskScenario);

    totalDirectCost += calc.totalDirectCost;
    totalEscalation += calc.escalation;
    totalRisk += calc.risk;
    totalOverhead += calc.overhead;
    totalCost += calc.totalEstimatedCost;
    totalSell += calc.sellPrice;
    totalMargin += calc.margin;
    totalTax += calc.tax;
    totalPriceWithTax += calc.totalPriceWithTax;

    if (calc.hasAnomaly) {
      anomalyCount++;
    }

    // Sum category breakdowns
    categoryBreakdown.Material += calc.categoryBreakdown.Material;
    categoryBreakdown.Labour += calc.categoryBreakdown.Labour;
    categoryBreakdown.Equipment += calc.categoryBreakdown.Equipment;
    categoryBreakdown.Subcontract += calc.categoryBreakdown.Subcontract;
    categoryBreakdown.Plant += calc.categoryBreakdown.Plant;
  });

  const avgMarginRate = totalCost > 0 ? (totalMargin / totalCost) * 100 : 0;

  return {
    totalDirectCost,
    totalEscalation,
    totalRisk,
    totalOverhead,
    totalCost,
    totalSell,
    totalMargin,
    avgMarginRate,
    totalTax,
    totalPriceWithTax,
    categoryBreakdown,
    itemCount: tenderItems.length,
    unmappedCount,
    anomalyCount
  };
}
