import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DataComponent } from './data/data.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
    {
        path:'',component:LoginComponent
    },
    {
        path:'employees',component:DataComponent,canActivate:[AuthGuard]
    },
   
];
