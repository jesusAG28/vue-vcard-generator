import { ref as l, watch as N, onMounted as R, createElementBlock as r, openBlock as d, createCommentVNode as f, createElementVNode as m } from "vue";
import g from "qrcode";
const E = { class: "vcard-generator" }, y = {
  key: 0,
  class: "vcard-qr"
}, $ = ["src"], k = { class: "vcard-actions" }, D = {
  __name: "VCardGenerator",
  props: {
    contact: {
      type: Object,
      required: !0,
      validator: function(a) {
        return a.name && (a.email || a.phone);
      }
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
    "qr-error"
  ],
  setup(a, { emit: v }) {
    const t = a, n = v, o = l(""), s = l(null), i = l(!1), u = () => {
      let e = `BEGIN:VCARD
VERSION:3.0
`;
      e += `FN:${t.contact.name}
`, t.contact.firstName && t.contact.lastName && (e += `N:${t.contact.lastName};${t.contact.firstName};;;
`), t.contact.organization && (e += `ORG:${t.contact.organization}
`), t.contact.title && (e += `TITLE:${t.contact.title}
`), t.contact.phone && (e += `TEL;TYPE=CELL:${t.contact.phone}
`), t.contact.email && (e += `EMAIL:${t.contact.email}
`), t.contact.website && (e += `URL:${t.contact.website}
`), t.contact.address && (e += `ADR:;;${t.contact.address};;;;
`), t.contact.linkedin && (e += `URL;TYPE=LINKEDIN:${t.contact.linkedin}
`), t.contact.twitter && (e += `URL;TYPE=TWITTER:${t.contact.twitter}
`), e += "END:VCARD", o.value = e, t.showQR && w(), n("vcard-generated", {
        vcardString: e,
        dataUrl: `data:text/vcard;charset=utf-8,${encodeURIComponent(e)}`
      });
    }, w = async () => {
      try {
        s.value = await g.toDataURL(o.value, {
          errorCorrectionLevel: "H",
          margin: 1,
          width: 200
        });
      } catch (e) {
        console.error("Error al generar QR:", e), n("qr-error", e.message);
      }
    }, C = () => {
      const e = `data:text/vcard;charset=utf-8,${encodeURIComponent(
        o.value
      )}`, c = document.createElement("a");
      c.href = e, c.download = `${t.contact.name.replace(/\s+/g, "_")}.vcf`, document.body.appendChild(c), c.click(), document.body.removeChild(c), n("vcard-downloaded");
    }, p = () => {
      i.value = typeof window < "u" && "NDEFReader" in window;
    }, h = async () => {
      if (!i.value) {
        n("nfc-error", "NFC no es compatible con este dispositivo");
        return;
      }
      try {
        const e = new window.NDEFReader();
        await e.scan(), n("nfc-scanning"), e.onreading = async () => {
          try {
            await e.write({
              records: [
                {
                  recordType: "text",
                  data: o.value
                }
              ]
            }), n("nfc-success", "vCard escrita correctamente a la etiqueta NFC");
          } catch (c) {
            n("nfc-error", c.message);
          }
        };
      } catch (e) {
        n("nfc-error", e.message);
      }
    };
    return N(
      () => t.contact,
      () => {
        u();
      },
      { deep: !0 }
    ), R(() => {
      u(), p();
    }), (e, c) => (d(), r("div", E, [
      s.value ? (d(), r("div", y, [
        m("img", {
          src: s.value,
          alt: "QR Code"
        }, null, 8, $)
      ])) : f("", !0),
      m("div", k, [
        a.showDownload ? (d(), r("button", {
          key: 0,
          onClick: C,
          class: "vcard-btn"
        }, " Descargar vCard ")) : f("", !0),
        i.value && a.showNFC ? (d(), r("button", {
          key: 1,
          onClick: h,
          class: "vcard-btn"
        }, " Escribir a NFC ")) : f("", !0)
      ])
    ]));
  }
}, T = {
  install(a) {
    a.component("VCardGenerator", D);
  }
};
export {
  D as VCardGenerator,
  T as default
};
