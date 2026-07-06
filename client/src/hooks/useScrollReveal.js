import { useCallback, useRef } from 'react';

export default function useScrollReveal() {
  const cleanupRef = useRef(null);

  // Usamos uma ref de função (callback ref) em vez de useRef + useEffect(() => {}, [])
  // porque várias páginas só montam o elemento com ref DEPOIS de terminar de
  // carregar dados da API (ex: `if (loading) return <div>Carregando...</div>`).
  // Um useEffect com dependências vazias roda uma única vez, no mount inicial —
  // se nesse instante o elemento ainda não existe (ou ainda não tem nenhum
  // filho com data-reveal, porque os dados ainda não chegaram), o observer
  // nunca é criado, e o conteúdo que aparece depois fica preso em opacity:0
  // para sempre. A ref de função roda de novo toda vez que o nó muda,
  // e o MutationObserver cobre o caso de conteúdo novo aparecer depois.
  const rootRef = useCallback(node => {
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }

    if (!node) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) {
      const reveal = () => {
        node.querySelectorAll('[data-reveal]:not(.is-visible)').forEach(el => {
          el.classList.add('is-visible');
        });
      };
      reveal();
      const mo = new MutationObserver(reveal);
      mo.observe(node, { childList: true, subtree: true });
      cleanupRef.current = () => mo.disconnect();
      return;
    }

    const io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -4% 0px' },
    );

    const scan = () => {
      node.querySelectorAll('[data-reveal]:not(.is-visible)').forEach(el => io.observe(el));
    };

    scan(); // escaneia o que já existe agora
    const mo = new MutationObserver(scan); // reobserva sempre que novo conteúdo entrar no DOM
    mo.observe(node, { childList: true, subtree: true });

    cleanupRef.current = () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return rootRef;
}