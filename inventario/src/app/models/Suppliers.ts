

export interface Proveedor {
    id?: number;
    nombre_empresa: string;
    nombre_comercial: string;
    tipo_documento: 'cedula' | 'ruc';
    numero_documento: string;
    
    // --- 2. Dirección ---
    provincia: number; 
    canton: number;
    correo: string;
    direccion: string;
    telefono: string;

    // --- 3. Información Bancaria ---
    tipo_banco: string;
    tipo_cuenta: 'Ahorro' | 'Corriente';
    num_cuenta: string;
    dueno_cuenta: string;
    cedula_ruc_dueno: string;

    // --- 4. Detalles Operacionales ---
    rubro: string;
    estado: 'Activo' | 'Inactivo';
    observaciones: string;
    imagen?: File; 
}