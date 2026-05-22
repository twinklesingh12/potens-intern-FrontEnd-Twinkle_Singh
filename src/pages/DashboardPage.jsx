import { useEffect, useMemo, useState } from 'react'

const anomalyItems = [
  {
    id: 'AN-1082',
    source: 'Compressor Line 2',
    context: 'Vibration crossed dynamic threshold for 3 continuous minutes.',
    severity: 'high',
    score: 92,
  },
  {
    id: 'AN-1083',
    source: 'Dispatch Queue',
    context: 'Outbound dispatch latency is 2.1x above baseline.',
    severity: 'medium',
    score: 74,
  },
  {
    id: 'AN-1084',
    source: 'Cold Storage Bay A',
    context: 'Temperature drift detected against expected cooling curve.',
    severity: 'high',
    score: 89,
  },
  {
    id: 'AN-1085',
    source: 'Packaging Unit',
    context: 'Optical rejection rate rose from 1.2% to 4.6% in 20 minutes.',
    severity: 'critical',
    score: 97,
  },
]

const anomalyTrend = [2, 3, 5, 4, 6, 7]

export default function DashboardPage({
  t,
  language,
  setLanguage,
  isDarkMode,
  setIsDarkMode,
}) {
  const initialApprovalsPending = Number.parseInt(t.kpiCards[2]?.value, 10) || 13
  const [secondsRemaining, setSecondsRemaining] = useState(14 * 60 + 30)
  const [approvalsPending, setApprovalsPending] = useState(initialApprovalsPending)
  const [approvedQuickCount, setApprovedQuickCount] = useState(0)
  const [removedActionIds, setRemovedActionIds] = useState([])
  const [slidingActionIds, setSlidingActionIds] = useState([])
  const [resolvedAnomalyIds, setResolvedAnomalyIds] = useState([])
  const [slidingAnomalyIds, setSlidingAnomalyIds] = useState([])
  const [heldQuickIds, setHeldQuickIds] = useState([])
  const [heldAnomalyIds, setHeldAnomalyIds] = useState([])

  const visibleQuickActions = useMemo(
    () => t.mockQuickActions.filter((item) => !removedActionIds.includes(item.id)),
    [removedActionIds, t.mockQuickActions],
  )
  const visibleAnomalyItems = useMemo(
    () => anomalyItems.filter((item) => !resolvedAnomalyIds.includes(item.id)),
    [resolvedAnomalyIds],
  )
  const anomalyCounts = useMemo(() => {
    return visibleAnomalyItems.reduce(
      (acc, item) => {
        acc[item.severity] += 1
        return acc
      },
      { critical: 0, high: 0, medium: 0 },
    )
  }, [visibleAnomalyItems])

  useEffect(() => {
    // Language switch swaps the translated list content; keep only ids that still exist.
    setSlidingActionIds((current) =>
      current.filter((id) => t.mockQuickActions.some((item) => item.id === id)),
    )
    setRemovedActionIds((current) =>
      current.filter((id) => t.mockQuickActions.some((item) => item.id === id)),
    )
  }, [language, t.mockQuickActions])

  useEffect(() => {
    setSlidingAnomalyIds((current) =>
      current.filter((id) => anomalyItems.some((item) => item.id === id)),
    )
    setResolvedAnomalyIds((current) =>
      current.filter((id) => anomalyItems.some((item) => item.id === id)),
    )
  }, [language])

  const kpiCards = useMemo(() => {
    // KPI cards are derived from live interaction state so numbers stay consistent with UI actions.
    const cards = [...t.kpiCards]
    if (cards[0]) {
      cards[0] = { ...cards[0], value: String(visibleQuickActions.length) }
    }
    if (cards[2]) {
      cards[2] = {
        ...cards[2],
        value: String(approvalsPending),
        detail:
          approvedQuickCount > 0
            ? `${cards[2].detail} · ${approvedQuickCount} ${t.approvedCountLabel}`
            : cards[2].detail,
      }
    }
    if (cards[1]) {
      cards[1] = {
        ...cards[1],
        value: String(visibleAnomalyItems.length),
        detail: `${anomalyCounts.high} ${t.highLabel} · ${anomalyCounts.critical} ${t.criticalLabel}`,
      }
    }
    if (cards[3]) {
      const riskPoints =
        anomalyCounts.critical * 6 +
        anomalyCounts.high * 3 +
        anomalyCounts.medium * 1 +
        heldQuickIds.length
      const healthScore = Math.max(70, 100 - riskPoints)
      cards[3] = {
        ...cards[3],
        value: `${healthScore.toFixed(1)}%`,
        detail:
          healthScore >= 92
            ? t.systemHealthDetailGood
            : t.systemHealthDetailWatch,
      }
    }
    return cards
  }, [
    approvalsPending,
    approvedQuickCount,
    t.kpiCards,
    t.approvedCountLabel,
    t.criticalLabel,
    t.highLabel,
    t.systemHealthDetailGood,
    t.systemHealthDetailWatch,
    anomalyCounts.critical,
    anomalyCounts.high,
    anomalyCounts.medium,
    heldQuickIds.length,
    visibleAnomalyItems.length,
    visibleQuickActions.length,
  ])

  const handleQuickActionClick = (itemId, decision) => {
    if (removedActionIds.includes(itemId) || slidingActionIds.includes(itemId)) {
      return
    }
    if (decision === 'approve') {
      setApprovalsPending((current) => Math.max(0, current - 1))
      setApprovedQuickCount((current) => current + 1)
    }
    if (decision === 'hold') {
      // Hold keeps the row visible and moves it into a paused decision state.
      setHeldQuickIds((current) =>
        current.includes(itemId) ? current : [...current, itemId],
      )
      return
    }
    setSlidingActionIds((current) => [...current, itemId])
    // Delay actual removal to let the slide/fade transition complete.
    setTimeout(() => {
      setRemovedActionIds((current) => [...current, itemId])
      setSlidingActionIds((current) => current.filter((id) => id !== itemId))
    }, 260)
  }

  const handleAnomalyActionClick = (itemId) => {
    if (resolvedAnomalyIds.includes(itemId) || slidingAnomalyIds.includes(itemId)) {
      return
    }
    setSlidingAnomalyIds((current) => [...current, itemId])
    setTimeout(() => {
      setResolvedAnomalyIds((current) => [...current, itemId])
      setSlidingAnomalyIds((current) => current.filter((id) => id !== itemId))
    }, 260)
  }

  const toggleQuickPause = (itemId) => {
    setHeldQuickIds((current) =>
      current.includes(itemId)
        ? current.filter((id) => id !== itemId)
        : [...current, itemId],
    )
  }

  const handleAnomalyDecision = (itemId, decision) => {
    if (decision === 'hold') {
      setHeldAnomalyIds((current) =>
        current.includes(itemId) ? current : [...current, itemId],
      )
      return
    }
    handleAnomalyActionClick(itemId)
  }

  const toggleAnomalyPause = (itemId) => {
    setHeldAnomalyIds((current) =>
      current.includes(itemId)
        ? current.filter((id) => id !== itemId)
        : [...current, itemId],
    )
  }

  const getSeverityLabel = (severity) => {
    if (severity === 'critical') return t.criticalLabel
    if (severity === 'high') return t.highLabel
    return t.mediumLabel
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSecondsRemaining((current) => (current > 0 ? current - 1 : 0))
    }, 1000)
    return () => clearInterval(intervalId)
  }, [])

  const minutes = String(Math.floor(secondsRemaining / 60)).padStart(2, '0')
  const seconds = String(secondsRemaining % 60).padStart(2, '0')
  const counterDisplay = `${minutes}:${seconds}`
  const maxTrendValue = Math.max(...anomalyTrend)

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
          {kpiCards.map((card) => (
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
            <h2 className="text-lg font-semibold">{t.liveCounterTitle}</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {t.liveCounterLabel}
            </p>
            <p className="mt-4 font-mono text-4xl font-semibold tracking-wide text-rose-600 dark:text-rose-400">
              {counterDisplay}
            </p>
          </article>
        </section>

        <section className="mt-4 grid gap-4 xl:grid-cols-3">
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
                  {heldQuickIds.includes(item.id) ? (
                    <div className="flex items-center gap-3">
                      <p className="text-xs font-medium text-amber-700 dark:text-amber-300">
                        {t.holdMessage}
                      </p>
                      <button
                        type="button"
                        onClick={() => toggleQuickPause(item.id)}
                        className="rounded-md bg-slate-700 px-3 py-1 text-xs font-semibold text-white"
                      >
                        {t.pauseLabel}
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleQuickActionClick(item.id, 'approve')}
                        className="rounded-md bg-emerald-600 px-3 py-1 text-xs font-semibold text-white"
                      >
                        {t.approve}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickActionClick(item.id, 'hold')}
                        className="rounded-md bg-amber-600 px-3 py-1 text-xs font-semibold text-white"
                      >
                        {t.hold}
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-semibold">{t.anomaliesTitle}</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {t.anomaliesSubtitle}
            </p>

            <div className="mt-4 grid gap-3">
              {visibleAnomalyItems.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-md border border-slate-200 bg-slate-50 p-3 transition-all duration-300 dark:border-slate-700 dark:bg-slate-800 ${
                    slidingAnomalyIds.includes(item.id)
                      ? 'translate-x-8 opacity-0'
                      : 'translate-x-0 opacity-100'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {item.id} • {item.source}
                      </p>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                        {item.context}
                      </p>
                    </div>
                    <div className="text-right text-xs text-slate-500 dark:text-slate-400">
                      <p>
                        {t.anomalySeverity}: {getSeverityLabel(item.severity)}
                      </p>
                      <p>
                        {t.anomalyScore}: {item.score}
                      </p>
                    </div>
                  </div>
                  {heldAnomalyIds.includes(item.id) ? (
                    <div className="mt-3 flex items-center gap-3">
                      <p className="text-xs font-medium text-amber-700 dark:text-amber-300">
                        {t.holdMessage}
                      </p>
                      <button
                        type="button"
                        onClick={() => toggleAnomalyPause(item.id)}
                        className="rounded-md bg-slate-700 px-3 py-1 text-xs font-semibold text-white"
                      >
                        {t.pauseLabel}
                      </button>
                    </div>
                  ) : (
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleAnomalyDecision(item.id, 'approve')}
                        className="rounded-md bg-emerald-600 px-3 py-1 text-xs font-semibold text-white"
                      >
                        {t.approve}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAnomalyDecision(item.id, 'hold')}
                        className="rounded-md bg-amber-600 px-3 py-1 text-xs font-semibold text-white"
                      >
                        {t.hold}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-md border border-slate-200 p-3 dark:border-slate-700">
              <p className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                {t.anomalyTrendTitle}
              </p>
              <svg viewBox="0 0 360 120" className="h-28 w-full">
                {anomalyTrend.map((value, index) => {
                  const barWidth = 40
                  const gap = 18
                  const x = 10 + index * (barWidth + gap)
                  const barHeight = (value / maxTrendValue) * 90
                  const y = 105 - barHeight
                  return (
                    <g key={`${value}-${index}`}>
                      <rect
                        x={x}
                        y={y}
                        width={barWidth}
                        height={barHeight}
                        rx="5"
                        className="fill-rose-500/80"
                      />
                      <text
                        x={x + barWidth / 2}
                        y="116"
                        textAnchor="middle"
                        className="fill-slate-500 text-[10px] dark:fill-slate-400"
                      >
                        H{index + 1}
                      </text>
                    </g>
                  )
                })}
              </svg>
            </div>
          </article>
        </section>
      </div>
    </main>
  )
}
