'use client';
import React, { useState, useEffect } from 'react';
import { Database } from 'lucide-react';
import { metadataService } from '@/lib/services/metadata';
import { MetadataResponse } from '@/types';

interface MetadataViewerProps {
  sourceId: string;
}

export const MetadataViewer: React.FC<MetadataViewerProps> = ({ sourceId }) => {
  const [metadata, setMetadata] = useState<MetadataResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const data = await metadataService.getBySource(sourceId);
        setMetadata(data);
      } catch (error) {
        console.error('Failed to fetch metadata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, [sourceId]);

  if (loading) return <div className="text-text-secondary">Loading metadata...</div>;
  if (!metadata) return null;

  return (
    <div className="mt-6 p-4 bg-bg-surface-2 rounded-lg border border-border">
      <div className="flex items-center gap-2 mb-4">
        <Database size={16} className="text-primary" />
        <h4 className="font-medium text-text-main">Data Schema</h4>
      </div>
      
      <div className="mb-3">
        <p className="text-sm text-text-secondary">Table: {metadata.metadata.table_name}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-2 text-text-main font-medium">Field Name</th>
              <th className="text-left p-2 text-text-main font-medium">Data Type</th>
              <th className="text-left p-2 text-text-main font-medium">Input Type</th>
              <th className="text-left p-2 text-text-main font-medium">Description</th>
              <th className="text-left p-2 text-text-main font-medium">Sample Values</th>
            </tr>
          </thead>
          <tbody>
            {metadata.fields.map((field) => (
              <tr key={field.field_id} className="border-b border-border/50 hover:bg-bg-element/50">
                <td className="p-2 font-mono text-text-main">{field.field_name}</td>
                <td className="p-2">
                  <span className="text-xs bg-bg-element px-2 py-1 rounded text-text-secondary">
                    {field.data_type}
                  </span>
                </td>
                <td className="p-2">
                  <span className={`text-xs px-2 py-1 rounded ${
                    field.input_type === 'id' ? 'bg-primary/20 text-primary' :
                    field.input_type === 'reject' ? 'bg-red-500/20 text-red-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {field.input_type}
                  </span>
                </td>
                <td className="p-2 text-text-secondary">
                  {field.description || '-'}
                </td>
                <td className="p-2 text-text-secondary">
                  {field.sample_values && field.sample_values.length > 0 
                    ? field.sample_values.slice(0, 3).join(', ')
                    : '-'
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};