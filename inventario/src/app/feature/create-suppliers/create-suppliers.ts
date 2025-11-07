import { Component, ChangeDetectorRef } from '@angular/core';
import { NavbarComponent } from "../../shared/navbar/navbar";
import { Footer } from "../../shared/footer/footer";
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProvinciasService } from '../../core/service/provincias.service';
import { Ciudad, Provincia } from '../../models/provincia';
import { Proveedor } from '../../models/Suppliers';
import { SuppliersService } from '../../core/service/suppliers.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-suppliers',
  imports: [NavbarComponent, Footer, FormsModule, CommonModule, ReactiveFormsModule],
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
      nom_empresa: ['', [Validators.required, Validators.minLength(3)]],
      nom_comercial: ['', [Validators.required, Validators.minLength(3)]],
      tipo_documento: ['', Validators.required],
      num_documento: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      provincia: ['', Validators.required],
      ciudad: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      direccion: ['', [Validators.required, Validators.minLength(5)]],
      telefono: ['',[ Validators.required, Validators.pattern(/^[0-9]+$/), Validators.minLength(9), Validators.maxLength(10), ],],
      banco: ['', Validators.required],
      tipo_cuenta: ['', Validators.required],
      num_cuenta: ['',[Validators.required,Validators.pattern('^[0-9]+$'),Validators.minLength(10),Validators.maxLength(20),],],
      dueno_cuenta: ['',[Validators.required,Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/),],],
      cedula_ruc_dueno: ['',[Validators.required,Validators.pattern('^[0-9]+$'),Validators.minLength(10),Validators.maxLength(13),],],
      rubro: ['', Validators.required],
      estado: ['', Validators.required],
      observacion: ['',[Validators.required,Validators.minLength(5),Validators.maxLength(100),Validators.pattern(/^[a-zA-Z0-9\s.,áéíóúÁÉÍÓÚñÑ-]+$/),],],
      imagen:[null]
    });
    this.formSuppliers.get('tipoDocumento')?.valueChanges.subscribe(() => {
      this.formSuppliers.get('numeroDocumento')?.updateValueAndValidity();
    });
  }


ngOnInit(): void {
    this.trerProvincias(); 

  }


  // ###################################

  //  4control sobre los input de cedula y ruc
  

  
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


    imagenSeleccionada(event: any) {
    const file = event.target.files[0];

    if (!file) {
      this.fileName = '';
      this.imagePreview = null;
      this.formSuppliers.get('imagen')?.setValue(null);
      return;
    }

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    const maxSize = 1024 * 500; // 500 KB
    const maxWidth = 800;
    const maxHeight = 400;

    // Validar tipo
    if (!allowedTypes.includes(file.type)) {
      this.formSuppliers.get('imagen')?.setErrors({ invalidType: true });
      this.fileName = '';
      return;
    }

    // Validar tamaño
    if (file.size > maxSize) {
      this.formSuppliers.get('imagen')?.setErrors({ tooLarge: true });
      this.fileName = '';
      return;
    }

    // Validar dimensiones de la imagen
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const img = new Image();
      img.onload = () => {
        if (img.width > maxWidth || img.height > maxHeight) {
          this.formSuppliers.get('imagen')?.setErrors({ wrongDimensions: true });
          this.fileName = '';
        } else {
          this.formSuppliers.get('imagen')?.setValue(file);
          this.formSuppliers.get('imagen')?.setErrors(null);
          this.fileName = file.name;
          this.imagePreview = e.target.result;
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }



  enviar() {
  this.formEnviado = true;
  if (this.formSuppliers.valid) {
    const formValues = this.formSuppliers.value;
    const nuevoProveedor: Proveedor ={
      nom_empresa: formValues.nom_empresa,
      nom_comercial: formValues.nom_comercial,
      tipo_documento: formValues.tipo_cedula,
      num_documento: formValues.num_documento,
      provincia: formValues.provincia,
      ciudad: formValues.ciudad,
      correo: formValues.correo,
      direccion: formValues.direccion,
      telefono: formValues.telefono,
      banco: formValues.banco,
      tipo_cuenta: formValues.tipo_cuenta,
      num_cuenta: formValues.num_cuenta,
      dueno_cuenta: formValues.deuno_cuenta,
      cedula_ruc_dueno: formValues.cedula_ruc_dueno,
      rubro: formValues.rubro,
      estado: formValues.estado,
      observacion: formValues.observacion,
      imagen: formValues.imagen,
    };
    console.log(nuevoProveedor);
    this.suppliersService.crearProveedor(nuevoProveedor).subscribe(
      response =>{
         Swal.fire({
            icon: 'success',
            title: '¡Proveedor creado!',
            text: 'El proveedor se ha creado correctamente.',
            confirmButtonText: 'Aceptar',
            timer: 3000,
            timerProgressBar: true
          });
          this.formSuppliers.reset();
          console.log('Proveedor creado con éxito', response);
      },
       error => {
          // Manejo de errores
          console.error('Error al crear la reserva', error);

          if (error.status === 409) {
            // Error de conflicto: horario ya reservado
            Swal.fire({
              icon: 'error',
              title: 'Horario no disponible',
              text: error.error.message || 'El horario ya está reservado para esa fecha.',
              confirmButtonText: 'Aceptar',
            });
          } else {
            // Otros errores
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ocurrió un error al crear la reserva. Inténtalo de nuevo.',
              confirmButtonText: 'Aceptar',
            });
          }
        }
    );
  }
}






}


