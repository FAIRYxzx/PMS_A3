// Import Angular core routing interface for defining route rules
import { Routes } from '@angular/router';
// Import Tabs page component as the parent container for all child routes
import { TabsPage } from './tabs.page';

// Define route configuration array for Tabs module, following Angular Routes interface
export const routes: Routes = [
  {
    // Empty path (matches /tabs), root route for Tabs page
    path: '',
    // Associate with TabsPage component; all child routes render inside this component
    component: TabsPage,
    // Child route configuration: tab pages under Tabs
    children: [
      {
        // Route path for Home tab
        path: 'home',
        loadComponent: () =>
          import('../home/home.page').then(m => m.HomePage)
      },
      {
        // Route path for Inventory List tab
        path: 'inventory',
        // Lazy load component: optimize initial load speed, only load when route is accessed
        loadComponent: () =>
          import('../inventory/inventory.page').then((m) => m.InventoryPage),
      },
      {
        // Route path for Add Item tab
        path: 'add',
        loadComponent: () =>
          import('../add/add.page').then((m) => m.AddPage),
      },
      // Route configuration for Edit/Delete tab
      {
        path: 'edit-delete',
        loadComponent: () =>
          import('../edit-delete/edit-delete.page').then((m) => m.EditDeletePage),
      },
      // Route configuration for Privacy & Security tab
      {
        path: 'privacy-security',
        loadComponent: () =>
          import('../privacy-security/privacy-security.page').then((m) => m.PrivacySecurityPage),
      },
      {
        // Empty child path (matches /tabs/), redirect to home by default
        path: '',
        redirectTo: '/tabs/home',
        // Strict full path match to avoid redirection errors from partial matching
        pathMatch: 'full',
      },
    ],
  },
  {
    // Root path (/) redirects to home to ensure default page on app launch
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full',
  },
];