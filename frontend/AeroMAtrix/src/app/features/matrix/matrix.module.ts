import { NgModule } from '@angular/core';
import { RouterModule, type Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

// Components
import { MatrixDetailComponent } from '../../components/matrix-detail/matrix-detail.component';
import { MatrixFormComponent } from '../../components/matrix-form/matrix-form.component';
import { MatrixListComponent } from '../../components/matrix-list/matrix-list.component';
import { MatrixVisualComponent } from '../../components/matrix-visual/matrix-visual.component';

const routes: Routes = [
  { path: 'matrices', component: MatrixListComponent },
  { path: 'matrices/:id', component: MatrixDetailComponent },
];

@NgModule({
  declarations: [
    MatrixListComponent,
    MatrixDetailComponent,
    MatrixFormComponent,
    MatrixVisualComponent,
  ],
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [
    MatrixListComponent,
    MatrixDetailComponent,
    MatrixFormComponent,
    MatrixVisualComponent,
  ],
})
export class MatrixModule {}
