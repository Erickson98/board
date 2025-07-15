import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DragDrop } from './drag-drop/drag-drop.component';
import { AngularSplitModule } from 'angular-split';
import { Header } from './header/header.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DragDrop, AngularSplitModule, Header],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'test';
  visibility = false;
}
