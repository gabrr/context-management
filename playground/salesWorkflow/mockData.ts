import { Order, Product } from "./types";

export const MOCK_CATALOG: Product[] = [
  {
    id: "spc-001",
    name: "Smoked Paprika",
    description: "Deep smoky paprika, great for rubs and stews.",
    price: 8.5,
    currency: "USD",
    stockStatus: "in_stock",
    tags: ["paprika", "smoked", "rubs"],
  },
  {
    id: "spc-002",
    name: "Cumin Seeds",
    description: "Whole cumin seeds with warm, earthy aroma.",
    price: 6.25,
    currency: "USD",
    stockStatus: "in_stock",
    tags: ["cumin", "seeds"],
  },
  {
    id: "spc-003",
    name: "Turmeric Powder",
    description: "Bright turmeric powder, vibrant color and mild flavor.",
    price: 5.75,
    currency: "USD",
    stockStatus: "low_stock",
    tags: ["turmeric", "powder"],
  },
  {
    id: "spc-004",
    name: "Black Peppercorns",
    description: "Bold, freshly-dried peppercorns for grinders.",
    price: 7.2,
    currency: "USD",
    stockStatus: "in_stock",
    tags: ["pepper", "peppercorn"],
  },
  {
    id: "spc-005",
    name: "Cinnamon Sticks",
    description: "Aromatic cassia sticks, ideal for desserts and teas.",
    price: 9.1,
    currency: "USD",
    stockStatus: "out_of_stock",
    tags: ["cinnamon", "sticks"],
  },
];

export const MOCK_ORDERS: Order[] = [
  {
    id: "A123",
    customerName: "Pat Duarte",
    status: "shipped",
    eta: "2025-01-03",
    deliveryWindow: "2pm-6pm",
    address: "Rua das Flores, 123, Lisbon",
    items: [
      { productId: "spc-001", name: "Smoked Paprika", quantity: 2 },
      { productId: "spc-004", name: "Black Peppercorns", quantity: 1 },
    ],
    notes: "Left warehouse, tracking TDT-9981.",
  },
  {
    id: "B456",
    customerName: "Alex Silva",
    status: "processing",
    eta: "2025-01-05",
    deliveryWindow: "10am-2pm",
    address: "Av. Central, 456, Porto",
    items: [{ productId: "spc-003", name: "Turmeric Powder", quantity: 3 }],
  },
  {
    id: "C789",
    customerName: "Chris Lee",
    status: "delayed",
    eta: "2025-01-06",
    deliveryWindow: "4pm-8pm",
    address: "Praça Nova, 789, Coimbra",
    items: [{ productId: "spc-002", name: "Cumin Seeds", quantity: 4 }],
    notes: "Carrier delay due to weather; rerouted via hub north.",
  },
];

export const COMPANY_PROFILE = {
  name: "Toque da Terra",
  blurb:
    "Toque da Terra crafts spice blends and singles with careful sourcing and fresh roasting.",
  shippingPolicy:
    "Orders ship within 1-2 business days. Standard shipping 3-6 business days; express options where available.",
  returns:
    "If anything arrives damaged or incorrect, we replace or refund. Contact support within 14 days with order id and photos if damaged.",
  supportChannels: [
    "Email: support@toquedaterra.example",
    "SMS/WhatsApp: +351-900-000-000",
  ],
};
