import { useEffect, useMemo, useState } from 'react'

export default function DashboardPage({
  t,
  language,
  setLanguage,
  isDarkMode,
  setIsDarkMode,
}) {
  const [removedActionIds, setRemovedActionIds] = useState([])
  const [slidingActionIds, setSlidingActionIds] = useState([])

  const visibleQuickActions = useMemo(
    () => t.mockQuickActions.filter((item) => !removedActionIds.includes(item.id)),
    [removedActionIds, t.mockQuickActions],
  )

  useEffect(() => {
    setSlidingActionIds((current) =>
      current.filter((id) => t.mockQuickActions.some((item) => item.id === id)),
    )
    setRemovedActionIds((current) =>
      current.filter((id) => t.mockQuickActions.some((item) => item.id === id)),
    )
  }, [language, t.mockQuickActions])

  const handleActionClick = (itemId) => {
    if (removedActionIds.includes(itemId) || slidingActionIds.includes(itemId)) {
      return
    }
    setSlidingActionIds((current) => [...current, itemId])
    setTimeout(() => {
      setRemovedActionIds((current) => [...current, itemId])
      setSlidingActionIds((current) => current.filter((id) => id !== itemId))
    }, 260)
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto w-full max-w-7xl px-6 py-8 md:px-8">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
          <div className="text-lg font-semibold tracking-tight">{t.logo}</div>
          <div className="flex items-center gap-3">
            <label className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <span>{t.darkMode}</span>
              <button
                type="button"
                onClick={() => setIsDarkMode((prev) => !prev)}
                className={`h-7 w-12 rounded-full p-1 transition ${
                  isDarkMode ? 'bg-slate-700' : 'bg-slate-300'
                }`}
                aria-label={t.darkMode}
              >
                <span
                  className={`block h-5 w-5 rounded-full bg-white transition ${
                    isDarkMode ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </label>

            <label className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <span>{t.languageLabel}</span>
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-900"
                aria-label={t.languageLabel}
              >
                <option value="en">{t.languageOptions.en}</option>
                <option value="hi">{t.languageOptions.hi}</option>
              </select>
            </label>
          </div>
        </header>

        <header className="mb-8 flex items-end justify-between border-b border-slate-200 pb-5 dark:border-slate-800">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {t.dashboardTitle}
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight dark:text-slate-100">
              {t.overviewTitle}
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t.updatedNow}
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {t.kpiCards.map((card) => (
            <article
              key={card.label}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {card.label}
              </p>
              <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">
                {card.value}
              </p>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {card.detail}
              </p>
            </article>
          ))}
        </section>

        <section className="mt-8 grid gap-4 xl:grid-cols-3">
          <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-semibold">{t.todayAtGlance}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              {t.todayAtGlanceCopy}
            </p>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-semibold">{t.quickActions}</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              {visibleQuickActions.map((item) => (
                <li
                  key={item.id}
                  className={`rounded-md bg-slate-100 px-3 py-3 transition-all duration-300 dark:bg-slate-800 ${
                    slidingActionIds.includes(item.id)
                      ? 'translate-x-8 opacity-0'
                      : 'translate-x-0 opacity-100'
                  }`}
                >
                  <p className="mb-2">{item.text}</p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleActionClick(item.id)}
                      className="rounded-md bg-emerald-600 px-3 py-1 text-xs font-semibold text-white"
                    >
                      {t.approve}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleActionClick(item.id)}
                      className="rounded-md bg-amber-600 px-3 py-1 text-xs font-semibold text-white"
                    >
                      {t.hold}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </article>
        </section>
      </div>
    </main>
  )
}
