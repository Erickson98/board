import {Component, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import {MatIconModule} from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
/**
 * @title Drag&Drop connected sorting
 */
@Component({
  selector: 'drag-drop',
  templateUrl: 'drag-drop.component.html',
  styleUrl: 'drag-drop.component.css',
  standalone: true,
  imports: [
    CdkDropList, 
    CdkDrag, 
    MatIconModule, 
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
})
export class DragDrop implements AfterViewInit {
  todo = [ 
    'Colocar cualquier imagen pasada por una url',
    'Boton para añadir mas tarjeta',
    'Ver si las tarjetas se pueden clickear',
    'Cambiar titulo a las tarjetas',
    'Crear la ruta home que servira para los tableros',
  ];

  done:string[] = [];
  doing:string[] = []
  nombre: string = '';
  @ViewChild('nameInput', { static: false }) nameInput !: ElementRef;

   ngAfterViewInit() {
    this.setFocus();
  }

  ngAfterViewChecked() {
    this.setFocus();
  }


  setFocus() {
    if (this.nameInput) {
      this.nameInput.nativeElement.focus();
    }
  }
  
  addCard() {
    this.doing.unshift("")

  }
  saveCard(){
    this.doing.map((x)=>{
      if (x === "") { x = this.nombre}
    })
    this.doing.unshift(this.nombre)
    this.nombre = ''
    console.log(this.doing)
  }
  handleEmptyItem() {
    console.log('Elemento vacío encontrado');
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
