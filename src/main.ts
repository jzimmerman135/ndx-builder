import Carousel from "./carousel";
import setupNamespace from "./namespace-builder";

const carousel = Carousel(
  document.getElementsByClassName('ndx-interface'),
  document.getElementById('contextbar-next')!,
  document.getElementById('contextbar-back')!,
  (button: HTMLElement) => {
    button.classList.remove('hidden');
    button.classList.remove('disabled');
  },
  (button: HTMLElement) => button.classList.add('disabled'),
  (button: HTMLElement) => button.classList.add('hidden'),
);

const namespace = setupNamespace();
