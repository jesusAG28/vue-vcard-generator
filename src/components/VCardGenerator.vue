<template>
  <div class="vcard-generator">
    <div v-if="qrCode" class="vcard-qr">
      <img :src="qrCode" alt="QR Code" />
    </div>
    <div class="vcard-actions">
      <button @click="downloadVCard" class="vcard-btn">Descargar vCard</button>
      <button v-if="nfcSupported" @click="writeToNFC" class="vcard-btn">
        Escribir a NFC
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import QRCode from "qrcode";

const props = defineProps({
  contact: {
    type: Object,
    required: true,
    validator: function (value) {
      return value.name && (value.email || value.phone);
    },
  },
  showQR: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits([
  "vcard-generated",
  "vcard-downloaded",
  "nfc-scanning",
  "nfc-success",
  "nfc-error",
  "qr-error",
]);

const vcardData = ref("");
const qrCode = ref(null);
const nfcSupported = ref(false);

// Generar vCard
const generateVCard = () => {
  // Formato estándar vCard
  let vcard = "BEGIN:VCARD\nVERSION:3.0\n";

  // Datos obligatorios
  vcard += `FN:${props.contact.name}\n`;

  // Datos opcionales con comprobación
  if (props.contact.firstName && props.contact.lastName) {
    vcard += `N:${props.contact.lastName};${props.contact.firstName};;;\n`;
  }

  if (props.contact.organization) {
    vcard += `ORG:${props.contact.organization}\n`;
  }

  if (props.contact.title) {
    vcard += `TITLE:${props.contact.title}\n`;
  }

  if (props.contact.phone) {
    vcard += `TEL;TYPE=CELL:${props.contact.phone}\n`;
  }

  if (props.contact.email) {
    vcard += `EMAIL:${props.contact.email}\n`;
  }

  if (props.contact.website) {
    vcard += `URL:${props.contact.website}\n`;
  }

  if (props.contact.address) {
    vcard += `ADR:;;${props.contact.address};;;;\n`;
  }

  // Redes sociales
  if (props.contact.linkedin) {
    vcard += `URL;TYPE=LINKEDIN:${props.contact.linkedin}\n`;
  }

  if (props.contact.twitter) {
    vcard += `URL;TYPE=TWITTER:${props.contact.twitter}\n`;
  }

  vcard += "END:VCARD";

  vcardData.value = vcard;

  // Generar QR si está habilitado
  if (props.showQR) {
    generateQRCode();
  }

  // Emitir evento con los datos generados
  emit("vcard-generated", {
    vcardString: vcard,
    dataUrl: `data:text/vcard;charset=utf-8,${encodeURIComponent(vcard)}`,
  });
};

// Generar código QR
const generateQRCode = async () => {
  try {
    qrCode.value = await QRCode.toDataURL(vcardData.value, {
      errorCorrectionLevel: "H",
      margin: 1,
      width: 200,
    });
  } catch (error) {
    console.error("Error al generar QR:", error);
    emit("qr-error", error.message);
  }
};

// Descargar vCard
const downloadVCard = () => {
  const dataUrl = `data:text/vcard;charset=utf-8,${encodeURIComponent(
    vcardData.value
  )}`;
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = `${props.contact.name.replace(/\s+/g, "_")}.vcf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  emit("vcard-downloaded");
};

// Comprobar soporte NFC
const checkNFCSupport = () => {
  nfcSupported.value = typeof window !== "undefined" && "NDEFReader" in window;
};

// Escribir en NFC
const writeToNFC = async () => {
  if (!nfcSupported.value) {
    emit("nfc-error", "NFC no es compatible con este dispositivo");
    return;
  }

  try {
    const ndef = new window.NDEFReader();
    await ndef.scan();

    emit("nfc-scanning");

    ndef.onreading = async () => {
      try {
        await ndef.write({
          records: [
            {
              recordType: "text",
              data: vcardData.value,
            },
          ],
        });

        emit("nfc-success", "vCard escrita correctamente a la etiqueta NFC");
      } catch (error) {
        emit("nfc-error", error.message);
      }
    };
  } catch (error) {
    emit("nfc-error", error.message);
  }
};

// Watch para cambios en contact
watch(
  () => props.contact,
  () => {
    generateVCard();
  },
  { deep: true }
);

// Inicializar al montar
onMounted(() => {
  generateVCard();
  checkNFCSupport();
});
</script>

<style>
.vcard-generator {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
}

.vcard-qr {
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  padding: 0.5rem;
  border-radius: 4px;
}

.vcard-qr img {
  display: block;
  max-width: 100%;
  height: auto;
}

.vcard-actions {
  display: flex;
  gap: 0.5rem;
  width: 100%;
}

.vcard-btn {
  flex: 1;
  padding: 0.5rem 1rem;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s;
}

.vcard-btn:hover {
  background-color: #3367d6;
}
</style>
