const kpiCards = [
  { label: 'Open Actions', value: '24', detail: '+6 since 09:00' },
  { label: 'Anomalies', value: '7', detail: '2 critical' },
  { label: 'Approvals Pending', value: '13', detail: '4 due in 2 hours' },
  { label: 'System Health', value: '98.4%', detail: 'All regions stable' },
]

const quickActions = [
  'Review high-priority incidents',
  'Clear pending operations approvals',
  'Validate overnight monitoring summary',
]

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto w-full max-w-7xl px-6 py-8 md:px-8">
        <header className="mb-8 flex items-end justify-between border-b border-slate-200 pb-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Cockpit Dashboard
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">
              Operations Overview
            </h1>
          </div>
          <p className="text-sm text-slate-500">Updated just now</p>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {kpiCards.map((card) => (
            <article
              key={card.label}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <p className="text-sm text-slate-500">{card.label}</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">
                {card.value}
              </p>
              <p className="mt-2 text-sm text-slate-500">{card.detail}</p>
            </article>
          ))}
        </section>

        <section className="mt-8 grid gap-4 xl:grid-cols-3">
          <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
            <h2 className="text-lg font-semibold">Today at a glance</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Routing is now in place and this index dashboard acts as the
              foundation for action queues, anomaly tracking, and live metrics.
            </p>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold">Quick actions</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {quickActions.map((item) => (
                <li key={item} className="rounded-md bg-slate-100 px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </section>
      </div>
    </main>
  )
}
