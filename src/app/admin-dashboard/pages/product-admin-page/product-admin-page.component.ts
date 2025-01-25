import { Component, computed, effect, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '@products/services/products.service';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { map } from 'rxjs';

@Component({
  selector: 'app-product-admin-page',

  imports: [ProductDetailsComponent],
  templateUrl: './product-admin-page.component.html',
})
export class ProductAdminPageComponent {
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  productId = toSignal(
    this.activatedRoute.params.pipe(map((params) => params['id']))
  );

  productService = inject(ProductsService);

  productResource = rxResource({
    request: () => ({ id: this.productId() }),
    loader: ({ request }) => {
      console.log(request.id);
      return this.productService.getProductById(request.id);
    },
  });

  // Si hay error redirigir a la pagina de productos
  redirectEffect = effect(() => {
    if (this.productResource.error()) {
      this.router.navigate(['/admin/products']);
    }
  });
}
