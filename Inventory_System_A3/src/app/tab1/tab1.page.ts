import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonList, IonItem, IonLabel, IonButton, IonIcon } from '@ionic/angular/standalone';
import { AlertController } from '@ionic/angular';
import { InventoryService } from '../services/inventory.service';
import { InventoryItem } from '../models/inventory.model';
import { helpCircleOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

addIcons({ helpCircleOutline });

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSearchbar,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonIcon,
    CommonModule,
    FormsModule
  ],
})
export class Tab1Page implements OnInit {
  items: InventoryItem[] = [];
  searchTerm = '';

  constructor(
    private inventoryService: InventoryService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.loadAllItems();
  }

  // Load all inventory items
  loadAllItems() {
    this.inventoryService.getAll().subscribe({
      next: (data: InventoryItem[]) => {
        this.items = data;
      },
      error: (err: any) => {
        console.error('Failed to load items', err);
      }
    });
  }

  // Search item by name
  search() {
    if (this.searchTerm.trim()) {
      this.inventoryService.getByName(this.searchTerm).subscribe({
        next: (item: InventoryItem) => {
          this.items = [item];
        },
        error: async () => {
          const alert = await this.alertController.create({
            header: 'Not Found',
            message: 'Item not found',
            buttons: ['OK']
          });
          await alert.present();
        }
      });
    } else {
      this.loadAllItems();
    }
  }

  // Show help information
  async showHelp() {
    const alert = await this.alertController.create({
      header: 'Help',
      message: '1. View all inventory\n2. Search items by name',
      buttons: ['OK']
    });
    await alert.present();
  }
}