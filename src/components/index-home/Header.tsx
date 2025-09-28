/* eslint-disable qwik/jsx-img */
import { component$, useContext } from '@builder.io/qwik';
import styles from '@styles/Header.module.css';
import { LangContext } from '@context/lang';

export default component$(() => {
  // язык из контекста
  const langCtx = useContext(LangContext);

  // словарь
  const t = {
    heroTitle: {
      ru: 'ПУСТЬ КОНКУРЕНТЫ ТРУДЯТСЯ ЗА ВАС',
      en: 'LET YOUR COMPETITORS WORK FOR YOU',
    },
    cta: {
      ru: 'УЗНАТЬ СТОИМОСТЬ',
      en: 'GET A QUOTE',
    },
    sectionTitle: {
      ru: 'ЧТО МЫ ДЕЛАЕМ?',
      en: 'WHAT DO WE DO?',
    },
    cards: [
      { ru: 'СНИЖЕНИЕ ПОЗИЦИИ САЙТА', en: "LOWERING THE SITE'S POSITION" },
      { ru: 'ПЕРЕХВАТ ГОРЯЧИХ ЗАПРОСОВ', en: 'INTERCEPTION OF HOT LEADS' },
      { ru: 'SMS-БОМБАРДИРОВЩИК', en: 'SMS BOMBER' },
      { ru: 'СБОЙ В ОБСЛУЖИВАНИИ', en: 'SERVICE DISRUPTION' },
      { ru: 'ПЛОХИЕ ОТЗЫВЫ', en: 'BAD REVIEWS' },
      { ru: 'ТЕНЕВОЙ ЗАПРЕТ', en: 'SHADOW BAN' },
    ],
    why: {
      ru: 'ПОЧЕМУ UNICORN BEAR ?',
      en: 'WHY UNICORN BEAR ?',
    },
  };

  return (
    <>
      <header class={styles.header}>
        <div class={styles.headerTop}>
          <div class={styles.hero}>
            <h1 class={styles.heroTitle}>{t.heroTitle[langCtx.state.lang]}</h1>
            <button class={styles.cta}>
              {t.cta[langCtx.state.lang]}
              <img src="/images/icons/send.svg" alt="plane" class={styles.icon} />
            </button>
          </div>
        </div>

        <div class={styles.headerBottom}>
          <h2 class={styles.sectionTitle}>{t.sectionTitle[langCtx.state.lang]}</h2>

          <div class={styles.cards}>
            {t.cards.map((card, i) => (
              <div key={i} class={styles.card}>
                <img
                  src={[
                    '/images/icons/Received.svg',
                    '/images/icons/document.svg',
                    '/images/icons/sms-tracking.svg',
                    '/images/icons/cloud-remove.svg',
                    '/images/icons/status-up.svg',
                    '/images/icons/group.svg',
                  ][i]}
                  alt="icon"
                  class={styles.cardIcon}
                />
                {card[langCtx.state.lang]}
              </div>
            ))}
          </div>
        </div>
      </header>

      <div class={styles.sectionWhy}>
  <h2 class={styles.sectionSubtitle}>{t.why[langCtx.state.lang]}</h2>
      </div>
    </>
  );
});
