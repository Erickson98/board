import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  HostListener,
  EventEmitter,
  Output,
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
import { DataService } from '../services/data.service';

/**
 * @title Drag&Drop connected sorting
 */

interface Column {
  id: number;
  name: string;
  titleEditable: boolean;
  estado: boolean;
  data: string[];
  Comments: any[];
  position: number;
}
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
  data: string[] = [];
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
      position: 0,
    },
    {
      id: 2,
      name: 'col2',
      titleEditable: false,
      estado: true,
      data: [],
      Comments: [],
      position: 1,
    },
    {
      id: 3,
      name: 'col3',
      titleEditable: false,
      estado: true,
      data: ['second element'],
      Comments: [],
      position: 2,
    },
  ];

  db: IDBDatabase | null = null;

  constructor(
    private cdr: ChangeDetectorRef,
    private eRef: ElementRef,
    private dataService: DataService
  ) {}
  @Output() visibilitySidePeek = new EventEmitter<boolean>(); // Asume que enviarás un string, ajusta según necesites

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

  hasAnyClass(element: HTMLElement, classes: Array<string>) {
    return classes.some((cls) => element.classList.contains(cls));
  }

  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    const clickedInside = this.eRef.nativeElement.contains(event.target);

    const titleCard = this.eRef.nativeElement.querySelector('#titleCard');
    const titleCard2 = this.eRef.nativeElement.querySelector('#h2Title');
    const board = this.eRef.nativeElement.querySelector('.board');

    if (board.contains(event.target)) {
      const target = event.target as HTMLElement;
      console.log(target.classList);
      if (this.hasAnyClass(target, ['board', 'example-container'])) {
        console.log('first');
        this.visibilitySidePeek.emit(false);
      }
      if (target.classList.contains('save-card')) {
        return;
      }

      console.log(this.nombre);
      // this.visibilitySidePeek.emit(false);
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
          this.updateColumnData(x.id, x.data);
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
  onClickOnCard(data: any) {
    this.visibilitySidePeek.emit(true);
  }
  onClickOutside() {
    console.log('first');
  }
  @ViewChild('nameInput', { static: false }) nameInput!: ElementRef;
  @ViewChild('context', { static: false }) context!: ElementRef;

  ngOnInit() {
    this.initDatabase();
    this.dataService.data$.subscribe((updatedData) => {
      this.data = updatedData;
      console.log('data has been updated:', updatedData);
      // Realiza cualquier otra acción necesaria
    });
  }

  updateData(value: string[]) {
    this.dataService.updateData(value);
  }

  updateColumnData(columnId: number, newElements: Array<any>) {
    if (!this.db) {
      console.error('Database not initialized');
      return;
    }

    const transaction: IDBTransaction = this.db.transaction(
      ['Columnas'],
      'readwrite'
    );
    const columnasStore: IDBObjectStore = transaction.objectStore('Columnas');

    const request: any = columnasStore.openCursor(IDBKeyRange.only(columnId));

    request.onsuccess = (event: Event) => {
      const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
      if (cursor) {
        const data = cursor.value;
        if (Array.isArray(data.data)) {
          if (newElements[newElements.length - 1] === '') {
            data.data.push(newElements[newElements.length - 2]);
          } else {
            data.data.push(newElements[newElements.length - 1]);
          }
        } else {
          data.data = newElements;
        }

        const updateRequest: IDBRequest<IDBValidKey> = cursor.update(data);
        updateRequest.onsuccess = () => {
          console.log('Column updated successfully:', data);
        };
        updateRequest.onerror = (error: Event) => {
          console.error('Error updating column:', error);
        };
      } else {
        console.log(`No entry found for columnId: ${columnId}`);
      }
    };

    request.onerror = (event: Event) => {
      console.error('Error fetching column by ID:', event);
    };
  }

  initDatabase() {
    const request = indexedDB.open('MyDatabase', 1);

    request.onupgradeneeded = (event) => {
      this.db = (event.target as IDBOpenDBRequest).result;
      console.log('Database opened successfully', this.db);

      // Crear almacén de objetos para "Columnas"
      const columnasStore = this.db.createObjectStore('Columnas', {
        keyPath: 'id',
        autoIncrement: true,
      });

      // Crear índice en "Columnas"
      columnasStore.createIndex('name', 'name', { unique: false });
      columnasStore.createIndex('position', 'position', { unique: false });

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
      // this.getAllColumns(this.db);
      this.searchColumnsByName();
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
        position: 1,
      },
      {
        name: 'col2',
        titleEditable: false,
        estado: true,
        data: [],
        Comments: [],
        position: 2,
      },
      {
        name: 'col3',
        titleEditable: false,
        estado: true,
        data: [],
        Comments: [],
        position: 3,
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
      // this.columnList = allColumns;
      console.log(allColumns);
    };

    request.onerror = (event) => {
      console.error('Error fetching columns:', event);
    };
  }

  update(db: IDBDatabase, columnId: number, col: any) {
    if (!this.db) {
      console.error('Database not initialized');
      return;
    }

    const transaction = this.db.transaction(['Columnas'], 'readwrite');
    const columnasStore = transaction.objectStore('Columnas');
    const index = columnasStore.index('position');
    const request = index.openCursor(IDBKeyRange.only(columnId));

    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
      console.log(cursor);
      console.log(col);
      console.log(columnId);
      if (cursor) {
        const data = cursor.value;
        console.log(data);
        Object.assign(data, col);

        const updateRequest = cursor.update(data);
        updateRequest.onsuccess = () => {
          console.log('Column updated successfully:', data);
        };
        updateRequest.onerror = (error) => {
          console.error('Error updating column:', error);
        };

        cursor.continue();
      } else {
        console.log('No more entries');
      }
    };

    request.onerror = (event) => {
      console.error('Error fetching column by position:', event);
    };
  }

  updateColumHandler(id: number, col: object) {
    if (this.db) {
      this.update(this.db, id, col);
    } else {
      console.error('Database not initialized');
    }
  }

  updateTwoElement(db: IDBDatabase, columnId: number[], col: any) {
    if (!this.db) {
      console.error('Database not initialized');
      return;
    }

    const transaction = this.db.transaction(['Columnas'], 'readwrite');
    const columnasStore = transaction.objectStore('Columnas');
    const index = columnasStore.index('position');
    const request1 = index.openCursor(IDBKeyRange.only(columnId[0]));
    const request2 = index.openCursor(IDBKeyRange.only(columnId[1]));
    let data1: IDBCursorWithValue;
    request1.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;

      if (cursor) {
        data1 = cursor.value;

        cursor.continue();
      } else {
        console.log('No more entries');
      }
    };

    request1.onerror = (event) => {
      console.error('Error fetching column by position:', event);
    };
    request2.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;

      if (cursor) {
        const data = cursor.value;
        console.log(data);
        Object.assign(data, col);

        const updateRequest = cursor.update(data);
        updateRequest.onsuccess = () => {
          console.log('Column updated successfully:', data);
        };
        updateRequest.onerror = (error) => {
          console.error('Error updating column:', error);
        };

        cursor.continue();
      } else {
        console.log('No more entries');
      }
    };

    request2.onerror = (event) => {
      console.error('Error fetching column by position:', event);
    };
  }
  addColumn(title: string) {
    if (this.db === null) {
      return;
    }
    const transaction = this.db.transaction(['Columnas'], 'readwrite');
    const store = transaction.objectStore('Columnas');
    const column = {
      name: title,
      titleEditable: false,
      estado: true,
      data: [],
      Comments: [],
      position: this.columnList.length + 1,
    };

    // Añadir nueva columna sin especificar ID
    const request = store.add(column);

    request.onsuccess = () => {
      console.log('Columna añadida con ID:', request);
      this.columnList.push({
        id: request.result as number,
        name: title,
        titleEditable: false,
        estado: true,
        data: [],
        Comments: [],
        position: this.columnList.length + 1,
      });
    };

    request.onerror = (event) => {
      console.error('Error al añadir la columna:', event);
    };
  }

  swapValues(columnId1: number, columnId2: number) {
    if (!this.db) {
      console.error('Database not initialized');
      return;
    }

    const transaction: IDBTransaction = this.db.transaction(
      ['Columnas'],
      'readwrite'
    );
    const columnasStore: IDBObjectStore = transaction.objectStore('Columnas');
    const index: IDBIndex = columnasStore.index('position');

    const request1 = index.openCursor(IDBKeyRange.only(columnId1));
    const request2 = index.openCursor(IDBKeyRange.only(columnId2));

    let data1: any, data2: any;
    let cursor1: IDBCursorWithValue | null = null;
    let cursor2: IDBCursorWithValue | null = null;

    request1.onsuccess = (event: Event) => {
      cursor1 = (event.target as IDBRequest<IDBCursorWithValue>).result;
      if (cursor1) {
        data1 = cursor1.value;
        if (data2) {
          performSwap();
        }
      } else {
        console.log('No entry found for columnId1');
      }
    };

    request1.onerror = (event: Event) => {
      console.error('Error fetching column by position for columnId1:', event);
    };

    request2.onsuccess = (event: Event) => {
      cursor2 = (event.target as IDBRequest<IDBCursorWithValue>).result;
      if (cursor2) {
        data2 = cursor2.value;
        if (data1) {
          performSwap();
        }
      } else {
        console.log('No entry found for columnId2');
      }
    };

    request2.onerror = (event: Event) => {
      console.error('Error fetching column by position for columnId2:', event);
    };

    const performSwap = () => {
      if (data1 && data2) {
        const tempPosition: number = data1.position;
        data1.position = data2.position;
        data2.position = tempPosition;

        const updateRequest1: IDBRequest<IDBValidKey> = cursor1!.update(data1);
        updateRequest1.onsuccess = () => {
          console.log('Column 1 updated successfully:', data1);
        };
        updateRequest1.onerror = (error: Event) => {
          console.error('Error updating column 1:', error);
        };

        const updateRequest2: IDBRequest<IDBValidKey> = cursor2!.update(data2);
        updateRequest2.onsuccess = () => {
          console.log('Column 2 updated successfully:', data2);
        };
        updateRequest2.onerror = (error: Event) => {
          console.error('Error updating column 2:', error);
        };
      }
    };
  }

  getAllColumnsByIndex() {
    if (!this.db) {
      console.error('Database not initialized');
      return;
    }

    const transaction = this.db.transaction(['Columnas'], 'readonly');
    const columnasStore = transaction.objectStore('Columnas');
    const index = columnasStore.index('position');
    const request = index.openCursor();
    const allColumns: any[] = [];

    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
      if (cursor) {
        allColumns.push(cursor.value);
        cursor.continue();
      } else {
        console.log('All columns by index name:', allColumns);
        // Aquí puedes actualizar el estado de tu componente o realizar otras acciones con los datos
      }
      console.log(allColumns);
      this.columnList = allColumns;
    };

    request.onerror = (event) => {
      console.error('Error fetching columns by index name:', event);
    };
  }

  searchColumnsByName() {
    if (this.db) {
      this.getAllColumnsByIndex();
    } else {
      console.error('Database not initialized');
    }
  }

  replaceAllColumns(newColumns: Array<{ [key: string]: any }>) {
    if (!this.db) {
      console.error('Database not initialized');
      return;
    }

    const transaction: IDBTransaction = this.db.transaction(
      ['Columnas'],
      'readwrite'
    );
    const columnasStore: IDBObjectStore = transaction.objectStore('Columnas');

    // Step 1: Clear all existing columns
    const clearRequest: any = columnasStore.clear();

    clearRequest.onsuccess = () => {
      // Step 2: Insert new columns
      newColumns.forEach((column, index) => {
        const addRequest: IDBRequest<IDBValidKey> = columnasStore.add({
          ...column,
        });

        addRequest.onsuccess = () => {
          console.log(`New column ${index} added successfully`, column);
        };

        addRequest.onerror = (error: Event) => {
          console.error(`Error adding new column ${index}:`, error);
        };
      });
    };

    clearRequest.onerror = (error: Event) => {
      console.error('Error deleting all columns:', error);
    };
  }

  onBoardClick(event: Event) {
    this.cdr.detectChanges();
  }

  ngAfterViewInit() {
    const separator = document.querySelector('.as-split-gutter') as HTMLElement;
    console.log(separator);

    // separator.style.display = 'none';
    const asZone = document.querySelectorAll('.as-split-area');
    if (asZone.length > 1) {
      const firstSplitArea = asZone[0] as HTMLElement;
      firstSplitArea.style.overflowX = 'auto';
      console.log(firstSplitArea.style.overflowX);
      const secondElement = asZone[1] as HTMLElement;
      secondElement.setAttribute('ng-reflect-visible', 'true');
    }
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
        this.updateColumnData(x.id, x.data);
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
  saveCard(col: string[], idx: any, colId: number) {
    // this.updateData(['dasldjaskldj']);
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
    this.updateColumnData(colId, this.columnList[idx].data);
    console.log(this.columnList[idx].data);
    // this.updateColumHandler(colId, col);
    this.cdr.detectChanges();
    this.columnList[idx].data.push('');
  }
  avoidAddCard(col: string[], idx: number) {
    this.nombre = '';
    // this.isAddingCard = true;
    console.log('first');
    this.columnList[idx].estado = true;
    col.pop();
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
      this.replaceAllColumns(this.columnList);
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
      this.replaceAllColumns(this.columnList);
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
    console.log(this.columnList);
    this.columnList.map((x, index) => {
      console.log(index + 1);
      x.position = index + 1;
      console.log(x.name);
      console.log(x.position);
    });
    this.replaceAllColumns(this.columnList);
  }
}
