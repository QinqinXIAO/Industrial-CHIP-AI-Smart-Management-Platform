
import React, { useState, createContext, useContext } from 'react';
import { 
  LayoutDashboard, 
  Atom, 
  Droplets, 
  ClipboardCheck, 
  Warehouse, 
  Settings,
  Bell,
  Search,
  User,
  Languages
} from 'lucide-react';
import Dashboard from './pages/Dashboard';
import ALDSystem from './pages/ALDSystem';
import WetProcess from './pages/WetProcess';
import TicketSystem from './pages/TicketSystem';
import WarehouseSystem from './pages/WarehouseSystem';
import { ModuleType } from './types';
import { Language, translations } from './i18n';

interface LanguageContextType {
  lang: Language;
  t: any;
  setLang: (l: Language) => void;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useTranslation must be used within LanguageProvider');
  return context;
};

const App: React.FC = () => {
  const [activeModule, setActiveModule] = useState<ModuleType>(ModuleType.DASHBOARD);
  const [lang, setLang] = useState<Language>('zh');

  const t = translations[lang];

  const renderModule = () => {
    switch (activeModule) {
      case ModuleType.DASHBOARD: return <Dashboard />;
      case ModuleType.ALD_REC: return <ALDSystem />;
      case ModuleType.WET_PROCESS: return <WetProcess />;
      case ModuleType.TICKET_SYSTEM: return <TicketSystem />;
      case ModuleType.WAREHOUSE: return <WarehouseSystem />;
      default: return <Dashboard />;
    }
  };

  const navItems = [
    { id: ModuleType.DASHBOARD, label: t.nav.dashboard, icon: LayoutDashboard },
    { id: ModuleType.ALD_REC, label: t.nav.ald, icon: Atom },
    { id: ModuleType.WET_PROCESS, label: t.nav.wet, icon: Droplets },
    { id: ModuleType.TICKET_SYSTEM, label: t.nav.ticket, icon: ClipboardCheck },
    { id: ModuleType.WAREHOUSE, label: t.nav.warehouse, icon: Warehouse },
  ];

  return (
    <LanguageContext.Provider value={{ lang, t, setLang }}>
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-900 text-white flex flex-col">
          <div className="p-6 flex items-center space-x-3">
            <div className="bg-blue-500 p-2 rounded-lg">
              <Atom className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">Industrial AI</span>
          </div>
          
          <nav className="flex-1 mt-6 px-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveModule(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeModule === item.id 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-800">
            <button className="flex items-center space-x-3 text-slate-400 hover:text-white transition-colors w-full px-4 py-2">
              <Settings className="w-5 h-5" />
              <span>{t.nav.settings}</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-10">
            <div className="flex items-center space-x-4">
              <h1 className="text-lg font-semibold text-gray-800">
                {navItems.find(i => i.id === activeModule)?.label}
              </h1>
              <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-1.5 ml-4">
                <Search className="w-4 h-4 text-gray-400 mr-2" />
                <input 
                  type="text" 
                  placeholder={t.header.search}
                  className="bg-transparent border-none focus:ring-0 text-sm w-64"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Language Toggle */}
              <button 
                onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
                className="flex items-center space-x-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Languages className="w-4 h-4 text-blue-500" />
                <span>{lang === 'zh' ? 'English' : '中文'}</span>
              </button>

              <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <div className="h-8 w-px bg-gray-200 mx-2"></div>
              <div className="flex items-center space-x-3 cursor-pointer group">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{t.header.admin}</p>
                  <p className="text-xs text-gray-500">{t.header.role}</p>
                </div>
                <div className="bg-gray-200 rounded-full p-2 group-hover:bg-gray-300 transition-colors">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-8">
            {renderModule()}
          </div>
        </main>
      </div>
    </LanguageContext.Provider>
  );
};

export default App;
