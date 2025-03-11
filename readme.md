# Vue vCard Generator

Un componente Vue para generar vCards con soporte para códigos QR y NFC.

## Características

- Genera vCards en formato estándar (RFC 6350)
- Crea códigos QR automáticamente
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

### Ejemplo completo con QR y NFC

```vue
<template>
  <div>
    <h1>Mi Tarjeta de Contacto</h1>
    
    <VCardGenerator 
      :contact="contactInfo"
      :showQR="true"
      :showNFC="true"
      :showDownload="true"
      @vcard-generated="handleVCardGenerated"
      @nfc-scanning="handleNFCScanning"
      @nfc-success="handleNFCSuccess"
      @nfc-error="handleNFCError"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { VCardGenerator } from 'vue-vcard-generator';

const contactInfo = ref({
  name: 'Ana Martínez',
  firstName: 'Ana',
  lastName: 'Martínez',
  organization: 'Tech Solutions',
  title: 'UX Designer',
  phone: '+34987654321',
  email: 'ana.martinez@ejemplo.com',
  website: 'https://anamartinez.com',
  address: 'Avenida Principal 45, Barcelona, España',
  linkedin: 'https://linkedin.com/in/anamartinez',
  twitter: 'https://twitter.com/anamartinez'
});

const handleVCardGenerated = (data) => {
  console.log('vCard generada correctamente');
};

const handleNFCScanning = () => {
  console.log('Escaneando etiqueta NFC...');
};

const handleNFCSuccess = (message) => {
  console.log('Éxito:', message);
};

const handleNFCError = (error) => {
  console.error('Error NFC:', error);
};
</script>
```

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

## Props

| Prop         | Tipo    | Requerido | Descripción                                 |
| ------------ | ------- | --------- | ------------------------------------------- |
| contact      | Object  | Sí        | Información de contacto                     |
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

## Licencia

MIT
