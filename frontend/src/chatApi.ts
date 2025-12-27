const CHAT_API_URL = 'http://localhost:8000';

class ChatApiClient {
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    const token = localStorage.getItem('auth_token');
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    return headers;
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const response = await fetch(`${CHAT_API_URL}${url}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  async get<T>(url: string): Promise<T> {
    const response = await fetch(`${CHAT_API_URL}${url}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  async patch<T>(url: string, data?: any): Promise<T> {
    const response = await fetch(`${CHAT_API_URL}${url}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  async getWithoutAuth<T>(url: string): Promise<T> {
    const response = await fetch(`${CHAT_API_URL}${url}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }
}

export const chatApi = new ChatApiClient();

// Agent API for LLM list (port 8002)
const AGENT_API_URL = 'http://localhost:8002';

class AgentApiClient {
  async get<T>(url: string): Promise<T> {
    const response = await fetch(`${AGENT_API_URL}${url}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }
}

export const agentApi = new AgentApiClient();