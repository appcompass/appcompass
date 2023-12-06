import type { Directive } from 'vue';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

export const momentAgoDirective = (): Directive => {
  dayjs.extend(relativeTime);
  return {
    created(el, binding) {
      el.innerHTML = ' ' + dayjs(binding.value, 'YYYY-MM-DD HH:mm:ss').fromNow();
      el.interval = setInterval(() => {
        el.innerHTML = ' ' + dayjs(binding.value, 'YYYY-MM-DD HH:mm:ss').fromNow();
      }, 1000);
    },
    updated(el, binding) {
      clearInterval(el.interval);
      el.innerHTML = ' ' + dayjs(binding.value, 'YYYY-MM-DD HH:mm:ss').fromNow();
      el.interval = setInterval(() => {
        el.innerHTML = ' ' + dayjs(binding.value, 'YYYY-MM-DD HH:mm:ss').fromNow();
      }, 1000);
    },
    unmounted(el, binding) {
      clearInterval(el.interval);
    }
  };
};
