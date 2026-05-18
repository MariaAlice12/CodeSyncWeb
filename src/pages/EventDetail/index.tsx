import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './style.css'
import { getEventById } from '../../services/event.service'
import { registerInEvent, getAllEventRegistrations, updateEventRegistration } from '../../services/eventRegistration.service'
import { useAuth } from '../../contexts/AuthContext'
import type { Event, EventRegistration } from '../../types'
import BracketVisual from '../../components/BracketVisual'

function EventDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { userId, userRole } = useAuth()
  const [event, setEvent] = useState<Event | null>(null)
  const [registrations, setRegistrations] = useState<EventRegistration[]>([])
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState(false)
  const [error, setError] = useState('')
  const [showBracket, setShowBracket] = useState(false)

  useEffect(() => {
    if (!id) return
    Promise.all([getEventById(Number(id)), getAllEventRegistrations()])
      .then(([ev, regs]) => {
        setEvent(ev)
        setRegistrations(regs.filter(r => r.event.id === Number(id)))
      })
      .catch(() => setError('Não foi possível carregar o evento'))
      .finally(() => setLoading(false))
  }, [id])

  const myReg = userId ? registrations.find(r => r.user.id === userId) : undefined

  async function handleRegister() {
    if (!userId || !id) return
    setRegistering(true)
    try {
      const reg = await registerInEvent(Number(id), userId)
      setRegistrations(prev => [...prev, reg])
    } catch {
      setError('Não foi possível realizar a inscrição')
    } finally {
      setRegistering(false)
    }
  }

  async function handleCancelRegistration() {
    if (!myReg) return
    setRegistering(true)
    try {
      await updateEventRegistration(myReg.id, { active: false })
      setRegistrations(prev => prev.map(r => r.id === myReg.id ? { ...r, active: false } : r))
    } catch {
      setError('Não foi possível cancelar a inscrição')
    } finally {
      setRegistering(false)
    }
  }

  if (loading) {
    return (
      <div className="event-detail-page">
        <p className="empty-state">Carregando...</p>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="event-detail-page">
        <p className="empty-state error">{error || 'Evento não encontrado'}</p>
        <button className="back-btn" onClick={() => navigate(-1)}>Voltar</button>
      </div>
    )
  }

  const activeRegs = registrations.filter(r => r.active)

  return (
    <div className="event-detail-page">
      <div className="event-detail-container">
        <button className="back-btn" onClick={() => navigate(-1)}>← Voltar</button>

        {event.image && (
          <img className="event-detail__image" src={event.image} alt={event.title} />
        )}

        <h1 className="event-detail__title">{event.title}</h1>

        {event.date && (
          <p className="event-detail__date">
            {new Date(event.date).toLocaleString('pt-BR', { dateStyle: 'full', timeStyle: 'short' })}
          </p>
        )}

        <p className="event-detail__description">{event.description}</p>

        {error && <p className="form-error">{error}</p>}

        {userRole === 'aluno' && (
          <div className="event-detail__action">
            {!myReg || !myReg.active ? (
              <button
                className="event-register-btn"
                disabled={registering}
                onClick={handleRegister}
              >
                {registering ? 'Aguarde...' : 'Inscrever-se no Evento'}
              </button>
            ) : (
              <div className="event-registered">
                <span className="event-registered__badge">Inscrito</span>
                <button
                  className="event-cancel-btn"
                  disabled={registering}
                  onClick={handleCancelRegistration}
                >
                  {registering ? 'Aguarde...' : 'Cancelar inscrição'}
                </button>
              </div>
            )}
          </div>
        )}

        <div className="event-detail__participants">
          <h3 className="event-detail__section-title">Participantes ({activeRegs.length})</h3>
          {activeRegs.length === 0 ? (
            <p className="empty-state">Nenhuma inscrição confirmada ainda.</p>
          ) : (
            <ul className="participant-list">
              {activeRegs.map(r => (
                <li key={r.id} className="participant-item">
                  <span className="participant-avatar">{r.user.name[0].toUpperCase()}</span>
                  <span className="participant-name">{r.user.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {event.tournamentBracket && (
          <div className="event-detail__bracket">
            <div className="event-detail__bracket-header">
              <h3 className="event-detail__section-title">
                Chaveamento · {event.tournamentBracket.name}
                <span className="bracket-type-badge">{event.tournamentBracket.type}</span>
              </h3>
              <button
                className={`bracket-toggle-btn${showBracket ? ' bracket-toggle-btn--active' : ''}`}
                onClick={() => setShowBracket(v => !v)}
              >
                {showBracket ? 'Ocultar Chave' : 'Mostrar Chave'}
              </button>
            </div>
            {showBracket && (
              <BracketVisual
                type={event.tournamentBracket.type}
                teamCount={event.tournamentBracket.teamCount}
                participants={activeRegs.map(r => r.user.name)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default EventDetail
