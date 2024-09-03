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
  ],
})
export class ModalCard {
  constructor(public dialogRef: MatDialogRef<DragDrop>) {}

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
  }
}
