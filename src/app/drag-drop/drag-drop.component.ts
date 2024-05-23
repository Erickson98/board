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

  ngOnInit() {
    this.initDatabase();
  }

  initDatabase() {
    const request = indexedDB.open('MyDatabase', 1);

    request.onupgradeneeded = function(event) {
      const db = (event.target as IDBOpenDBRequest).result;

      // Crear un almacén de objetos para "Columnas"
      const columnasStore = db.createObjectStore('Columnas', { keyPath: 'name' });

      // Crear almacenes de objetos para "Columna1" y "Columna2"
      const columna1Store = db.createObjectStore('Columna1', { keyPath: 'id' });
      const columna2Store = db.createObjectStore('Columna2', { keyPath: 'id' });

      // Crear índices en "Columna1" y "Columna2" según sea necesario
      columna1Store.createIndex('foreign_key_id', 'foreign_key_id', { unique: false });
      columna2Store.createIndex('foreign_key_id', 'foreign_key_id', { unique: false });

      // Crear almacén de objetos para "Comments"
      const commentsStore = db.createObjectStore('Comments', { keyPath: 'id' });
      commentsStore.createIndex('Author', 'Author', { unique: false });
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      this.getData(db);
    };

    request.onerror = function(event) {
      console.error('Database error:');
    };
  }

  getData(db: IDBDatabase) {
    const transaction = db.transaction(['Columnas', 'Columna1', 'Columna2', 'Comments'], 'readonly');

    const columna1Store = transaction.objectStore('Columna1');
    const columna1Request = columna1Store.getAll();

    columna1Request.onsuccess = (event) => {
      this.doing = (event.target as IDBRequest).result;
      console.log('Columna1:', this.doing);
    };

    transaction.oncomplete = function() {
      console.log('All data retrieved from the database.');
    };

    transaction.onerror = function(event) {
      console.error('Transaction error:', (event.target as IDBTransaction).error);
    };
  }

  


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
      console.log(event.container.data)
      console.log(event.previousIndex)
      console.log(event.currentIndex)
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      console.log(event.item.element.nativeElement.innerHTML)
      console.log(event.previousContainer.data)
      console.log(event.container.data)
      console.log(event.previousIndex)
      console.log(event.currentIndex)
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
}
