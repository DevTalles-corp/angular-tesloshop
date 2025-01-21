import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FrontNavbarComponent } from '../../components/front-navbar/front-navbar.component';

@Component({
  selector: 'app-store-front-layout',
  imports: [RouterOutlet, FrontNavbarComponent],
  templateUrl: './store-front-layout.component.html',
})
export class StoreFrontLayoutComponent {}
