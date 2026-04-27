/**
 * Core application routing configuration file
 * Defines routing rules and global dependency injection configuration for the Angular app
 */
import { Routes } from '@angular/router'; // Core Angular routing interface
import { provideHttpClient } from '@angular/common/http'; // Angular HTTP client provider

/**
 * Application route array - defines all routing rules
 * Type Routes provided by @angular/router, supports path matching, lazy loading, etc.
 */
export const routes: Routes = [
  {
    path: 'tabs', // Root path for tab navigation
    // Lazy load tab module routing configuration - optimizes initial page load performance
    loadChildren: () => import('./tabs/tabs.routes').then(m => m.routes)
  },
  {
    path: '', // Empty path (default route)
    redirectTo: 'tabs/home', // Redirect to home tab
    pathMatch: 'full' // Trigger redirect only on exact empty path match
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then(m => m.HomePage)
  }
];

/**
 * Global application configuration object
 * Contains dependency injection provider configuration for the entire application
 */
export const appConfig = {
  providers: [
    provideHttpClient() // Register HTTP client service for app-wide HttpClient injection
  ]
};