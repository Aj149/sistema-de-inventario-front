import { Provincia, Ciudad } from './provincia';

export interface Proveedor {
    id?: number;
    nom_empresa: string;
    nom_comercial: string;
    tipo_documento: 'cedula' | 'ruc';
    num_documento: string;
    
    // --- 2. Dirección ---
    provincia: number; 
    ciudad: number;
    correo: string;
    direccion: string;
    telefono: string;

    // --- 3. Información Bancaria ---
    banco: string;
    tipo_cuenta: 'Ahorro' | 'Corriente';
    num_cuenta: string;
    dueno_cuenta: string;
    cedula_ruc_dueno: string;

    // --- 4. Detalles Operacionales ---
    rubro: string;
    estado: 'Activo' | 'Inactivo';
    observacion: string;
    imagen?: File; 
}