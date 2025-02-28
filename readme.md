# Vue vCard Generator

Un componente Vue para generar vCards con soporte para códigos QR y NFC.

## Características

- Genera vCards en formato estándar (RFC 6350)
- Crea códigos QR automáticamente
- Soporte para escribir en etiquetas NFC
- Compatible con Vue 2 y Vue 3
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

// Vue 2
import Vue from 'vue';
import VCardGenerator from 'vue-vcard-generator';

Vue.use(VCardGenerator);
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

### Ejemplo básico

```vue
<template>
  <div>
    <VCardGenerator 
      :contact="contactInfo"
      @vcard-generated="handleVCardGenerated"
      @nfc-success="handleNFCSuccess"
      @nfc-error="handleNFCError"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      contactInfo: {
        name: 'John Doe',
        organization: 'Example Corp',
        title: 'Software Developer',
        phone: '+1234567890',
        email: 'john.doe@example.com',
        website: 'https://example.com'
      }
    };
  },
  methods: {
    handleVCardGenerated(vcard) {
      console.log('vCard generada:', vcard);
    },
    handleNFCSuccess(message) {
      alert(message);
    },
    handleNFCError(error) {
      console.error('Error NFC:', error);
    }
  }
}
</script>
```

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
