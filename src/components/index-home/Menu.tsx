/* eslint-disable qwik/jsx-img */
/* eslint-disable qwik/no-use-visible-task */
import { component$, useSignal, $, useVisibleTask$, useContext } from '@builder.io/qwik';
import styles from '@styles/Menu.module.css';
import { LangContext } from '@context/lang';

export default component$(() => {
  const isOpen = useSignal(false);
  const carouselRef = useSignal<HTMLDivElement>();
  const isDragging = useSignal(false);
  const startX = useSignal(0);
  const scrollLeft = useSignal(0);

  // Контекст языка
  const langCtx = useContext(LangContext);

  const toggleLang = $(() => {
    const next = langCtx.state.lang === 'ru' ? 'en' : 'ru';
    langCtx.setLang(next);
  });

  // словарь
  const t = {
    menu: { ru: 'МЕНЮ', en: 'MENU' },
    cards: [
      { ru: 'СБОЙ В ОБСЛУЖИВАНИИ', en: 'SERVICE DISRUPTION' },
      { ru: 'СНИЖЕНИЕ ПОЗИЦИИ САЙТА', en: "LOWERING THE SITE'S POSITION" },
      { ru: 'ПЛОХИЕ ОТЗЫВЫ', en: 'BAD REVIEWS' },
      { ru: 'ТЕНЕВОЙ ЗАПРЕТ', en: 'SHADOW BAN' },
      { ru: 'SMS-БОМБАРДИРОВЩИК', en: 'SMS BOMBER' },
      { ru: 'ПЕРЕХВАТ ГОРЯЧИХ ЗАПРОСОВ', en: 'INTERCEPTION OF HOT LEADS' },
    ],
  };

  const toggleMenu = $(() => {
    isOpen.value = !isOpen.value;
    document.body.style.overflow = isOpen.value ? 'hidden' : '';
  });

  useVisibleTask$(({ track }) => {
    track(() => isOpen.value);

    const carousel = carouselRef.value;
    if (!isOpen.value || !carousel) return;

    let rafId: number | null = null;
    let pendingDelta = 0;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging.value = true;
      startX.value = e.pageX - carousel.getBoundingClientRect().left;
      scrollLeft.value = carousel.scrollLeft;
      carousel.style.cursor = 'grabbing';
      carousel.style.userSelect = 'none';
    };

    const handleMouseUp = () => {
      isDragging.value = false;
      carousel.style.cursor = 'pointer';
      carousel.style.userSelect = 'auto';
    };

    const handleMouseLeave = () => {
      isDragging.value = false;
      carousel.style.cursor = 'pointer';
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.value) return;
      e.preventDefault();
      const x = e.pageX - carousel.getBoundingClientRect().left;
      const walk = (x - startX.value) * 3;
      carousel.scrollLeft = scrollLeft.value - walk;
    };

    let touchStartX = 0;
    let touchScrollLeft = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].pageX - carousel.getBoundingClientRect().left;
      touchScrollLeft = carousel.scrollLeft;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const x = e.touches[0].pageX - carousel.getBoundingClientRect().left;
      const walk = (x - touchStartX) * 1.6;
      carousel.scrollLeft = touchScrollLeft - walk;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      if (!carousel) return;
      const card = carousel.querySelector(`.${styles.card}`) as HTMLElement;
      const cardWidth = card ? card.offsetWidth + 24 : 300;
      const multiplier = cardWidth / 100;
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;

      pendingDelta += delta * multiplier;

      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          carousel.scrollLeft += pendingDelta;
          pendingDelta = 0;
          rafId = null;
        });
      }
    };

    carousel.addEventListener('mousedown', handleMouseDown);
    carousel.addEventListener('mouseup', handleMouseUp);
    carousel.addEventListener('mouseleave', handleMouseLeave);
    carousel.addEventListener('mousemove', handleMouseMove);

    carousel.addEventListener('touchstart', handleTouchStart, { passive: true });
    carousel.addEventListener('touchmove', handleTouchMove, { passive: false });
    carousel.addEventListener('wheel', handleWheel, { passive: false });

    carousel.style.cursor = 'pointer';

    return () => {
      carousel.removeEventListener('mousedown', handleMouseDown);
      carousel.removeEventListener('mouseup', handleMouseUp);
      carousel.removeEventListener('mouseleave', handleMouseLeave);
      carousel.removeEventListener('mousemove', handleMouseMove);
      carousel.removeEventListener('touchstart', handleTouchStart);
      carousel.removeEventListener('touchmove', handleTouchMove);
      carousel.removeEventListener('wheel', handleWheel);

      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };
  });

  return (
    <>
      <div class={styles.header}>
        <div class={styles.left}>
          <img src="/favicon.svg" alt="Unicorn Bear" class={styles.logo} />
          <span class={styles.title}>UNICORN BEAR</span>
        </div>
          <div class={styles.right} onClick$={toggleMenu}>
          <span class={styles.menuText}>{t.menu[langCtx.state.lang]}</span>
          <div class={`${styles.burger} ${isOpen.value ? styles.open : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>

      {isOpen.value && (
        <div class={styles.menuOverlay}>
          <div ref={carouselRef} class={styles.carousel}>
            {t.cards.map((card, i) => (
              <div
                key={i}
                class={styles.card}
                style={{ '--bg-image': `url('/images/bears/2025-09-22T19-29-25-${i + 1}.jpg')` }}
              >
                <div class={styles.cardTitle}>{card[langCtx.state.lang]}</div>
                <div class={styles.cardSound}></div>
              </div>
            ))}
          </div>

          <button class={styles.langSwitcher} onClick$={toggleLang}>
            {langCtx.state.lang === 'ru' ? 'EN' : 'RU'}
          </button>
        </div>
      )}
    </>
  );
});
