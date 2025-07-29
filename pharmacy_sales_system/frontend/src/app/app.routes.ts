import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard';
import { ProductoCreate } from './componentes/producto-create/producto-create';
import { ProductoEdit } from './componentes/producto-edit/producto-edit';
import { ProductoList } from './componentes/producto-list/producto-list';
import { Home } from './componentes/home/home';
import { Login } from './componentes/login/login';
import { Register } from './componentes/register/register';
import { UserEdit } from './componentes/user-edit/user-edit';
import { UserList } from './componentes/user-list/user-list';
import { HistorialVentas } from './componentes/historial-ventas/historial-ventas';
import { Estadisticas } from './componentes/estadisticas/estadisticas';


export const routes: Routes = [
  { path: 'home', component: Home, canActivate: [AuthGuard] },
  { path: 'productos', component: ProductoList, canActivate: [AuthGuard] },
  { path: 'productos/nuevo', component: ProductoCreate, canActivate: [AuthGuard] },
  { path: 'productos/editar/:id', component: ProductoEdit, canActivate: [AuthGuard] },
  { path: 'historial-ventas', component: HistorialVentas, canActivate: [AuthGuard] },
  { path: 'estadisticas', component: Estadisticas, canActivate: [AuthGuard] },
  { path: 'users/register', component: Register, canActivate: [AuthGuard] },
  { path: 'users/edit/:id', component: UserEdit, canActivate: [AuthGuard] },
  { path: 'users', component: UserList, canActivate: [AuthGuard] },
  { path: '', component: Login },
  { path: '**', redirectTo: '' },
];
