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

<script>
import QRCode from "qrcode";

export default {
  name: "VCardGenerator",
  props: {
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
  },
  data() {
    return {
      vcardData: "",
      qrCode: null,
      nfcSupported: false,
    };
  },
  mounted() {
    this.generateVCard();
    this.checkNFCSupport();
  },
  watch: {
    contact: {
      deep: true,
      handler() {
        this.generateVCard();
      },
    },
  },
  methods: {
    generateVCard() {
      // Formato estándar vCard
      let vcard = "BEGIN:VCARD\nVERSION:3.0\n";

      // Datos obligatorios
      vcard += `FN:${this.contact.name}\n`;

      // Datos opcionales con comprobación
      if (this.contact.firstName && this.contact.lastName) {
        vcard += `N:${this.contact.lastName};${this.contact.firstName};;;\n`;
      }

      if (this.contact.organization) {
        vcard += `ORG:${this.contact.organization}\n`;
      }

      if (this.contact.title) {
        vcard += `TITLE:${this.contact.title}\n`;
      }

      if (this.contact.phone) {
        vcard += `TEL;TYPE=CELL:${this.contact.phone}\n`;
      }

      if (this.contact.email) {
        vcard += `EMAIL:${this.contact.email}\n`;
      }

      if (this.contact.website) {
        vcard += `URL:${this.contact.website}\n`;
      }

      if (this.contact.address) {
        vcard += `ADR:;;${this.contact.address};;;;\n`;
      }

      // Redes sociales
      if (this.contact.linkedin) {
        vcard += `URL;TYPE=LINKEDIN:${this.contact.linkedin}\n`;
      }

      if (this.contact.twitter) {
        vcard += `URL;TYPE=TWITTER:${this.contact.twitter}\n`;
      }

      vcard += "END:VCARD";

      this.vcardData = vcard;

      // Generar QR si está habilitado
      if (this.showQR) {
        this.generateQRCode();
      }

      // Emitir evento con los datos generados
      this.$emit("vcard-generated", {
        vcardString: vcard,
        dataUrl: `data:text/vcard;charset=utf-8,${encodeURIComponent(vcard)}`,
      });
    },

    async generateQRCode() {
      try {
        this.qrCode = await QRCode.toDataURL(this.vcardData, {
          errorCorrectionLevel: "H",
          margin: 1,
          width: 200,
        });
      } catch (error) {
        console.error("Error al generar QR:", error);
        this.$emit("qr-error", error.message);
      }
    },

    downloadVCard() {
      const dataUrl = `data:text/vcard;charset=utf-8,${encodeURIComponent(
        this.vcardData
      )}`;
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${this.contact.name.replace(/\s+/g, "_")}.vcf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      this.$emit("vcard-downloaded");
    },

    checkNFCSupport() {
      this.nfcSupported =
        typeof window !== "undefined" && "NDEFReader" in window;
    },

    async writeToNFC() {
      if (!this.nfcSupported) {
        this.$emit("nfc-error", "NFC no es compatible con este dispositivo");
        return;
      }

      try {
        const ndef = new window.NDEFReader();
        await ndef.scan();

        this.$emit("nfc-scanning");

        ndef.onreading = async () => {
          try {
            await ndef.write({
              records: [
                {
                  recordType: "text",
                  data: this.vcardData,
                },
              ],
            });

            this.$emit(
              "nfc-success",
              "vCard escrita correctamente a la etiqueta NFC"
            );
          } catch (error) {
            this.$emit("nfc-error", error.message);
          }
        };
      } catch (error) {
        this.$emit("nfc-error", error.message);
      }
    },
  },
};
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
