'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Atom, Copy, Edit2, RefreshCw, BarChart3 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message, ChatReference } from '@/types';
import { ReferenceButton } from '../atoms/ReferenceButton';
import { DataTable } from '../atoms/DataTable';
import { visualizeService } from '@/lib/services/chatService';
import { referenceService } from '@/lib/services/references';
import dynamic from 'next/dynamic';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false }) as any;

interface ChatMessageProps {
  msg: Message;
  onEdit?: (convo_id: string, content: string) => void;
  onCopy: (content: string) => void;
  onReferenceClick?: (reference: ChatReference) => void;
  isLatestUserMessage?: boolean;
  isLatestAssistantMessage?: boolean;
  onRegenerate?: () => void;
  convoId?: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ msg, onEdit, onCopy, onReferenceClick, isLatestUserMessage, isLatestAssistantMessage, onRegenerate, convoId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(msg.content);
  const [chartData, setChartData] = useState<any>(null);
  const [showChart, setShowChart] = useState(false);
  const [hasGeneratedChart, setHasGeneratedChart] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
      textarea.focus();
      const length = textarea.value.length;
      textarea.setSelectionRange(length, length);
    }
  }, [isEditing]);

  const handleSave = () => {
    if (onEdit && editContent.trim() !== msg.content) {
      onEdit(msg.convo_id, editContent);
    }
    setIsEditing(false);
    setEditContent(editContent);
  };

  const hasData = () => {
    return msg.references?.some(ref => ref.type === 'sql_data') || false;
  };

  const hasChartRef = () => {
    return msg.references?.some(ref => ref.type === 'plotly_data') || false;
  };

  const getDisplayReferences = () => {
    return msg.references?.filter(ref => ref.type !== 'plotly_data') || [];
  };

  const loadChartData = async () => {
    const plotlyRef = msg.references?.find(ref => ref.type === 'plotly_data');
    if (!plotlyRef) return;
    
    try {
      const refData = await referenceService.getById(plotlyRef.reference_id);
      setChartData(refData.content);
    } catch (error) {
      // console.error('Failed to load chart data:', error);
    }
  };

  const toggleChart = async () => {
    if (!showChart && !chartData) {
      await loadChartData();
    }
    setShowChart(!showChart);
  };

  const handleVisualize = async () => {
    const actualConvoId = msg.convo_id || convoId;    
    if (!actualConvoId) return;
    try {
      const response = await visualizeService.createChart(actualConvoId);
      // console.log('Visualize response:', response);
      // console.log('Response structure:', JSON.stringify(response, null, 2));
      if (response?.content) {
        setChartData(response.content);
      } else {
        setChartData(response);
      }
      setShowChart(true);
      setHasGeneratedChart(true);
    } catch (error) {
      // console.error('Visualization failed:', error);
    }
  };

  return (
    <div className={`flex gap-3 md:gap-4 max-w-3xl mx-auto group ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      
      {msg.role === 'assistant' && (
        <div className="w-8 h-8 rounded-full bg-linear-to-tr from-blue-500 to-purple-500 shrink-0 flex items-center justify-center mt-1">
          <Atom size={16} className="text-white" />
        </div>
      )}
      
      <div className={`relative max-w-[85%] md:max-w-[75%] min-w-0 ${isEditing ? 'w-full' : ''}`}>
        {isEditing ? (
          <div className="bg-bg-element rounded-2xl p-4 border border-primary">
            <textarea 
              ref={textareaRef} 
              value={editContent} 
              onChange={(e) => setEditContent(e.target.value)} 
              className="w-full bg-transparent border-none resize-none outline-none text-text-main leading-relaxed text-sm md:text-base" 
              rows={1} 
            />
            <div className="flex justify-end gap-2 mt-3">
              <button 
                onClick={() => setIsEditing(false)} 
                className="px-3 py-1.5 rounded-full text-xs font-medium text-text-secondary hover:bg-bg-main transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave} 
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-primary text-white hover:opacity-90 transition-opacity cursor-pointer"
              >
                Update
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col min-w-0">
            <div className={`
              rounded-2xl p-3 md:p-4 leading-relaxed text-sm md:text-base 
              wrap-break-word whitespace-pre-wrap
              ${msg.role === 'user' 
                ? 'bg-bg-element text-text-main rounded-tr-sm' 
                : 'bg-transparent text-text-main px-0'
              }
            `}>
              {(() => {
                if (msg.role === 'assistant') {
                  try {
                    const parsed = JSON.parse(msg.content);
                    if (parsed.type === 'sql_data') {
                      return <DataTable columns={parsed.content.columns} data={parsed.content.data} />;
                    }
                    if (parsed.type === 'plotly_data') {
                      return (
                        <div className="mt-4">
                          <Plot
                            data={parsed.content.data}
                            layout={parsed.content.layout}
                            config={{ responsive: true }}
                            style={{ width: '100%', height: '400px' }}
                          />
                        </div>
                      );
                    }
                  } catch (e) {}
                  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>;
                }
                return editContent;
              })()}
            </div>

            {showChart && chartData && (
              <div className="mt-4 p-4 bg-bg-element rounded-lg">
                <Plot
                  data={chartData.data}
                  layout={chartData.layout}
                  config={{ responsive: true }}
                  style={{ width: '100%', height: '400px' }}
                />
              </div>
            )}

            {(getDisplayReferences().length > 0 || (hasChartRef() || hasGeneratedChart)) && (
              <div className="flex flex-wrap gap-2 mt-2">
                {getDisplayReferences().map((ref, index) => (
                  <ReferenceButton
                    key={`${ref.reference_id}-${index}`}
                    reference={ref}
                    onClick={() => {}}
                  />
                ))}
                
                {(hasChartRef() || hasGeneratedChart) && (
                  <button
                    onClick={toggleChart}
                    className="inline-flex items-center gap-1.5 px-2 py-1 text-xs bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-md transition-colors cursor-pointer"
                  >
                    <BarChart3 size={12} />
                    {showChart ? 'Hide Chart' : 'Show Chart'}
                  </button>
                )}
              </div>
            )}

            {msg.role === 'assistant' ? (
                <div className="mt-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onCopy(msg.content)} className="p-1.5 rounded-full text-text-secondary hover:bg-bg-element transition-colors cursor-pointer">
                      <Copy size={14} />
                    </button>

                    {hasData() && !hasChartRef() && !hasGeneratedChart && (
                      <button onClick={handleVisualize} className="p-1.5 rounded-full text-text-secondary hover:bg-bg-element transition-colors cursor-pointer">
                        <BarChart3 size={14} />
                      </button>
                    )}

                    {isLatestAssistantMessage && (
                      <button onClick={onRegenerate} className="p-1.5 rounded-full text-text-secondary hover:bg-bg-element transition-colors cursor-pointer">
                        <RefreshCw size={14} />
                      </button>
                    )}
                </div>
            ) : (
                <div className="absolute top-2 right-full mr-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {isLatestUserMessage && (
                        <button onClick={() => setIsEditing(true)} className="p-1.5 rounded-full bg-bg-surface border border-border text-text-secondary hover:text-text-main transition-colors cursor-pointer shadow-sm">
                          <Edit2 size={12} />
                        </button>
                      )}
                      <button onClick={() => onCopy(editContent)} className="p-1.5 rounded-full bg-bg-surface border border-border text-text-secondary hover:text-text-main transition-colors cursor-pointer shadow-sm">
                        <Copy size={12} />
                      </button>
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};