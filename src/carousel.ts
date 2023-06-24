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

export function enableNextButton(carousel: Carousel) {
  const button = carousel.nextButton;
  button.classList.remove('hidden');
  button.classList.remove('disabled');
  carousel.nextEnabled = true;
}

export function enableBackButton(carousel: Carousel) {
  const button = carousel.backButton;
  button.classList.remove('hidden');
  button.classList.remove('disabled');
  carousel.backEnabled = true;
}

export function disableNextButton(carousel: Carousel) {
  const button = carousel.nextButton;
  button.classList.add('disabled');
  carousel.nextEnabled = false;
}

export function disableBackButton(carousel: Carousel) {
  const button = carousel.backButton;
  button.classList.add('disabled');
  carousel.backEnabled = false;
}

// hiding buttons is handled internally 
function hideNextButton(carousel: Carousel) {
  const button = carousel.nextButton;
  button.classList.add('hidden');
  carousel.nextEnabled = false;
}

function hideBackButton(carousel: Carousel) {
  const button = carousel.backButton;
  button.classList.add('hidden');
  carousel.backEnabled = false;
}

function invalidCarousel(carousel: Carousel) {
  return carousel.at < 0 || carousel.at >= carousel.length;
}

// forward or backward
function slideCarousel(carousel: Carousel, forward: boolean) {
  if (invalidCarousel(carousel))
    throw Error("Bad carousel: " + String(carousel));

  const start = forward ? 0 : carousel.length - 1;
  const end = !forward ? 0 : carousel.length - 1;
  const enableBack = forward ? enableBackButton : enableNextButton;
  const hideNext = forward ? hideNextButton : hideBackButton;
  const nextAt = forward ? carousel.at + 1 : carousel.at - 1;

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

export function buildCarousel(
  slidingElements: HTMLCollectionOf<HTMLElement>,
  nextButton: HTMLElement,
  backButton: HTMLElement
) {
  const carousel: Carousel = {
    at: 0,
    length: slidingElements.length,
    slidingElements: Array.from(slidingElements),
    nextButton,
    backButton,
    nextEnabled: true,
    backEnabled: false,
  };

  carousel.nextButton.addEventListener('click', () => {
    if (!carousel.nextEnabled)
      return;
    slideCarousel(carousel, true);
    console.log('next');
  })

  carousel.backButton.addEventListener('click', () => {
    if (!carousel.backEnabled)
      return;
    slideCarousel(carousel, false);
    console.log('back');
  })

  return {
    enableNextButton() {
      enableNextButton(carousel)
    },
    enableBackButton() {
      enableBackButton(carousel)
    },
    disableNextButton() {
      disableNextButton(carousel)
    },
    disableBackButton() {
      disableBackButton(carousel)
    }
  };
}
