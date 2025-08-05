import { Booking, CreateBookingRequest, UpdateBookingRequest, ApiResponse } from '../types';

const API_BASE_URL = 'http://localhost:8082/api/frontdesk';

class FrontdeskService {
  private async request<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getAllBookings(): Promise<Booking[]> {
    return this.request<Booking[]>('');
  }

  async getBookingById(id: number): Promise<Booking> {
    return this.request<Booking>(`/${id}`);
  }

  async createBooking(booking: CreateBookingRequest): Promise<ApiResponse<Booking>> {
    return this.request<ApiResponse<Booking>>('', {
      method: 'POST',
      body: JSON.stringify(booking),
    });
  }

  async updateBooking(id: number, booking: UpdateBookingRequest): Promise<ApiResponse<Booking>> {
    return this.request<ApiResponse<Booking>>(`/${id}`, {
      method: 'PUT',
      body: JSON.stringify(booking),
    });
  }

  async deleteBooking(id: number): Promise<ApiResponse<void>> {
    return this.request<ApiResponse<void>>(`/${id}`, {
      method: 'DELETE',
    });
  }

  async checkIn(id: number): Promise<ApiResponse<Booking>> {
    return this.request<ApiResponse<Booking>>(`/${id}/checkin`, {
      method: 'POST',
    });
  }

  async checkOut(id: number): Promise<ApiResponse<Booking>> {
    return this.request<ApiResponse<Booking>>(`/${id}/checkout`, {
      method: 'POST',
    });
  }
}

export const frontdeskService = new FrontdeskService();
