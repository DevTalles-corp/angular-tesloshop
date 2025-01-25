import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '@auth/interfaces/user.interface';
import {
  Gender,
  Product,
  ProductsResponse,
} from '@products/interfaces/product.interface';
import { delay, Observable, of, pipe, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

interface Options {
  limit?: number;
  offset?: number;
  gender?: string;
}

const emptyProduct: Product = {
  id: 'new',
  title: '',
  description: '',
  price: 0,
  stock: 0,
  sizes: [],
  tags: [],
  slug: '',
  gender: Gender.Men,
  images: [],
  user: {} as User,
};

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private http = inject(HttpClient);

  private productsCache = new Map<string, ProductsResponse>();
  private productCache = new Map<string, Product>();

  getProducts(options: Options): Observable<ProductsResponse> {
    const { limit = 9, offset = 0, gender = '' } = options;

    const key = `${limit}-${offset}-${gender}`; // 9-0-''
    if (this.productsCache.has(key)) {
      return of(this.productsCache.get(key)!);
    }

    return this.http
      .get<ProductsResponse>(`${baseUrl}/products`, {
        params: {
          limit,
          offset,
          gender,
        },
      })
      .pipe(
        tap((resp) => console.log(resp)),
        tap((resp) => this.productsCache.set(key, resp))
      );
  }

  getProductByIdSlug(idSlug: string): Observable<Product> {
    if (this.productCache.has(idSlug)) {
      return of(this.productCache.get(idSlug)!);
    }

    return this.http
      .get<Product>(`${baseUrl}/products/${idSlug}`)
      .pipe(tap((product) => this.productCache.set(idSlug, product)));
  }

  getProductById(id: string): Observable<Product> {
    if (id === 'new') {
      return of(emptyProduct);
    }

    return this.http.get<Product>(`${baseUrl}/products/${id}`).pipe(
      tap((product) => this.productCache.set(id, product)),
      tap((product) => console.log(product))
    );
  }

  updateProduct(id: string, product: Partial<Product>): Observable<Product> {
    return this.http
      .patch<Product>(`${baseUrl}/products/${id}`, product)
      .pipe(tap((product) => this.updateProductCache(id, product)));
  }

  createProduct(product: Partial<Product>): Observable<Product> {
    return this.http
      .post<Product>(`${baseUrl}/products`, product)
      .pipe(tap((product) => this.updateProductCache(product.id, product)));
  }

  updateProductCache(id: string, product: Product) {
    this.productCache.set(id, product);

    this.productsCache.forEach((products) => {
      products.products = products.products.map((currentProduct) =>
        currentProduct.id === id ? product : currentProduct
      );
    });
  }
}
