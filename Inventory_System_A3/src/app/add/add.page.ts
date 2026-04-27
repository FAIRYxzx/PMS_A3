import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Import Ionic standalone components
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonButton, IonIcon, IonToggle, IonCard, IonCardContent, IonBadge, IonText,IonButtons, IonFab, IonFabButton } from '@ionic/angular/standalone';
// Import Ionic alert and loading controllers
import { AlertController, LoadingController } from '@ionic/angular/standalone';
// Import inventory service
import { InventoryService } from '../services/inventory.service';
// Import inventory-related models
import { Category, InventoryItem, InventoryRequest, StockStatus } from '../models/inventory.model';
// Import Ionicons icon related utilities
import { addIcons } from 'ionicons';
import { helpCircleOutline, addCircleOutline, starOutline, arrowUpOutline } from 'ionicons/icons';

// Register required icons
addIcons({ helpCircleOutline, addCircleOutline });

/**
 * Add Inventory Item Page Component
 * Handles inventory item addition form, form validation, and submission logic
 * Also displays the current list of marked featured inventory items
 */
@Component({
  selector: 'app-add',
  templateUrl: 'add.page.html',
  styleUrls: ['add.page.scss'],
  standalone: true,
  // Import required modules and components
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonList, IonItem, IonLabel, IonInput,
    IonSelect, IonSelectOption, IonButton,
    IonIcon, IonToggle, IonCard, IonCardContent, IonBadge,
    IonText,
    IonFab,
    IonFabButton,
    IonButtons
],
  // Provide alert and loading controller services
  providers: [AlertController, LoadingController]
})
export class AddPage implements OnInit {
   @ViewChild(IonContent, { static: false }) content!: IonContent;

  public showScrollButton: boolean = false;

  onScroll(event: any) {
    const scrollTop = event.detail.scrollTop;
    this.showScrollButton = scrollTop > 300;
  }

  scrollToTop() {
    this.content.scrollToTop(500);
  }
  /** Form data model for new inventory item */
  newItem: InventoryRequest = {
    item_name: '',
    category: Category.Miscellaneous,
    quantity: 0,
    price: 0,
    supplier_name: '',
    stock_status: StockStatus.InStock,
    featured_item: 0,
    special_note: ''
  };
  /** Featured item toggle state (two-way binding) */
  isFeatured: boolean = false;
  /** Category enum list (for dropdown selection) */
  categories = Object.values(Category);
  /** Stock status enum list (for dropdown selection) */
  stockStatuses = Object.values(StockStatus);
  /** Featured inventory items list */
  featuredItems: InventoryItem[] = [];
  /** Loading state flag (controls button disable and loading popup) */
  isLoading: boolean = false;

  // Stock status color mapping
  statusColorMap: Record<StockStatus, string> = {
    [StockStatus.InStock]: 'success',    // In Stock - success color (green)
    [StockStatus.LowStock]: 'warning',   // Low Stock - warning color (yellow)
    [StockStatus.OutOfStock]: 'danger'   // Out of Stock - danger color (red)
  };

  /** Icon mapping object (used in template) */
  icons = {
    help: helpCircleOutline,    // Help icon
    add: addCircleOutline,      // Add icon
    star: starOutline,          // Star icon (empty state display)
    arrowUp: arrowUpOutline,
  };

  /**
   * Constructor injects dependency services
   * @param inventoryService Inventory service (handles data CRUD operations)
   * @param alertCtrl Alert controller (displays prompts and help information)
   * @param loadingCtrl Loading controller (displays in-operation loading status)
   */
  constructor(
    private inventoryService: InventoryService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) { }

  /**
   * Component initialization lifecycle hook
   * Loads featured inventory items list when page loads
   */
  ngOnInit() {
    this.loadFeaturedItems();
  }

  /**
   * Loads featured inventory items list
   * Gets all items from inventory service and filters featured items
   */
  async loadFeaturedItems() {
    try {
      // Get all inventory items, set to empty array if no data
      const allItems = await this.inventoryService.getAll().toPromise() || [];
      // Filter featured items
      this.featuredItems = this.inventoryService.getFeaturedItems(allItems);
    } catch (error) {
      // Catch load failure exception and print log
      console.error('Load featured items error:', error);
    }
  }

  /**
   * Handles featured item toggle change event
   * Converts toggle state to numeric value (1=featured, 0=not featured) and binds to form model
   */
  onFeaturedToggle() {
    this.newItem.featured_item = this.isFeatured ? 1 : 0;
  }

  /**
   * Handles add form submission logic
   * 1. Form validation → 2. Show loading state → 3. Validate item name uniqueness → 4. Submit addition → 5. Reset form/refresh list
   */
  async submitAddForm() {
    // Basic form validation: required fields not empty, quantity and price non-negative
    if (!this.newItem.item_name.trim() || this.newItem.quantity < 0 || this.newItem.price < 0 || !this.newItem.supplier_name.trim()) {
      this.showAlert('Invalid Input', 'Please fill all required fields, quantity and price cannot be negative.');
      return;
    }

    // Create and show loading popup
    const loading = await this.loadingCtrl.create({
      message: 'Adding item...',
      spinner: 'circles'
    });
    await loading.present();

    try {
      // Get all inventory items and validate item name uniqueness
      const allItems = await this.inventoryService.getAll().toPromise() || [];
      if (!this.inventoryService.isNameUnique(allItems, this.newItem.item_name)) {
        await loading.dismiss(); // Close loading popup
        this.showAlert('Duplicate Name', 'Item name already exists, please use a unique name.');
        return;
      }

      // Call service to add inventory item
      await this.inventoryService.create(this.newItem).toPromise();
      await loading.dismiss(); // Close loading popup
      // Show addition success prompt
      this.showAlert('Success', 'Inventory item added successfully!');
      // Reset form
      this.resetForm();
      // Reload featured items list
      this.loadFeaturedItems();

    } catch (error) {
      // Catch addition failure exception
      await loading.dismiss(); // Close loading popup
      this.showAlert('Error', 'Failed to add item, please try again.');
      console.error('Add item error:', error);
    } finally {
      // Reset loading state regardless of success or failure
      this.isLoading = false;
    }
  }

  /**
   * Resets form to initial state
   * Restores all form field default values and resets featured toggle state
   */
  resetForm() {
    this.newItem = {
      item_name: '',
      category: Category.Miscellaneous,
      quantity: 0,
      price: 0,
      supplier_name: '',
      stock_status: StockStatus.InStock,
      featured_item: 0,
      special_note: ''
    };
    this.isFeatured = false;
  }

  /**
   * Shows help popup
   * Explains operation guidelines and rules for adding inventory items
   */
  async showHelp() {
    const alert = await this.alertCtrl.create({
      header: 'Help - Add Item',
      message: `
        1. Fill all required fields to add a new inventory item\n
        2. Item name must be unique, cannot duplicate existing items\n
        3. Quantity and price must be non-negative numbers\n
        4. Toggle "Featured Item" to mark it as featured\n
        5. Special note is optional, can be left blank\n
      `,
      buttons: ['OK'],
      cssClass: 'custom-help-alert'
    });
    await alert.present();
  }

  /**
   * Private method: general alert display
   * @param header Alert title
   * @param message Alert content
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