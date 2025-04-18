import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent {}
