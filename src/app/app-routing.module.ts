import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactListComponent } from './contact-list/contact-list.component';

const routes: Routes = [{
  path: '',
  redirectTo:'/contactsList',
  pathMatch: 'full'
},{
  path:'contactsList',
  component: ContactListComponent
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
