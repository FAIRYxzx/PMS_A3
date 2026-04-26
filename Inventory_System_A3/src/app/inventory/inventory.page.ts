// Import Angular core
import { Component, OnInit } from '@angular/core';
// Import Ionic standalone UI components
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonSearchbar, IonButton, IonIcon, IonSelect, IonSelectOption,
  IonCard, IonCardContent, IonLoading, IonBadge,
  IonGrid, IonRow, IonCol, IonItem, IonLabel, IonInput,
  IonAccordion, IonAccordionGroup, IonToggle
} from '@ionic/angular/standalone';
// Import Ionic modal and loading utilities
import { AlertController, LoadingController } from '@ionic/angular/standalone';
// Import inventory data service
import { InventoryService } from '../services/inventory.service';
// Import inventory data models
import { InventoryItem, Category, StockStatus } from '../models/inventory.model';
// Import required Ionic icons
import { helpCircleOutline, filterOutline, searchOutline, arrowUpOutline, arrowDownOutline, refreshOutline, folderOpenOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
// Import Angular common and form modules
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Register icons for global use
addIcons({ helpCircleOutline, filterOutline, searchOutline, arrowUpOutline, arrowDownOutline });

/**
 * Inventory List Page Component
 * Displays, searches, filters, and sorts inventory items
 */
@Component({
  selector: 'app-inventory',
  templateUrl: 'inventory.page.html',
  styleUrls: ['inventory.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonSearchbar, IonButton, IonIcon, IonSelect, IonSelectOption,
    IonCard, IonCardContent, IonLoading, IonBadge,
    IonGrid, IonRow, IonCol, IonItem, IonLabel, IonInput,
    IonAccordion, IonAccordionGroup, IonToggle,
    CommonModule, FormsModule
  ],
  providers: [AlertController, LoadingController]
})
export class InventoryPage implements OnInit {
  // Full unfiltered inventory list
  allItems: InventoryItem[] = [];
  // Filtered and sorted items displayed to user
  filteredItems: InventoryItem[] = [];
  
  // Search and filter variables
  searchName: string = '';
  selectedCategory: string = '';
  selectedStockStatus: string = '';
  priceMin: number = 0;
  priceMax: number | undefined = undefined;
  showFeaturedOnly: boolean = false;
  
  // Sorting configuration
  sortBy: 'price' | null = null;
  sortOrder: 'asc' | 'desc' = 'asc';
  
  // Dropdown options from enums
  categories = Object.values(Category);
  stockStatuses = Object.values(StockStatus);
  isLoading: boolean = false;
  
  // Stock status to Ionic color mapping
  statusColorMap: Record<StockStatus, string> = {
    [StockStatus.InStock]: 'success',
    [StockStatus.LowStock]: 'warning',
    [StockStatus.OutOfStock]: 'danger'
  };

  // Icon references for template binding
  icons = {
    help: helpCircleOutline,
    search: searchOutline,
    floder: folderOpenOutline,
    refresh: refreshOutline
  };

  /**
   * Constructor injects required services
   */
  constructor(
    private inventoryService: InventoryService,
    private alertController: AlertController,
    private loadingCtrl: LoadingController
  ) {}

  /**
   * Initialize component: load inventory data
   */
  ngOnInit() {
    this.loadAllItems();
  }

  /**
   * Load full inventory list with loading indicator
   */
  async loadAllItems() {
    this.isLoading = true;
    const loading = await this.loadingCtrl.create({
      message: 'Loading inventory...',
      spinner: 'circles'
    });
    await loading.present();

    this.inventoryService.getAll().subscribe({
      next: (data: InventoryItem[]) => {
        this.allItems = data;
        this.filteredItems = [...this.allItems];
        this.isLoading = false;
        loading.dismiss();
      },
      error: (err) => {
        console.error('Failed to load items', err);
        this.showAlert('Error', 'Failed to load inventory data. Please check your network and try again.');
        this.isLoading = false;
        loading.dismiss();
      }
    });
  }

  /**
   * Ensure minimum price is not negative
   */
  validatePriceMin() {
    if (this.priceMin < 0) {
      this.showAlert('Invalid Input', 'Minimum price cannot be less than 0.');
      this.priceMin = 0;
    }
  }

  /**
   * Apply all search, filter, and sort conditions
   */
  applySearchAndFilters() {
    if (this.priceMin < 0) {
      this.showAlert('Invalid Input', 'Minimum price cannot be less than 0.');
      this.priceMin = 0;
      return;
    }

    // Start with full list
    let result = [...this.allItems];
    
    // Filter by item name (case-insensitive)
    if (this.searchName.trim()) {
      const term = this.searchName.toLowerCase();
      result = result.filter(i => i.item_name.toLowerCase().includes(term));
    }
    
    // Filter by category
    if (this.selectedCategory) {
      result = result.filter(i => i.category === this.selectedCategory);
    }
    
    // Filter by stock status
    if (this.selectedStockStatus) {
      result = result.filter(i => i.stock_status === this.selectedStockStatus);
    }
    
    // Filter by price range
    result = result.filter(i => {
      const matchMin = i.price >= this.priceMin;
      const matchMax = this.priceMax !== undefined ? i.price <= this.priceMax : true;
      return matchMin && matchMax;
    });

    // Show only featured items if enabled
    if (this.showFeaturedOnly) {
      result = result.filter(i => i.featured_item === 1);
    }
    
    // Apply sorting if enabled
    if (this.sortBy) {
      result = this.applySorting(result);
    }
    
    // Update displayed list
    this.filteredItems = result;
  }

  /**
   * Sort items by configured field and order
   */
  applySorting(items: InventoryItem[]): InventoryItem[] {
    const sortedItems = [...items];
    if (this.sortBy === 'price') {
      sortedItems.sort((a, b) => {
        return this.sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
      });
    }
    return sortedItems;
  }

  /**
   * Toggle sort state: none → asc → desc → none
   */
  toggleSort(sortType: 'price') {
    if (this.sortBy !== sortType) {
      this.sortBy = sortType;
      this.sortOrder = 'asc';
    } else {
      if (this.sortOrder === 'asc') {
        this.sortOrder = 'desc';
      } else {
        this.sortBy = null;
        this.sortOrder = 'asc';
      }
    }
    this.applySearchAndFilters();
  }

  /**
   * Reset all filters and sorting to default state
   */
  resetAll() {
    this.searchName = '';
    this.selectedCategory = '';
    this.selectedStockStatus = '';
    this.priceMin = 0;
    this.priceMax = undefined;
    this.showFeaturedOnly = false;
    this.sortBy = null;
    this.sortOrder = 'asc';
    this.filteredItems = [...this.allItems];
  }

  /**
   * Show help dialog with usage instructions
   */
  async showHelp() {
    const alert = await this.alertController.create({
      header: 'Help - Inventory List',
      message: `
        1. Tap "Advanced Filters" to expand more search options\n
        2. Filter by name, category, stock status, price range and featured items\n
        3. Minimum price cannot be less than 0\n
        4. Sort by price\n
        5. Tap the same sort button again to toggle: Ascending -> Descending -> No Sort\n
        6. All item information including special note is displayed\n
      `,
      buttons: ['OK'],
      cssClass: 'custom-help-alert'
    });
    await alert.present();
  }

  /**
   * Show generic alert dialog
   */
  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}