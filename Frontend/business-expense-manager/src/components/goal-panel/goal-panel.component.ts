import { Component, Optional } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-goal-panel',
  standalone: true,
  imports: [],
  templateUrl: './goal-panel.component.html',
  styleUrl: './goal-panel.component.css'
})
export class GoalPanelComponent {
  constructor(@Optional() private dialog: MatDialogRef<any>) {}

  public close(): void {
    this.dialog.close();
  }
}
