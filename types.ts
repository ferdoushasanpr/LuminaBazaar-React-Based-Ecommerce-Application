
export interface Product {
  _id: string;
  name: string;
  desc: string;
  price: number;
  quantity: number;
  category: any;
  availability?: boolean;
}

export interface Category {
  _id: string;
  name: string;
}

export interface CartItem {
  _id: string;
  product: Product;
  price: number;
  quantity: number;
}
