import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { TabViewModule } from 'primeng/tabview';
import { MatListModule } from '@angular/material/list';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms'; // Importar FormsModule
import { CommonModule } from '@angular/common'; // Importar CommonModule
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  ProgressSpinnerMode,
  MatProgressSpinnerModule,
} from '@angular/material/progress-spinner';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { debounceTime, fromEvent, Observable, Subscription } from 'rxjs';

/**
 * @title Tab group with asynchronously loading tab contents
 */

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'tab-card',
  templateUrl: 'tab-card.component.html',
  styleUrl: 'tab-card.component.css',
  standalone: true,
  imports: [
    MatTabsModule,
    TabViewModule,
    MatListModule,
    CheckboxModule,
    FormsModule,
    CommonModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    BadgeModule,
    AvatarModule,
  ],
})
export class TabCard implements OnInit, OnDestroy {
  resizeSubscription!: Subscription;

  ngOnInit(): void {
    this.previousLength = this.listComments.length;
    // Nos suscribimos al evento resize con un debounce para optimizar el rendimiento
    this.resizeSubscription = fromEvent(window, 'resize')
      .pipe(debounceTime(200))
      .subscribe((event) => {
        const width = (event.target as Window).innerWidth;
        const height = (event.target as Window).innerHeight;
        console.log(`Width: ${width}, Height: ${height}`);
        this.ngDoCheck();
      });
  }

  ngOnDestroy(): void {
    // Nos desuscribimos al destruir el componente para evitar fugas de memoria
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
  }
  // resizeObservable: Observable<Event>;
  // resizeSubscription: Subscription;
  // constructor(private cdr: ChangeDetectorRef) {
  //   this.resizeObservable = fromEvent(window, 'resize'); // Inicialización de Observable
  //   this.resizeSubscription = new Subscription(); // Inicialización de Subscription (vacía por defecto)

  //   // Ejemplo de suscripción a resizeObservable
  //   this.resizeSubscription = fromEvent(window, 'resize').subscribe((event) => {
  //     this.onResize(event);
  //   });
  // }
  // onResize(event: any) {
  //   console.log('Window resized:', event);
  //   console.log('New width:', window.innerWidth);
  //   console.log('New height:', window.innerHeight);
  //   this.ngDoCheck();
  // }
  // ngOnDestroy() {
  //   // Desuscribirse del evento para evitar fugas de memoria
  //   this.resizeSubscription.unsubscribe();
  // }
  @ViewChild('editableDiv') editableDiv!: ElementRef;
  @ViewChild('commentTextarea') commentTextarea!: ElementRef;
  @ViewChildren('commentTextareas') commentTextareas!: QueryList<ElementRef>;

  isEditable: boolean = false;

  checked = true;

  typesOfShoes: string[] = [
    'Boots',
    'Clogs',
    'Loafers',
    'Moccasins',
    'Sneakers',
  ];
  listTasks = {
    tasks: [
      { content: 'Completar boton', status: true },
      { content: 'Cambiar color', status: false },
    ],
    completed: 1,
  };

  listComments = [
    {
      avatarImg:
        'https://primefaces.org/cdn/primeng/images/demo/avatar/onyamalimba.png',
      name: 'JoseP07',
      timestamp: '2 hours ago',
      comment: 'Completar esto antes del 18',
      edit: false,
      height: 54,
    },
    {
      avatarImg:
        'https://primefaces.org/cdn/primeng/images/demo/avatar/onyamalimba.png',
      name: 'JoseP07',
      timestamp: '2 hours ago',
      comment: 'Completar esto antes del 18',
      edit: false,
      height: 54,
    },
  ];
  value = 50;
  mode: ProgressSpinnerMode = 'determinate';
  contentTask = '';
  contentComment = '';
  isTaskSubmitted: boolean = false; // Controla si el enlace o el textarea se muestra
  textButton: string = 'Add element';
  previousLength = 0;
  auto_grow(element: any) {
    console.log('first');
    // Restablecer la altura temporalmente para evitar errores de cálculo
    console.log(element.style.height);
    element.style.height = 'auto';
    // Ajustar la altura al scrollHeight del contenido
    element.style.height = element.scrollHeight + 'px';
  }

  // Método que activa el enlace y oculta el textarea
  changeStatusForAddOrNot() {
    this.isTaskSubmitted = !this.isTaskSubmitted;
  }
  delteTask(index: number) {
    if (this.listTasks.tasks[index].status) {
      this.listTasks.completed -= 1;
    }
    this.listTasks.tasks.splice(index, 1);
    console.log(this.listTasks);
    if (this.listTasks.completed <= -1) {
      this.listTasks.completed = 0;
    }
  }
  addTask() {
    if (this.contentTask.trim() === '') {
      return;
    }
    this.listTasks.tasks.push({ content: this.contentTask, status: false });
    this.contentTask = '';
  }
  // Controlar el cambio de estado del checkbox
  onCheckboxChange(event: any, index: any) {
    console.log('Checked:', event.checked);
    console.log(index);
    this.listTasks.tasks[index].status = event.checked;
    if (event.checked) {
      this.listTasks.completed += 1;
      return;
    }
    this.listTasks.completed -= 1;
  }
  cancelTask() {
    this.isTaskSubmitted = false;
    this.contentTask = '';
  }
  onInputChange(event: any) {
    const value = event.target.innerText;
    this.contentComment = value;
    console.log(event.target.style.heightStyle);

    // Reiniciar la altura para recalcularla

    const element = event.target as HTMLElement; // Acceder al <div>

    // Obtener la altura actual del div
    const height = element.offsetHeight;
    console.log('Altura actual (offsetHeight):', height);

    // Si necesitas saber la altura total del contenido, incluso si es más grande que el contenedor
    const scrollHeight = element.scrollHeight;
    console.log(scrollHeight);
  }
  onKeyDown(
    event: KeyboardEvent,
    avatarImg: string,
    name: string,
    comment: string
  ): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addComment(avatarImg, name, comment);
    } else if (event.key === 'Escape') {
      this.editableDiv.nativeElement.innerText = '';
    }
  }
  onKeyDownTextArea(event: KeyboardEvent, index: number) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.listComments[index].edit = false;
    }
  }

  addComment(avatarImg: string, name: string, comment: string) {
    console.log(comment);
    const textAreaMain = document.getElementById('div-comment-main');
    console.log(textAreaMain);
    53;
    if (comment.trim() === '' || textAreaMain === null) {
      return;
    }
    console.log(textAreaMain.style.height);
    const element = textAreaMain as HTMLElement; // Acceder al <div>

    // Obtener la altura actual del div
    const height = element.scrollHeight;

    console.log(height);
    this.listComments.unshift({
      avatarImg: avatarImg,
      name: name,
      timestamp: '2 hours ago',
      comment: comment,
      edit: false,
      height: height,
    });
    // this.previousLength = this.listComments.length;
    this.contentComment = '';
    this.editableDiv.nativeElement.innerText = '';
  }
  ngAfterViewInit() {
    console.log('first');

    // this.cdr.detectChanges(); // Solo forzar la detección de cambios si el componente sigue activo
  }

  ngDoCheck(): void {
    console.log(this.listComments.length);
    console.log(this.previousLength);
    // Si cambia la longitud de la lista, ajustamos los textareas
    if (this.listComments.length !== this.previousLength) {
      console.log('first');
      this.previousLength = this.listComments.length;
      this.adjustTextareaHeights();
    }
  }
  adjustTextareaHeights(): void {
    this.commentTextareas.forEach((textareaRef) => {
      const textarea = textareaRef.nativeElement as HTMLTextAreaElement;
      this.auto_grow(textarea); // Ajustar la altura automáticamente
    });
  }
  deletCommnet(index: number) {
    this.listComments.splice(index, 1);
  }
  editar(index: number): void {
    this.listComments[index].edit = true;

    setTimeout(() => {
      const textareasArray = this.commentTextareas.toArray();
      if (textareasArray[index]) {
        textareasArray[index].nativeElement.focus();
      }
    }, 0);
  }
}
