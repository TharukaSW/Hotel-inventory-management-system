export enum BookingStatus {
  RESERVED = 'RESERVED',
  CHECKED_IN = 'CHECKED_IN',
  CHECKED_OUT = 'CHECKED_OUT',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PARTIAL = 'PARTIAL',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED'
}

export interface Booking {
  id: number;
  guestName: string;
  guestEmail?: string;
  guestPhone?: string;
  roomNumber: string;
  roomType?: string;
  status: BookingStatus;
  checkInDate?: string;
  checkOutDate?: string;
  expectedCheckIn?: string;
  expectedCheckOut?: string;
  numberOfGuests?: number;
  specialRequests?: string;
  totalAmount?: number;
  paymentStatus?: PaymentStatus;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBookingRequest {
  guestName: string;
  guestEmail?: string;
  guestPhone?: string;
  roomNumber: string;
  roomType?: string;
  status: BookingStatus;
  checkInDate?: string;
  checkOutDate?: string;
  expectedCheckIn?: string;
  expectedCheckOut?: string;
  numberOfGuests?: number;
  specialRequests?: string;
  totalAmount?: number;
  paymentStatus?: PaymentStatus;
  createdBy?: string;
}

export interface UpdateBookingRequest {
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  roomNumber?: string;
  roomType?: string;
  status?: BookingStatus;
  checkInDate?: string;
  checkOutDate?: string;
  expectedCheckIn?: string;
  expectedCheckOut?: string;
  numberOfGuests?: number;
  specialRequests?: string;
  totalAmount?: number;
  paymentStatus?: PaymentStatus;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}
