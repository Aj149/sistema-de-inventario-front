export interface Provincia {
    id?: number;
    nombre: string;
    canton: Ciudad [];
} 

export interface Ciudad {
    id?: number;
    nombre: string;
    provincia: number;
}