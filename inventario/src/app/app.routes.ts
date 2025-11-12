import { Routes } from '@angular/router';
import { Home } from './feature/home/home';
import { Inventory } from './feature/inventory/inventory';
import { Suppliers } from './feature/suppliers/suppliers';
import { CreateSuppliers } from './feature/suppliers/create-suppliers/create-suppliers';
import { ViewSuppliers } from './feature/suppliers/view-suppliers/view-suppliers';



export const routes: Routes = [

    {path: 'home', component: Home},
    { path: 'inventory', component: Inventory},
    { path: 'suppliers', component: Suppliers},
    { path: 'create-suppliers', component: CreateSuppliers},
    {path: 'view-suppliers', component: ViewSuppliers},










    { path: '**', redirectTo: 'home' },
];
