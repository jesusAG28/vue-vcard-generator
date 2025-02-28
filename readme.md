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

### Ejemplo completo con todas las funcionalidades (QR y NFC)

```vue
<template>
  <div class="contact-card-container">
    <h1>Tarjeta de Contacto Digital</h1>
    
    <div class="status-messages">
      <div v-if="nfcStatus" :class="['nfc-status', nfcStatusType]">{{ nfcStatus }}</div>
    </div>
    
    <VCardGenerator 
      :contact="contactInfo"
      :showQR="showQrCode"
      @vcard-generated="handleVCardGenerated"
      @vcard-downloaded="handleVCardDownloaded"
      @nfc-scanning="handleNFCScanning"
      @nfc-success="handleNFCSuccess"
      @nfc-error="handleNFCError"
      @qr-error="handleQRError"
    />
    
    <div class="options">
      <button @click="showQrCode = !showQrCode">
        {{ showQrCode ? 'Ocultar QR' : 'Mostrar QR' }}
      </button>
      
      <div class="contact-form">
        <h2>Editar Información</h2>
        <label>
          Nombre:
          <input v-model="contactInfo.name" />
        </label>
        <label>
          Organización:
          <input v-model="contactInfo.organization" />
        </label>
        <label>
          Cargo:
          <input v-model="contactInfo.title" />
        </label>
        <label>
          Teléfono:
          <input v-model="contactInfo.phone" />
        </label>
        <label>
          Email:
          <input v-model="contactInfo.email" />
        </label>
        <label>
          Web:
          <input v-model="contactInfo.website" />
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { VCardGenerator } from 'vue-vcard-generator';

const showQrCode = ref(true);
const nfcStatus = ref('');
const nfcStatusType = ref('');

const contactInfo = ref({
  name: 'María García',
  firstName: 'María',
  lastName: 'García',
  organization: 'Desarrollo Web SL',
  title: 'Desarrolladora Laravel/Vue',
  phone: '+34612345678',
  email: 'maria.garcia@ejemplo.com',
  website: 'https://mariaweb.dev',
  address: 'Calle Innovación 42, Barcelona',
  linkedin: 'https://linkedin.com/in/mariagarcia',
  twitter: 'https://twitter.com/mariagarcia_dev'
});

const handleVCardGenerated = (data) => {
  console.log('vCard generada correctamente');
  
  // Ejemplo de cómo podrías guardar la vCard en localStorage
  localStorage.setItem('myVCard', data.vcardString);
};

const handleVCardDownloaded = () => {
  nfcStatus.value = 'Tarjeta descargada correctamente';
  nfcStatusType.value = 'success';
  
  // Limpiar el mensaje después de 3 segundos
  setTimeout(() => {
    nfcStatus.value = '';
  }, 3000);
};

const handleNFCScanning = () => {
  nfcStatus.value = 'Acerca una etiqueta NFC al dispositivo...';
  nfcStatusType.value = 'info';
};

const handleNFCSuccess = (message) => {
  nfcStatus.value = message;
  nfcStatusType.value = 'success';
  
  // Limpiar el mensaje después de 5 segundos
  setTimeout(() => {
    nfcStatus.value = '';
  }, 5000);
};

const handleNFCError = (error) => {
  nfcStatus.value = `Error NFC: ${error}`;
  nfcStatusType.value = 'error';
  
  // Si el error es que el dispositivo no soporta NFC
  if (error === 'NFC no es compatible con este dispositivo') {
    // Puedes mostrar información adicional al usuario
    console.warn('Este navegador o dispositivo no tiene soporte para NFC. La funcionalidad NFC requiere Chrome para Android 89+ y HTTPS.');
  }
  
  // Limpiar el mensaje después de 5 segundos
  setTimeout(() => {
    nfcStatus.value = '';
  }, 5000);
};

const handleQRError = (error) => {
  nfcStatus.value = `Error al generar QR: ${error}`;
  nfcStatusType.value = 'error';
  
  // Limpiar el mensaje después de 5 segundos
  setTimeout(() => {
    nfcStatus.value = '';
  }, 5000);
};
</script>

<style>
.contact-card-container {
  font-family: Arial, sans-serif;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.status-messages {
  min-height: 40px;
  margin-bottom: 20px;
}

.nfc-status {
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 10px;
}

.nfc-status.success {
  background-color: #e6ffe6;
  border: 1px solid #00cc00;
  color: #006600;
}

.nfc-status.error {
  background-color: #ffe6e6;
  border: 1px solid #cc0000;
  color: #990000;
}

.nfc-status.info {
  background-color: #e6f2ff;
  border: 1px solid #0066cc;
  color: #004080;
}

.options {
  margin-top: 30px;
}

.contact-form {
  margin-top: 20px;
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 4px;
}

.contact-form label {
  display: block;
  margin-bottom: 10px;
}

.contact-form input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  background-color: #4285f4;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #3367d6;
}
</style>
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

### Solución de problemas comunes con NFC

- **El botón NFC no aparece**: El dispositivo o navegador no son compatibles con la API Web NFC.
- **Error al escanear**: Asegúrate de que la etiqueta NFC sea compatible y esté cerca del lector NFC del dispositivo.
- **Error de permiso**: El usuario debe permitir el acceso a NFC cuando el navegador lo solicite.

## Props

| Prop    | Tipo    | Requerido | Descripción                           |
| ------- | ------- | --------- | ------------------------------------- |
| contact | Object  | Sí        | Información de contacto               |
| showQR  | Boolean | No        | Mostrar código QR (por defecto: true) |

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