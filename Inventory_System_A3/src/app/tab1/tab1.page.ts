import { Component, OnInit } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonSearchbar, IonList, IonItem, IonLabel,
  IonButton, IonIcon, IonSelect, IonSelectOption,
  IonCard, IonCardContent, IonChip
} from '@ionic/angular/standalone';
import { AlertController } from '@ionic/angular';
import { InventoryService } from '../services/inventory.service';
import { InventoryItem, Category } from '../models/inventory.model';
import { helpCircleOutline, filterOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

addIcons({ helpCircleOutline, filterOutline });

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonSearchbar, IonList, IonItem, IonLabel,
    IonButton, IonIcon, IonSelect, IonSelectOption,
    IonCard, IonCardContent, IonChip,
    CommonModule, FormsModule
  ],
})
export class Tab1Page implements OnInit {
  items: InventoryItem[] = [];
  filteredItems: InventoryItem[] = [];
  searchTerm = '';
  selectedCategory: string = '';
  sortByPopularity: boolean = false;

  categories = Object.values(Category);

  constructor(
    private inventoryService: InventoryService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.loadAllItems();
  }

  // Load all items
  loadAllItems() {
    this.inventoryService.getAll().subscribe({
      next: (data: InventoryItem[]) => {
        this.items = data;
        this.applyFilters();
      },
      error: (err) => {
        console.error('Failed to load items', err);
      }
    });
  }

  // Filter + search + sort
  applyFilters() {
    let result = [...this.items];

    // Search filter
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(i => i.item_name.toLowerCase().includes(term));
    }

    // Category filter
    if (this.selectedCategory) {
      result = result.filter(i => i.category === this.selectedCategory);
    }

    // Sort by popularity (featured items first)
    if (this.sortByPopularity) {
      result.sort((a, b) => b.featured_item - a.featured_item);
    }

    this.filteredItems = result;
  }

  // Toggle popularity sort
  togglePopularitySort() {
    this.sortByPopularity = !this.sortByPopularity;
    this.applyFilters();
  }

  // Show help info
  async showHelp() {
    const alert = await this.alertController.create({
      header: 'Help',
      message: '1. View all items\n2. Search by name\n3. Filter by category\n4. Sort by popularity',
      buttons: ['OK']
    });
    await alert.present();
  }
}