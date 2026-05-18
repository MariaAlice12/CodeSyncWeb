import { useMemo } from 'react'

function shuffle(arr: string[]): string[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

interface BracketVisualProps {
  type: string
  teamCount: number
  participants: string[]
}

function BracketVisual({ type, teamCount, participants }: BracketVisualProps) {
  const seeded = useMemo(() => {
    const shuffled = shuffle(participants)
    while (shuffled.length < teamCount) shuffled.push('A definir')
    return shuffled.slice(0, teamCount)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const rounds = Math.ceil(Math.log2(teamCount))

  if (type === 'round-robin') {
    // round-robin usa participantes reais, sem padding "A definir"
    const actual = participants.filter(p => p.trim() !== '')
    const matchCount = (actual.length * (actual.length - 1)) / 2
    return (
      <div className="bracket-rr">
        <p className="bracket-rr__info">{actual.length} participantes · {matchCount} partidas no total</p>
        <div className="bracket-rr__grid">
          {actual.map((a, i) =>
            actual.map((b, j) =>
              j > i ? (
                <div key={`${i}-${j}`} className="bracket-rr__match">
                  <span className="bracket-rr__name">{a}</span>
                  <span className="bracket-rr__vs">×</span>
                  <span className="bracket-rr__name">{b}</span>
                </div>
              ) : null
            )
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="bracket-elim">
      {Array.from({ length: rounds }, (_, r) => {
        const matchesInRound = Math.pow(2, rounds - r - 1)
        const label = r === rounds - 1 ? 'Final' : r === rounds - 2 ? 'Semifinal' : `Rodada ${r + 1}`
        return (
          <div key={r} className="bracket-round">
            <span className="bracket-round__label">{label}</span>
            <div className="bracket-round__matches">
              {Array.from({ length: matchesInRound }, (_, m) => {
                const slotA = r === 0 ? seeded[m * 2] : 'A definir'
                const slotB = r === 0 ? seeded[m * 2 + 1] : 'A definir'
                return (
                  <div key={m} className="bracket-match">
                    <span className={`bracket-match__slot${slotA === 'A definir' ? ' bracket-match__slot--tbd' : ''}`}>{slotA}</span>
                    <span className="bracket-match__vs">×</span>
                    <span className={`bracket-match__slot${slotB === 'A definir' ? ' bracket-match__slot--tbd' : ''}`}>{slotB}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default BracketVisual
