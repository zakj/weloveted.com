function updateFontSize(el) {
  // TODO: some better algorithm
  // const rect = el.getBoundingClientRect();
  // const area = rect.width * rect.height;
  const len = el.textContent.length;
  let size;
  // const size = clamp(area / 100 / len, 18, 150);
  if (len < 20) size = 240;
  else if (len < 50) size = 200;
  else if (len < 100) size = 100;
  else if (len < 200) size = 64;
  else size = 48;
  el.style.setProperty('font-size', `${size}px`);
}

const fitText = {
  inserted(el) {
    requestAnimationFrame(() => updateFontSize(el));
  },

  update(el) {
    requestAnimationFrame(() => updateFontSize(el));
  },
};

export default {
  fitText,

  install(Vue) {
    Vue.directive('fit-text', fitText);
  },
};
