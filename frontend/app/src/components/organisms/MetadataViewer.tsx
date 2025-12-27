'use client';
import React, { useState, useEffect } from 'react';
import { Database, Edit2, Save, X } from 'lucide-react';
import { metadataService } from '@/src/services/metadata';
import { MetadataResponse } from '@/types';

interface MetadataViewerProps {
  sourceId: string;
}

export const MetadataViewer: React.FC<MetadataViewerProps> = ({ sourceId }) => {
  const [metadata, setMetadata] = useState<MetadataResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const data = await metadataService.getBySource(sourceId);
        setMetadata(data);
        setEditData({
          table_name: data.metadata.table_name,
          description: data.metadata.description,
          fields: data.fields.map(field => ({
            field_name: field.field_name,
            data_type: field.data_type,
            input_type: field.input_type,
            description: field.description,
            sample_values: field.sample_values || []
          }))
        });
      } catch (error) {
        console.error('Failed to fetch metadata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, [sourceId]);

  const handleSave = async () => {
    try {
      await metadataService.update({
        metadata: {
          ...metadata!.metadata,
          table_name: editData.table_name,
          description: editData.description
        },
        fields: editData.fields.map((field: any, index: number) => ({
          ...metadata!.fields[index],
          field_name: field.field_name,
          data_type: field.data_type,
          input_type: field.input_type,
          description: field.description,
          sample_values: field.sample_values
        }))
      });
      
      const updatedData = await metadataService.getBySource(sourceId);
      setMetadata(updatedData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update metadata:', error);
    }
  };

  const handleCancel = () => {
    if (metadata) {
      setEditData({
        table_name: metadata.metadata.table_name,
        description: metadata.metadata.description,
        fields: metadata.fields.map(field => ({
          field_name: field.field_name,
          data_type: field.data_type,
          input_type: field.input_type,
          description: field.description,
          sample_values: field.sample_values || []
        }))
      });
    }
    setIsEditing(false);
  };

  if (loading) return <div className="text-text-secondary">Loading metadata...</div>;
  if (!metadata || !editData) return null;

  return (
    <div className="mt-6 p-4 bg-bg-surface-2 rounded-lg border border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Database size={16} className="text-primary" />
          <h4 className="font-medium text-text-main">Data Schema</h4>
        </div>
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1 px-3 py-1 bg-primary text-white rounded hover:bg-primary/80 transition-colors"
          >
            <Edit2 size={14} />
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button 
              onClick={handleSave}
              className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              <Save size={14} />
              Save
            </button>
            <button 
              onClick={handleCancel}
              className="flex items-center gap-1 px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              <X size={14} />
              Cancel
            </button>
          </div>
        )}
      </div>
      
      {/* Table Metadata */}
      <div className="mb-4 p-3 bg-bg-element rounded-lg border border-border/50">
        <h5 className="font-medium text-text-main mb-2">Table Information</h5>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-text-secondary min-w-[80px]">Name:</span>
            {isEditing ? (
              <input
                type="text"
                value={editData.table_name}
                onChange={(e) => setEditData({...editData, table_name: e.target.value})}
                className="flex-1 px-2 py-1 text-sm border border-border rounded bg-bg-surface-1 text-text-main focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            ) : (
              <span className="text-sm text-text-main">{metadata.metadata.table_name}</span>
            )}
          </div>
          <div className="flex items-start gap-2">
            <span className="text-sm font-medium text-text-secondary min-w-[80px]">Description:</span>
            {isEditing ? (
              <textarea
                value={editData.description}
                onChange={(e) => setEditData({...editData, description: e.target.value})}
                className="flex-1 px-2 py-1 text-sm border border-border rounded bg-bg-surface-1 text-text-main focus:outline-none focus:ring-2 focus:ring-primary/50"
                rows={2}
              />
            ) : (
              <span className="text-sm text-text-main">
                {metadata.metadata.description || "No description provided"}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Field Metadata */}
      <div className="mb-2">
        <h5 className="font-medium text-text-main">Fields ({metadata.fields.length})</h5>
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
            {(isEditing ? editData.fields : metadata.fields).map((field: any, index: number) => (
              <tr key={isEditing ? index : field.field_id} className="border-b border-border/50 hover:bg-bg-element/50">
                <td className="p-2">
                  {isEditing ? (
                    <input
                      type="text"
                      value={field.field_name}
                      onChange={(e) => {
                        const newFields = [...editData.fields];
                        newFields[index].field_name = e.target.value;
                        setEditData({...editData, fields: newFields});
                      }}
                      className="w-full px-2 py-1 text-sm border border-border rounded bg-bg-surface-1 text-text-main font-mono focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  ) : (
                    <span className="font-mono text-text-main">{field.field_name}</span>
                  )}
                </td>
                <td className="p-2">
                  {isEditing ? (
                    <select
                      value={field.data_type}
                      onChange={(e) => {
                        const newFields = [...editData.fields];
                        newFields[index].data_type = e.target.value;
                        setEditData({...editData, fields: newFields});
                      }}
                      className="w-full px-2 py-1 text-xs border border-border rounded bg-bg-surface-1 text-text-main focus:outline-none focus:ring-2 focus:ring-primary/50 [&>option]:bg-bg-surface-1 [&>option]:text-text-main"
                    >
                      <option value="STRING">STRING</option>
                      <option value="DOUBLE">DOUBLE</option>
                      <option value="DATE">DATE</option>
                      <option value="INTEGER">INTEGER</option>
                    </select>
                  ) : (
                    <span className="text-xs bg-bg-element px-2 py-1 rounded text-text-secondary">
                      {field.data_type}
                    </span>
                  )}
                </td>
                <td className="p-2">
                  {isEditing ? (
                    <select
                      value={field.input_type}
                      onChange={(e) => {
                        const newFields = [...editData.fields];
                        newFields[index].input_type = e.target.value as 'id' | 'input' | 'reject';
                        setEditData({...editData, fields: newFields});
                      }}
                      className="w-full px-2 py-1 text-xs border border-border rounded bg-bg-surface-1 text-text-main focus:outline-none focus:ring-2 focus:ring-primary/50 [&>option]:bg-bg-surface-1 [&>option]:text-text-main"
                    >
                      <option value="input">input</option>
                      <option value="id">id</option>
                      <option value="reject">reject</option>
                    </select>
                  ) : (
                    <span className={`text-xs px-2 py-1 rounded ${
                      field.input_type === 'id' ? 'bg-primary/20 text-primary' :
                      field.input_type === 'reject' ? 'bg-red-500/20 text-red-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {field.input_type}
                    </span>
                  )}
                </td>
                <td className="p-2">
                  {isEditing ? (
                    <input
                      type="text"
                      value={field.description || ''}
                      onChange={(e) => {
                        const newFields = [...editData.fields];
                        newFields[index].description = e.target.value;
                        setEditData({...editData, fields: newFields});
                      }}
                      className="w-full px-2 py-1 text-sm border border-border rounded bg-bg-surface-1 text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Enter description"
                    />
                  ) : (
                    <span className="text-text-secondary">
                      {field.description || '-'}
                    </span>
                  )}
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