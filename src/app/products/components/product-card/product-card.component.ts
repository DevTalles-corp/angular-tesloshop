import { Component, computed, input } from '@angular/core';
import { SlicePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '@products/interfaces/product.interface';

@Component({
  selector: 'product-card',
  imports: [RouterLink, SlicePipe],
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent {
  product = input.required<Product>();

  imageUrl = computed(() => {
    return `http://localhost:3000/api/files/product/${
      this.product().images[0]
    }`;
  });
}
