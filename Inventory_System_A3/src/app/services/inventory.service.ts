import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InventoryItem, InventoryRequest } from '../models/inventory.model';

const API_URL = 'https://prog2005.it.scu.edu.au/ArtGalley';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(API_URL);
  }

  getByName(name: string): Observable<InventoryItem> {
    return this.http.get<InventoryItem>(`${API_URL}/${name}`);
  }

  create(data: InventoryRequest): Observable<any> {
    return this.http.post(API_URL, data);
  }

  update(name: string, data: InventoryRequest): Observable<any> {
    return this.http.put(`${API_URL}/${name}`, data);
  }

  delete(name: string): Observable<any> {
    return this.http.delete(`${API_URL}/${name}`);
  }

  isNameUnique(items: InventoryItem[], name: string): boolean {
    return !items.some(i => i.item_name.toLowerCase() === name.toLowerCase());
  }

  getFeatured(items: InventoryItem[]): InventoryItem[] {
    return items.filter(i => i.featured_item === 1);
  }
}