import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { TabViewModule } from 'primeng/tabview';
import { MatListModule } from '@angular/material/list';
import { CheckboxModule } from 'primeng/checkbox';

/**
 * @title Tab group with asynchronously loading tab contents
 */
@Component({
  selector: 'tab-card',
  templateUrl: 'tab-card.component.html',
  styleUrl: 'tab-card.component.css',
  standalone: true,
  imports: [MatTabsModule, TabViewModule, MatListModule, CheckboxModule],
})
export class TabCard {
  typesOfShoes: string[] = [
    'Boots',
    'Clogs',
    'Loafers',
    'Moccasins',
    'Sneakers',
  ];
  auto_grow(element: any) {
    console.log('first');
    // Restablecer la altura temporalmente para evitar errores de cálculo
    console.log(element.style.height);
    element.style.height = 'auto';
    // Ajustar la altura al scrollHeight del contenido
    element.style.height = element.scrollHeight + 'px';
  }
}
