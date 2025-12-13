'use client';
import React, { useState } from 'react';
import { FileText, Database, BarChart3, ChevronDown, X } from 'lucide-react';
import { ChatReference, Reference } from '@/types';
import { referenceService } from '@/lib/services/references';

interface ReferenceButtonProps {
  reference: ChatReference;
  onClick: (reference: ChatReference) => void;
}

export const ReferenceButton: React.FC<ReferenceButtonProps> = ({ reference, onClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [referenceData, setReferenceData] = useState<Reference | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const getIcon = () => {
    switch (reference.type) {
      case 'sql_code':
        return <FileText size={12} />;
      case 'sql_data':
        return <Database size={12} />;
      case 'plotly_code':
        return <BarChart3 size={12} />;
      case 'plotly_data':
        return <BarChart3 size={12} />;
      default:
        return <FileText size={12} />;
    }
  };

  const getLabel = () => {
    switch (reference.type) {
      case 'sql_code':
        return 'SQL Code';
      case 'sql_data':
        return 'Data';
      case 'plotly_code':
        return 'Chart Code';
      case 'plotly_data':
        return 'Chart Data';
      default:
        return 'Reference';
    }
  };

  const renderContent = (content: string) => {
    // Check if content is markdown table
    if (content.includes('|') && content.includes('---')) {
      const lines = content.trim().split('\n');
      const headerLine = lines.find(line => line.includes('|') && !line.includes('---'));
      const separatorIndex = lines.findIndex(line => line.includes('---'));
      
      if (headerLine && separatorIndex > -1) {
        const headers = headerLine.split('|').map(h => h.trim()).filter(h => h);
        const dataLines = lines.slice(separatorIndex + 1).filter(line => line.includes('|'));
        
        return (
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr>
                  {headers.map((header, i) => (
                    <th key={i} className="text-left px-2 py-1 font-medium text-text-secondary border-b border-border">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dataLines.map((line, i) => {
                  const cells = line.split('|').map(c => c.trim()).filter(c => c);
                  return (
                    <tr key={i}>
                      {cells.map((cell, j) => (
                        <td key={j} className="px-2 py-1 text-text-main border-b border-border/20">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      }
    }
    
    // Default: render as code
    return (
      <pre className="text-xs whitespace-pre-wrap break-words text-text-main">
        {content}
      </pre>
    );
  };

  const handleToggle = async () => {
    if (!isOpen && !referenceData) {
      setIsLoading(true);
      try {
        const data = await referenceService.getById(reference.reference_id);
        setReferenceData(data);
      } catch (error) {
        console.error('Failed to load reference:', error);
      } finally {
        setIsLoading(false);
      }
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={handleToggle}
        className="inline-flex items-center gap-1.5 px-2 py-1 text-xs bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-md transition-colors cursor-pointer"
      >
        {getIcon()}
        {getLabel()}
        <ChevronDown size={10} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-80 bg-bg-surface border border-border rounded-lg shadow-lg z-50">
          <div className="flex items-center justify-between p-3 border-b border-border">
            <h3 className="font-medium text-sm text-text-main">{getLabel()}</h3>
            <button onClick={() => setIsOpen(false)} className="text-text-secondary hover:text-text-main transition-colors">
              <X size={14} />
            </button>
          </div>
          <div className="p-3 max-h-60 overflow-y-auto">
            {isLoading ? (
              <div className="text-xs text-text-secondary">Loading...</div>
            ) : referenceData ? (
              renderContent(referenceData.content)
            ) : (
              <div className="text-xs text-text-secondary">No data available</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};