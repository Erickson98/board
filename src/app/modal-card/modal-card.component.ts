import { Component, Inject } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DragDrop } from '../drag-drop/drag-drop.component';
import { AvatarModule } from 'primeng/avatar';
import { MatIconModule } from '@angular/material/icon';
import { TabCard } from '../tab-card/tab-card.component';

@Component({
  selector: 'modal-card',
  templateUrl: 'modal-card.component.html',
  styleUrl: 'modal-card.component.css',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    AvatarModule,
    MatIconModule,
    TabCard,
  ],
})
export class ModalCard {
  constructor(public dialogRef: MatDialogRef<DragDrop>) {}

  openMenu(): void {
    const menuButton = document.getElementById('menuButton');
    if (menuButton === null) {
      return;
    }
    menuButton.addEventListener('click', function () {
      const floatingMenu = document.getElementById('floatingMenu');
      if (floatingMenu === null) {
        return;
      }
      if (
        floatingMenu.style.display === 'none' ||
        floatingMenu.style.display === ''
      ) {
        // Display the menu
        floatingMenu.style.display = 'block';
        floatingMenu.style.position = 'absolute';
        floatingMenu.style.top = `${this.offsetTop + this.offsetHeight + 10}px`; // Position below the button
        floatingMenu.style.left = `${this.offsetLeft}px`; // Align with the button
      } else {
        // Hide the menu
        floatingMenu.style.display = 'none';
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  get_average_rgb(img: any) {
    let context = document.createElement('canvas').getContext('2d');
    if (typeof img == 'string') {
      let src = img;
      img = new Image(300, 300);
      img.setAttribute('crossOrigin', '');
      img.src = src;
    }
    console.log(img.width);
    console.log(typeof img);
    if (context === null) {
      console.log('first');
      return;
    }
    console.log('first');
    context.imageSmoothingEnabled = true;
    context.drawImage(img, 0, 0, 1, 1);
    return context.getImageData(0, 0, 1, 1).data.slice(0, 3);
  }
  ngOnInit(): void {
    // Función getColor llamada cuando la imagen ha cargado completamente
    const image = document.querySelector('img') as HTMLImageElement;
    if (image != null) {
      console.log(this.get_average_rgb(image.src));
    }
    const editableElement = document.getElementById('editable');
    if (editableElement === null) {
      return;
    }
    editableElement.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        event.preventDefault(); // Evitar el salto de línea
        editableElement.blur(); // Quitar el foco del elemento
      }
    });
  }
  auto_grow(element: any) {
    console.log('first');
    // Restablecer la altura temporalmente para evitar errores de cálculo
    console.log(element.style.height);
    element.style.height = 'auto';
    // Ajustar la altura al scrollHeight del contenido
    element.style.height = element.scrollHeight + 10 + 'px';
  }
}
