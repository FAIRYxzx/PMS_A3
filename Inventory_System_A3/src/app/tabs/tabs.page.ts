// Import Angular core decorators and dependency injection utilities
import { Component, EnvironmentInjector, inject } from '@angular/core';
// Import Ionic standalone components for direct use without module imports
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
// Import specific Ionicons icons
import { listOutline, addCircleOutline, createOutline, shieldOutline, homeOutline } from 'ionicons/icons';
// Import Angular common module
import { CommonModule } from '@angular/common';

// Component decorator: define component metadata
@Component({
  // Component selector: used as <app-tabs> in templates
  selector: 'app-tabs',
  // Associated HTML template file
  templateUrl: 'tabs.page.html',
  // Associated style file
  styleUrls: ['tabs.page.scss'],
  // Import required standalone components/modules (Standalone mode)
  imports: [CommonModule,IonTabs,IonTabBar,IonTabButton,IonIcon,IonLabel],
})
// Tabs page component class: manages tab icons and related data
export class TabsPage {
  // Icon mapping object: links template aliases to actual Ionicons icons
  icons = {
    // Icon for Home tab
    home: homeOutline,
    // Icon for Inventory List tab
    list: listOutline,
    // Icon for Add Item tab
    add: addCircleOutline,
    // Icon for Edit/Delete tab
    edit: createOutline,
    // Icon for Privacy & Security tab
    privacy: shieldOutline
  };
}