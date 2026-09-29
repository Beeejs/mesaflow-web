import { metricsList } from "../../../constants/constants.js"

const PlatformMetrics = () => {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {metricsList.map((metric) => (
        <div
          key={metric.label}
          className="rounded-2xl border border-mesa-border bg-mesa-bg p-5"
        >
          <p className="text-sm text-mesa-muted">
            {metric.label}
          </p>

          <p className="mt-3 text-3xl font-bold text-mesa-text">
            {metric.value}
          </p>

          <p className={`mt-2 text-xs ${metric.color}`}>
            {metric.description}
          </p>
        </div>
      ))}
    </div>
  )
}

export default PlatformMetrics