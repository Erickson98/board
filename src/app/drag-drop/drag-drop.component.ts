import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  HostListener,
} from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
} from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AutoResizeDirective } from '../auto-resize.component';

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
    CommonModule,
    CdkDropListGroup,
    AutoResizeDirective,
  ],
})
export class DragDrop implements AfterViewInit {
  todo = [
    'Colocar cualquier imagen pasada por una url',
    'Cambiar titulo a las tarjetas',
    'Crear la ruta home que servira para los tableros',
  ];

  done: string[] = [
    'Boton para añadir mas tarjeta',
    'Ver si las tarjetas se pueden clickear',
  ];
  doing: string[] = [];
  isAddingCard: boolean = true;
  nombre: string = '';
  isEditableTitleCard: boolean = false;
  externalHeight: number = 0;

  columnList = [
    {
      id: 1,
      name: 'todo',
      titleEditable: false,
      estado: true,
      data: [
        'eliminar el bug de que si se esta asignando un nombre a la tarjeta no puede arrastrarse.',
        'Colocar cualquier imagen pasada por una url',
        'Cambiar titulo a las tarjetas',
        'Crear la ruta home que servira para los tableros',
      ],
    },
    {
      id: 2,
      name: 'col2',
      titleEditable: false,
      estado: true,
      data: ['first element'],
    },
    {
      id: 3,
      name: 'col3',
      titleEditable: false,
      estado: true,
      data: ['second element'],
    },
  ];
  constructor(private cdr: ChangeDetectorRef, private eRef: ElementRef) {}
  @ViewChild('textarea') textarea!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('header', { static: false })
  header!: ElementRef<HTMLHeadingElement>;
  onEnter(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.textarea.nativeElement.blur();
      console.log('first');
    }
  }
  calculateHeaderHeight(): void {
    if (this.header) {
      console.log(this.header.nativeElement.textContent);
      this.externalHeight = this.header.nativeElement.scrollHeight;
      console.log(this.externalHeight);
      this.cdr.detectChanges();
    }
  }
  onEnterPressed(id: number) {
    this.changeTitle(id);
    console.log('first');
  }

  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    const cardElement = this.eRef.nativeElement.querySelector('#card');
    if (cardElement.contains(event.target)) {
      console.log('first');
      return;
    }
    if (this.eRef.nativeElement.contains(event.target)) {
      this.onClickOutside();
      console.log('first');
      this.columnList.map((x) => {
        if (!x.estado && this.nombre === '') {
          x.data.pop();
        }
        if (x.data[x.data.length - 1] === '') {
          x.data[x.data.length - 1] = this.nombre;
          this.nombre = '';
          this.cdr.detectChanges();
        }
        x.estado = true;
        return x;
      });
    }
    if (!this.eRef.nativeElement.contains(event.target)) {
      console.log(event);
      this.columnList.map((x) => {
        if (this.nombre !== '' && x.data[x.data.length - 1] === '') {
          console.log('first');
          console.log(x.data);
        }
        if (x.data[x.data.length - 1] === '') {
          // x.data[x.data.length - 1] = this.nombre;
          // this.nombre = '';
          console.log(x.data);
        }
        console.log(x.data);
        return x;
      });
    }

    if (!this.eRef.nativeElement.querySelector('#card')) {
      console.log('first');
    }
  }
  ngOnChanges() {
    console.log('first');
  }
  changeTitle(id: number) {
    console.log('first');
    this.calculateHeaderHeight();

    this.isEditableTitleCard = !this.isEditableTitleCard;
    this.cdr.detectChanges();
    console.log(id);
    this.columnList.map((x) => {
      if (x.id === id) {
        x.titleEditable = !x.titleEditable;
      }
      return x;
    });
  }
  onClickOutside() {
    console.log('first');
  }
  @ViewChild('nameInput', { static: false }) nameInput!: ElementRef;
  @ViewChild('context', { static: false }) context!: ElementRef;

  ngOnInit() {
    this.initDatabase();
  }

  initDatabase() {
    const request = indexedDB.open('MyDatabase', 1);

    request.onupgradeneeded = function (event) {
      const db = (event.target as IDBOpenDBRequest).result;

      // Crear un almacén de objetos para "Columnas"
      const columnasStore = db.createObjectStore('Columnas', {
        keyPath: 'name',
      });

      // Crear almacenes de objetos para "Columna1" y "Columna2"
      const columna1Store = db.createObjectStore('Columna1', { keyPath: 'id' });
      const columna2Store = db.createObjectStore('Columna2', { keyPath: 'id' });

      // Crear índices en "Columna1" y "Columna2" según sea necesario
      columna1Store.createIndex('foreign_key_id', 'foreign_key_id', {
        unique: false,
      });
      columna2Store.createIndex('foreign_key_id', 'foreign_key_id', {
        unique: false,
      });

      // Crear almacén de objetos para "Comments"
      const commentsStore = db.createObjectStore('Comments', { keyPath: 'id' });
      commentsStore.createIndex('Author', 'Author', { unique: false });
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      this.getData(db);
    };

    request.onerror = function (event) {
      console.error('Database error:');
    };
  }

  getData(db: IDBDatabase) {
    const transaction = db.transaction(
      ['Columnas', 'Columna1', 'Columna2', 'Comments'],
      'readonly'
    );

    const columna1Store = transaction.objectStore('Columna1');
    const columna1Request = columna1Store.getAll();

    columna1Request.onsuccess = (event) => {
      this.doing = (event.target as IDBRequest).result;
      console.log('Columna1:', this.doing);
    };

    transaction.oncomplete = function () {
      console.log('All data retrieved from the database.');
    };

    transaction.onerror = function (event) {
      console.error(
        'Transaction error:',
        (event.target as IDBTransaction).error
      );
    };
  }

  onBoardClick() {
    console.log('first');
    this.cdr.detectChanges();
  }

  ngAfterViewInit() {
    this.setFocus();
    this.calculateHeaderHeight();
    this.cdr.detectChanges();
  }

  ngAfterViewChecked() {
    this.setFocus();
  }

  setFocus() {
    if (this.nameInput) {
      this.nameInput.nativeElement.focus();
    }
  }

  addCard(col: string[], estado: boolean = true, nombre: string, idx: any) {
    this.cdr.detectChanges();
    this.columnList.map((x) => {
      x.estado = true;
      if (x.data[x.data.length - 1] === '' && this.nombre !== '') {
        console.log(x.data);
        console.log(x.data[x.data.length - 1]);
        x.data[x.data.length - 1] = this.nombre;
        this.nombre = '';
        return;
      }
      if (x.data[x.data.length - 1] === '' && this.nombre === '') {
        x.data.pop();
      }
      return x;
    });
    this.columnList[idx].estado = false;
    this.columnList[idx].data.push('');
  }
  saveCard(col: string[], estado: boolean = true, idx: any) {
    if (this.nombre === '') {
      this.columnList[idx].estado = true;
      let index = col.findIndex((x) => x === '');
      col.splice(index, 1);
      this.cdr.detectChanges();
      console.log(col);
      return;
    }

    col = col.map((x) => {
      if (x === '') {
        x = this.nombre;
      }
      return x;
    });
    this.columnList[idx].data = col;
    // col[col.length - 1] = this.nombre;
    this.nombre = '';
    // col.splice(idx, 0, '');
    col.push('');
    console.log(this.columnList);
    this.cdr.detectChanges();
  }
  avoidAddCard(col: string[], idx: number) {
    this.nombre = '';
    // this.isAddingCard = true;
    this.columnList[idx].estado = true;
    col.pop();
    this.cdr.detectChanges();
  }
  addColumn() {
    console.log('first');
    this.columnList.push({
      id: 7,
      name: 'hello',
      titleEditable: false,
      data: ['hey'],
      estado: true,
    });
    this.cdr.detectChanges();
  }
  handleEmptyItem() {
    console.log('Elemento vacío encontrado');
    // Aquí puedes añadir la lógica que necesitas
  }
  trackByFn(index: number, item: any) {
    return index; // or item.id if you have a unique identifier
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      console.log(event.container.data);
      console.log(event.previousIndex);
      console.log(event.currentIndex);
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      console.log(event.item.element.nativeElement.innerHTML);
      console.log(event.previousContainer.data);
      console.log(event.container.data);
      console.log(event.previousIndex);
      console.log(event.currentIndex);
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
  dropCol(event: CdkDragDrop<any>) {
    if (event.previousContainer === event.container) {
      console.log(event.container.data);
      console.log(event.previousIndex);
      console.log(event.currentIndex);
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      console.log(event.item.element.nativeElement.innerHTML);
      console.log(event.previousContainer.data);
      console.log(event.container.data);
      console.log(event.previousIndex);
      console.log(event.currentIndex);
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  dropHorizontal(event: CdkDragDrop<any>) {
    moveItemInArray(this.columnList, event.previousIndex, event.currentIndex);
  }
}
