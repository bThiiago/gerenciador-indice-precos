export interface Category {
  id: string;
  name: string;
  barcode: boolean;
}

export interface Market {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
  market: Market;
  created_at: date;
}

export interface User {
  id: string;
  name: string;
  password: string;
  level: number;
}
