import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonInput,
  IonSelect, IonSelectOption, IonButton,
  IonIcon, IonToggle, IonCard, IonCardContent, IonBadge
} from '@ionic/angular/standalone';
import { AlertController, LoadingController } from '@ionic/angular/standalone';
import { InventoryService } from '../services/inventory.service';
import { Category, InventoryItem, InventoryRequest, StockStatus } from '../models/inventory.model';
import { addIcons } from 'ionicons';
import { helpCircleOutline, addCircleOutline, starOutline } from 'ionicons/icons';

addIcons({ helpCircleOutline, addCircleOutline });

@Component({
  selector: 'app-add',
  templateUrl: 'add.page.html',
  styleUrls: ['add.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonList, IonItem, IonLabel, IonInput,
    IonSelect, IonSelectOption, IonButton,
    IonIcon, IonToggle, IonCard, IonCardContent, IonBadge
  ],
  providers: [AlertController, LoadingController]
})
export class AddPage implements OnInit {
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
  isFeatured: boolean = false;
  categories = Object.values(Category);
  stockStatuses = Object.values(StockStatus);
  featuredItems: InventoryItem[] = [];
  isLoading: boolean = false;

  // 库存状态颜色映射
  statusColorMap: Record<StockStatus, string> = {
    [StockStatus.InStock]: 'success',
    [StockStatus.LowStock]: 'warning',
    [StockStatus.OutOfStock]: 'danger'
  };

  icons = {
      help: helpCircleOutline,
      add: addCircleOutline,
      star: starOutline,
    };

  constructor(
    private inventoryService: InventoryService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.loadFeaturedItems();
  }

  async loadFeaturedItems() {
    try {
      const allItems = await this.inventoryService.getAll().toPromise() || [];
      this.featuredItems = this.inventoryService.getFeaturedItems(allItems);
    } catch (error) {
      console.error('Load featured items error:', error);
    }
  }

  onFeaturedToggle() {
    this.newItem.featured_item = this.isFeatured ? 1 : 0;
  }

  async submitAddForm() {
    if (!this.newItem.item_name.trim() || this.newItem.quantity < 0 || this.newItem.price < 0 || !this.newItem.supplier_name.trim()) {
      this.showAlert('Invalid Input', 'Please fill all required fields, quantity and price cannot be negative.');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Adding item...',
      spinner: 'circles'
    });
    await loading.present();

    try {
      const allItems = await this.inventoryService.getAll().toPromise() || [];
      if (!this.inventoryService.isNameUnique(allItems, this.newItem.item_name)) {
        await loading.dismiss();
        this.showAlert('Duplicate Name', 'Item name already exists, please use a unique name.');
        return;
      }

      await this.inventoryService.create(this.newItem).toPromise();
      await loading.dismiss();
      this.showAlert('Success', 'Inventory item added successfully!');
      this.resetForm();
      this.loadFeaturedItems();

    } catch (error) {
      await loading.dismiss();
      this.showAlert('Error', 'Failed to add item, please try again.');
      console.error('Add item error:', error);
    } finally {
      this.isLoading = false;
    }
  }

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

  private async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}