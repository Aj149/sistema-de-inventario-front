import { Component, ChangeDetectorRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { RouterLink } from "@angular/router";
import { NavbarComponent } from '../../../shared/navbar/navbar';
import { Footer } from '../../../shared/footer/footer';
import { Ciudad, Provincia } from '../../../models/provincia';
import { ProvinciasService } from '../../../core/service/provincias.service';
import { SuppliersService } from '../../../core/service/suppliers.service';

@Component({
  selector: 'app-create-suppliers',
  imports: [NavbarComponent, Footer, FormsModule, CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './create-suppliers.html',
  styleUrl: './create-suppliers.css'
})
export class CreateSuppliers {

  
  formSuppliers: FormGroup;

  provincias: Provincia []=[];
  ciudadesFiltradas: Ciudad[] = [];
  provinciaSeleccionada: number | null = null;
  formEnviado: boolean = false;

  fileName: string = '';
  imagePreview: string | ArrayBuffer | null = null;


  
  constructor(
    private fb: FormBuilder,
    private provinciaService: ProvinciasService,
    private suppliersService: SuppliersService,
    private cdr: ChangeDetectorRef
  ) {
    this.formSuppliers = this.fb.group({
      nombre_empresa: ['', [Validators.required, Validators.minLength(3)]],
      nombre_comercial: ['', [Validators.required, Validators.minLength(3)]],
      tipo_documento: ['', Validators.required],
      numero_documento: ['', [Validators.required, this.validarDocumento.bind(this)]],
      provincia: ['', Validators.required],
      canton: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      direccion: ['', [Validators.required, Validators.minLength(5)]],
      telefono: ['',[ Validators.required, Validators.pattern(/^[0-9]+$/), Validators.minLength(9), Validators.maxLength(10), ],],
      tipo_banco: ['', Validators.required],
      tipo_cuenta: ['', Validators.required],
      num_cuenta: ['',[Validators.required,Validators.pattern('^[0-9]+$'),Validators.minLength(10),Validators.maxLength(20),],],
      dueno_cuenta: ['',[Validators.required,Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/),],],
      cedula_ruc_dueno: ['',[Validators.required,Validators.pattern('^[0-9]+$'),Validators.minLength(10),Validators.maxLength(13),],],
      rubro: ['', Validators.required],
      estado: ['', Validators.required],
      observaciones: ['',[Validators.required,Validators.minLength(5),Validators.maxLength(100),Validators.pattern(/^[a-zA-Z0-9\s.,áéíóúÁÉÍÓÚñÑ-]+$/),],],
      imagen:[null]
    });
    this.formSuppliers.get('tipo_documento')?.valueChanges.subscribe(() => {
  this.formSuppliers.get('numero_documento')?.reset();
  this.formSuppliers.get('numero_documento')?.updateValueAndValidity();
    });
  }


ngOnInit(): void {
    this.trerProvincias(); 

  }


  // ###################################

  //  4control sobre los input de cedula y ruc
  

  
  // Validador personalizado
  validarDocumento(control: AbstractControl): ValidationErrors | null {
  const tipo = this.formSuppliers?.get('tipo_documento')?.value;
  const numero = control.value;
  
  if (!numero || !tipo) {
    return null;
  }
  
  // Validar que sean solo números
  if (!/^\d+$/.test(numero)) {
    return { soloNumeros: 'Solo se permiten números' };
  }
  
  // Validar longitud según el tipo
  if (tipo === 'CEDULA' && numero.length !== 10) {
    return { longitudInvalida: 'La cédula debe tener 10 dígitos' };
  }
  
  if (tipo === 'RUC' && numero.length !== 13) {
    return { longitudInvalida: 'El RUC debe tener 13 dígitos' };
  }
  
  // Validar formato específico
  if (tipo === 'CEDULA') {
    return this.validarCedulaEcuatoriana(numero);
  }
  
  if (tipo === 'RUC') {
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
    return { formatoInvalido: 'Los primeros 10 dígitos del RUC no forman un ruc válido' };
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
trerProvincias(): void {
  this.provinciaService.obtenerProvincia().subscribe({
    next: (data) => {
      this.provincias = data;
      this.cdr.detectChanges();
    },
    error: (error) => {
      console.error("❌ Error cargando provincias:", error);
    },
  });
}


    onProvinciaChange(event: Event) {
  const provinciaId = Number((event.target as HTMLSelectElement).value);
  
  // Si no hay provincia seleccionada, limpiar ciudades
  if (!provinciaId) {
    this.ciudadesFiltradas = [];
    return;
  }

  // Limpiar ciudades previas antes de cargar nuevas
  this.ciudadesFiltradas = [];

  this.provinciaService.obtenerCiudadesPorProvincia(provinciaId).subscribe(
    (data) => {
      this.ciudadesFiltradas = data;
      console.log("Ciudades filtradas:", this.ciudadesFiltradas);
      this.cdr.detectChanges();
    },
    (error) => console.error("Error al obtener ciudades:", error)
  );
}



 // 4Método para verificar si el campo rubro tiene error.
  campoInvalido(campo: string): boolean {
      const control = this.formSuppliers.get(campo);
      return !!(control && control.invalid && (control.dirty || control.touched));
    }
selectedFile: File | null = null;


    imagenSeleccionada(event: any) {
    const file = event.target.files[0];

    if (!file) {
      this.fileName = '';
      this.imagePreview = null;
      this.formSuppliers.get('imagen')?.setValue(null);
      return;
    }

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    const maxSize = 1024 * 2000; //2mb
    // const maxWidth = 900;
    // const maxHeight = 500;


     // ✅ Guardar el archivo sin asignarlo al formControl
  this.selectedFile = file;
  this.formSuppliers.get('imagen')?.setErrors(null);
  this.fileName = file.name;

    // Validar tipo
    if (!allowedTypes.includes(file.type)) {
      this.formSuppliers.get('imagen')?.setErrors({ invalidType: true });
      this.fileName = '';
      return;
    }

    const reader = new FileReader();
  reader.onload = (e: any) => {
    this.imagePreview = e.target.result;
  };
  reader.readAsDataURL(file);
  }

      


  // Vista previa
 enviar() {
  this.formEnviado = true;

  // Verifica si el formulario es válido
  if (!this.formSuppliers.valid) {
    console.error('FORMULARIO INVÁLIDO');
    // Mostrar alerta con los campos específicos
    Swal.fire({
      icon: 'error',
      title: 'Formulario incompleto o inválido',
      confirmButtonText: 'Aceptar',
    });

    return; // Detener el envío
  }

  const formValues = this.formSuppliers.value;
  const formData = new FormData();

  // Agrega todos los campos al FormData
  for (const key in formValues) {
    if (formValues.hasOwnProperty(key) && key !== 'imagen') {
      formData.append(key, formValues[key]);
    }
  }

  // Agrega la imagen si existe
  if (this.selectedFile) {
    formData.append('imagen', this.selectedFile);
  }

  // Llama al servicio
  this.suppliersService.crearProveedor(formData).subscribe({
    next: (response) => {
      Swal.fire({
        icon: 'success',
        title: '¡Proveedor creado!',
        text: 'El proveedor se ha creado correctamente.',
        confirmButtonText: 'Aceptar',
        timer: 3000,
        timerProgressBar: true,
      });
      this.formSuppliers.reset();
      this.imagePreview = null;
      this.fileName = '';
    },
    error: (error) => {
      console.error('Error al crear el proveedor', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al crear el proveedor. Inténtalo de nuevo.',
        confirmButtonText: 'Aceptar',
      });
    },
  });
}





}


