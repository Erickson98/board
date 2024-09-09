import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { TabViewModule } from 'primeng/tabview';
import { MatListModule } from '@angular/material/list';

/**
 * @title Tab group with asynchronously loading tab contents
 */
@Component({
  selector: 'tab-card',
  templateUrl: 'tab-card.component.html',
  styleUrl: 'tab-card.component.css',
  standalone: true,
  imports: [MatTabsModule, TabViewModule, MatListModule],
})
export class TabCard {
  typesOfShoes: string[] = [
    'Boots',
    'Clogs',
    'Loafers',
    'Moccasins',
    'Sneakers',
  ];
}
