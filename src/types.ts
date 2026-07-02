/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CostCategory = 'Material' | 'Labour' | 'Equipment' | 'Subcontract' | 'Plant';

export interface CostItem {
  code: string;
  description: string;
  unit: string;
  rate: number;
  category: CostCategory;
}

export interface AssemblyItem {
  costCode: string;
  qty: number; // multiplier per 1 unit of Assembly
}

export interface Assembly {
  id: string;
  description: string;
  unit: string;
  items: AssemblyItem[];
}

export interface TenderItem {
  id: string;
  code: string;
  description: string;
  qty: number;
  unit: string;
  trade: string;
}

export interface TenderMapping {
  tenderItemId: string;
  assemblyId: string; // References Assembly.id
  factor: number; // multiplier for Assembly quantity (defaults to 1.0)
}

export interface SystemSettings {
  overheadRate: number;      // e.g. 5 (%)
  escalationRate: number;    // e.g. 3 (%)
  taxRate: number;           // e.g. 10 (%)
  currency: string;          // e.g. 'USD'
  defaultMarginRate: number; // e.g. 10 (%)
}

export interface RiskScenario {
  optimistic: number;     // e.g. 2 (%)
  expected: number;       // e.g. 5 (%)
  conservative: number;   // e.g. 10 (%)
  selectedRisk: 'optimistic' | 'expected' | 'conservative';
}

export interface HistoryRecord {
  id: string;
  tenderName: string;
  date: string;
  totalCost: number;
  totalSell: number;
  margin: number;
  itemCount: number;
  assemblyReuseCount: number;
}
