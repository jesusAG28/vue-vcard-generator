import { ref as s, watch as C, onMounted as $, createElementBlock as l, openBlock as d, createCommentVNode as f, createElementVNode as h } from "vue";
import _ from "qrcode";
const D = { class: "vcard-generator" }, T = {
  key: 0,
  class: "vcard-photo"
}, k = ["src"], F = {
  key: 1,
  class: "vcard-qr"
}, L = ["src"], I = { class: "vcard-actions" }, U = {
  __name: "VCardGenerator",
  props: {
    contact: {
      type: Object,
      required: !0,
      validator: function(n) {
        return n.name && (n.email || n.phone);
      }
    },
    photo: {
      type: String,
      default: null
    },
    showQR: {
      type: Boolean,
      default: !0
    },
    showNFC: {
      type: Boolean,
      default: !1
    },
    showDownload: {
      type: Boolean,
      default: !1
    }
  },
  emits: [
    "vcard-generated",
    "vcard-downloaded",
    "nfc-scanning",
    "nfc-success",
    "nfc-error",
    "qr-error",
    "photo-error"
  ],
  setup(n, { emit: g }) {
    const t = n, o = g, i = s(""), p = s(null), v = s(!1), r = s(null), c = s(null), w = async () => {
      if (!t.photo) {
        r.value = null, c.value = null;
        return;
      }
      try {
        r.value = t.photo;
        const a = await (await fetch(t.photo)).blob(), u = new FileReader();
        u.onload = () => {
          c.value = u.result.split(",")[1], m();
        }, u.onerror = (b) => {
          o("photo-error", "Error al procesar la imagen de URL: " + b), c.value = null;
        }, u.readAsDataURL(a);
      } catch (e) {
        o("photo-error", "Error al procesar la imagen: " + e.message), r.value = null, c.value = null;
      }
    }, m = () => {
      let e = `BEGIN:VCARD
VERSION:3.0
`;
      if (e += `FN:${t.contact.name}
`, t.contact.firstName && t.contact.lastName && (e += `N:${t.contact.lastName};${t.contact.firstName};;;
`), t.contact.organization && (e += `ORG:${t.contact.organization}
`), t.contact.title && (e += `TITLE:${t.contact.title}
`), t.contact.phone && (e += `TEL;TYPE=CELL:${t.contact.phone}
`), t.contact.email && (e += `EMAIL:${t.contact.email}
`), t.contact.website && (e += `URL:${t.contact.website}
`), t.contact.address && (e += `ADR:;;${t.contact.address};;;;
`), t.contact.linkedin && (e += `URL;TYPE=LINKEDIN:${t.contact.linkedin}
`), t.contact.twitter && (e += `URL;TYPE=TWITTER:${t.contact.twitter}
`), c.value) {
        let a = "JPEG";
        r.value.includes("data:image/png") ? a = "PNG" : r.value.includes("data:image/gif") && (a = "GIF"), e += `PHOTO;ENCODING=b;TYPE=${a}:${c.value}
`;
      }
      e += "END:VCARD", i.value = e, t.showQR && N(), o("vcard-generated", {
        vcardString: e,
        dataUrl: `data:text/vcard;charset=utf-8,${encodeURIComponent(e)}`
      });
    }, N = async () => {
      try {
        p.value = await _.toDataURL(i.value, {
          errorCorrectionLevel: "H",
          margin: 1,
          width: 200
        });
      } catch (e) {
        console.error("Error al generar QR:", e), o("qr-error", e.message);
      }
    }, E = () => {
      const e = `data:text/vcard;charset=utf-8,${encodeURIComponent(
        i.value
      )}`, a = document.createElement("a");
      a.href = e, a.download = `${t.contact.name.replace(/\s+/g, "_")}.vcf`, document.body.appendChild(a), a.click(), document.body.removeChild(a), o("vcard-downloaded");
    }, R = () => {
      v.value = typeof window < "u" && "NDEFReader" in window;
    }, y = async () => {
      if (!v.value) {
        o("nfc-error", "NFC no es compatible con este dispositivo");
        return;
      }
      try {
        const e = new window.NDEFReader();
        await e.scan(), o("nfc-scanning"), e.onreading = async () => {
          try {
            await e.write({
              records: [
                {
                  recordType: "text",
                  data: i.value
                }
              ]
            }), o("nfc-success", "vCard escrita correctamente a la etiqueta NFC");
          } catch (a) {
            o("nfc-error", a.message);
          }
        };
      } catch (e) {
        o("nfc-error", e.message);
      }
    };
    return C(
      () => t.contact,
      () => {
        m();
      },
      { deep: !0 }
    ), C(
      () => t.photo,
      () => {
        w();
      }
    ), $(() => {
      w(), m(), R();
    }), (e, a) => (d(), l("div", D, [
      r.value ? (d(), l("div", T, [
        h("img", {
          src: r.value,
          alt: "Foto de perfil"
        }, null, 8, k)
      ])) : f("", !0),
      p.value ? (d(), l("div", F, [
        h("img", {
          src: p.value,
          alt: "QR Code"
        }, null, 8, L)
      ])) : f("", !0),
      h("div", I, [
        n.showDownload ? (d(), l("button", {
          key: 0,
          onClick: E,
          class: "vcard-btn"
        }, " Descargar vCard ")) : f("", !0),
        v.value && n.showNFC ? (d(), l("button", {
          key: 1,
          onClick: y,
          class: "vcard-btn"
        }, " Escribir a NFC ")) : f("", !0)
      ])
    ]));
  }
}, P = {
  install(n) {
    n.component("VCardGenerator", U);
  }
};
export {
  U as VCardGenerator,
  P as default
};
