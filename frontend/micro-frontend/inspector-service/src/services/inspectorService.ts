import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8082/api/inspector',
    headers: {
        'Content-Type': 'application/json',
    }
});

export const createItemRequest = async (data: any) => {
    try {
        const response = await apiClient.post('/item-requests', data);
        return response.data;
    } catch (error) {
        console.error('Error creating item request', error);
        throw error;
    }
};

export const getItemRequests = async () => {
    try {
        const response = await apiClient.get('/item-requests');
        return response.data;
    } catch (error) {
        console.error('Error fetching item requests', error);
        throw error;
    }
};

export const getItemRequestById = async (id: number) => {
    try {
        const response = await apiClient.get(`/item-requests/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching item request by id: ${id}`, error);
        throw error;
    }
};

export const createInspection = async (data: any) => {
    try {
        const response = await apiClient.post('/inspections', data);
        return response.data;
    } catch (error) {
        console.error('Error creating inspection', error);
        throw error;
    }
};

export const getInspections = async () => {
    try {
        const response = await apiClient.get('/inspections');
        return response.data;
    } catch (error) {
        console.error('Error fetching inspections', error);
        throw error;
    }
};

export const getInspectionById = async (id: number) => {
    try {
        const response = await apiClient.get(`/inspections/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching inspection by id: ${id}`, error);
        throw error;
    }
};

export const addInspectionItem = async (inspectionId: number, data: any) => {
    try {
        const response = await apiClient.post(`/inspections/${inspectionId}/items`, data);
        return response.data;
    } catch (error) {
        console.error('Error adding inspection item', error);
        throw error;
    }
};

export const updateInspectionItem = async (itemId: number, data: any) => {
    try {
        const response = await apiClient.put(`/inspection-items/${itemId}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating inspection item', error);
        throw error;
    }
};

export const removeInspectionItem = async (itemId: number) => {
    try {
        const response = await apiClient.delete(`/inspection-items/${itemId}`);
        return response.data;
    } catch (error) {
        console.error('Error removing inspection item', error);
        throw error;
    }
};

export const getAllInventoryItems = async () => {
    try {
        const response = await apiClient.get('/inventory');
        return response.data;
    } catch (error) {
        console.error('Error fetching inventory items', error);
        throw error;
    }
};

export const getInventoryItemById = async (id: number) => {
    try {
        const response = await apiClient.get(`/inventory/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching inventory item by id: ${id}`, error);
        throw error;
    }
};

export const getInventoryItemsByCategory = async (categoryId: number) => {
    try {
        const response = await apiClient.get(`/inventory/category/${categoryId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching inventory items by category: ${categoryId}`, error);
        throw error;
    }
};

export const getInventoryItemsBySupplier = async (supplierId: number) => {
    try {
        const response = await apiClient.get(`/inventory/supplier/${supplierId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching inventory items by supplier: ${supplierId}`, error);
        throw error;
    }
};

export const searchInventoryItems = async (searchTerm: string) => {
    try {
        const response = await apiClient.get(`/inventory/search?searchTerm=${encodeURIComponent(searchTerm)}`);
        return response.data;
    } catch (error) {
        console.error(`Error searching inventory items: ${searchTerm}`, error);
        throw error;
    }
};

export const getLowStockInventoryItems = async () => {
    try {
        const response = await apiClient.get('/inventory/low-stock');
        return response.data;
    } catch (error) {
        console.error('Error fetching low stock inventory items', error);
        throw error;
    }
};

export const getInventoryItemsByStatus = async (status: string) => {
    try {
        const response = await apiClient.get(`/inventory/status/${status}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching inventory items by status: ${status}`, error);
        throw error;
    }
};
