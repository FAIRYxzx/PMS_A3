export enum Category {
  Electronics = 'Electronics',
  Furniture = 'Furniture',
  Clothing = 'Clothing',
  Tools = 'Tools',
  Miscellaneous = 'Miscellaneous'
}

export enum StockStatus {
  InStock = 'In Stock',
  LowStock = 'Low Stock',
  OutOfStock = 'Out of Stock'
}

export interface InventoryItem {
  item_id: number;
  item_name: string;
  category: Category;
  quantity: number;
  price: number;
  supplier_name: string;
  stock_status: StockStatus;
  featured_item: 0 | 1;
  special_note?: string | null;
}

export interface InventoryRequest {
  item_name: string;
  category: Category;
  quantity: number;
  price: number;
  supplier_name: string;
  stock_status: StockStatus;
  featured_item?: 0 | 1;
  special_note?: string | null;
}