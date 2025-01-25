// HTML
// https://gist.github.com/Klerith/4a2e8b17e9a34bd945f3e393cee2ced9

import {
  Component,
  computed,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductCarouselComponent } from '@products/components/product-carousel/product-carousel.component';
import { Product, Size } from '@products/interfaces/product.interface';
import { ProductsService } from '@products/services/products.service';
import { FormErrorLabelComponent } from '@shared/components/form-error-label/form-error-label.component';
import { async, firstValueFrom } from 'rxjs';

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
  router = inject(Router);

  wasSaved = signal(false);

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

  imageFiles: FileList | undefined = undefined;
  tempImages = signal<string[]>([]);

  ngOnInit(): void {
    this.setFormValue(this.product());
  }

  setFormValue(formLike: Partial<Product>) {
    this.productForm.patchValue(formLike as any);
    this.productForm.patchValue({ tags: formLike.tags?.join(', ') });
  }

  async onSubmit() {
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
    if (this.product().id === 'new') {
      const product = await firstValueFrom(
        this.productsService.createProduct(productLike)
      );
      this.router.navigate(['/admin/products', product.id]);
      this.setFormValue(product);
    } else {
      await firstValueFrom(
        this.productsService.updateProduct(
          this.product().id,
          productLike,
          this.imageFiles
        )
      );
      this.router.navigate(['/admin/products', this.product().id], {
        replaceUrl: true,
      });
    }

    this.wasSaved.set(true);
    setTimeout(() => {
      this.wasSaved.set(false);
    }, 2000);
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

  onFileChange(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    this.imageFiles = files ?? undefined;

    // Añadir las imagenes al arreglo de images del producto para verlas
    const imageUrls = Array.from(files ?? []).map((file) =>
      URL.createObjectURL(file)
    );

    console.log(imageUrls);
    this.tempImages.set(imageUrls);

    // this.productForm.patchValue({ images: imageUrls });
  }
}
