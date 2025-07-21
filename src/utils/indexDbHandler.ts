import { MessageService } from 'primeng/api';

export default class IndexDbHandler {
  db: IDBDatabase;
  messageService: MessageService;
  constructor(db: IDBDatabase, messageService: MessageService) {
    this.db = db;
    this.messageService = messageService;
  }
  initDatabase() {
    const request = indexedDB.open('MyDatabase', 1);

    request.onupgradeneeded = (event) => {
      this.db = (event.target as IDBOpenDBRequest).result;
      console.log('Database upgrade / creation triggered');

      const columnasStore = this.db.createObjectStore('Columnas', {
        keyPath: 'id',
        autoIncrement: true,
      });

      columnasStore.createIndex('name', 'name', { unique: false });
      columnasStore.createIndex('position', 'position', { unique: false });

      // const commentsStore = this.db.createObjectStore('Comments', {
      //   keyPath: 'id',
      //   autoIncrement: true,
      // });
    };

    request.onsuccess = (event) => {
      this.db = (event.target as IDBOpenDBRequest).result;

      const transaction = this.db.transaction('Columnas', 'readonly');
      const store = transaction.objectStore('Columnas');
      const countRequest = store.count();

      countRequest.onsuccess = () => {
        const count = countRequest.result;
        if (this.db === null) {
          return;
        }
        if (count > 0) {
          this.getAllColumns();
        }
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Message Content',
        });
      };

      countRequest.onerror = () => {
        console.error('Error checking Columnas store');
      };
    };

    request.onerror = (event) => {
      console.error('Database error:', event);
    };
  }

  update() {}
  delete() {}
  deleteByIndex() {}
  private getAllColumns() {
    const transaction = this.db.transaction(['Columnas'], 'readonly');
    const columnasStore = transaction.objectStore('Columnas');
    const request = columnasStore.openCursor();
    const allColumns: any[] = [];

    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Message Content',
      });
      if (cursor) {
        allColumns.push(cursor.value);
        cursor.continue();
      } else {
        return allColumns;
      }
    };

    request.onerror = (event) => {
      console.error('Error fetching columns:', event);
    };
  }
}
