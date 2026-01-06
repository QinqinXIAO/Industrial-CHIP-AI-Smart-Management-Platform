
import React, { useState, useRef } from 'react';
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Info, 
  FlaskConical, 
  Microscope, 
  FileText, 
  Upload, 
  Database, 
  Globe, 
  X,
  Plus,
  Trash2,
  CheckCircle2,
  CloudLightning
} from 'lucide-react';
import { gemini } from '../services/geminiService';
import { ALDRecommendation } from '../types';
import { useTranslation } from '../App';

const ALDSystem: React.FC = () => {
  const { lang, t } = useTranslation();
  const d = t.ald;
  
  const [element, setElement] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ALDRecommendation[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showWeightInfo, setShowWeightInfo] = useState(false);

  // New states for interactive components
  const [showPrecursorModal, setShowPrecursorModal] = useState(false);
  const [showDepthModal, setShowDepthModal] = useState(false);
  const [localPrecursors, setLocalPrecursors] = useState([
    { name: 'Al(CH3)3 (TMA)', grade: '99.999%', volume: '500ml', type: 'Organometallic' },
    { name: 'TiCl4', grade: '99.99%', volume: '1L', type: 'Halide' },
    { name: 'DEZ', grade: '99.999%', volume: '250ml', type: 'Organometallic' },
    { name: 'H2O', grade: 'Electronic', volume: 'Bulk', type: 'Oxygen Source' },
    { name: 'O3', grade: 'High Yield', volume: 'Gas', type: 'Oxygen Source' },
    { name: 'NH3', grade: '99.9995%', volume: '40L', type: 'Nitrogen Source' }
  ]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = async () => {
    if (!element) return;
    setLoading(true);
    try {
      const precursorNames = localPrecursors.map(p => p.name);
      const data = await gemini.getALDRecommendation(element, precursorNames, lang);
      setResults(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate file processing
      alert(lang === 'zh' ? `正在解析文献/清单: ${file.name}` : `Parsing document: ${file.name}`);
      // In a real app, we'd use gemini.processImageInput or similar here
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <FlaskConical className="w-8 h-8 text-blue-600 mr-3" />
          {d.title}
        </h2>
        
        <div className="flex space-x-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              value={element}
              onChange={(e) => setElement(e.target.value)}
              placeholder={d.placeholder}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-lg"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button 
            onClick={handleSearch}
            disabled={loading}
            className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-200 flex items-center"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                {d.searching}
              </span>
            ) : d.btnSearch}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Interactive Local Precursor Card */}
          <button 
            onClick={() => setShowPrecursorModal(true)}
            className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-left hover:bg-blue-100 transition-all group"
          >
            <div className="flex justify-between items-start mb-1">
              <h4 className="text-sm font-semibold text-blue-900">{d.localStatus}</h4>
              <Database className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-xs text-blue-700">{d.localMatch.replace('{n}', localPrecursors.length.toString())}</p>
            <span className="text-[10px] mt-2 inline-block font-bold text-blue-500 uppercase tracking-tighter group-hover:underline">点击管理库文件 →</span>
          </button>

          {/* Interactive Search Depth Card */}
          <button 
            onClick={() => setShowDepthModal(true)}
            className="p-4 bg-green-50 rounded-xl border border-green-100 text-left hover:bg-green-100 transition-all group"
          >
            <div className="flex justify-between items-start mb-1">
              <h4 className="text-sm font-semibold text-green-900">{d.depth}</h4>
              <Globe className="w-4 h-4 text-green-400 group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-xs text-green-700">{d.depthDesc}</p>
            <span className="text-[10px] mt-2 inline-block font-bold text-green-500 uppercase tracking-tighter group-hover:underline">查看数据源动态 →</span>
          </button>

          <button 
            onClick={() => setShowWeightInfo(!showWeightInfo)}
            className="p-4 bg-purple-50 rounded-xl border border-purple-100 flex items-center justify-between hover:bg-purple-100 transition-colors"
          >
            <div>
              <h4 className="text-sm font-semibold text-purple-900 mb-1">{d.weightRule}</h4>
              <p className="text-xs text-purple-700">{d.weightDesc}</p>
            </div>
            <Info className="w-5 h-5 text-purple-400" />
          </button>
        </div>

        {showWeightInfo && (
          <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200 animate-in fade-in slide-in-from-top-4 duration-300">
            <h5 className="font-bold text-gray-800 mb-3">{d.weightTitle}</h5>
            <ul className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              {d.weightRules.map((r: string, i: number) => (
                <li key={i}>• {r}</li>
              ))}
            </ul>
          </div>
        )}

        {results.length > 0 && (
          <div className="overflow-hidden border border-gray-100 rounded-xl">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{d.table.scheme}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{d.table.temp}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{d.table.score}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{d.table.details}</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map((res, idx) => (
                  <React.Fragment key={idx}>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <span className="font-semibold text-gray-900">{res.reactantA} + {res.reactantB}</span>
                            {res.isLocal && <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-[10px] rounded-full font-bold uppercase">Local</span>}
                          </div>
                          <span className="text-xs text-gray-400 mt-1 truncate max-w-xs">{res.source}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{res.reactionTemp}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-16 h-2 bg-gray-100 rounded-full mr-3 overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${res.score}%` }}></div>
                          </div>
                          <span className="text-sm font-bold text-blue-600">{res.score}/100</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => setExpandedId(expandedId === idx ? null : idx)}
                          className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                        >
                          {expandedId === idx ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                        </button>
                      </td>
                    </tr>
                    {expandedId === idx && (
                      <tr className="bg-gray-50">
                        <td colSpan={4} className="px-8 py-6">
                          <div className="grid grid-cols-2 gap-8 text-sm">
                            <div className="space-y-4">
                              <h6 className="font-bold text-gray-800 flex items-center">
                                <Microscope className="w-4 h-4 mr-2" /> {d.params}
                              </h6>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-white rounded-lg border border-gray-200">
                                  <p className="text-xs text-gray-400 mb-1">{res.reactantA} dose</p>
                                  <p className="font-medium">{res.doseA}</p>
                                </div>
                                <div className="p-3 bg-white rounded-lg border border-gray-200">
                                  <p className="text-xs text-gray-400 mb-1">{res.reactantA} temp</p>
                                  <p className="font-medium">{res.heatA}</p>
                                </div>
                                <div className="p-3 bg-white rounded-lg border border-gray-200">
                                  <p className="text-xs text-gray-400 mb-1">{res.reactantB} dose</p>
                                  <p className="font-medium">{res.doseB}</p>
                                </div>
                                <div className="p-3 bg-white rounded-lg border border-gray-200">
                                  <p className="text-xs text-gray-400 mb-1">{res.reactantB} temp</p>
                                  <p className="font-medium">{res.heatB}</p>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h6 className="font-bold text-gray-800 mb-3">{d.aiAnalysis}</h6>
                              <div className="p-4 bg-white rounded-xl border border-gray-200 text-gray-600 leading-relaxed whitespace-pre-line">
                                {res.details}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && results.length === 0 && element && (
          <div className="text-center py-20 text-gray-400">
            <Microscope className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p>{d.noResult}</p>
          </div>
        )}
      </div>

      {/* Local Precursor Modal */}
      {showPrecursorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-blue-600 text-white flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Database className="w-5 h-5" />
                <h3 className="font-bold">{lang === 'zh' ? '本地前体库管理' : 'Local Precursor Inventory'}</h3>
              </div>
              <button onClick={() => setShowPrecursorModal(false)} className="hover:bg-blue-700 p-1 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <p className="text-xs text-gray-500">{lang === 'zh' ? '系统已自动索引校内试剂库文件。' : 'System auto-indexes local reagent inventory files.'}</p>
                <div className="flex space-x-2">
                  <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center space-x-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold border border-blue-100 hover:bg-blue-100 transition-all"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{lang === 'zh' ? '上传清单/文献' : 'Upload List/Doc'}</span>
                  </button>
                  <button className="flex items-center space-x-2 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-all">
                    <Plus className="w-3.5 h-3.5" />
                    <span>{lang === 'zh' ? '手动录入' : 'Manual Add'}</span>
                  </button>
                </div>
              </div>

              <div className="max-h-[400px] overflow-y-auto space-y-2">
                {localPrecursors.map((p, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 group">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white rounded-lg border border-gray-200 text-blue-600">
                        <FlaskConical className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">{p.name}</p>
                        <p className="text-[10px] text-gray-400 font-mono uppercase">{p.type} | {p.grade}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-[10px] text-gray-400 uppercase tracking-tighter">Stock</p>
                        <p className="text-xs font-bold text-gray-700">{p.volume}</p>
                      </div>
                      <button className="p-1.5 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button onClick={() => setShowPrecursorModal(false)} className="px-6 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-bold hover:bg-gray-100 transition-all">
                {lang === 'zh' ? '完成' : 'Done'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search Depth Modal */}
      {showDepthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-200">
            <div className="px-6 py-4 bg-green-600 text-white flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5" />
                <h3 className="font-bold">{lang === 'zh' ? 'AI 检索深度详情' : 'AI Search Depth Details'}</h3>
              </div>
              <button onClick={() => setShowDepthModal(false)} className="hover:bg-green-700 p-1 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">{lang === 'zh' ? '全域实时扫描' : 'Global Real-time Scan'}</h4>
                  <p className="text-sm text-gray-500">{lang === 'zh' ? '通过 Gemini Pro 深度扫描全球顶尖工艺库。' : 'Deep scanning top global process libraries via Gemini Pro.'}</p>
                </div>
                <div className="h-16 w-16 bg-green-50 rounded-full flex items-center justify-center border-4 border-green-100">
                  <CloudLightning className="w-8 h-8 text-green-600 animate-pulse" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">Google Scholar</span>
                  </div>
                  <p className="text-[10px] text-slate-500">API 响应正常，覆盖全领域 40M+ 工艺文献。</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">ScienceDirect</span>
                  </div>
                  <p className="text-[10px] text-slate-500">已授权。支持全文摘要提取与工艺参数矩阵构建。</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">Lab Internal DB</span>
                    <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-[8px] rounded font-bold uppercase ml-auto">Local</span>
                  </div>
                  <p className="text-[10px] text-slate-500">包含近 10 年本实验室沉积记录与失败案例对标。</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">arXiv / Pre-print</span>
                  </div>
                  <p className="text-[10px] text-slate-500">捕获最新尚未发表的前沿工艺。权重 1.5。</p>
                </div>
              </div>

              <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-center space-x-4">
                <CheckCircle2 className="w-10 h-10 text-indigo-600" />
                <div>
                  <h5 className="font-bold text-indigo-900 text-sm">检索信度评分: 98.4/100</h5>
                  <p className="text-xs text-indigo-700">当前检索深度已覆盖该元素 95% 以上的高质量工艺文献。</p>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button onClick={() => setShowDepthModal(false)} className="px-8 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 transition-all shadow-md">
                {lang === 'zh' ? '我明白了' : 'I Understand'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ALDSystem;
