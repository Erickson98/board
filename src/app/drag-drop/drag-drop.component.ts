import {Component} from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import {MatIconModule} from '@angular/material/icon';

/**
 * @title Drag&Drop connected sorting
 */
@Component({
  selector: 'drag-drop',
  templateUrl: 'drag-drop.component.html',
  styleUrl: 'drag-drop.component.css',
  standalone: true,
  imports: [CdkDropList, CdkDrag, MatIconModule],
})
export class DragDrop {
  todo = [ 
    'Colocar cualquier imagen pasada por una url',
    'Boton para añadir mas tarjeta',
    'Ver si las tarjetas se pueden clickear',
    'Cambiar titulo a las tarjetas',
    'Crear la ruta home que servira para los tableros',
  ];

  done:string[] = [];
  doing:string[] = []

  addCard() {
    this.doing.push("Doing")
    console.log('Botón presionado: Añadir una tarjeta');
    // Aquí puedes añadir la lógica que necesitas
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
}
