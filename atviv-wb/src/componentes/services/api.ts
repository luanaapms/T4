import axios from 'axios';
import { Cliente } from '../models/types';

const api = axios.create({
    baseURL: 'http://localhost:32832',
    timeout: 10000,
    validateStatus: (status) => (status >= 200 && status < 300) || status === 302
});

api.interceptors.response.use(
    (response) => {
        if (response.status === 302 && response.data) {
            return {
                ...response,
                status: 200,
                statusText: 'OK',
                data: response.data
            };
        }
        return response;
    },
    (error) => {
        let errorMessage = 'Erro na requisição';

        if (error.response) {
            errorMessage = `Erro ${error.response.status}: ${error.response.statusText || 'Erro no servidor'}`;
            if (error.response.data) {
                errorMessage += ` - ${JSON.stringify(error.response.data)}`;
            }
        } else if (error.request) {
            errorMessage = 'Sem resposta do servidor';
        }

        console.error('Erro API:', errorMessage);
        return Promise.reject(new Error(errorMessage));
    }
);

export const apiClientes = {
    listar: async (): Promise<Cliente[]> => {
        const response = await api.get('/clientes/');
        return response.data;
    },

    buscar: async (id: number): Promise<Cliente> => {
        const response = await api.get(`/cliente/${id}/`);
        return response.data;
    },

    cadastrar: async (cliente: Omit<Cliente, 'id'>): Promise<Cliente> => {
        const response = await api.post('/cliente/cadastrar/', cliente);
        return response.data;
    },

    atualizar: async (cliente: Cliente): Promise<Cliente> => {
        const response = await api.put('/cliente/atualizar', cliente);
        return response.data;
    },

    excluir: async (id: number): Promise<void> => {
        fetch('http://localhost:32832/cliente/excluir', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id})
        })
  }
};
