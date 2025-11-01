import { Routes } from '@angular/router';
import { Home } from './feature/home/home';
import { Inventory } from './feature/inventory/inventory';
import { Suppliers } from './feature/suppliers/suppliers';
import { CreateSuppliers } from './feature/create-suppliers/create-suppliers';


export const routes: Routes = [

    {path: 'home', component: Home},
    { path: 'inventory', component: Inventory},
    { path: 'suppliers', component: Suppliers},
    { path: 'create-suppliers', component: CreateSuppliers},










    { path: '**', redirectTo: 'home' },
];
