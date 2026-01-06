
import React, { useState } from 'react';
import { Droplets, FileText, Share2, BookOpen, Layers, Bot, MessageSquare, Send } from 'lucide-react';

const WetProcess: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'GRAPH' | 'LIT' | 'ASSISTANT'>('GRAPH');

  const KnowledgeNode: React.FC<{ label: string; x: number; y: number; type: string }> = ({ label, x, y, type }) => (
    <div 
      className={`absolute px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transform hover:scale-105 transition-transform ${
        type === 'material' ? 'bg-blue-50 border-blue-200 text-blue-700' :
        type === 'process' ? 'bg-purple-50 border-purple-200 text-purple-700' :
        'bg-green-50 border-green-200 text-green-700'
      }`}
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      {label}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100">
          {[
            { id: 'GRAPH', label: '湿法知识图谱', icon: Share2 },
            { id: 'LIT', label: '智能文献解析', icon: FileText },
            { id: 'ASSISTANT', label: 'AI 工艺助手', icon: Bot },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 py-4 text-sm font-bold transition-all border-b-2 ${
                activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="p-8">
          {activeTab === 'GRAPH' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">湿法工艺关系网络</h3>
                <div className="flex space-x-2">
                  <span className="flex items-center text-xs text-gray-500"><div className="w-2 h-2 rounded-full bg-blue-400 mr-1"></div> 材料</span>
                  <span className="flex items-center text-xs text-gray-500"><div className="w-2 h-2 rounded-full bg-purple-400 mr-1"></div> 工序</span>
                  <span className="flex items-center text-xs text-gray-500"><div className="w-2 h-2 rounded-full bg-green-400 mr-1"></div> 产物</span>
                </div>
              </div>
              <div className="h-[500px] bg-slate-50 rounded-2xl border border-slate-100 relative overflow-hidden group">
                {/* Simulated Knowledge Graph Nodes */}
                <KnowledgeNode label="HF 氢氟酸" x={20} y={30} type="material" />
                <KnowledgeNode label="BOE 缓冲蚀刻液" x={25} y={50} type="material" />
                <KnowledgeNode label="SiO2 蚀刻" x={45} y={40} type="process" />
                <KnowledgeNode label="Si 面清洗" x={50} y={60} type="process" />
                <KnowledgeNode label="疏水表面" x={75} y={45} type="result" />
                <KnowledgeNode label="无机颗粒去处" x={70} y={65} type="result" />
                
                {/* Simulated connections using SVG */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                  <line x1="25%" y1="35%" x2="45%" y2="42%" stroke="#3b82f6" strokeWidth="1" />
                  <line x1="30%" y1="52%" x2="45%" y2="42%" stroke="#3b82f6" strokeWidth="1" />
                  <line x1="48%" y1="45%" x2="75%" y2="48%" stroke="#3b82f6" strokeWidth="1" />
                  <line x1="53%" y1="65%" x2="70%" y2="68%" stroke="#3b82f6" strokeWidth="1" />
                </svg>
                
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-white/50 backdrop-blur-sm px-6 py-3 rounded-full border border-gray-200 text-sm font-medium animate-pulse text-gray-400">
                    可交互知识图谱预览（支持拖拽缩放）
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 border border-gray-100 rounded-xl bg-gray-50">
                  <p className="text-xs text-gray-400 mb-1">节点总数</p>
                  <p className="text-xl font-bold text-gray-800">124,592</p>
                </div>
                <div className="p-4 border border-gray-100 rounded-xl bg-gray-50">
                  <p className="text-xs text-gray-400 mb-1">关系映射</p>
                  <p className="text-xl font-bold text-gray-800">582,103</p>
                </div>
                <div className="p-4 border border-gray-100 rounded-xl bg-gray-50">
                  <p className="text-xs text-gray-400 mb-1">近一周更新</p>
                  <p className="text-xl font-bold text-blue-600">+1,429</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'LIT' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">文献智能解析队列</h3>
                <button className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors">
                  上传新文献 (PDF)
                </button>
              </div>
              <div className="space-y-3">
                {[
                  { title: 'Optimization of SC-1 Cleaning Process', status: 'Parsed', date: '2023-10-24' },
                  { title: 'New Approaches to Wet Etching of SiC', status: 'Parsing', date: '2023-10-25' },
                  { title: 'Metal Contamination Removal via DHF', status: 'Waiting', date: '2023-10-25' },
                ].map((lit, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:shadow-sm transition-all group">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-gray-100 rounded group-hover:bg-blue-50 transition-colors">
                        <FileText className="w-5 h-5 text-gray-500 group-hover:text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{lit.title}</p>
                        <p className="text-xs text-gray-400">{lit.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        lit.status === 'Parsed' ? 'bg-green-100 text-green-700' :
                        lit.status === 'Parsing' ? 'bg-blue-100 text-blue-700 animate-pulse' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        {lit.status}
                      </span>
                      <button className="text-gray-300 hover:text-gray-600 transition-colors">
                        <Layers className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'ASSISTANT' && (
            <div className="h-[600px] flex flex-col space-y-4">
              <div className="flex-1 bg-slate-50 rounded-2xl border border-slate-100 p-6 overflow-y-auto space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm max-w-[80%]">
                    <p className="text-sm text-gray-700">您好！我是湿法工艺 AI 助手。我可以为您解析工艺手册、生成机台 Recipe 或回答湿法技术问题。请问有什么可以帮您？</p>
                  </div>
                </div>
                
                <div className="flex items-start justify-end space-x-3">
                  <div className="bg-blue-600 p-4 rounded-2xl rounded-tr-none shadow-md max-w-[80%]">
                    <p className="text-sm text-white font-medium">帮我生成一份针对 12 英寸晶圆的 SC-1 清洗工艺卡片。</p>
                  </div>
                  <div className="p-2 bg-gray-200 rounded-lg">
                    <MessageSquare className="w-5 h-5 text-gray-600" />
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-white p-6 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm max-w-[90%] space-y-4">
                    <div className="border-b border-gray-100 pb-3 flex justify-between items-center">
                      <h5 className="font-bold text-gray-800">已生成标准工艺卡片 (SC-1)</h5>
                      <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-100">AI 推荐模型 v2.4</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="p-2 bg-slate-50 rounded">
                        <span className="text-gray-400 block mb-1">配比 (NH4OH:H2O2:H2O)</span>
                        <span className="font-bold text-gray-700">1:1:5</span>
                      </div>
                      <div className="p-2 bg-slate-50 rounded">
                        <span className="text-gray-400 block mb-1">反应温度</span>
                        <span className="font-bold text-gray-700">75 ± 2 ℃</span>
                      </div>
                      <div className="p-2 bg-slate-50 rounded">
                        <span className="text-gray-400 block mb-1">清洗时间</span>
                        <span className="font-bold text-gray-700">10 min</span>
                      </div>
                      <div className="p-2 bg-slate-50 rounded">
                        <span className="text-gray-400 block mb-1">兆声波频率</span>
                        <span className="font-bold text-gray-700">1.0 MHz</span>
                      </div>
                    </div>
                    <div className="flex space-x-3 pt-2">
                      <button className="flex-1 bg-blue-600 text-white text-xs font-bold py-2 rounded-lg hover:bg-blue-700 transition-colors">导出至机台软件</button>
                      <button className="flex-1 bg-white border border-gray-200 text-gray-700 text-xs font-bold py-2 rounded-lg hover:bg-gray-50 transition-colors">调整参数</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-lg">
                <input 
                  type="text" 
                  placeholder="询问工艺建议或输入指令..." 
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2"
                />
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                    <BookOpen className="w-5 h-5" />
                  </button>
                  <button className="p-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WetProcess;
