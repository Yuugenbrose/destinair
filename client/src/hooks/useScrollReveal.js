import { useEffect, useRef } from 'react';

export default function useScrollReveal() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;

    if (!root) {
      return undefined;
    }

    const elements = Array.from(root.querySelectorAll('[data-reveal]'));

    if (!elements.length) {
      return undefined;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) {
      elements.forEach(element => element.classList.add('is-visible'));
      return undefined;
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -4% 0px' },
    );

    elements.forEach(element => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return rootRef;
}