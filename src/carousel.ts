// Carousel manager

type Carousel = {
  at: number;
  readonly length: number;
  readonly slidingElements: Array<HTMLElement>;
  readonly nextButton: HTMLElement,
  readonly backButton: HTMLElement,
  nextEnabled: boolean,
  backEnabled: boolean,
}

function invalidCarousel(carousel: Carousel) {
  return carousel.at < 0 || carousel.at >= carousel.length;
}

// forward or backward
function slideCarousel(
  carousel: Carousel,
  forward: boolean,
  enableButton: (button: HTMLElement) => void,
  hideButton: (button: HTMLElement) => void
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

export default function Carousel(
  slidingElements: HTMLCollectionOf<Element>,
  nextButton: HTMLElement,
  backButton: HTMLElement,
  enableButton: (elem: HTMLElement) => void,
  disableButton: (elem: HTMLElement) => void,
  hideButton: (elem: HTMLElement) => void,
) {
  const carousel: Carousel = {
    at: 0,
    length: slidingElements.length,
    slidingElements: Array.from(slidingElements) as HTMLElement[],
    nextButton,
    backButton,
    nextEnabled: true,
    backEnabled: false,
  };

  carousel.nextButton.addEventListener('click', () => {
    if (!carousel.nextEnabled)
      return;
    slideCarousel(carousel, true, enableButton, hideButton);
  })

  carousel.backButton.addEventListener('click', () => {
    if (!carousel.backEnabled)
      return;
    slideCarousel(carousel, false, enableButton, hideButton);
  })

  hideButton(carousel.backButton);
  enableButton(carousel.nextButton);

  return {
    enableNextButton() {
      enableButton(carousel.nextButton);
      carousel.nextEnabled = true;
    },
    enableBackButton() {
      enableButton(carousel.backButton);
      carousel.backEnabled = true;
    },
    disableNextButton() {
      disableButton(carousel.nextButton);
      carousel.nextEnabled = false;
    },
    disableBackButton() {
      disableButton(carousel.backButton);
      carousel.backEnabled = false;
    }
  };
}
