import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Import Ionic standalone components
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonInput,
  IonSelect, IonSelectOption, IonButton,
  IonIcon, IonToggle, IonSearchbar,
  IonCard, IonCardContent, IonBadge,
  IonGrid, IonRow, IonCol, IonModal,
  IonAccordion, IonAccordionGroup
} from '@ionic/angular/standalone';
// Import Ionic alert and loading controllers
import { AlertController, LoadingController } from '@ionic/angular/standalone';
// Import inventory service and models
import { InventoryService } from '../services/inventory.service';
import { Category, InventoryItem, InventoryRequest, StockStatus } from '../models/inventory.model';
// Import Ionic icons
import { addIcons } from 'ionicons';
import { helpCircleOutline, searchOutline, createOutline, trashOutline, closeOutline, folderOpenOutline } from 'ionicons/icons';

// Register used Ionic icons
addIcons({ helpCircleOutline, searchOutline, createOutline, trashOutline, closeOutline });

/**
 * Edit / Delete Item Page Component
 * Functionality: Display item list, filter items, edit item info, delete items (exclude Laptop)
 */
@Component({
  selector: 'app-edit-delete', // Component selector
  templateUrl: 'edit-delete.page.html', // Template file path
  styleUrls: ['edit-delete.page.scss'], // Style file path
  standalone: true, // Standalone component (Angular 14+)
  imports: [ // Required imported modules
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonList, IonItem, IonLabel, IonInput,
    IonSelect, IonSelectOption, IonButton,
    IonIcon, IonToggle, IonSearchbar,
    IonCard, IonCardContent, IonBadge,
    IonGrid, IonRow, IonCol, IonModal,
    IonAccordion, IonAccordionGroup
  ],
  providers: [AlertController, LoadingController] // Inject modal and loading services
})
export class EditDeletePage {
  // Filter condition variables
  searchName: string = ''; // Search keyword for item name
  selectedCategory: string = ''; // Selected category filter
  selectedStockStatus: string = ''; // Selected stock status filter
  priceMin: number = 0; // Minimum price filter
  priceMax: number | undefined = undefined; // Maximum price filter (optional)
  showFeaturedOnly: boolean = false; // Show featured items only flag
  
  // Item data variables
  allItems: InventoryItem[] = []; // Full item list
  filteredItems: InventoryItem[] = []; // Filtered item list
  
  // Modal related variables
  isModalOpen: boolean = false; // Edit modal open state
  selectedItem: InventoryItem | null = null; // Currently selected item
  editItem: InventoryRequest = { // Form binding object for editing
    item_name: '',
    category: Category.Miscellaneous,
    quantity: 0,
    price: 0,
    supplier_name: '',
    stock_status: StockStatus.InStock,
    featured_item: 0,
    special_note: ''
  };
  isFeatured: boolean = false; // Featured item toggle state
  
  // Dropdown option sources
  categories = Object.values(Category); // Category list from enum
  stockStatuses = Object.values(StockStatus); // Stock status list from enum
  isLoading: boolean = false; // Loading state flag
  readonly FORBIDDEN_DELETE_ITEM = 'Laptop'; // Item name that cannot be deleted

  // Stock status to color mapping for badge styling
  statusColorMap: Record<StockStatus, string> = {
    [StockStatus.InStock]: 'success',    // In Stock - green
    [StockStatus.LowStock]: 'warning',   // Low Stock - yellow
    [StockStatus.OutOfStock]: 'danger'   // Out of Stock - red
  };

  // Centralized icon mapping
  icons = {
    help: helpCircleOutline,    // Help icon
    search: searchOutline,      // Search icon
    floder: folderOpenOutline,  // Empty state folder icon
    close: closeOutline,        // Close icon
    creat: createOutline,       // Update icon
    trash: trashOutline         // Delete icon
  };

  /**
   * Constructor: inject dependency services
   * @param inventoryService Service for inventory CRUD operations
   * @param alertCtrl Service for showing alert dialogs
   * @param loadingCtrl Service for showing loading indicators
   */
  constructor(
    private inventoryService: InventoryService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {}

  /**
   * Component initialization hook: load all items on page load
   */
  ngOnInit() {
    this.loadAllItems();
  }

  /**
   * Load all inventory items
   * Flow: show loading → fetch data → assign lists → handle errors → hide loading
   */
  async loadAllItems() {
    this.isLoading = true;
    try {
      // Fetch all items from service
      const data = await this.inventoryService.getAll().toPromise() || [];
      this.allItems = data;
      this.filteredItems = [...this.allItems]; // Initialize filtered list
    } catch (error) {
      console.error('Load items error:', error);
      this.showAlert('Error', 'Failed to load inventory data.');
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Validate minimum price input: ensure >= 0
   */
  validatePriceMin() {
    if (this.priceMin < 0) {
      this.showAlert('Invalid Input', 'Minimum price cannot be less than 0.');
      this.priceMin = 0;
    }
  }

  /**
   * Apply all filter conditions to item list
   * Filter logic: name → category → stock status → price → featured
   */
  applySearch() {
    // Validate min price first
    if (this.priceMin < 0) {
      this.showAlert('Invalid Input', 'Minimum price cannot be less than 0.');
      this.priceMin = 0;
      return;
    }

    // Create copy to avoid mutating original array
    let result = [...this.allItems];
    
    // 1. Filter by item name (case-insensitive)
    if (this.searchName.trim()) {
      const term = this.searchName.toLowerCase();
      result = result.filter(i => i.item_name.toLowerCase().includes(term));
    }
    
    // 2. Filter by category
    if (this.selectedCategory) {
      result = result.filter(i => i.category === this.selectedCategory);
    }
    
    // 3. Filter by stock status
    if (this.selectedStockStatus) {
      result = result.filter(i => i.stock_status === this.selectedStockStatus);
    }
    
    // 4. Filter by price range
    result = result.filter(i => {
      const matchMin = i.price >= this.priceMin;
      const matchMax = this.priceMax !== undefined ? i.price <= this.priceMax : true;
      return matchMin && matchMax;
    });

    // 5. Filter by featured items
    if (this.showFeaturedOnly) {
      result = result.filter(i => i.featured_item === 1);
    }
    
    // Update filtered list
    this.filteredItems = result;
  }

  /**
   * Open edit item modal
   * @param item Selected item object
   */
  openItemModal(item: InventoryItem) {
    this.selectedItem = item;
    this.editItem = { ...item }; // Copy data to avoid direct mutation
    this.isFeatured = item.featured_item === 1;
    this.isModalOpen = true;
  }

  /**
   * Close edit modal
   */
  closeModal() {
    this.isModalOpen = false;
    this.selectedItem = null;
  }

  /**
   * Handle featured toggle change: sync to editItem
   */
  onFeaturedToggle() {
    this.editItem.featured_item = this.isFeatured ? 1 : 0;
  }

  /**
   * Submit item update request
   * Flow: validate → show loading → check unique name → call update → show result → refresh
   */
  async submitUpdate() {
    if (!this.selectedItem) return;

    // Validate required fields and non-negative values
    if (!this.editItem.item_name.trim() || this.editItem.quantity < 0 || this.editItem.price < 0 || !this.editItem.supplier_name.trim()) {
      this.showAlert('Invalid Input', 'Please fill all required fields, quantity and price cannot be negative.');
      return;
    }

    const originalName = this.selectedItem.item_name;
    const loading = await this.loadingCtrl.create({
      message: 'Updating item...',
      spinner: 'circles'
    });
    await loading.present();

    try {
      // Check name uniqueness if name changed
      if (this.editItem.item_name !== originalName) {
        if (!this.inventoryService.isNameUnique(this.allItems, this.editItem.item_name, originalName)) {
          await loading.dismiss();
          this.showAlert('Duplicate Name', 'Item name already exists, please use a unique name.');
          return;
        }
      }

      // Call update service
      await this.inventoryService.update(originalName, this.editItem).toPromise();
      await loading.dismiss();
      this.showAlert('Success', 'Item updated successfully!');
      this.closeModal();
      this.loadAllItems();

    } catch (error) {
      await loading.dismiss();
      this.showAlert('Error', 'Failed to update item, please try again.');
      console.error('Update error:', error);
    }
  }

  /**
   * Show delete confirmation dialog
   * Flow: check forbidden item → show confirm dialog → execute delete if confirmed
   */
  async confirmDelete() {
    if (!this.selectedItem) return;

    // Prevent deleting Laptop
    if (this.selectedItem.item_name === this.FORBIDDEN_DELETE_ITEM) {
      this.showAlert('Forbidden', 'The "Laptop" item cannot be deleted.');
      return;
    }

    // Create confirmation dialog
    const alert = await this.alertCtrl.create({
      header: 'Confirm Delete',
      message: `Are you sure you want to delete "${this.selectedItem.item_name}"?`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { 
          text: 'Delete', 
          role: 'destructive',
          handler: () => this.executeDelete()
        }
      ]
    });
    await alert.present();
  }

  /**
   * Execute item deletion
   * Flow: show loading → call delete → show result → refresh list
   */
  private async executeDelete() {
    if (!this.selectedItem) return;

    const loading = await this.loadingCtrl.create({
      message: 'Deleting item...',
      spinner: 'circles'
    });
    await loading.present();

    try {
      // Call delete service by item name
      await this.inventoryService.delete(this.selectedItem.item_name).toPromise();
      await loading.dismiss();
      this.showAlert('Success', 'Item deleted successfully!');
      this.closeModal();
      this.loadAllItems();
    } catch (error) {
      await loading.dismiss();
      this.showAlert('Error', 'Failed to delete item, please try again.');
      console.error('Delete error:', error);
    }
  }

  /**
   * Reset all filter conditions to default
   */
  resetSearch() {
    this.searchName = '';
    this.selectedCategory = '';
    this.selectedStockStatus = '';
    this.priceMin = 0;
    this.priceMax = undefined;
    this.showFeaturedOnly = false;
    this.filteredItems = [...this.allItems];
  }

  /**
   * Show help dialog with usage instructions
   */
  async showHelp() {
    const alert = await this.alertCtrl.create({
      header: 'Help - Edit/Delete',
      message: `
        1. Tap "Advanced Filters" to expand more search options\n
        2. Filter by name, category, stock status, price range and featured items\n
        3. Minimum price cannot be less than 0\n
        4. Tap on any item card to open details\n
        5. Edit information in the popup and tap "Update"\n
        6. Tap "Delete" in the popup to remove the item\n
        7. Laptop item cannot be deleted
      `,
      buttons: ['OK'],
      cssClass: 'custom-help-alert'
    });
    await alert.present();
  }

  /**
   * Universal alert dialog helper
   * @param header Dialog title
   * @param message Dialog content
   */
  private async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}