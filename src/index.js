import VCardGenerator from "./components/VCardGenerator.vue";

// Exportar el componente individual
export { VCardGenerator };

// Exportar para instalación automática de Vue
export default {
  install(Vue) {
    Vue.component("VCardGenerator", VCardGenerator);
  },
};
