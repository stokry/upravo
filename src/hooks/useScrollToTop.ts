export function useScrollToTop() {
  const forceScrollTop = () => {
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });
  };

  return { forceScrollTop };
}