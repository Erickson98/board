import {Component, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
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
import { CommonModule } from '@angular/common';   

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
    FormsModule,
    CommonModule
  ],
})
export class DragDrop implements AfterViewInit {
  todo = [ 
    'Colocar cualquier imagen pasada por una url', 
    
    'Cambiar titulo a las tarjetas',
    'Crear la ruta home que servira para los tableros',
  ];

  done:string[] = ['Boton para añadir mas tarjeta', 'Ver si las tarjetas se pueden clickear',];
  doing:string[] = [];
  isAddingCard:boolean = true
  nombre: string = '';

  constructor(private cdr: ChangeDetectorRef) {}

  @ViewChild('nameInput', { static: false }) nameInput !: ElementRef;

   ngAfterViewInit() {
    this.setFocus();
    console.log("first")
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
    this.doing.push("")
     this.isAddingCard = false
     this.cdr.detectChanges();

  }
  saveCard(){
    if (this.nombre === "") {
      this.isAddingCard = true;
      this.doing.pop()
      this.cdr.detectChanges(); 
      return
    }
    this.doing.map((x)=>{
      if (x === "") { x = this.nombre}
    })
    this.doing[this.doing.length - 1] = this.nombre
    this.nombre = ''
    this.doing.push("")
    this.cdr.detectChanges();
  }
  avoidAddCard(){
    this.nombre = ''
    this.isAddingCard = true;
    this.doing.pop();
    this.cdr.detectChanges();
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
