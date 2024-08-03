export interface Category {
  id: string;
  name: string;
  barcode: boolean;
  color: number;
}

export interface City {
  id: string;
  name: string;
  state: string;
}

export interface Market {
  id: string;
  name: string;
  city: City;
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  barcode: Barcode[];
  created_at: date;
}

export interface Research {
  id: string;
  market: Market;
  product: Product;
  price: number;
  created_at: date;
}

export interface User {
  id: string;
  name: string;
  password: string;
  level: number;
}

export interface Barcode {
  id: string;
  code: string;
  product: Product;
}
