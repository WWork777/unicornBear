import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import styles from '@styles/loader.module.css';

export default component$(() => {
  const visible = useSignal(true);
  const hiddenClass = useSignal('');
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    // prevent scrolling while loader is visible (same as Menu)
    try {
      document.body.style.overflow = 'hidden';
    } catch {
      // ignore (SSR)
    }

    // hide loader on window load
    const onLoad = () => {
      // start fade-out
      hiddenClass.value = styles.fadeOut;
      // fully hide after animation and restore overflow (same as Menu)
      setTimeout(() => {
        visible.value = false;
        try {
          document.body.style.overflow = '';
        } catch {
          // ignore
        }
      }, 600);
    };

    if (typeof window !== 'undefined') {
      if (document.readyState === 'complete') {
        onLoad();
      } else {
        window.addEventListener('load', onLoad, { once: true });
      }
    }

    return () => {
      try {
        document.body.style.overflow = '';
      } catch {
        // ignore
      }
    };
  });

  return (
    <div class={`${styles.loaderWrap} ${hiddenClass.value}`} style={{ display: visible.value ? 'flex' : 'none' }}>
      <div class={styles.loaderInner}>
        <svg class={styles.logo} width="120" height="120" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <defs>
            <linearGradient id="g" x1="0" x2="1">
              <stop offset="0%" stop-color="#ff7a18" />
              <stop offset="50%" stop-color="#af002d" />
              <stop offset="100%" stop-color="#319197" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="40" stroke="url(#g)" stroke-width="6" fill="none" class={styles.ring} />
          <circle cx="50" cy="50" r="10" fill="url(#g)" class={styles.dot} />
        </svg>
        <div class={styles.text}>UNICORN BEAR</div>
      </div>
    </div>
  );
});
