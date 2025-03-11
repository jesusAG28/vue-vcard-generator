import { ref as s, watch as N, onMounted as R, createElementBlock as i, openBlock as l, createCommentVNode as m, createElementVNode as u } from "vue";
import g from "qrcode";
const E = { class: "vcard-generator" }, y = {
  key: 0,
  class: "vcard-qr"
}, $ = ["src"], _ = { class: "vcard-actions" }, b = {
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
      default: !0
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
    const e = a, n = v, o = s(""), r = s(null), d = s(!1), f = () => {
      let t = `BEGIN:VCARD
VERSION:3.0
`;
      t += `FN:${e.contact.name}
`, e.contact.firstName && e.contact.lastName && (t += `N:${e.contact.lastName};${e.contact.firstName};;;
`), e.contact.organization && (t += `ORG:${e.contact.organization}
`), e.contact.title && (t += `TITLE:${e.contact.title}
`), e.contact.phone && (t += `TEL;TYPE=CELL:${e.contact.phone}
`), e.contact.email && (t += `EMAIL:${e.contact.email}
`), e.contact.website && (t += `URL:${e.contact.website}
`), e.contact.address && (t += `ADR:;;${e.contact.address};;;;
`), e.contact.linkedin && (t += `URL;TYPE=LINKEDIN:${e.contact.linkedin}
`), e.contact.twitter && (t += `URL;TYPE=TWITTER:${e.contact.twitter}
`), t += "END:VCARD", o.value = t, e.showQR && C(), n("vcard-generated", {
        vcardString: t,
        dataUrl: `data:text/vcard;charset=utf-8,${encodeURIComponent(t)}`
      });
    }, C = async () => {
      try {
        r.value = await g.toDataURL(o.value, {
          errorCorrectionLevel: "H",
          margin: 1,
          width: 200
        });
      } catch (t) {
        console.error("Error al generar QR:", t), n("qr-error", t.message);
      }
    }, p = () => {
      const t = `data:text/vcard;charset=utf-8,${encodeURIComponent(
        o.value
      )}`, c = document.createElement("a");
      c.href = t, c.download = `${e.contact.name.replace(/\s+/g, "_")}.vcf`, document.body.appendChild(c), c.click(), document.body.removeChild(c), n("vcard-downloaded");
    }, w = () => {
      d.value = typeof window < "u" && "NDEFReader" in window;
    }, h = async () => {
      if (!d.value) {
        n("nfc-error", "NFC no es compatible con este dispositivo");
        return;
      }
      try {
        const t = new window.NDEFReader();
        await t.scan(), n("nfc-scanning"), t.onreading = async () => {
          try {
            await t.write({
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
      } catch (t) {
        n("nfc-error", t.message);
      }
    };
    return N(
      () => e.contact,
      () => {
        f();
      },
      { deep: !0 }
    ), R(() => {
      f(), w();
    }), (t, c) => (l(), i("div", E, [
      r.value ? (l(), i("div", y, [
        u("img", {
          src: r.value,
          alt: "QR Code"
        }, null, 8, $)
      ])) : m("", !0),
      u("div", _, [
        u("button", {
          onClick: p,
          class: "vcard-btn"
        }, "Descargar vCard"),
        d.value && a.showNFC ? (l(), i("button", {
          key: 0,
          onClick: h,
          class: "vcard-btn"
        }, " Escribir a NFC ")) : m("", !0)
      ])
    ]));
  }
}, T = {
  install(a) {
    a.component("VCardGenerator", b);
  }
};
export {
  b as VCardGenerator,
  T as default
};
