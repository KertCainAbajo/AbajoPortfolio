import { useEffect, useMemo, useState } from 'react'
import { ArrowUpRight, Github } from 'lucide-react'

const GITHUB_USERNAME = 'KertCainAbajo'
const GITHUB_PROFILE = `https://github.com/${GITHUB_USERNAME}`
const CONTRIBUTIONS_API = `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}`
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

export default function ContributionGraph() {
  const [data, setData] = useState(null)
  const [failed, setFailed] = useState(false)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  useEffect(() => {
    let cancelled = false
    const loadContributions = async () => {
      try {
        const response = await fetch(CONTRIBUTIONS_API)
        if (!response.ok) throw new Error('GitHub contributions request failed')
        const result = await response.json()
        if (!Array.isArray(result.contributions) || result.contributions.length === 0) throw new Error('No contribution data returned')
        if (!cancelled) {
          setData(result)
          setFailed(false)
        }
      } catch {
        if (!cancelled) setFailed(true)
      }
    }
    loadContributions()
    const refresh = window.setInterval(loadContributions, 60 * 60 * 1000)
    return () => {
      cancelled = true
      window.clearInterval(refresh)
    }
  }, [])

  const availableYears = useMemo(() => {
    if (!data) return []
    const totalYears = Object.keys(data.total || {}).filter((year) => /^\d{4}$/.test(year)).map(Number)
    const contributionYears = data.contributions.map((day) => Number(day.date.slice(0, 4)))
    return [...new Set([...totalYears, ...contributionYears])].sort((a, b) => b - a)
  }, [data])
  const activeYear = availableYears.includes(selectedYear) ? selectedYear : availableYears[0]

  const { weeks, monthMarks } = useMemo(() => {
    if (!data || !activeYear) return { weeks: [], monthMarks: [] }
    const start = new Date(Date.UTC(activeYear, 0, 1))
    const dayCount = (Date.UTC(activeYear + 1, 0, 1) - start.getTime()) / 86400000
    const startOffset = start.getUTCDay()
    const weekCount = Math.ceil((startOffset + dayCount) / 7)
    const columns = Array.from({ length: weekCount }, () => Array(7).fill(null))
    const dayLookup = new Map(data.contributions.filter((day) => Number(day.date.slice(0, 4)) === activeYear).map((day) => [day.date, day]))
    const marks = []
    for (let index = 0; index < dayCount; index += 1) {
      const date = new Date(start.getTime() + index * 86400000)
      const dateString = date.toISOString().slice(0, 10)
      const cellIndex = startOffset + index
      const week = Math.floor(cellIndex / 7)
      const day = cellIndex % 7
      columns[week][day] = dayLookup.get(dateString) || { date: dateString, count: 0, level: 0 }
      if (date.getUTCDate() === 1) marks.push({ label: MONTHS[date.getUTCMonth()], week: week + 1 })
    }
    return { weeks: columns, monthMarks: marks }
  }, [data, activeYear])

  const total = activeYear ? data?.total?.[activeYear] ?? data?.contributions?.filter((day) => Number(day.date.slice(0, 4)) === activeYear).reduce((sum, day) => sum + day.count, 0) ?? 0 : 0

  return (
    <div className="contribution-card">
      <div className="contribution-head">
        <div><span className="card-kicker">A SMALL VIEW OF THE BIG PICTURE</span><h3>Progress is a practice.</h3></div>
        <a className="contribution-profile-link" href={GITHUB_PROFILE} target="_blank" rel="noreferrer"><Github size={14} /> GITHUB PROFILE <ArrowUpRight size={13} /></a>
      </div>
      {weeks.length ? (
        <div className="contribution-content">
          <div className="contribution-calendar">
            <div className="contribution-summary">{total.toLocaleString()} contributions in {activeYear}</div>
            <div className="contribution-graph">
              <div className="graph-months" style={{ '--week-count': weeks.length }}>
                {monthMarks.map((month, index) => <span key={`${month.label}-${index}`} style={{ gridColumn: month.week }}>{month.label}</span>)}
              </div>
              <div className="graph-body">
                <div className="graph-days"><span /><span>MON</span><span /><span>WED</span><span /><span>FRI</span><span /></div>
                <div className="graph-weeks" style={{ '--week-count': weeks.length }}>
                  {weeks.map((week, weekIndex) => <div className="graph-week" key={weekIndex}>
                    {week.map((day, dayIndex) => <span
                      className={`graph-cell ${day ? `intensity-${day.level}` : 'graph-cell-empty'}`}
                      key={dayIndex}
                      title={day ? `${day.date}: ${day.count} contribution${day.count === 1 ? '' : 's'}` : undefined}
                      aria-label={day ? `${day.date}: ${day.count} contributions` : undefined}
                    />)}
                  </div>)}
                </div>
              </div>
              <div className="graph-legend"><span>LESS</span>{[0, 1, 2, 3, 4].map((level) => <i className={`graph-cell intensity-${level}`} key={level} />)}<span>MORE</span></div>
            </div>
          </div>
          <nav className="contribution-years" aria-label="Select contribution year">
            {availableYears.map((year) => <button className={activeYear === year ? 'selected' : ''} aria-pressed={activeYear === year} key={year} onClick={() => setSelectedYear(year)}>{year}</button>)}
          </nav>
        </div>
      ) : failed ? (
        <div className="contribution-fallback">
          <img src={`https://ghchart.rshah.org/292929/${GITHUB_USERNAME}`} alt={`GitHub contribution calendar for ${GITHUB_USERNAME}`} />
          <span>LIVE GITHUB CALENDAR · LAST 12 MONTHS</span>
        </div>
      ) : (
        <div className="contribution-loading" aria-live="polite">Loading GitHub contributions…</div>
      )}
      <p className="contribution-caption">{weeks.length ? `GitHub activity for @${GITHUB_USERNAME} · Updates automatically (data may be cached for up to an hour).` : failed ? <>Live graph from GitHub’s public profile data. <a href={GITHUB_PROFILE} target="_blank" rel="noreferrer">View profile <ArrowUpRight size={12} /></a></> : <a href={GITHUB_PROFILE} target="_blank" rel="noreferrer">View @{GITHUB_USERNAME} on GitHub <ArrowUpRight size={12} /></a>}</p>
    </div>
  )
}
