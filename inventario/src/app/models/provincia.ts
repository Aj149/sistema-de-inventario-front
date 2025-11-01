export interface Provincia {
    id_provincia?: number;
    nombre: string;
    ciudad: Ciudad [];
} 

export interface Ciudad {
    id_ciudad?: number;
    nombre: string;
}