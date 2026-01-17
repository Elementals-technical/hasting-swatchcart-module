/**
 * Scrolls to the top of the #root element with smooth behavior
 */
export const scrollToTop = () => {
  const rootContainer = document.getElementById('root');
  if (rootContainer) {
    rootContainer.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
};
