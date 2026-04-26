/**
 * Application root component
 * Entry component for Angular app, serves as main application container
 * Uses Standalone components mode
 */
import { Component } from '@angular/core'; // Angular component decorator
import { CommonModule } from '@angular/common'; // Angular common module 
import { RouterModule } from '@angular/router'; // Angular routing module
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone'; // Ionic core components

/**
 * Root component decorator configuration
 */
@Component({
  selector: 'app-root', // Component selector
  templateUrl: 'app.component.html', // Component template file path
  standalone: true, // Standalone mode
  imports: [
    CommonModule, // Import common directives module
    RouterModule, // Import routing module (supports router links and navigation)
    IonApp, // Ionic application root container
    IonRouterOutlet // Ionic router outlet (handles page transition animations)
  ]
})
export class AppComponent {
  // Root component constructor
  constructor() {}
}