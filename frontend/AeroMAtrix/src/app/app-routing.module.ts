import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatrixDetailComponent } from './components/matrix-detail/matrix-detail.component';
import { MatrixListComponent } from './components/matrix-list/matrix-list.component';

const routes: Routes = [
  { path: '', redirectTo: '/matrices', pathMatch: 'full' },
  { path: 'matrices', component: MatrixListComponent },
  { path: 'matrices/:id', component: MatrixDetailComponent },
  // Agrega más rutas según sea necesario
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
