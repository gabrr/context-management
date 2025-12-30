export enum SalesIntent {
  PRODUCT_INFO = "PRODUCT_INFO",
  ORDER_TRACKING = "ORDER_TRACKING",
  ORDER_UPDATE = "ORDER_UPDATE",
  COMPANY_INFO = "COMPANY_INFO",
  SUPPORT = "SUPPORT",
  CHAT = "CHAT",
  UNKNOWN = "UNKNOWN",
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  stockStatus: "in_stock" | "low_stock" | "out_of_stock";
  tags?: string[];
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  status: "processing" | "shipped" | "delivered" | "delayed";
  eta: string;
  deliveryWindow?: string;
  address?: string;
  items: OrderItem[];
  notes?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  preferredContact?: "email" | "sms" | "phone";
}

export interface IntentResult {
  intent: SalesIntent;
  confidence: number;
  notes?: string;
}
