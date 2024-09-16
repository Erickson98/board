import { Component, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
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
  ],
})
export class TabCard {
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

  value = 50;
  mode: ProgressSpinnerMode = 'determinate';
  contentTask = '';
  isTaskSubmitted: boolean = false; // Controla si el enlace o el textarea se muestra
  textButton: string = 'Add element';

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
}
