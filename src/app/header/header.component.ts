import { Component, ViewEncapsulation } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
interface SearchItem {
  title: string;
  sub: string;
}
@Component({
  selector: 'header',
  templateUrl: 'header.component.html',
  styleUrl: 'header.component.css',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class Header {
  constructor() {}

  data: SearchItem[] = [
    {
      title: 'Agregar boton delete cuando hace hover',
      sub: 'Trello own: doing',
    },
    {
      title: 'Agregar boton delete cuando hace hover',
      sub: 'Trello own: doing',
    },
    {
      title: 'Agregar boton delete cuando hace hover',
      sub: 'Trello own: doing',
    },
    {
      title: 'Agregar boton delete cuando hace hover',
      sub: 'Trello own: doing',
    },
    {
      title: 'Agregar boton delete cuando hace hover',
      sub: 'Trello own: doing',
    },
    {
      title: 'Agregar boton delete cuando hace hover',
      sub: 'Trello own: doing',
    },
    {
      title: 'Agregar boton delete cuando hace hover',
      sub: 'Trello own: doing',
    },
    {
      title: 'Agregar boton delete cuando hace hover',
      sub: 'Trello own: doing',
    },
    {
      title: 'Agregar boton delete cuando hace hover',
      sub: 'Trello own: doing',
    },
    {
      title: 'Agregar boton delete cuando hace hover',
      sub: 'Trello own: doing',
    },
    {
      title: 'Agregar boton delete cuando hace hover',
      sub: 'Trello own: doing',
    },
    {
      title: 'Agregar boton delete cuando hace hover',
      sub: 'Trello own: doing',
    },
    {
      title: 'Agregar boton delete cuando hace hover',
      sub: 'Trello own: doing',
    },
    { title: 'Agregar una header al igual que esta', sub: 'Trello own: To do' },
    {
      title:
        'colocar el boton de agregar nueva tarea dentro de la barra con un icono',
      sub: 'Tool: to do',
    },
    { title: 'Agregar dependencia en js', sub: 'Code editor with react: Done' },
    { title: 'funcionalidad de agregar mas task', sub: 'Tool: Done' },
    {
      title: 'cuando añado tarjeta, agregarla a la base de datos.',
      sub: 'Trello own: done · Archivada',
    },
    {
      title:
        'si no hay tareas en un proyecto agregar un texto que diga agregar Tareas',
      sub: 'Tool: Done',
    },
    { title: 'boton de agregar un nuevo proyecto', sub: 'Tool: Done' },
  ];
  ngAfterViewInit(): void {
    setTimeout(() => {
      function highlightMatch(text: string, query: string): string {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, `<span class="highlight">$1</span>`);
      }
      var searchInput = document.getElementById(
        'searchInput'
      ) as HTMLInputElement;
      var resultsBox = document.getElementById('resultsBox') as HTMLDivElement;
      if (searchInput === null || resultsBox === null) {
        console.log('Ok');
        return;
      }
      console.log('HELLLLLLO');
      function renderResults(filtered: SearchItem[], query: string): void {
        resultsBox.innerHTML = '';

        for (const item of filtered) {
          const div = document.createElement('div');
          div.classList.add('item');

          div.innerHTML = `
      <div class="item-title">${highlightMatch(item.title, query)}</div>
      <div class="item-sub">${item.sub}</div>
    `;

          resultsBox.appendChild(div);
        }

        resultsBox.style.display = 'block';
      }
      searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim().toLowerCase();
        resultsBox.innerHTML = '';

        if (!query) {
          resultsBox.style.display = 'none';
          return;
        }

        const filtered = this.data.filter((item) =>
          item.title.toLowerCase().includes(query)
        );

        if (filtered.length === 0) {
          resultsBox.style.display = 'none';
          return;
        }

        renderResults(filtered, query);
      });
    }, 5000);
  }
}
