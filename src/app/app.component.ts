import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DragDrop } from './drag-drop/drag-drop.component';
import { AngularSplitModule } from 'angular-split';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DragDrop, AngularSplitModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'angular-17-app';
  visibility = false;
}
