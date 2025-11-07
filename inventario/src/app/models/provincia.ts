export interface Provincia {
    id?: number;
    nombre: string;
    ciudad: Ciudad [];
} 

export interface Ciudad {
    id?: number;
    nombre: string;
    provincia: number;
}