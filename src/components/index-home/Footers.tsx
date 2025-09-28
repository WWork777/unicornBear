import { component$, useContext } from '@builder.io/qwik';
import styles from '@styles/Footers.module.css';
import { LangContext } from '@context/lang';

export default component$(() => {
  const langCtx = useContext(LangContext);
  const lang = langCtx.state.lang; // 'ru' | 'en'
  const year = new Date().getFullYear();

  // словарь переводов для футера
  const t = {
    yearsLabel: { ru: 'ГОДА', en: 'YEARS' },
    workingSince: { ru: 'РАБОТАЕМ С 2023 ГОДА.', en: 'OPERATING SINCE 2023.' },

    features: [
      {
        h: { ru: 'СЕРВЕРА ПО ВСЕМУ МИРУ', en: 'SERVERS AROUND THE WORLD' },
        p: { ru: 'МЕСТО РАБОТЫ ПО ВАШЕМУ ВЫБОРУ', en: 'WORK LOCATION OF YOUR CHOICE' },
      },
      {
        h: { ru: 'КРУГЛОСУТОЧНАЯ ПОДДЕРЖКА', en: '24/7 SUPPORT' },
        p: { ru: 'НАШ МЕНЕДЖЕР ПОМОЖЕТ ВАМ СДЕЛАТЬ ВЫБОР', en: 'OUR MANAGER WILL HELP YOU CHOOSE' },
      },
      {
        h: { ru: 'ПОЛНАЯ АНОНИМНОСТЬ', en: 'FULL ANONYMITY' },
        p: { ru: 'ВАШИ ДАННЫЕ НЕ СОХРАНЯЮТСЯ', en: 'YOUR DATA IS NOT STORED' },
      },
    ],

    copyright: {
      ru: `© ${year} UNICORN BEAR — ВСЕ ПРАВА ЗАЩИЩЕНЫ, ОДНАКО ИДЕИ РАССМАТРИВАЮТСЯ В ПОРЯДКЕ ПОСТУПЛЕНИЯ!`,
      en: `© ${year} UNICORN BEAR — ALL RIGHTS RESERVED, IDEAS ARE CONSIDERED ON A FIRST-COME BASIS!`,
    },
  };

  return (
    <footer class={styles.footer}>
      <div class={styles.container}>
        <div class={styles.mainContent}>
          <div class={styles.leftSection}>
            <div class={styles.years}>
              <span class={styles.arrow}>➤</span>
              <span class={styles.number}>2</span>
              <span class={styles.label}>{t.yearsLabel[lang]}</span>
            </div>
            <div class={styles.subtext}>{t.workingSince[lang]}</div>
          </div>

          <div class={styles.features}>
            {t.features.map((f, i) => (
              <div key={i} class={styles.feature}>
                <h3>{f.h[lang]}</h3>
                <p>{f.p[lang]}</p>
              </div>
            ))}
          </div>
        </div>

        <div class={styles.copyright}>
          {t.copyright[lang]}
        </div>
      </div>
    </footer>
  );
});
