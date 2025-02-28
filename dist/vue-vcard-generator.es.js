import { ref as s, watch as N, onMounted as R, createElementBlock as i, openBlock as l, createCommentVNode as f, createElementVNode as m } from "vue";
import g from "qrcode";
const E = { class: "vcard-generator" }, _ = {
  key: 0,
  class: "vcard-qr"
}, y = ["src"], $ = { class: "vcard-actions" }, b = {
  __name: "VCardGenerator",
  props: {
    contact: {
      type: Object,
      required: !0,
      validator: function(c) {
        return c.name && (c.email || c.phone);
      }
    },
    showQR: {
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
  setup(c, { emit: v }) {
    const e = c, a = v, r = s(""), o = s(null), d = s(!1), u = () => {
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
`), t += "END:VCARD", r.value = t, e.showQR && p(), a("vcard-generated", {
        vcardString: t,
        dataUrl: `data:text/vcard;charset=utf-8,${encodeURIComponent(t)}`
      });
    }, p = async () => {
      try {
        o.value = await g.toDataURL(r.value, {
          errorCorrectionLevel: "H",
          margin: 1,
          width: 200
        });
      } catch (t) {
        console.error("Error al generar QR:", t), a("qr-error", t.message);
      }
    }, C = () => {
      const t = `data:text/vcard;charset=utf-8,${encodeURIComponent(
        r.value
      )}`, n = document.createElement("a");
      n.href = t, n.download = `${e.contact.name.replace(/\s+/g, "_")}.vcf`, document.body.appendChild(n), n.click(), document.body.removeChild(n), a("vcard-downloaded");
    }, w = () => {
      d.value = typeof window < "u" && "NDEFReader" in window;
    }, h = async () => {
      if (!d.value) {
        a("nfc-error", "NFC no es compatible con este dispositivo");
        return;
      }
      try {
        const t = new window.NDEFReader();
        await t.scan(), a("nfc-scanning"), t.onreading = async () => {
          try {
            await t.write({
              records: [
                {
                  recordType: "text",
                  data: r.value
                }
              ]
            }), a("nfc-success", "vCard escrita correctamente a la etiqueta NFC");
          } catch (n) {
            a("nfc-error", n.message);
          }
        };
      } catch (t) {
        a("nfc-error", t.message);
      }
    };
    return N(
      () => e.contact,
      () => {
        u();
      },
      { deep: !0 }
    ), R(() => {
      u(), w();
    }), (t, n) => (l(), i("div", E, [
      o.value ? (l(), i("div", _, [
        m("img", {
          src: o.value,
          alt: "QR Code"
        }, null, 8, y)
      ])) : f("", !0),
      m("div", $, [
        m("button", {
          onClick: C,
          class: "vcard-btn"
        }, "Descargar vCard"),
        d.value ? (l(), i("button", {
          key: 0,
          onClick: h,
          class: "vcard-btn"
        }, " Escribir a NFC ")) : f("", !0)
      ])
    ]));
  }
}, T = {
  install(c) {
    c.component("VCardGenerator", b);
  }
};
export {
  b as VCardGenerator,
  T as default
};
