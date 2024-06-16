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
    'Cargar los datos y rellenar el board',
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
      Comments: [],
    },
    {
      id: 2,
      name: 'col2',
      titleEditable: false,
      estado: true,
      data: [],
      Comments: [],
    },
    {
      id: 3,
      name: 'col3',
      titleEditable: false,
      estado: true,
      data: ['second element'],
      Comments: [],
    },
  ];

  db: IDBDatabase | null = null;

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
      this.externalHeight = this.header.nativeElement.scrollHeight;
      this.cdr.detectChanges();
    }
  }
  onEnterPressed(id: number) {
    this.changeTitle(id);
  }

  onInputChange() {
    console.log('Nombre actualizado:', this.nombre);
    this.cdr.detectChanges();
  }

  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    const clickedInside = this.eRef.nativeElement.contains(event.target);

    const titleCard = this.eRef.nativeElement.querySelector('#titleCard');
    const titleCard2 = this.eRef.nativeElement.querySelector('#h2Title');
    const board = this.eRef.nativeElement.querySelector('.board');

    if (board.contains(event.target)) {
      const target = event.target as HTMLElement;
      if (target.classList.contains('save-card')) {
        return;
      }

      console.log(this.nombre);
      this.columnList.map((x) => {
        console.log(x.data[x.data.length - 1]);
        if (x.data[x.data.length - 1] === '' && this.nombre.trim() === '') {
          x.estado = true;
          console.log('first');
          this.nombre = '';
          x.data.pop();
          return;
        }

        console.log(this.nombre);
        if (x.data[x.data.length - 1] === '' && this.nombre.trim() !== '') {
          console.log('first');
          x.data[x.data.length - 1] = this.nombre;
          this.nombre = '';
          x.estado = true;
          this.cdr.detectChanges();
        }
        return x;
      });
      this.cdr.detectChanges();
    }

    if (titleCard2.contains(event.target)) {
      console.log('first');
    }
    console.log(event.target);
    if (!titleCard.contains(event.target) && clickedInside) {
      console.log('first');
      if (titleCard2.contains(event.target)) {
        console.log('first');
      }
      this.columnList.map((x) => {
        if (x.titleEditable) {
          x.titleEditable = false;
        }
        return x;
      });
      this.cdr.detectChanges();
    }
    const cardElement = this.eRef.nativeElement.querySelector('#card');
    if (cardElement.contains(event.target)) {
      console.log('first');
      // return;
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
  changeTitle(id: number, event: any = '') {
    this.isEditableTitleCard = !this.isEditableTitleCard;
    const height = event.target?.scrollHeight;
    console.log(id);
    this.columnList.map((x) => {
      x.estado = true;
      if (x.data[x.data.length - 1] === '' && this.nombre.trim() === '') {
        this.nombre = '';
        x.data.pop();
      }

      if (x.data[x.data.length - 1] === '' && this.nombre.trim() !== '') {
        x.data[x.data.length - 1] = this.nombre;
        this.nombre = '';
      }

      if (x.id === id) {
        // this.calculateHeaderHeight();
        this.externalHeight = height;

        x.titleEditable = !x.titleEditable;
      } else {
        x.titleEditable = false;
      }
      return x;
    });
    this.cdr.detectChanges();
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

    request.onupgradeneeded = (event) => {
      this.db = (event.target as IDBOpenDBRequest).result;
      console.log('Database opened successfully', this.db);

      // Crear almacén de objetos para "Columnas"
      const columnasStore = this.db.createObjectStore('Columnas', {
        keyPath: 'id',
      });

      // Crear índice en "Columnas"
      columnasStore.createIndex('name', 'name', { unique: true });

      // Crear almacén de objetos para "Comments"
      const commentsStore = this.db.createObjectStore('Comments', {
        keyPath: 'id',
        autoIncrement: true,
      });
      this.initializeData(this.db);
    };

    request.onsuccess = (event) => {
      this.db = (event.target as IDBOpenDBRequest).result;
      console.log(this.db);
      this.checkAndInitializeData(this.db);
      this.getAllColumns(this.db);
      console.log('Database initialized successfully');
    };

    request.onerror = (event) => {
      console.error('Database error:', event);
    };
  }

  initializeData(db: IDBDatabase) {
    const transaction = db.transaction(['Columnas', 'Comments'], 'readwrite');

    const columnasStore = transaction.objectStore('Columnas');
    const commentsStore = transaction.objectStore('Comments');
    console.log('first');
    const columnListAux = [
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
        Comments: [],
      },
      {
        id: 2,
        name: 'col2',
        titleEditable: false,
        estado: true,
        data: [],
        Comments: [],
      },
      {
        id: 3,
        name: 'col3',
        titleEditable: false,
        estado: true,
        data: [],
        Comments: [],
      },
    ];
    columnListAux.forEach((column) => {
      columnasStore.add(column);
    });

    transaction.oncomplete = () => {
      console.log('All data initialized');
    };

    transaction.onerror = (event) => {
      console.error('Transaction error:', event);
    };
  }
  checkAndInitializeData(db: IDBDatabase) {
    const transaction = db.transaction(['Columnas'], 'readonly');
    const columnasStore = transaction.objectStore('Columnas');
    const request = columnasStore.count();

    request.onsuccess = () => {
      if (request.result === 0) {
        // Si no hay datos en la base de datos, inicializar
        this.initializeData(db);
      } else {
        console.log(
          'Data already exists in the database. No need to initialize.'
        );
      }
    };

    request.onerror = (event) => {
      console.error('Error checking data in the database:', event);
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
  getAllColumns(db: IDBDatabase) {
    const transaction = db.transaction(['Columnas'], 'readonly');
    const columnasStore = transaction.objectStore('Columnas');
    const request = columnasStore.openCursor();
    const allColumns: any[] = [];

    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
      if (cursor) {
        allColumns.push(cursor.value);
        cursor.continue();
      } else {
        console.log('All columns:', allColumns);
        // Aquí puedes actualizar el estado de tu componente o realizar otras acciones con los datos
      }
      this.columnList = allColumns;
      console.log(allColumns);
    };

    request.onerror = (event) => {
      console.error('Error fetching columns:', event);
    };
  }

  update(db: IDBDatabase, columnId: number, col: object) {
    const transaction = db.transaction(['Columnas'], 'readwrite');
    const columnasStore = transaction.objectStore('Columnas');
    const request = columnasStore.get(columnId);

    request.onsuccess = (event) => {
      let column = (event.target as IDBRequest).result;

      if (column) {
        column = col;
        const updateRequest = columnasStore.put(column);

        updateRequest.onsuccess = () => {
          console.log('Column updated successfully:', column);
        };

        updateRequest.onerror = (event) => {
          console.error('Error updating column:', event);
        };
      } else {
        console.log('Column not found:', columnId);
      }
    };

    request.onerror = (event) => {
      console.error('Error fetching column:', event);
    };
  }

  updateColumnNameHandler(id: number, col: object) {
    if (this.db) {
      this.update(this.db, id, col);
    } else {
      console.error('Database not initialized');
    }
  }

  onBoardClick(event: Event) {
    console.log('first');
    this.cdr.detectChanges();
  }

  ngAfterViewInit() {
    this.setFocus();
    // this.calculateHeaderHeight();
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
      x.titleEditable = false;
      if (x.data[x.data.length - 1] === '' && this.nombre !== '') {
        console.log(x.data);
        console.log(x.data[x.data.length - 1]);
        x.data[x.data.length - 1] = this.nombre;
        this.nombre = '';
        return;
      }
      if (x.data[x.data.length - 1] === '' && this.nombre === '') {
        console.log('first');
        x.data.pop();
      }
      return x;
    });
    this.columnList[idx].estado = false;
    this.columnList[idx].data.push('');
  }
  saveCard(col: string[], idx: any) {
    if (this.nombre === '' || this.nombre.trim() === '') {
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
    console.log(col);
    this.columnList[idx].data = col;
    // col[col.length - 1] = this.nombre;
    console.log(this.columnList[idx].data);
    // col.splice(idx, 0, '');
    console.log(idx);
    this.nombre = '';
    this.columnList[idx].data.push('');
    console.log(this.columnList[idx].data);
    this.cdr.detectChanges();
  }
  avoidAddCard(col: string[], idx: number) {
    this.nombre = '';
    // this.isAddingCard = true;
    console.log('first');
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
      Comments: [],
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
