import { Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '@products/services/products.service';
import { ProductDetailsComponent } from './product-details/product-details.component';

@Component({
  selector: 'app-product-admin-page',

  imports: [ProductDetailsComponent],
  templateUrl: './product-admin-page.component.html',
})
export class ProductAdminPageComponent {
  activatedRoute = inject(ActivatedRoute);
  productId = this.activatedRoute.snapshot.params['id'];

  productService = inject(ProductsService);

  productResource = rxResource({
    request: () => ({ id: this.productId }),
    loader: ({ request }) => {
      return this.productService.getProductById(request.id);
    },
  });
}
