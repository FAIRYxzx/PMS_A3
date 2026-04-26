// Import Angular core: Component for component definition, OnInit for lifecycle hook
import { Component, OnInit } from '@angular/core';
// Import Ionic standalone components: Import only required UI components to reduce bundle size
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon, IonCard, IonCardContent, IonList, IonItem, IonLabel, IonAccordion, IonText, IonAccordionGroup, IonCardTitle, IonCardHeader, IonButtons } from '@ionic/angular/standalone';
// Import Ionic AlertController: For creating and displaying help dialogs
import { AlertController } from '@ionic/angular/standalone';
// Import Ionicons icons: Import only used icons for performance optimization
import { helpCircleOutline } from 'ionicons/icons';
// Ionicons utility: Register imported icons for template usage
import { addIcons } from 'ionicons';
// Angular common module: Provides basic directives
import { CommonModule } from '@angular/common';

// Register help icon to enable usage in template via name="help-circle-outline"
addIcons({ helpCircleOutline });

/**
 * Privacy & Security Page Component
 * Selector: app-privacy-security (used in routing / other components)
 * Template: privacy-security.page.html (page structure)
 * Styles: privacy-security.page.scss (page styling)
 */
@Component({
  selector: 'app-privacy-security',
  templateUrl: './privacy-security.page.html',
  styleUrls: ['./privacy-security.page.scss'],
  imports: [IonAccordion, IonIcon, IonItem, IonLabel, IonText, IonAccordionGroup, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonContent, IonButton, IonToolbar, IonTitle, IonButtons, IonHeader],
})
export class PrivacySecurityPage implements OnInit {

  /**
   * Constructor: Inject AlertController service
   * @param alertController - Ionic alert controller for creating help dialogs
   */
  constructor(private alertController: AlertController) { }

  /**
   * Lifecycle hook: Executes on component initialization
   * No initialization logic for now, reserved for future extension
   */
  ngOnInit() {
  }

  /**
   * Show help dialog
   * Function: Explains page navigation and content to users
   * Type: Async function
   */
  async showHelp() {
    // Create help dialog instance
    const alert = await this.alertController.create({
      header: 'Help & Information',          // Dialog title
      subHeader: 'Privacy and Security Page',// Dialog subtitle
      // Dialog content: Explains page purpose and interaction
      message: 'This page explains how your inventory data is protected and highlights mobile-specific security measures. Tap on any section below to expand and read the details.',
      buttons: ['Understood']                // Confirm button
    });

    // Display the dialog
    await alert.present();
  }
}