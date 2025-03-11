# Vue vCard Generator

Un componente Vue para generar vCards con soporte para códigos QR, NFC y fotos de perfil.

## Características

- Genera vCards en formato estándar (RFC 6350)
- Crea códigos QR automáticamente
- Soporte para fotos de perfil
- Soporte para escribir en etiquetas NFC
- Compatible con Vue 3
- Fácil de integrar y personalizar

## Instalación

```bash
npm install vue-vcard-generator
# o
yarn add vue-vcard-generator
```

## Uso

### Registro global

```js
// Vue 3
import { createApp } from 'vue';
import App from './App.vue';
import VCardGenerator from 'vue-vcard-generator';

const app = createApp(App);
app.use(VCardGenerator);
app.mount('#app');
```

### Registro local

```js
import { VCardGenerator } from 'vue-vcard-generator';

export default {
  components: {
    VCardGenerator
  }
}
```

### Usando script setup (Vue 3)

```vue
<script setup>
import { VCardGenerator } from 'vue-vcard-generator';
import { ref } from 'vue';

// resto del código...
</script>
```

## Ejemplos de uso completos

### Ejemplo básico con script setup

```vue
<template>
  <div>
    <h1>Mi Tarjeta de Contacto</h1>
    <VCardGenerator 
      :contact="contactInfo"
      @vcard-generated="handleVCardGenerated"
      @vcard-downloaded="handleVCardDownloaded"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { VCardGenerator } from 'vue-vcard-generator';

const contactInfo = ref({
  name: 'Juan Pérez',
  firstName: 'Juan',
  lastName: 'Pérez',
  organization: 'Empresa Ejemplo S.L.',
  title: 'Desarrollador Full Stack',
  phone: '+34123456789',
  email: 'juan.perez@ejemplo.com',
  website: 'https://ejemplo.com',
  address: 'Calle Ejemplo 123, Madrid, España',
  linkedin: 'https://linkedin.com/in/juanperez',
  twitter: 'https://twitter.com/juanperez'
});

const handleVCardGenerated = (data) => {
  console.log('vCard generada:', data.vcardString);
  console.log('URL para descarga:', data.dataUrl);
};

const handleVCardDownloaded = () => {
  console.log('vCard descargada correctamente');
};
</script>
```

### Ejemplo con foto de perfil por URL

```vue
<template>
  <div>
    <h1>Mi Tarjeta de Contacto</h1>
    
    <div>
      <h3>URL de la foto</h3>
      <input 
        type="url" 
        v-model="photoUrl" 
        placeholder="https://ejemplo.com/mi-foto.jpg"
      />
    </div>
    
    <VCardGenerator 
      :contact="contactInfo"
      :photo="photoUrl"
      photoType="url"
      @vcard-generated="handleVCardGenerated"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { VCardGenerator } from 'vue-vcard-generator';

const contactInfo = ref({
  name: 'Ana Martínez',
  // ...resto de información de contacto
});

const photoUrl = ref('https://ejemplo.com/mi-foto.jpg');

const handleVCardGenerated = (data) => {
  console.log('vCard generada correctamente');
};
</script>
```

### Ejemplo completo con todas las funcionalidades (QR, NFC y foto)

Consulta el archivo de ejemplo en el repositorio para ver una implementación completa con todas las funcionalidades.

## Notas importantes sobre la funcionalidad NFC

### Requisitos para NFC

La funcionalidad NFC tiene requisitos específicos:

1. **Dispositivo compatible**: Debe tener hardware NFC.
2. **Navegador compatible**: Actualmente solo funciona en Chrome para Android (versión 89 o superior).
3. **HTTPS**: La página debe servirse a través de HTTPS por razones de seguridad.

### Comprobación de compatibilidad NFC

El componente detecta automáticamente si el navegador y dispositivo son compatibles con NFC y solo mostrará el botón "Escribir a NFC" cuando sea compatible.

### Uso de NFC en entorno de desarrollo

Para probar la funcionalidad NFC en un entorno local de desarrollo:

1. Configura un certificado SSL local para tu servidor de desarrollo.
2. Usa un dispositivo Android con NFC.
3. Accede al sitio a través de HTTPS.

```js
// Ejemplo de configuración de vite.config.js para habilitar HTTPS local
export default defineConfig({
  plugins: [vue()],
  server: {
    https: true
  },
  // resto de la configuración...
});
```

### Solución de problemas comunes con NFC

- **El botón NFC no aparece**: El dispositivo o navegador no son compatibles con la API Web NFC.
- **Error al escanear**: Asegúrate de que la etiqueta NFC sea compatible y esté cerca del lector NFC del dispositivo.
- **Error de permiso**: El usuario debe permitir el acceso a NFC cuando el navegador lo solicite.

## Props

| Prop         | Tipo    | Requerido | Descripción                                 |
| ------------ | ------- | --------- | ------------------------------------------- |
| contact      | Object  | Sí        | Información de contacto                     |
| photo        | String  | No        | URL de la foto de perfil                    |
| showQR       | Boolean | No        | Mostrar código QR (por defecto: true)       |
| showNFC      | Boolean | No        | Mostrar botón para NFC (por defecto: false) |
| showDownload | Boolean | No        | Mostrar botón para Descargar vCard          |

### Objeto contact

| Propiedad    | Tipo   | Requerido | Descripción     |
| ------------ | ------ | --------- | --------------- |
| name         | String | Sí        | Nombre completo |
| firstName    | String | No        | Nombre          |
| lastName     | String | No        | Apellido        |
| organization | String | No        | Organización    |
| title        | String | No        | Cargo           |
| phone        | String | No        | Teléfono        |
| email        | String | No        | Email           |
| website      | String | No        | Sitio web       |
| address      | String | No        | Dirección       |
| linkedin     | String | No        | URL de LinkedIn |
| twitter      | String | No        | URL de Twitter  |

## Eventos

| Evento           | Payload                  | Descripción                              |
| ---------------- | ------------------------ | ---------------------------------------- |
| vcard-generated  | { vcardString, dataUrl } | Se emite cuando se genera la vCard       |
| vcard-downloaded | -                        | Se emite cuando se descarga la vCard     |
| nfc-scanning     | -                        | Se emite cuando se inicia el escaneo NFC |
| nfc-success      | message                  | Éxito al escribir la etiqueta NFC        |
| nfc-error        | errorMessage             | Error al escribir la etiqueta NFC        |
| qr-error         | errorMessage             | Error al generar el código QR            |
| photo-error      | errorMessage             | Error al procesar la foto                |

## Licencia

MIT
