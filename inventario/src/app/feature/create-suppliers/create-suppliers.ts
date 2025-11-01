import { Component } from '@angular/core';
import { NavbarComponent } from "../../shared/navbar/navbar";
import { Footer } from "../../shared/footer/footer";
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Documento } from '../../models/createSuppliers';

@Component({
  selector: 'app-create-suppliers',
  imports: [NavbarComponent, Footer, FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './create-suppliers.html',
  styleUrl: './create-suppliers.css'
})
export class CreateSuppliers {

  documento: Documento = {tipo: 'cedula', numero: ''}
  formSuppliers: FormGroup;
  
  constructor(private fb: FormBuilder) {
    this.formSuppliers = this.fb.group({
      nombreEmpresa: ['', [Validators.required, Validators.minLength(3)]],
      nombreComercial: ['', [Validators.required, Validators.minLength(3)]],
       tipoDocumento: ['cedula', Validators.required], // valor por defecto
        numero: ['', [Validators.required, this.validarDocumento.bind(this)]]
    });
    this.formSuppliers.get('tipoDocumento')?.valueChanges.subscribe(() => {
      this.formSuppliers.get('numeroDocumento')?.updateValueAndValidity();
    });
  }

  // ###################################

  //  4control sobre los input de cedula y ruc
  get f() {
  return this.formSuppliers.controls;
  }
  
  // Validador personalizado
  validarDocumento(control: AbstractControl): ValidationErrors | null {
  const tipo = this.formSuppliers?.get('tipoDocumento')?.value;
  const numero = control.value;
  
  if (!numero || !tipo) {
    return null;
  }
  
  // Validar que sean solo números
  if (!/^\d+$/.test(numero)) {
    return { soloNumeros: 'Solo se permiten números' };
  }
  
  // Validar longitud según el tipo
  if (tipo === 'cedula' && numero.length !== 10) {
    return { longitudInvalida: 'La cédula debe tener 10 dígitos' };
  }
  
  if (tipo === 'ruc' && numero.length !== 13) {
    return { longitudInvalida: 'El RUC debe tener 13 dígitos' };
  }
  
  // Validar formato específico
  if (tipo === 'cedula') {
    return this.validarCedulaEcuatoriana(numero);
  }
  
  if (tipo === 'ruc') {
    return this.validarRucEcuatoriano(numero);
  }
  
  return null;
  }
  
  validarCedulaEcuatoriana(cedula: string): ValidationErrors | null {
  if (cedula.length !== 10 || !/^\d+$/.test(cedula)) {
  return { formatoInvalido: 'La cédula debe tener 10 dígitos numéricos' };
  }
  
  const provincia = parseInt(cedula.substring(0, 2));
  if (provincia < 1 || provincia > 24) {
  return { formatoInvalido: 'Los dos primeros dígitos no corresponden a una provincia válida' };
  }
  
  const digitos = cedula.split('').map(d => parseInt(d));
  const digitoVerificador = digitos[9];
  
  let suma = 0;
  for (let i = 0; i < 9; i++) {
  let valor = digitos[i];
  if (i % 2 === 0) { // posición impar (0,2,4,6,8)
    valor *= 2;
    if (valor > 9) valor -= 9;
  }
  suma += valor;
  }
  
  const decenaSuperior = Math.ceil(suma / 10) * 10;
  const digitoCalculado = decenaSuperior - suma;
  
  if (digitoCalculado !== digitoVerificador) {
  return { formatoInvalido: 'Dígito verificador incorrecto' };
  }
  
  return null; // cédula válida
  }
  
  
  validarRucEcuatoriano(ruc: string): ValidationErrors | null {
  // Validar que los primeros 10 dígitos sean una cédula válida
  const cedulaBase = ruc.substring(0, 10);
  const cedulaError = this.validarCedulaEcuatoriana(cedulaBase);
  if (cedulaError) {
    return { formatoInvalido: 'Los primeros 10 dígitos del RUC no forman una cédula válida' };
  }
  
  // Validar que los últimos 3 dígitos sean de establecimiento válido
  const establecimiento = ruc.substring(10, 13);
  if (parseInt(establecimiento) < 1) {
    return { formatoInvalido: 'Los últimos 3 dígitos del RUC son inválidos' };
  }
  
  return null;
  }
  // ###################################

  
    // 4trer las cuidades y provincias

    trerProvincias(): void{
      this.
      // hacer la logica para traer las provincias y ciudades de la base de datos
    }








  CreateSuppliers() {}
  
  provincias: string[] = [];       // Lista de provincias
  cantones: string[] = [];         // Lista de cantones según la provincia seleccionada
  provinciaSeleccionada: string = '';
  cantonSeleccionado: string = '';

  provinciasData: { [key: string]: string[] } = {};

  

  // Llamar cuando cambie la provincia
  seleccionarProvincia(): void {
    if (this.provinciaSeleccionada && this.provinciasData[this.provinciaSeleccionada]) {
      this.cantones = this.provinciasData[this.provinciaSeleccionada];
      this.cantonSeleccionado = ''; // Resetear canton al cambiar provincia
    } else {
      this.cantones = [];
      this.cantonSeleccionado = '';
    }
  }

  // Llamar cuando se seleccione un cantón (opcional)
  onCantonChange(): void {
    console.log('Cantón seleccionado:', this.cantonSeleccionado);
  }


}
