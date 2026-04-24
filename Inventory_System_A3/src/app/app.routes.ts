import { Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
];

// 这一句是 Angular 官方必需配置，完全合规！
export const appConfig = {
  providers: [
    provideHttpClient()
  ]
};