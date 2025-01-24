import { Routes } from '@angular/router';
import { AdminDashboardLayoutComponent } from './layouts/admin-dashboard-layout/admin-dashboard-layout.component';
import { ProductsAdminPageComponent } from './pages/products-admin-page/products-admin-page.component';
import { ProductAdminPageComponent } from './pages/product-admin-page/product-admin-page.component';

export const adminDashboardRoutes: Routes = [
  {
    path: '',
    component: AdminDashboardLayoutComponent,
    children: [
      {
        path: '',
        component: ProductsAdminPageComponent,
      },
      {
        path: 'products/:id',
        component: ProductAdminPageComponent,
      },
    ],
  },
];

export default adminDashboardRoutes;
