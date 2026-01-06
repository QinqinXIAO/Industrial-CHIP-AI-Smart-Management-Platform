
import React, { useState, useRef } from 'react';
import { ClipboardList, Mic, Send, CheckCircle, Clock, AlertCircle, Loader2, Square } from 'lucide-react';
import { gemini } from '../services/geminiService';
import { useTranslation } from '../App';

const TicketSystem: React.FC = () => {
  const { lang, t } = useTranslation();
  const d = t.ticket;

  const [ticketInput, setTicketInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setIsTranscribing(true);
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const base64Audio = await blobToBase64(audioBlob);
        
        try {
          const transcribedText = await gemini.transcribeVoiceToText(base64Audio, 'audio/webm', lang);
          if (transcribedText) {
            setTicketInput(prev => prev ? `${prev}\n${transcribedText}` : transcribedText);
          }
        } catch (err) {
          console.error("Transcription failed:", err);
        } finally {
          setIsTranscribing(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      alert("Microphone access failed.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleAnalyze = async () => {
    if (!ticketInput) return;
    setIsProcessing(true);
    try {
      const result = await gemini.analyzeTicket(ticketInput, lang);
      setAnalysis(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <ClipboardList className="w-8 h-8 text-indigo-600 mr-3" />
            {d.title}
          </h2>
          {isRecording && (
            <div className="flex items-center space-x-2 px-3 py-1 bg-red-50 text-red-600 rounded-full border border-red-100 animate-pulse">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-xs font-bold uppercase tracking-wider">{d.recording}</span>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-semibold text-gray-700">{d.descLabel}</label>
            {isTranscribing && (
              <span className="text-xs text-indigo-500 flex items-center">
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                {d.transcribing}
              </span>
            )}
          </div>
          
          <div className="relative">
            <textarea 
              value={ticketInput}
              onChange={(e) => setTicketInput(e.target.value)}
              placeholder={d.placeholder}
              className="w-full h-48 p-5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none text-gray-700 transition-all"
            />
            <div className="absolute bottom-4 right-4 flex space-x-2">
              <button 
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isTranscribing}
                className={`p-3 rounded-full transition-all shadow-md flex items-center justify-center ${
                  isRecording 
                    ? 'bg-red-500 text-white hover:bg-red-600 animate-bounce' 
                    : 'bg-white text-gray-500 hover:text-indigo-600 border border-gray-100'
                } disabled:opacity-50`}
              >
                {isRecording ? <Square className="w-5 h-5 fill-current" /> : <Mic className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          <div className="flex justify-end pt-2">
            <button 
              onClick={handleAnalyze}
              disabled={isProcessing || !ticketInput || isRecording}
              className="flex items-center space-x-2 px-10 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-lg shadow-indigo-100 active:scale-95"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{d.btnSubmitting}</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>{d.btnSubmit}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {analysis && (
          <div className="mt-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-slate-800 mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  {d.coreInfo}
                </h4>
                <div className="space-y-3">
                  {Object.entries(analysis.coreInfo || {}).map(([k, v]: [string, any]) => (
                    <div key={k} className="flex justify-between border-b border-slate-200 pb-2 last:border-0">
                      <span className="text-xs text-slate-500">{k}</span>
                      <span className="text-sm font-medium text-slate-700">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-slate-800 mb-4 flex items-center">
                  <AlertCircle className="w-5 h-5 text-orange-500 mr-2" />
                  {d.validity}
                </h4>
                <div className="p-4 bg-white rounded-xl border border-slate-100 text-sm text-slate-600 leading-relaxed shadow-inner h-full overflow-y-auto max-h-[160px]">
                  {analysis.validityCheck}
                </div>
              </div>
            </div>

            <div className="p-8 bg-indigo-50 rounded-2xl border border-indigo-100">
              <h4 className="font-bold text-indigo-900 mb-6 flex items-center">
                <Clock className="w-5 h-5 text-indigo-600 mr-2" />
                {d.solutions}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(analysis.recommendations || []).map((rec: string, i: number) => (
                  <div key={i} className="bg-white p-5 rounded-xl border border-indigo-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-1 bg-indigo-600 text-white text-[10px] font-bold">Top {i+1}</div>
                    <p className="text-sm text-gray-700 leading-relaxed mb-4">{rec}</p>
                    <button className="text-xs font-bold text-indigo-600 flex items-center group-hover:underline">
                      {d.apply}
                      <Send className="w-3 h-3 ml-1" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketSystem;
