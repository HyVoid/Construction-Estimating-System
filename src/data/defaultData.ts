/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CostItem, Assembly, TenderItem, TenderMapping, SystemSettings, RiskScenario, HistoryRecord } from '../types';

export const DEFAULT_SETTINGS: SystemSettings = {
  overheadRate: 5.5,
  escalationRate: 3.0,
  taxRate: 10.0,
  currency: 'USD',
  defaultMarginRate: 12.0
};

export const DEFAULT_RISK: RiskScenario = {
  optimistic: 2.0,
  expected: 5.0,
  conservative: 12.5,
  selectedRisk: 'expected'
};

export const DEFAULT_COST_LIBRARY: CostItem[] = [
  // Material Category
  { code: 'MAT-CONC-32', description: 'Concrete Ready Mix 32MPa', unit: 'm3', rate: 165.00, category: 'Material' },
  { code: 'MAT-CONC-40', description: 'Concrete Ready Mix 40MPa', unit: 'm3', rate: 185.00, category: 'Material' },
  { code: 'MAT-STEEL-N12', description: 'N12 Reinforcement Rebar (Tonne)', unit: 't', rate: 1450.00, category: 'Material' },
  { code: 'MAT-STEEL-MESH', description: 'SL82 Reinforcing Mesh (Sheet)', unit: 'sheet', rate: 58.00, category: 'Material' },
  { code: 'MAT-FORM-PLY', description: '17mm Formwork Structural Plywood', unit: 'm2', rate: 24.50, category: 'Material' },
  { code: 'MAT-GRAVEL-20', description: '20mm Recycled Gravel Base', unit: 't', rate: 42.00, category: 'Material' },
  { code: 'MAT-SAND-FILL', description: 'Unscreened Fill Sand', unit: 't', rate: 28.50, category: 'Material' },

  // Labour Category
  { code: 'LAB-CIV-SKILL', description: 'Skilled Concrete Placer/Finisher', unit: 'hr', rate: 55.00, category: 'Labour' },
  { code: 'LAB-STEEL-FIX', description: 'Steel Fixer / Reinforcement Specialist', unit: 'hr', rate: 58.00, category: 'Labour' },
  { code: 'LAB-CARP-FORM', description: 'Formwork Carpenter', unit: 'hr', rate: 62.00, category: 'Labour' },
  { code: 'LAB-OP-HVY', description: 'Heavy Plant Operator (Excavator)', unit: 'hr', rate: 68.00, category: 'Labour' },
  { code: 'LAB-CIV-GNRL', description: 'General Construction Labourer', unit: 'hr', rate: 45.00, category: 'Labour' },

  // Equipment Category
  { code: 'EQ-PUMP-CONC', description: '42m Boom Concrete Pump Truck Hire', unit: 'hr', rate: 220.00, category: 'Equipment' },
  { code: 'EQ-EXCV-20T', description: '20 Tonne Tracked Excavator Hire', unit: 'hr', rate: 185.00, category: 'Equipment' },
  { code: 'EQ-BOBCAT-S70', description: 'Bobcat Skid Steer Loader Hire', unit: 'hr', rate: 95.00, category: 'Equipment' },
  { code: 'EQ-VIB-ROLLER', description: 'Ride-On Vibrating Soil Compactor', unit: 'hr', rate: 120.00, category: 'Equipment' },

  // Subcontract Category
  { code: 'SUB-CONC-PLACE', description: 'Subcontract Concrete Placement & Finish', unit: 'm2', rate: 35.00, category: 'Subcontract' },
  { code: 'SUB-SOIL-TEST', description: 'Geotechnical Soil Testing / Compaction Report', unit: 'ea', rate: 850.00, category: 'Subcontract' },
  { code: 'SUB-SURVEY-SET', description: 'Engineering Site Surveyor Setup', unit: 'day', rate: 1500.00, category: 'Subcontract' },

  // Plant Category
  { code: 'PL-SHED-MNT', description: 'Site Office & Crib Shed Monthly Rental', unit: 'mth', rate: 2400.00, category: 'Plant' },
  { code: 'PL-GEN-80KVA', description: '80kVA Diesel Generator Rental', unit: 'wk', rate: 650.00, category: 'Plant' },
  { code: 'PL-TOILET-PORT', description: 'Portable Site Toilet & Servicing', unit: 'wk', rate: 110.00, category: 'Plant' }
];

export const DEFAULT_ASSEMBLIES: Assembly[] = [
  {
    id: 'ASM-SLAB-OG',
    description: 'Slab-on-Ground Construction (per m3)',
    unit: 'm3',
    items: [
      { costCode: 'MAT-CONC-32', qty: 1.05 },       // 5% wastage
      { costCode: 'MAT-STEEL-MESH', qty: 1.8 },      // Mesh overlap multiplier
      { costCode: 'MAT-FORM-PLY', qty: 0.6 },        // Timber perimeter forms
      { costCode: 'LAB-CIV-SKILL', qty: 3.5 },       // 3.5 hrs Skilled Labour
      { costCode: 'LAB-CIV-GNRL', qty: 2.0 },        // 2 hrs General Labour
      { costCode: 'EQ-PUMP-CONC', qty: 0.25 }        // Pump fraction per m3
    ]
  },
  {
    id: 'ASM-FOOT-STRIP',
    description: 'Reinforced Concrete Strip Footings (per m3)',
    unit: 'm3',
    items: [
      { costCode: 'MAT-CONC-32', qty: 1.03 },
      { costCode: 'MAT-STEEL-N12', qty: 0.08 },      // Tons of reinforcement steel
      { costCode: 'MAT-FORM-PLY', qty: 1.2 },        // Formwork both sides
      { costCode: 'LAB-CARP-FORM', qty: 4.0 },       // Formwork carpenter hours
      { costCode: 'LAB-STEEL-FIX', qty: 3.0 },       // Steel fixer hours
      { costCode: 'LAB-CIV-SKILL', qty: 2.5 }        // Placer hours
    ]
  },
  {
    id: 'ASM-EXCV-SITE',
    description: 'Bulk Site Excavation & Base Prep (per m3)',
    unit: 'm3',
    items: [
      { costCode: 'EQ-EXCV-20T', qty: 0.08 },       // excavator productivity per m3
      { costCode: 'LAB-OP-HVY', qty: 0.08 },         // heavy operator matching machine
      { costCode: 'MAT-GRAVEL-20', qty: 0.15 },      // gravel base replacement layer
      { costCode: 'EQ-VIB-ROLLER', qty: 0.04 },      // compaction fraction
      { costCode: 'LAB-CIV-GNRL', qty: 0.1 }         // spotter / general labor
    ]
  },
  {
    id: 'ASM-WALL-RETAIN',
    description: 'Structural Concrete Retaining Wall (per m2)',
    unit: 'm2',
    items: [
      { costCode: 'MAT-CONC-40', qty: 0.25 },        // 250mm thick wall
      { costCode: 'MAT-FORM-PLY', qty: 2.1 },        // Forms both sides + wastage
      { costCode: 'MAT-STEEL-N12', qty: 0.015 },     // Rebar per m2
      { costCode: 'LAB-CARP-FORM', qty: 3.2 },       // Carpenter form erection
      { costCode: 'LAB-STEEL-FIX', qty: 1.5 },       // Steel fixer
      { costCode: 'LAB-CIV-SKILL', qty: 1.8 }        // Concrete placement
    ]
  }
];

export const DEFAULT_TENDER_ITEMS: TenderItem[] = [
  {
    id: 'TND-001',
    code: 'BOQ-01.01',
    description: 'Ground Floor Slab Construction - Class 32MPa concrete with structural mesh reinforcing and perimeter timber forms',
    qty: 350,
    unit: 'm3',
    trade: 'Concrete Slab'
  },
  {
    id: 'TND-002',
    code: 'BOQ-01.02',
    description: 'Reinforced Concrete Foundation Strip Footings - High strength structural foundation beams for loadbearing brickwork',
    qty: 120,
    unit: 'm3',
    trade: 'Footings & Foundations'
  },
  {
    id: 'TND-003',
    code: 'BOQ-02.01',
    description: 'Bulk Ground Site Excavation, profiling, grading, compacting and placing 150mm gravel subgrade base course',
    qty: 850,
    unit: 'm3',
    trade: 'Earthworks & Grading'
  },
  {
    id: 'TND-004',
    code: 'BOQ-03.01',
    description: 'Structural Reinforced Boundary Retaining Wall - 250mm thickness, architectural formwork finish, engineered steel bars',
    qty: 280,
    unit: 'm2',
    trade: 'Retaining Walls'
  }
];

export const DEFAULT_TENDER_MAPPINGS: TenderMapping[] = [
  { tenderItemId: 'TND-001', assemblyId: 'ASM-SLAB-OG', factor: 1.0 },
  { tenderItemId: 'TND-002', assemblyId: 'ASM-FOOT-STRIP', factor: 1.0 },
  { tenderItemId: 'TND-003', assemblyId: 'ASM-EXCV-SITE', factor: 1.0 },
  { tenderItemId: 'TND-004', assemblyId: 'ASM-WALL-RETAIN', factor: 1.0 }
];

export const DEFAULT_HISTORY: HistoryRecord[] = [
  {
    id: 'HIST-001',
    tenderName: 'Greenwood Commercial Office Tower Foundation',
    date: '2026-03-12',
    totalCost: 185000,
    totalSell: 224000,
    margin: 11.2,
    itemCount: 3,
    assemblyReuseCount: 3
  },
  {
    id: 'HIST-002',
    tenderName: 'Oakwood Estate Ground Retaining Wall Systems',
    date: '2026-05-20',
    totalCost: 95400,
    totalSell: 115000,
    margin: 12.5,
    itemCount: 2,
    assemblyReuseCount: 2
  },
  {
    id: 'HIST-003',
    tenderName: 'Metro Transit Depot Earthworks & Concrete Pavements',
    date: '2026-06-15',
    totalCost: 450000,
    totalSell: 545000,
    margin: 10.0,
    itemCount: 5,
    assemblyReuseCount: 4
  }
];
