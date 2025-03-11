import { ref as s, watch as C, onMounted as b, createElementBlock as i, openBlock as u, createCommentVNode as h, createElementVNode as p } from "vue";
import $ from "qrcode";
const T = { class: "vcard-generator" }, F = {
  key: 0,
  class: "vcard-photo"
}, L = ["src"], k = {
  key: 1,
  class: "vcard-qr"
}, D = ["src"], I = { class: "vcard-actions" }, U = {
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
    const t = n, o = g, l = s(""), v = s(null), f = s(!1), r = s(null), c = s(null), w = async () => {
      if (!t.photo) {
        r.value = null, c.value = null;
        return;
      }
      try {
        r.value = t.photo;
        const a = await (await fetch(t.photo)).blob(), d = new FileReader();
        d.onload = () => {
          c.value = d.result.split(",")[1], m();
        }, d.onerror = (_) => {
          o("photo-error", "Error al procesar la imagen de URL: " + _), c.value = null;
        }, d.readAsDataURL(a);
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
      e += "END:VCARD", l.value = e, t.showQR && N(), o("vcard-generated", {
        vcardString: e,
        dataUrl: `data:text/vcard;charset=utf-8,${encodeURIComponent(e)}`
      });
    }, N = async () => {
      try {
        v.value = await $.toDataURL(l.value, {
          errorCorrectionLevel: "H",
          margin: 1,
          width: 200
        });
      } catch (e) {
        console.error("Error al generar QR:", e), o("qr-error", e.message);
      }
    }, E = () => {
      const e = `data:text/vcard;charset=utf-8,${encodeURIComponent(
        l.value
      )}`, a = document.createElement("a");
      a.href = e, a.download = `${t.contact.name.replace(/\s+/g, "_")}.vcf`, document.body.appendChild(a), a.click(), document.body.removeChild(a), o("vcard-downloaded");
    }, R = () => {
      f.value = typeof window < "u" && "NDEFReader" in window;
    }, y = async () => {
      if (!f.value) {
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
                  data: l.value
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
    ), b(() => {
      w(), m(), R();
    }), (e, a) => (u(), i("div", T, [
      r.value ? (u(), i("div", F, [
        p("img", {
          src: r.value,
          alt: "Foto de perfil"
        }, null, 8, L)
      ])) : h("", !0),
      v.value ? (u(), i("div", k, [
        p("img", {
          src: v.value,
          alt: "QR Code"
        }, null, 8, D)
      ])) : h("", !0),
      p("div", I, [
        p("button", {
          onClick: E,
          class: "vcard-btn"
        }, "Descargar vCard"),
        f.value && n.showNFC ? (u(), i("button", {
          key: 0,
          onClick: y,
          class: "vcard-btn"
        }, " Escribir a NFC ")) : h("", !0)
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
