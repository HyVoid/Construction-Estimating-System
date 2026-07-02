/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  SystemSettings, 
  RiskScenario, 
  CostItem, 
  Assembly, 
  TenderItem, 
  TenderMapping, 
  HistoryRecord 
} from './types';
import { 
  DEFAULT_SETTINGS, 
  DEFAULT_RISK, 
  DEFAULT_COST_LIBRARY, 
  DEFAULT_ASSEMBLIES, 
  DEFAULT_TENDER_ITEMS, 
  DEFAULT_TENDER_MAPPINGS, 
  DEFAULT_HISTORY 
} from './data/defaultData';
import { calculateSystemSummary } from './utils/calcEngine';
import { ExecutiveDashboard } from './components/ExecutiveDashboard';
import { LibraryManagement } from './components/LibraryManagement';
import { TenderFlow } from './components/TenderFlow';
import { AssemblyBuilderView } from './components/AssemblyBuilderView';
import { EstimatingCore } from './components/EstimatingCore';
import { DataIntegrations } from './components/DataIntegrations';
import { 
  FolderSync, 
  Download, 
  Upload, 
  RotateCcw, 
  TrendingUp, 
  Database, 
  Layers, 
  UploadCloud, 
  ArrowRightLeft, 
  Hammer, 
  Calculator, 
  ShieldAlert, 
  FileText, 
  Share2, 
  History, 
  LayoutDashboard,
  Settings as SettingsIcon,
  HelpCircle,
  ChevronDown,
  Check
} from 'lucide-react';

const LOCAL_STORAGE_KEY = 'construction_estimate_factory_state';

interface BackupState {
  settings: SystemSettings;
  risk: RiskScenario;
  costLibrary: CostItem[];
  assemblies: Assembly[];
  tenderItems: TenderItem[];
  mappings: TenderMapping[];
  historyRecords: HistoryRecord[];
}

export default function App() {
  // Global States
  const [settings, setSettings] = useState<SystemSettings>(DEFAULT_SETTINGS);
  const [risk, setRisk] = useState<RiskScenario>(DEFAULT_RISK);
  const [costLibrary, setCostLibrary] = useState<CostItem[]>(DEFAULT_COST_LIBRARY);
  const [assemblies, setAssemblies] = useState<Assembly[]>(DEFAULT_ASSEMBLIES);
  const [tenderItems, setTenderItems] = useState<TenderItem[]>(DEFAULT_TENDER_ITEMS);
  const [mappings, setMappings] = useState<TenderMapping[]>(DEFAULT_TENDER_MAPPINGS);
  const [historyRecords, setHistoryRecords] = useState<HistoryRecord[]>(DEFAULT_HISTORY);

  // UI States
  const [activeTab, setActiveTab] = useState<string>('12_Dashboard');
  const [lastSaved, setLastSaved] = useState<string>('Never');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // File import ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load state from localStorage on startup
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as BackupState;
        if (parsed.settings) setSettings(parsed.settings);
        if (parsed.risk) setRisk(parsed.risk);
        if (parsed.costLibrary) setCostLibrary(parsed.costLibrary);
        if (parsed.assemblies) setAssemblies(parsed.assemblies);
        if (parsed.tenderItems) setTenderItems(parsed.tenderItems);
        if (parsed.mappings) setMappings(parsed.mappings);
        if (parsed.historyRecords) setHistoryRecords(parsed.historyRecords);
        
        // Load stored save time
        const storedTime = localStorage.getItem(`${LOCAL_STORAGE_KEY}_saved_at`);
        if (storedTime) {
          setLastSaved(storedTime);
        }
      } else {
        // First load defaults and record save time
        saveToLocalStorage(
          DEFAULT_SETTINGS,
          DEFAULT_RISK,
          DEFAULT_COST_LIBRARY,
          DEFAULT_ASSEMBLIES,
          DEFAULT_TENDER_ITEMS,
          DEFAULT_TENDER_MAPPINGS,
          DEFAULT_HISTORY
        );
      }
    } catch (e) {
      console.error('Failed to parse state from localStorage, loading defaults.', e);
    }
  }, []);

  // Helper to trigger save
  const saveToLocalStorage = (
    s: SystemSettings,
    r: RiskScenario,
    c: CostItem[],
    a: Assembly[],
    t: TenderItem[],
    m: TenderMapping[],
    h: HistoryRecord[]
  ) => {
    const backup: BackupState = {
      settings: s,
      risk: r,
      costLibrary: c,
      assemblies: a,
      tenderItems: t,
      mappings: m,
      historyRecords: h
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(backup));
    const nowStr = new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_saved_at`, nowStr);
    setLastSaved(nowStr);
  };

  // Continuous Auto-Save cascading updates
  useEffect(() => {
    saveToLocalStorage(settings, risk, costLibrary, assemblies, tenderItems, mappings, historyRecords);
  }, [settings, risk, costLibrary, assemblies, tenderItems, mappings, historyRecords]);

  // Math summary calculation
  const summary = calculateSystemSummary(tenderItems, mappings, assemblies, costLibrary, settings, risk);

  // Export state to JSON
  const handleExportBackup = () => {
    const backup: BackupState = {
      settings,
      risk,
      costLibrary,
      assemblies,
      tenderItems,
      mappings,
      historyRecords
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `estimating_workbench_backup_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Trigger hidden file picker for Import
  const triggerImportBackup = () => {
    fileInputRef.current?.click();
  };

  // Handle uploaded JSON file
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string) as BackupState;
        
        if (
          parsed.settings && 
          parsed.costLibrary && 
          parsed.assemblies && 
          parsed.tenderItems && 
          parsed.mappings
        ) {
          setSettings(parsed.settings);
          setRisk(parsed.risk || DEFAULT_RISK);
          setCostLibrary(parsed.costLibrary);
          setAssemblies(parsed.assemblies);
          setTenderItems(parsed.tenderItems);
          setMappings(parsed.mappings);
          setHistoryRecords(parsed.historyRecords || []);
          alert('Backup database imported successfully! Active states are updated.');
        } else {
          alert('Invalid backup schema. Required cost library and assembly definitions are missing.');
        }
      } catch (err) {
        alert('Failed to parse uploaded backup JSON. Please check file integrity.');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // clear input
  };

  // Restore factory out-of-the-box defaults
  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all data and cost libraries back to factory out-of-the-box defaults? This cannot be undone.')) {
      setSettings(DEFAULT_SETTINGS);
      setRisk(DEFAULT_RISK);
      setCostLibrary(DEFAULT_COST_LIBRARY);
      setAssemblies(DEFAULT_ASSEMBLIES);
      setTenderItems(DEFAULT_TENDER_ITEMS);
      setMappings(DEFAULT_TENDER_MAPPINGS);
      setHistoryRecords(DEFAULT_HISTORY);
      alert('Estimating factory is successfully restored to default settings.');
    }
  };

  // Define full tab names mapped to icons
  const TABS = [
    { id: '12_Dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: '01_Settings', label: 'Settings', icon: SettingsIcon },
    { id: '02_Cost_Library', label: 'Cost Library', icon: Database },
    { id: '03_Assembly_Library', label: 'Assembly Library', icon: Layers },
    { id: '04_Tender_Import', label: 'Tender Import', icon: UploadCloud },
    { id: '05_Tender_Mapping', label: 'Tender Mapping', icon: ArrowRightLeft },
    { id: '06_Assembly_Builder', label: 'Assembly Builder', icon: Hammer },
    { id: '07_Estimate_Engine', label: 'Estimate Engine', icon: Calculator },
    { id: '08_Risk_Margin', label: 'Risk & Margin', icon: ShieldAlert },
    { id: '09_Tender_Output', label: 'Tender Output', icon: FileText },
    { id: '10_Procore_Export', label: 'Procore Export', icon: Share2 },
    { id: '11_History_Repository', label: 'History Repository', icon: History }
  ];

  const NAV_GROUPS = [
    {
      id: 'overview',
      label: 'Overview & Settings',
      icon: LayoutDashboard,
      tabIds: ['12_Dashboard', '01_Settings']
    },
    {
      id: 'libraries',
      label: 'Master Libraries',
      icon: Database,
      tabIds: ['02_Cost_Library', '03_Assembly_Library', '06_Assembly_Builder']
    },
    {
      id: 'estimation',
      label: 'Estimating Core',
      icon: Calculator,
      tabIds: ['04_Tender_Import', '05_Tender_Mapping', '07_Estimate_Engine', '08_Risk_Margin']
    },
    {
      id: 'deliverables',
      label: 'Exports & History',
      icon: FileText,
      tabIds: ['09_Tender_Output', '10_Procore_Export', '11_History_Repository']
    }
  ];

  const activeGroup = NAV_GROUPS.find(g => g.tabIds.includes(activeTab)) || NAV_GROUPS[0];

  return (
    <div className="min-h-screen bg-[#F5F5F2] flex flex-col font-body pb-12">
      {/* Hidden file input for import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImportBackup}
        accept=".json"
        className="hidden"
      />

      {/* STICKY TOP NAVIGATION BAR (56px) */}
      <nav id="top-nav-bar" className="sticky top-0 z-50 h-[56px] bg-white border-b border-neutral-200 flex items-center justify-between px-6 shadow-sm">
        {/* Left Brand Brand Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#051C2C] flex items-center justify-center text-white font-heading font-bold text-[18px]">
            E
          </div>
          <div className="leading-tight">
            <span className="font-heading font-bold text-[16px] text-[#051C2C] tracking-tight block">ESTIMATING</span>
            <span className="text-[10px] text-neutral-400 font-semibold tracking-wider uppercase block">Assembly Factory</span>
          </div>
        </div>

        {/* Right Category Groups selectors */}
        <div className="hidden md:flex items-center gap-3 h-full">
          {NAV_GROUPS.map((group) => {
            const Icon = group.icon;
            const isGroupActive = group.tabIds.includes(activeTab);
            return (
              <button
                key={group.id}
                onClick={() => setActiveTab(group.tabIds[0])}
                className={`flex items-center gap-2 px-2.5 h-full border-b-[3px] uppercase tracking-[0.06em] text-[11px] font-bold transition-all duration-200 cursor-pointer ${
                  isGroupActive 
                    ? 'border-[#2251FF] text-[#051C2C]' 
                    : 'border-transparent text-neutral-400 hover:text-[#051C2C]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isGroupActive ? 'text-[#2251FF]' : 'text-neutral-400'}`} />
                <span>{group.label}</span>
              </button>
            );
          })}
        </div>

        {/* Small screen indicator / Mobile Dropdown */}
        <div className="md:hidden relative">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-neutral-50 hover:bg-neutral-100 text-[12px] font-semibold text-[#051C2C] rounded-lg border border-neutral-200/60 transition-all cursor-pointer shadow-xs active:scale-95"
          >
            {(() => {
              const currentTab = TABS.find((t) => t.id === activeTab);
              if (currentTab) {
                const CurrentIcon = currentTab.icon;
                return (
                  <>
                    <CurrentIcon className="w-3.5 h-3.5 text-[#2251FF]" />
                    <span className="font-semibold">{currentTab.label}</span>
                  </>
                );
              }
              return <span>Navigate Worksheets</span>;
            })()}
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
          </button>

          {mobileMenuOpen && (
            <>
              {/* Overlay back to close on outside click */}
              <div 
                className="fixed inset-0 z-50" 
                onClick={() => setMobileMenuOpen(false)} 
              />
              <div className="absolute right-0 mt-2 w-64 bg-white border border-neutral-200/80 rounded-xl shadow-lg py-2.5 z-50 animate-fadeup max-h-[380px] overflow-y-auto">
                <div className="px-3.5 py-1 text-[10px] uppercase font-bold tracking-wider text-neutral-400 border-b border-neutral-100 pb-2 mb-2">
                  Select Worksheet
                </div>
                {NAV_GROUPS.map((group) => {
                  const GroupIcon = group.icon;
                  return (
                    <div key={group.id} className="space-y-0.5 mb-3 last:mb-0">
                      <div className="px-3.5 py-1 text-[9px] uppercase font-bold tracking-wider text-neutral-400 flex items-center gap-1.5">
                        <GroupIcon className="w-3 h-3 text-neutral-400" />
                        <span>{group.label}</span>
                      </div>
                      {group.tabIds.map((tabId) => {
                        const tab = TABS.find((t) => t.id === tabId);
                        if (!tab) return null;
                        const Icon = tab.icon;
                        const isActive = activeTab === tabId;
                        return (
                          <button
                            key={tabId}
                            onClick={() => {
                              setActiveTab(tabId);
                              setMobileMenuOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-4 py-1.5 text-left text-[11px] font-medium transition-colors cursor-pointer ${
                              isActive
                                ? 'bg-neutral-50 text-[#2251FF] font-semibold'
                                : 'text-neutral-600 hover:bg-neutral-50 hover:text-[#051C2C]'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#2251FF]' : 'text-neutral-400'}`} />
                              <span>{tab.label}</span>
                            </div>
                            {isActive && <Check className="w-3.5 h-3.5 text-[#2251FF]" />}
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </nav>

      {/* SECONDARY STICKY SUB-NAVBAR FOR WORKSHEETS */}
      <div className="sticky top-[56px] z-40 bg-white border-b border-neutral-200/60 px-10 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
          <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mr-1">Worksheets:</span>
          
          {/* Segmented Tab Group Container */}
          <div className="bg-neutral-100/80 p-1 rounded-xl flex items-center gap-1 border border-neutral-200/50">
            {activeGroup.tabIds.map((tabId) => {
              const tab = TABS.find((t) => t.id === tabId);
              if (!tab) return null;
              const Icon = tab.icon;
              const isSubActive = activeTab === tabId;
              return (
                <button
                  key={tabId}
                  onClick={() => setActiveTab(tabId)}
                  className={`relative flex items-center gap-2 px-3.5 py-1.5 text-[12px] font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                    isSubActive
                      ? 'bg-white text-[#2251FF] shadow-xs font-bold'
                      : 'text-neutral-500 hover:text-[#051C2C] hover:bg-white/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSubActive ? 'text-[#2251FF]' : 'text-neutral-400'}`} />
                  <span>{tab.label}</span>
                  {isSubActive && (
                    <span className="absolute bottom-0.5 left-3.5 right-3.5 h-[2px] bg-[#2251FF] rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-2 text-[11px] text-neutral-400 font-semibold uppercase tracking-wider">
          <span className="font-bold text-[#051C2C]">{activeGroup.label}</span>
          <span className="text-neutral-300">/</span>
          <span>{TABS.find(t => t.id === activeTab)?.label}</span>
        </div>
      </div>

      {/* MAIN LAYOUT WRAPPER (1400px centered, 40px padding) */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-10 py-8 space-y-6">
        
        {/* UPPER UTILITY SUB-BAR (Actions & Auto-Save Indicators) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm">
          {/* Path / Current Tab Title with EB Garamond display */}
          <div>
            <h1 className="font-heading font-semibold text-[26px] text-[#051C2C] tracking-tight">
              {TABS.find((t) => t.id === activeTab)?.label} Worksheet
            </h1>
            <p className="text-[12px] text-neutral-400">
              Construction Tender Estimating Factory / Sheet_{activeTab}
            </p>
          </div>

          {/* Backup operations & indicators */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="text-[12px] text-neutral-500 mr-2 flex items-center gap-1.5 bg-neutral-50 px-3 py-1.5 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-[#00C853] animate-pulse" />
              <span>Last saved: <span className="font-mono font-bold text-[#051C2C]">{lastSaved}</span></span>
            </div>

            <button
              onClick={handleExportBackup}
              className="px-3 py-1.5 border border-neutral-200 hover:bg-neutral-50 text-[12px] font-semibold text-[#051C2C] rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
              title="Download entire workbook backup as JSON"
            >
              <Download className="w-3.5 h-3.5 text-[#2251FF]" />
              <span>Export Backup</span>
            </button>

            <button
              onClick={triggerImportBackup}
              className="px-3 py-1.5 border border-neutral-200 hover:bg-neutral-50 text-[12px] font-semibold text-[#051C2C] rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
              title="Upload previous estimating backup JSON"
            >
              <Upload className="w-3.5 h-3.5 text-[#2251FF]" />
              <span>Import Backup</span>
            </button>

            <button
              onClick={handleResetData}
              className="px-3 py-1.5 border border-red-100 hover:bg-red-50 text-[12px] font-semibold text-[#D32F2F] rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
              title="Reset libraries and settings to standard template"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#D32F2F]" />
              <span>Reset Data</span>
            </button>
          </div>
        </div>

        {/* WORKSPACE SHEET RENDER */}
        <div id="active-sheet-content" className="min-h-[500px]">
          {/* Render Dashboard & Settings */}
          {(activeTab === '12_Dashboard' || activeTab === '01_Settings') && (
            <ExecutiveDashboard
              settings={settings}
              onChangeSettings={setSettings}
              risk={risk}
              onChangeRisk={setRisk}
              summary={summary}
              historyRecords={historyRecords}
              activeTab={activeTab}
            />
          )}

          {/* Render Cost & Assembly Libraries */}
          {(activeTab === '02_Cost_Library' || activeTab === '03_Assembly_Library') && (
            <LibraryManagement
              costLibrary={costLibrary}
              onChangeCostLibrary={setCostLibrary}
              assemblies={assemblies}
              onChangeAssemblies={setAssemblies}
              settings={settings}
              activeTab={activeTab}
            />
          )}

          {/* Render Tender Import & Mapping */}
          {(activeTab === '04_Tender_Import' || activeTab === '05_Tender_Mapping') && (
            <TenderFlow
              tenderItems={tenderItems}
              onChangeTenderItems={setTenderItems}
              mappings={mappings}
              onChangeMappings={setMappings}
              assemblies={assemblies}
              settings={settings}
              activeTab={activeTab}
            />
          )}

          {/* Render Assembly Builder factory */}
          {activeTab === '06_Assembly_Builder' && (
            <AssemblyBuilderView
              assemblies={assemblies}
              onChangeAssemblies={setAssemblies}
              costLibrary={costLibrary}
              settings={settings}
            />
          )}

          {/* Render Estimating cores */}
          {(activeTab === '07_Estimate_Engine' || activeTab === '08_Risk_Margin' || activeTab === '09_Tender_Output') && (
            <EstimatingCore
              tenderItems={tenderItems}
              mappings={mappings}
              assemblies={assemblies}
              costLibrary={costLibrary}
              settings={settings}
              onChangeSettings={setSettings}
              risk={risk}
              onChangeRisk={setRisk}
              summary={summary}
              activeTab={activeTab}
            />
          )}

          {/* Render Procore & History archives */}
          {(activeTab === '10_Procore_Export' || activeTab === '11_History_Repository') && (
            <DataIntegrations
              tenderItems={tenderItems}
              mappings={mappings}
              assemblies={assemblies}
              costLibrary={costLibrary}
              settings={settings}
              risk={risk}
              summary={summary}
              historyRecords={historyRecords}
              onSaveToHistory={(rec) => setHistoryRecords([...historyRecords, rec])}
              onDeleteHistory={(id) => setHistoryRecords(historyRecords.filter((r) => r.id !== id))}
              activeTab={activeTab}
            />
          )}
        </div>
      </main>

      {/* STATUS BAR FOOTER */}
      <footer className="bg-white border-t border-neutral-200/60 py-3.5 px-10 text-neutral-400 text-[11px] mt-12">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            Workspace: <span className="font-semibold text-[#051C2C]">greenwood_phase_2.est</span>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <span>Local Database: <span className="text-[#00C853] font-bold">Secure Local Cache</span></span>
            <span>Real-time Sync: <span className="text-[#2251FF] font-bold">Enabled ({lastSaved})</span></span>
            <span>&copy; 2026 Estimating Assembly Factory</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
