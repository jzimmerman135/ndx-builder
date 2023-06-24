import { buildCarousel } from "./carousel";

const carousel = buildCarousel(
  document.getElementsByClassName('ndx-interfce') as HTMLCollectionOf<HTMLDivElement>,
  document.getElementById('contextbar-back')!,
  document.getElementById('contextbar-next')!,
);

carousel.enableNextButton();

