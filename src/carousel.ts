// Carousel manager

// internal implementation structure
type Carousel = {
  at: number;
  nextEnabled: boolean,
  backEnabled: boolean,
  readonly length: number;
  readonly slidingElements: Array<HTMLElement>;
  readonly nextButton: HTMLElement,
  readonly backButton: HTMLElement,
}

function invalidCarousel(carousel: Carousel) {
  return carousel.at < 0 || carousel.at >= carousel.length;
}

// or backward
function slideCarousel(
  carousel: Carousel,
  forward: boolean,
  enableButton: (button: HTMLElement) => void,
  hideButton: (button: HTMLElement) => void,
) {
  if (invalidCarousel(carousel))
    throw Error("Bad carousel: " + String(carousel));

  const start = forward ? 0 : carousel.length - 1;
  const end = !forward ? 0 : carousel.length - 1;
  const nextAt = forward ? carousel.at + 1 : carousel.at - 1;

  const enableBack = (c: Carousel) => {
    enableButton(forward ? c.backButton : c.nextButton);
    if (forward)
      carousel.backEnabled = true;
    else
      carousel.nextEnabled = true;
  }

  const hideNext = (c: Carousel) => {
    hideButton(forward ? c.nextButton : c.backButton);
    if (forward)
      carousel.nextEnabled = false;
    else
      carousel.backEnabled = false;
  }

  if (carousel.at == end)
    return;
  else if (nextAt == end)
    hideNext(carousel);
  else if (carousel.at == start)
    enableBack(carousel);

  carousel.at = nextAt;
  const translatex = `translateX(-${carousel.at * 100}%)`;
  carousel.slidingElements.map((e) => e.style.transform = translatex);
}

// returns an interface to use the carousel
//
// the enable, disable and hide callbacks are only for visual changes
// event handler logic is internal
export default function Carousel(
  slidingElements: HTMLCollectionOf<Element>,
  nextButton: HTMLElement,
  backButton: HTMLElement,
  enableButtonEffect: (elem: HTMLElement) => void,
  disableButtonEffect: (elem: HTMLElement) => void,
  hideButtonEffect: (elem: HTMLElement) => void,
) {
  const carousel: Carousel = {
    at: 0,
    nextEnabled: true,
    backEnabled: false,
    length: slidingElements.length,
    slidingElements: Array.from(slidingElements) as HTMLElement[],
    nextButton,
    backButton,
  };

  hideButtonEffect(carousel.backButton);
  enableButtonEffect(carousel.nextButton);

  const slide = (c: Carousel, enabled: boolean, forward: boolean) => {
    if (!enabled)
      return;
    slideCarousel(c, forward, enableButtonEffect, hideButtonEffect);
  }
  carousel.nextButton.addEventListener('click',
    () => slide(carousel, carousel.nextEnabled, true));
  carousel.backButton.addEventListener('click',
    () => slide(carousel, carousel.backEnabled, false));

  return {
    enableNextButton() {
      enableButtonEffect(carousel.nextButton);
      carousel.nextEnabled = true;
    },
    enableBackButton() {
      enableButtonEffect(carousel.backButton);
      carousel.backEnabled = true;
    },
    disableNextButton() {
      disableButtonEffect(carousel.nextButton);
      carousel.nextEnabled = false;
    },
    disableBackButton() {
      disableButtonEffect(carousel.backButton);
      carousel.backEnabled = false;
    },
    trySlideNext() {
      slide(carousel, carousel.nextEnabled, true);
      return carousel.nextEnabled;
    },
    trySlideBack() {
      slide(carousel, carousel.backEnabled, false);
      return carousel.backEnabled;
    },
    at() {
      return carousel.at;
    }
  };
}
