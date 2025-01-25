// HTML
// https://gist.github.com/Klerith/4a2e8b17e9a34bd945f3e393cee2ced9

import { Component, computed, inject, input, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Validators } from '@angular/forms';
import { ProductCarouselComponent } from '@products/components/product-carousel/product-carousel.component';
import { Product, Size } from '@products/interfaces/product.interface';
import { ProductsService } from '@products/services/products.service';
import { FormErrorLabelComponent } from '@shared/components/form-error-label/form-error-label.component';

@Component({
  selector: 'product-details',
  imports: [
    ProductCarouselComponent,
    ReactiveFormsModule,
    FormErrorLabelComponent,
  ],
  templateUrl: './product-details.component.html',
})
export class ProductDetailsComponent implements OnInit {
  product = input.required<Product>();
  productsService = inject(ProductsService);

  fb = inject(FormBuilder);

  productForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    slug: [
      '',
      [Validators.required, Validators.pattern(/^[a-z0-9_]+(?:-[a-z0-9_]+)*$/)],
    ],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    sizes: [['']],
    tags: [''],
    images: [[]],
    gender: [
      'men',
      [Validators.required, Validators.pattern(/men|women|kid|unisex/)],
    ],
  });

  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  ngOnInit(): void {
    this.productForm.patchValue(this.product() as any);
    this.productForm.patchValue({ tags: this.product().tags.join(', ') });
  }

  onSubmit() {
    this.productForm.markAllAsTouched();
    const formValue = this.productForm.value;

    if (this.productForm.invalid) return;
    const sizes = this.productForm.value.sizes ?? [];

    const productLike: Partial<Product> = {
      ...(formValue as any),
      tags: formValue.tags
        ?.toLowerCase()
        .split(',')
        .map((tag) => tag.trim()) ?? [''],
    };

    // console.log(productLike);

    this.productsService
      .updateProduct(this.product().id, productLike)
      .subscribe((product) => {
        console.log({ product });
      });
  }

  onSizeClick(size: string) {
    const currentSizes = [...(this.productForm.value.sizes ?? [])];

    if (currentSizes.includes(size)) {
      currentSizes.splice(currentSizes.indexOf(size), 1);
    } else {
      currentSizes.push(size);
    }

    this.productForm.patchValue({ sizes: currentSizes });
  }
}
