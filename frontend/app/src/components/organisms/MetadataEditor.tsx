'use client';

import React, { useState } from 'react';
import { Database, Edit2, Save, X } from 'lucide-react';
import { MetadataRequest } from '@/types';
import { metadataService } from '@/src/services/metadata';

interface MetadataEditorProps {
  sourceId: string;
  metadata: MetadataRequest;
  onUpdate?: (metadata: MetadataRequest) => void;
}

export const MetadataEditor: React.FC<MetadataEditorProps> = ({ 
  sourceId, 
  metadata, 
  onUpdate 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
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

  const handleSave = async () => {
    try {
      await metadataService.update({
        metadata: {
          ...metadata.metadata,
          table_name: formData.table_name,
          description: formData.description
        },
        fields: formData.fields.map((field, index) => ({
          ...metadata.fields[index],
          field_name: field.field_name,
          data_type: field.data_type,
          input_type: field.input_type,
          description: field.description,
          sample_values: field.sample_values
        }))
      });
      setIsEditing(false);
      if (onUpdate) {
        const updatedMetadata = await metadataService.getBySource(sourceId);
        onUpdate(updatedMetadata);
      }
    } catch (error) {
      console.error('Failed to update metadata:', error);
    }
  };

  if (!isEditing) {
    return (
      <div className="space-y-6">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Database size={20} className="text-blue-600" />
              <h3 className="text-lg font-semibold text-blue-800">Table Metadata</h3>
            </div>
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              <Edit2 size={14} />
              Edit
            </button>
          </div>
          <div className="space-y-2">
            <div>
              <span className="font-medium text-blue-700">Table Name:</span>
              <span className="ml-2">{metadata.metadata.table_name}</span>
            </div>
            <div>
              <span className="font-medium text-blue-700">Description:</span>
              <span className="ml-2">{metadata.metadata.description || 'No description'}</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg border">
          <h4 className="text-lg font-semibold mb-4">Field Metadata ({metadata.fields.length} fields)</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-medium">Field Name</th>
                  <th className="text-left p-2 font-medium">Data Type</th>
                  <th className="text-left p-2 font-medium">Input Type</th>
                  <th className="text-left p-2 font-medium">Description</th>
                  <th className="text-left p-2 font-medium">Sample Values</th>
                </tr>
              </thead>
              <tbody>
                {metadata.fields.map((field) => (
                  <tr key={field.field_id} className="border-b hover:bg-white">
                    <td className="p-2 font-mono font-medium">{field.field_name}</td>
                    <td className="p-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {field.data_type}
                      </span>
                    </td>
                    <td className="p-2">
                      <span className={`px-2 py-1 text-xs rounded ${
                        field.input_type === 'id' ? 'bg-purple-100 text-purple-800' :
                        field.input_type === 'reject' ? 'bg-red-100 text-red-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {field.input_type}
                      </span>
                    </td>
                    <td className="p-2">{field.description || '-'}</td>
                    <td className="p-2 text-xs text-gray-600">
                      {field.sample_values?.slice(0, 3).join(', ') || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-4">Edit Table Metadata</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Table Name</label>
            <input
              type="text"
              value={formData.table_name}
              onChange={(e) => setFormData({...formData, table_name: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg border">
        <h4 className="text-lg font-semibold mb-4">Edit Field Metadata</h4>
        <div className="space-y-3">
          {formData.fields.map((field, index) => (
            <div key={index} className="p-3 bg-white border rounded">
              <div className="grid grid-cols-3 gap-2 mb-2">
                <input
                  placeholder="Field Name"
                  value={field.field_name}
                  onChange={(e) => {
                    const newFields = [...formData.fields];
                    newFields[index].field_name = e.target.value;
                    setFormData({...formData, fields: newFields});
                  }}
                  className="p-2 border rounded"
                />
                <select
                  value={field.data_type}
                  onChange={(e) => {
                    const newFields = [...formData.fields];
                    newFields[index].data_type = e.target.value;
                    setFormData({...formData, fields: newFields});
                  }}
                  className="p-2 border rounded [&>option]:bg-white [&>option]:text-gray-900"
                >
                  <option value="STRING">STRING</option>
                  <option value="DOUBLE">DOUBLE</option>
                  <option value="DATE">DATE</option>
                  <option value="INTEGER">INTEGER</option>
                </select>
                <select
                  value={field.input_type}
                  onChange={(e) => {
                    const newFields = [...formData.fields];
                    newFields[index].input_type = e.target.value as 'id' | 'input' | 'reject';
                    setFormData({...formData, fields: newFields});
                  }}
                  className="p-2 border rounded [&>option]:bg-white [&>option]:text-gray-900"
                >
                  <option value="input">input</option>
                  <option value="id">id</option>
                  <option value="reject">reject</option>
                </select>
              </div>
              <textarea
                placeholder="Description"
                value={field.description}
                onChange={(e) => {
                  const newFields = [...formData.fields];
                  newFields[index].description = e.target.value;
                  setFormData({...formData, fields: newFields});
                }}
                className="w-full p-2 border rounded"
                rows={2}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button 
          onClick={handleSave}
          className="flex items-center gap-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          <Save size={16} />
          Save
        </button>
        <button 
          onClick={() => setIsEditing(false)}
          className="flex items-center gap-1 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          <X size={16} />
          Cancel
        </button>
      </div>
    </div>
  );
};