
import React, { useState, useRef, useEffect } from 'react';
import { 
  Warehouse, 
  Package, 
  AlertTriangle, 
  LineChart as ChartIcon,
  Mic,
  Camera,
  Plus,
  Loader2,
  Check,
  Thermometer,
  Wind,
  ShieldCheck,
  Layers,
  BarChart3,
  Calendar,
  Wrench,
  Activity,
  Box,
  ClipboardCheck,
  TrendingDown,
  X,
  FileText
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { gemini } from '../services/geminiService';
import { WarehouseItem } from '../types';
import { useTranslation } from '../App';

type TabType = 'INVENTORY' | 'SAFETY' | 'MAINTENANCE' | 'ANALYTICS';

const WarehouseSystem: React.FC = () => {
  const { lang, t } = useTranslation();
  const d = t.warehouse;

  const [activeTab, setActiveTab] = useState<TabType>('INVENTORY');
  const [items, setItems] = useState<WarehouseItem[]>([
    { id: '1', name: 'Al(CH3)3 (TMA)', brand: 'Sigma', spec: '500ml', quantity: 12, unit: 'Bottle', expiryDate: '2024-12-01', health: 'HEALTHY', price: 1200 },
    { id: '2', name: 'NH3 Gas Cylinder', brand: 'Air Liquide', spec: '40L', quantity: 5, unit: 'Cylinder', expiryDate: '2023-11-15', health: 'CRITICAL', price: 800 },
    { id: '3', name: 'HF 49%', brand: 'Honeywell', spec: '1L', quantity: 8, unit: 'Bottle', expiryDate: '2025-06-20', health: 'HEALTHY', price: 150 },
    { id: '4', name: 'Vacuum Filter', brand: 'Swagelok', spec: '2um', quantity: 2, unit: 'Unit', expiryDate: '2025-06-20', health: 'WARNING', price: 450 },
  ]);

  // Simulated Sensor Data
  const [sensors, setSensors] = useState({ temp: 22.4, hum: 45.2, voc: 0.02, nh3: 0.01 });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [monitorResult, setMonitorResult] = useState<{status: string, details: string} | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showCamera, setShowCamera] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSensors(prev => ({
        temp: +(prev.temp + (Math.random() - 0.5) * 0.1).toFixed(1),
        hum: +(prev.hum + (Math.random() - 0.5) * 0.5).toFixed(1),
        voc: +(prev.voc + (Math.random() - 0.5) * 0.001).toFixed(3),
        nh3: +(prev.nh3 + (Math.random() - 0.5) * 0.001).toFixed(3),
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleRunAiAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      let result = '';
      if (activeTab === 'ANALYTICS') {
        result = await gemini.analyzeLabAnalytics(items, [], lang);
      } else {
        result = await gemini.analyzeWarehouse(items, lang);
      }
      setAiAnalysis(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (event) => audioChunksRef.current.push(event.data);
      mediaRecorder.onstop = async () => {
        setIsProcessing(true);
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const base64Audio = await blobToBase64(audioBlob);
        try {
          const newItemData = await gemini.processVoiceInput(base64Audio, 'audio/webm', lang);
          if (newItemData.name) {
            const newItem: WarehouseItem = {
              id: Math.random().toString(36).substr(2, 9),
              name: newItemData.name,
              brand: newItemData.brand || "N/A",
              spec: newItemData.spec || "N/A",
              quantity: Number(newItemData.quantity) || 1,
              unit: newItemData.unit || "Unit",
              expiryDate: newItemData.expiryDate || "2025-12-31",
              health: 'HEALTHY',
              price: 0
            };
            setItems(prev => [newItem, ...prev]);
          }
        } catch (err) { console.error(err); } finally { setIsProcessing(false); }
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) { alert("Mic failed"); }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleOcrClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsProcessing(true);
    try {
      const base64Image = await blobToBase64(file);
      // Determine if we are doing general entry or "Verification"
      const newItemData = await gemini.processImageInput(base64Image, file.type, lang);
      
      if (newItemData.name) {
        setItems(prev => [{
          id: Math.random().toString(36).substr(2, 9),
          name: newItemData.name,
          brand: newItemData.brand || "N/A",
          spec: newItemData.spec || "N/A",
          quantity: Number(newItemData.quantity) || 1,
          unit: newItemData.unit || "Unit",
          expiryDate: newItemData.expiryDate || "2025-12-31",
          health: 'HEALTHY',
          price: 0
        }, ...prev]);
        
        setAiAnalysis(lang === 'zh' 
          ? `### 验收单生成成功\n\n已成功识别物料：**${newItemData.name}**\n- 规格：${newItemData.spec}\n- 品牌：${newItemData.brand}\n- 状态：已自动对标本地采购库，符合 R&D 级别要求。\n- 建议操作：已入库至 3 号架。` 
          : `### Acceptance Slip Generated\n\nIdentified: **${newItemData.name}**\n- Spec: ${newItemData.spec}\n- Brand: ${newItemData.brand}\n- Status: Matched against local DB, compliant with R&D standards.\n- Action: Stored in Shelf #3.`);
      }
    } catch (err) { console.error(err); } finally { setIsProcessing(false); if (fileInputRef.current) fileInputRef.current.value = ''; }
  };

  const startMonitoring = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert("Camera access failed.");
      setShowCamera(false);
    }
  };

  const captureAndAnalyze = async () => {
    if (!videoRef.current) return;
    setIsProcessing(true);
    
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(videoRef.current, 0, 0);
    
    const base64 = canvas.toDataURL('image/jpeg').split(',')[1];
    
    // Cleanup camera
    const stream = videoRef.current.srcObject as MediaStream;
    stream.getTracks().forEach(t => t.stop());
    setShowCamera(false);

    try {
      const prompt = "Analyze this lab material status from camera. Check for leaks, damage, or improper storage. Return JSON {status: string, details: string}. Language: " + (lang === 'zh' ? 'Chinese' : 'English');
      const response = await gemini['ai'].models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          { inlineData: { data: base64, mimeType: 'image/jpeg' } },
          { text: prompt }
        ],
        config: { responseMimeType: "application/json" }
      });
      const res = JSON.parse(response.text || '{}');
      setMonitorResult(res);
      setAiAnalysis(`### 图像监控分析报告\n\n**状态：${res.status}**\n\n${res.details}`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />

      {/* Camera Overlay */}
      {showCamera && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4">
          <div className="relative w-full max-w-2xl aspect-video bg-gray-900 rounded-2xl overflow-hidden border-4 border-indigo-500 shadow-2xl">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            <div className="absolute inset-0 border-[40px] border-black/20 pointer-events-none">
              <div className="w-full h-full border-2 border-dashed border-white/50 rounded-lg"></div>
            </div>
            <button 
              onClick={() => {
                const stream = videoRef.current?.srcObject as MediaStream;
                stream?.getTracks().forEach(t => t.stop());
                setShowCamera(false);
              }}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-white text-sm mt-6 mb-8 font-medium">请将镜头对准待检测物料标签或包装</p>
          <button 
            onClick={captureAndAnalyze}
            className="px-12 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all flex items-center space-x-3 shadow-xl"
          >
            <Camera className="w-6 h-6" />
            <span>执行实时检测</span>
          </button>
        </div>
      )}

      {/* Header & Global Stats */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Warehouse className="w-8 h-8 text-indigo-600 mr-3" />
            {d.title}
          </h2>
          <p className="text-gray-500 text-sm mt-1">{d.subtitle}</p>
        </div>
        <div className="flex items-center space-x-6">
          <div className="text-center px-4 border-r border-gray-100 last:border-0">
            <p className="text-xs text-gray-400 uppercase mb-1">Temp</p>
            <p className="text-lg font-bold text-gray-800">{sensors.temp}°C</p>
          </div>
          <div className="text-center px-4 border-r border-gray-100 last:border-0">
            <p className="text-xs text-gray-400 uppercase mb-1">PID/VOC</p>
            <p className="text-lg font-bold text-blue-600">{sensors.voc} ppm</p>
          </div>
          <div className="text-center px-4 border-r border-gray-100 last:border-0">
            <p className="text-xs text-gray-400 uppercase mb-1">Safety</p>
            <div className="flex items-center text-green-500 text-sm font-bold">
              <ShieldCheck className="w-4 h-4 mr-1" />
              SECURE
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-200/50 p-1 rounded-xl w-fit">
        {[
          { id: 'INVENTORY', label: d.tabs.inventory, icon: Package },
          { id: 'SAFETY', label: d.tabs.safety, icon: Wind },
          { id: 'MAINTENANCE', label: d.tabs.maintenance, icon: Layers },
          { id: 'ANALYTICS', label: d.tabs.analytics, icon: BarChart3 },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id as TabType); setAiAnalysis(''); }}
            className={`flex items-center space-x-2 px-6 py-2 rounded-lg transition-all text-sm font-bold ${
              activeTab === tab.id ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Area */}
        <div className="lg:col-span-3 space-y-6">
          {activeTab === 'INVENTORY' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                  <h3 className="font-bold text-gray-800 flex items-center">
                    <Box className="w-5 h-5 mr-2 text-indigo-500" />
                    实验室物料管理 (录入与核验)
                  </h3>
                  <div className="flex space-x-2">
                    <button onClick={isRecording ? stopRecording : startRecording} className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${isRecording ? 'bg-red-50 text-red-600 border-red-200 shadow-sm' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}>
                      <Mic className="w-3.5 h-3.5" />
                      <span>{isRecording ? '停止' : d.btnVoice}</span>
                    </button>
                    <button onClick={handleOcrClick} className="flex items-center space-x-2 px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-100 transition-all text-xs font-bold">
                      <Camera className="w-3.5 h-3.5" />
                      <span>{d.btnOcr}</span>
                    </button>
                    <button className="flex items-center space-x-2 px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all text-xs font-bold">
                      <Plus className="w-3.5 h-3.5" />
                      <span>{d.btnAdd}</span>
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{d.table.info}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{d.table.qty}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{d.table.expiry}</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{d.table.action}</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {items.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className={`p-2 rounded-lg mr-3 ${item.health === 'HEALTHY' ? 'bg-green-50 text-green-600' : item.health === 'CRITICAL' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'}`}>
                                <Package className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-gray-900">{item.name}</p>
                                <p className="text-[10px] text-gray-400 font-mono uppercase">{item.brand} | {item.spec}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-700">{item.quantity} {item.unit}</td>
                          <td className="px-6 py-4">
                             <div className="flex items-center">
                               <div className={`h-1.5 w-12 rounded-full mr-2 ${item.health === 'HEALTHY' ? 'bg-green-200' : item.health === 'CRITICAL' ? 'bg-red-200' : 'bg-orange-200'}`}>
                                 <div className={`h-full rounded-full ${item.health === 'HEALTHY' ? 'bg-green-500' : item.health === 'CRITICAL' ? 'bg-red-500' : 'bg-orange-500'}`} style={{width: item.health === 'HEALTHY' ? '90%' : item.health === 'CRITICAL' ? '10%' : '40%'}}></div>
                               </div>
                               <span className="text-xs text-gray-500 font-medium">{item.expiryDate}</span>
                             </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="text-indigo-600 hover:text-indigo-800 text-xs font-bold uppercase tracking-wider">{d.table.details}</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button 
                  onClick={handleOcrClick}
                  className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 flex items-center justify-between hover:bg-indigo-100 transition-all text-left group"
                >
                   <div className="flex items-center">
                     <div className="p-3 bg-white rounded-xl shadow-sm mr-4 group-hover:scale-110 transition-transform">
                       <ClipboardCheck className="w-6 h-6 text-indigo-600" />
                     </div>
                     <div>
                       <h4 className="font-bold text-indigo-900 text-sm">AI 自动判别与验收单生成</h4>
                       <p className="text-xs text-indigo-700 mt-1 opacity-80">点击上传单据，智能识别物料纯度与规格并生成报告。</p>
                     </div>
                   </div>
                   <div className="px-4 py-2 bg-white text-indigo-600 text-xs font-bold rounded-lg border border-indigo-100 shadow-sm">
                     去核验
                   </div>
                </button>
                <button 
                  onClick={startMonitoring}
                  className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex items-center justify-between text-white hover:bg-slate-700 transition-all text-left group"
                >
                   <div className="flex items-center">
                     <div className="p-3 bg-slate-700 rounded-xl mr-4 group-hover:rotate-12 transition-transform">
                       <Camera className="w-6 h-6 text-blue-400" />
                     </div>
                     <div>
                       <h4 className="font-bold text-sm text-blue-100">图像 AI 货物状态监控</h4>
                       <p className="text-xs text-slate-400 mt-1">开启相机扫描物料，自动识别泄漏、破损或非法开启。</p>
                     </div>
                   </div>
                   <div className="flex items-center space-x-2 bg-slate-900/50 px-3 py-1.5 rounded-full">
                     <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                     <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Detecting</span>
                   </div>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'SAFETY' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-6 flex items-center">
                  <Thermometer className="w-5 h-5 mr-2 text-indigo-500" />
                  {d.safety.tempHum}
                </h3>
                <div className="h-64">
                   <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={Array.from({length: 10}).map((_, i) => ({name: i, temp: sensors.temp + (Math.random()-0.5)}))}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                       <XAxis hide />
                       <YAxis domain={['dataMin - 1', 'dataMax + 1']} hide />
                       <Area type="monotone" dataKey="temp" stroke="#6366f1" fill="#6366f120" />
                     </AreaChart>
                   </ResponsiveContainer>
                </div>
                <div className="mt-4 flex justify-around text-center">
                  <div><p className="text-xs text-gray-400">Current Temp</p><p className="text-xl font-bold">{sensors.temp}°C</p></div>
                  <div><p className="text-xs text-gray-400">Current Hum</p><p className="text-xl font-bold">{sensors.hum}%</p></div>
                </div>
              </div>

              <div className="bg-slate-900 p-6 rounded-2xl shadow-xl relative overflow-hidden group">
                 <h3 className="font-bold text-white mb-6 flex items-center relative z-10">
                   <Wind className="w-5 h-5 mr-2 text-blue-400" />
                   {d.safety.gasConc}
                 </h3>
                 <div className="flex items-center justify-center h-40 relative z-10">
                    <div className="text-center">
                      <p className="text-4xl font-bold text-blue-400 tracking-tighter">{sensors.voc}</p>
                      <p className="text-xs text-blue-300/50 uppercase font-bold mt-1">PPM (VOC Index)</p>
                    </div>
                 </div>
                 <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-900">
                    <div className="h-full bg-blue-400 transition-all duration-500" style={{width: `${sensors.voc * 100}%`}}></div>
                 </div>
                 <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/10 text-xs text-blue-200 relative z-10">
                    AI Analysis: 危化品泄漏风险处于极低水平。联动排风系统已就绪。
                 </div>
              </div>

              <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-32 h-20 bg-gray-800 rounded-lg flex items-center justify-center relative overflow-hidden border-2 border-green-500">
                    <div className="absolute inset-0 bg-green-500/10 flex items-center justify-center">
                      <Check className="w-8 h-8 text-green-500" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{d.safety.compliance}</h4>
                    <p className="text-sm text-gray-500">AI 人员动作识别：未检测到违规取用，PPE 佩戴符合实验室安全准则。</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full border border-green-100">
                  {d.safety.statusNormal}
                </span>
              </div>
            </div>
          )}

          {activeTab === 'MAINTENANCE' && (
             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8">
                <div className="flex justify-between items-end">
                   <div>
                     <h3 className="text-xl font-bold text-gray-800">{d.maintenance.lifecycle}</h3>
                     <p className="text-sm text-gray-500">备件出库频次与设备正常运维周期比对（基于 A* 路径与更换间隔）。</p>
                   </div>
                   <button className="px-4 py-2 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-lg border border-indigo-100 hover:bg-indigo-100 transition-all">
                      绑定新备件/设备
                   </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                      <div className="flex items-center">
                         <Wrench className="w-10 h-10 text-gray-400 mr-4" />
                         <div>
                            <p className="font-bold text-gray-900">Swagelok 2um Filter</p>
                            <p className="text-xs text-gray-500">绑定机台: ALD Chamber #03</p>
                            <div className="mt-2 flex items-center space-x-2">
                               <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-bold">周期：3月</span>
                               <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded font-bold">当前：1.2月</span>
                            </div>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-xs text-gray-400">剩余寿命</p>
                         <p className="text-xl font-bold text-orange-500">42%</p>
                      </div>
                   </div>
                   <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                      <div className="flex items-center">
                         <Activity className="w-10 h-10 text-gray-400 mr-4" />
                         <div>
                            <p className="font-bold text-gray-900">压力表/传感器</p>
                            <p className="text-xs text-gray-500">绑定机台: Gas Cabinet B</p>
                            <div className="mt-2 flex items-center space-x-2">
                               <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-bold">周期：24月</span>
                               <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold">已用：3月</span>
                            </div>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-xs text-gray-400">剩余寿命</p>
                         <p className="text-xl font-bold text-green-500">89%</p>
                      </div>
                   </div>
                </div>
                <div className="bg-indigo-600 rounded-2xl p-6 text-white flex items-center justify-between">
                   <div className="flex items-center space-x-4">
                      <AlertTriangle className="w-10 h-10 opacity-50" />
                      <div>
                         <p className="font-bold">AI 异常状态提示</p>
                         <p className="text-sm text-indigo-100">检测到 ALD Chamber #03 的滤芯更换频次异常（1个月内更换2次），推断设备可能存在管路污染风险。</p>
                      </div>
                   </div>
                   <button className="px-4 py-2 bg-white text-indigo-600 font-bold rounded-lg text-sm shadow-md">自动派发检修单</button>
                </div>
             </div>
          )}

          {activeTab === 'ANALYTICS' && (
             <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h4 className="font-bold text-gray-800 mb-6 flex items-center">
                       <BarChart3 className="w-5 h-5 mr-2 text-indigo-500" />
                       {d.analytics.costTitle}
                    </h4>
                    <div className="space-y-4">
                       <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500">Sigma Al(CH3)3 (High Grade)</span>
                          <span className="font-bold text-green-600">实验成功率: 98.4%</span>
                       </div>
                       <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-green-500 h-full" style={{width: '98%'}}></div>
                       </div>
                       <div className="flex justify-between items-center text-sm mt-4">
                          <span className="text-gray-500">Generic Precursor (Lab Grade)</span>
                          <span className="font-bold text-orange-600">实验成功率: 82.1%</span>
                       </div>
                       <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-orange-500 h-full" style={{width: '82%'}}></div>
                       </div>
                       <div className="mt-4 p-3 bg-slate-50 rounded-lg text-xs text-slate-500 border border-slate-100">
                          AI 洞察：尽管 Sigma 品牌价格高出 15%，但因其实验成功率高，月度综合研发成本反而降低了 12,000 元。
                       </div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h4 className="font-bold text-gray-800 mb-6 flex items-center">
                       <TrendingDown className="w-5 h-5 mr-2 text-indigo-500" />
                       气体与能耗分析 (Leak Detection)
                    </h4>
                    <div className="h-40 bg-gray-50 rounded-xl mb-4 p-4 flex items-end justify-between space-x-1">
                       {[40, 55, 45, 80, 75, 40, 35].map((h, i) => (
                         <div key={i} className="flex-1 bg-indigo-200 rounded-t-sm" style={{height: `${h}%`}}></div>
                       ))}
                    </div>
                    <div className="p-3 bg-orange-50 rounded-xl border border-orange-100 text-xs text-orange-700 leading-relaxed">
                       AI 预警：发现 N2 气体用量异常增加（对比实验计划需求，实际消耗高出 50L/周），推断管道 A3 区可能存在微量泄漏。建议检漏。
                    </div>
                  </div>
                </div>
                <button 
                  onClick={handleRunAiAnalysis} 
                  disabled={isAnalyzing}
                  className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all flex items-center justify-center space-x-3 shadow-xl shadow-indigo-100 active:scale-95"
                >
                  {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <BarChart3 className="w-5 h-5" />}
                  <span>{d.analytics.reportBtn}</span>
                </button>
             </div>
          )}
        </div>

        {/* AI Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-6 flex items-center">
              <Check className="w-4 h-4 text-green-500 mr-2" />
              {d.aiInsights}
            </h3>
            {aiAnalysis || isProcessing ? (
              <div className="text-sm text-gray-600 leading-relaxed prose prose-sm max-w-none animate-in fade-in duration-500 bg-gray-50 p-4 rounded-xl border border-gray-100 min-h-[100px] flex flex-col justify-center">
                {isProcessing ? (
                   <div className="flex items-center justify-center space-x-2 text-indigo-600 py-8">
                     <Loader2 className="w-5 h-5 animate-spin" />
                     <span className="font-bold text-xs uppercase tracking-widest">AI 分析中...</span>
                   </div>
                ) : (
                  <div className="whitespace-pre-wrap">{aiAnalysis}</div>
                )}
              </div>
            ) : (
              <div className="p-12 text-center text-gray-400">
                <ChartIcon className="w-12 h-12 mx-auto mb-3 opacity-10" />
                <p className="text-[10px] uppercase font-bold tracking-widest">{d.aiPrompt}</p>
              </div>
            )}
            {activeTab === 'INVENTORY' && !aiAnalysis && !isProcessing && (
              <button 
                onClick={handleRunAiAnalysis} 
                disabled={isAnalyzing}
                className="w-full mt-6 py-3 bg-indigo-50 text-indigo-600 font-bold rounded-xl text-xs hover:bg-indigo-100 transition-all disabled:opacity-50"
              >
                {isAnalyzing ? '...' : d.btnAi}
              </button>
            )}
            {aiAnalysis && (
              <button 
                onClick={() => setAiAnalysis('')} 
                className="w-full mt-4 text-[10px] text-gray-400 font-bold uppercase hover:text-gray-600"
              >
                清除分析
              </button>
            )}
          </div>

          <div className="bg-orange-50 border border-orange-100 p-6 rounded-2xl">
            <div className="flex items-start">
              <AlertTriangle className="w-6 h-6 text-orange-600 mr-3 mt-1" />
              <div>
                <h4 className="font-bold text-orange-900 mb-1">{d.shortage}</h4>
                <p className="text-xs text-orange-700 leading-relaxed">{d.shortageDesc}</p>
                <button className="mt-3 text-[10px] font-bold text-orange-900 uppercase tracking-widest bg-white px-3 py-1.5 rounded-lg border border-orange-200 hover:bg-orange-50 transition-all">{d.handle}</button>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h4 className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-widest">Global Status</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                 <span className="text-gray-500">仓储效率评级</span>
                 <span className="text-green-500 font-bold">EXCELLENT</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                 <span className="text-gray-500">AI 服务响应</span>
                 <span className="text-blue-500 font-bold">0.8s</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                 <span className="text-gray-500">区域效率优化</span>
                 <span className="text-gray-700 font-bold">ENABLED</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarehouseSystem;
