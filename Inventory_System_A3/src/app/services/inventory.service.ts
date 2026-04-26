/**
 * Core inventory management service
 * Handles backend API communication, all inventory-related HTTP requests, and frontend data processing
 * Registered as a root-level singleton service shared across the entire application
 */
import { Injectable } from '@angular/core'; // Angular dependency injection decorator
import { HttpClient } from '@angular/common/http'; // Angular HTTP client
import { Observable } from 'rxjs'; // Reactive programming core type
import { InventoryItem, InventoryRequest } from '../models/inventory.model'; // Inventory data models

/**
 * Backend API base URL
 * Root URL for all inventory requests
 */
const API_URL = 'https://prog2005.it.scu.edu.au/ArtGalley';

/**
 * Inventory service decorator - registered as root-level singleton
 */
@Injectable({ providedIn: 'root' })
export class InventoryService {
  /**
   * Constructor - inject HTTP client dependency
   * @param http HttpClient instance for making HTTP requests
   */
  constructor(private http: HttpClient) {}

  /**
   * Retrieve complete inventory item list
   * HTTP Method: GET
   * API Endpoint: /
   * @returns Observable<InventoryItem[]> - Observable array of inventory items
   */
  getAll(): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(API_URL);
  }

  /**
   * Fetch single inventory record by exact item name
   * Note: Name must be URL-encoded to prevent errors from special characters
   * HTTP Method: GET
   * API Endpoint: /name
   * @param name Full item name (must be non-empty on frontend)
   * @returns Observable<InventoryItem> - Observable of single inventory item
   */
  getByName(name: string): Observable<InventoryItem> {
    return this.http.get<InventoryItem>(`${API_URL}/${encodeURIComponent(name)}`);
  }

  /**
   * Create new inventory item
   * HTTP Method: POST
   * API Endpoint: /
   * @param data Request body for new item
   * @returns Observable<InventoryItem> - Complete item object after creation (includes backend-generated item_id)
   */
  create(data: InventoryRequest): Observable<InventoryItem> {
    return this.http.post<InventoryItem>(API_URL, data);
  }

  /**
   * Update inventory data by original item name
   * HTTP Method: PUT
   * API Endpoint: /name
   * @param name Original item name (used to locate resource for update)
   * @param data Updated item data
   * @returns Observable<InventoryItem> - Complete updated item object
   */
  update(name: string, data: InventoryRequest): Observable<InventoryItem> {
    return this.http.put<InventoryItem>(`${API_URL}/${encodeURIComponent(name)}`, data);
  }

  /**
   * Delete inventory item by name
   * HTTP Method: DELETE
   * API Endpoint: /name
   * @param name Name of item to delete
   * @returns Observable<any> - Delete operation response (typically empty or status code)
   */
  delete(name: string): Observable<any> {
    return this.http.delete(`${API_URL}/${encodeURIComponent(name)}`);
  }

  /**
   * Frontend validation for unique item name
   * Prevents duplicate name submissions to backend
   * @param items Full inventory item list (for comparison)
   * @param name Item name to validate
   * @param originalName Original name in edit mode (optional) - exclude self during edit
   * @returns boolean - true = unique name, false = name already exists
   */
  isNameUnique(items: InventoryItem[], name: string, originalName?: string): boolean {
    return !items.some(item => {
      // Check if editing the same item (exclude self from comparison in edit mode)
      const isSelf = originalName ? item.item_name === originalName : false;
      // Case-insensitive name comparison, excluding self
      return item.item_name.toLowerCase() === name.toLowerCase() && !isSelf;
    });
  }

  /**
   * Filter featured items list
   * Extract items marked as featured (featured_item=1) from full list
   * @param items Full inventory item list
   * @returns InventoryItem[] - Array of featured items
   */
  getFeaturedItems(items: InventoryItem[]): InventoryItem[] {
    return items.filter(item => item.featured_item === 1);
  }
}