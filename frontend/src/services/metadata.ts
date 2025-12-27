import { api } from '../api';
import { MetadataRequest } from '@/types';

export const metadataService = {
  getBySource: (sourceId: string): Promise<MetadataRequest> => 
    api.get(`/metadata/source/${sourceId}`),
    
  deleteBySource: (sourceId: string): Promise<{message: string}> => 
    api.delete(`/metadata/source/${sourceId}`),
    
  update: (data: MetadataRequest): Promise<{message: string}> => 
    api.put('/metadata', data),
};