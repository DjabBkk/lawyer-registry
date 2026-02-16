import { SortSelect } from './SortSelect'

interface ResultsToolbarProps {
  shown: number
  total: number
  sortValue: string
}

export function ResultsToolbar({ shown, total, sortValue }: ResultsToolbarProps) {
  return (
    <div className="mb-6 flex items-center justify-between rounded-lg border border-warm-200 bg-white px-4 py-3">
      <p className="text-sm text-royal-700/80">
        Showing {shown} of {total} firms
      </p>
      <div className="flex items-center gap-2">
        <span className="text-sm text-royal-700/70">Sort by:</span>
        <SortSelect defaultValue={sortValue} />
      </div>
    </div>
  )
}

