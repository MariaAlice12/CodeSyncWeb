import { useState, useEffect } from 'react'
import './style.css'
import { useAuth } from '../../contexts/AuthContext'
import { logout } from '../../services/auth.service'
import { getTrainings, enrollInTraining, getMyEnrollments } from '../../services/training.service'
import type { Training, Enrollment } from '../../types'
import { useNavigate } from 'react-router-dom'

type Tab = 'matricula' | 'meus-treinos'

const WEEKDAY_LABEL: Record<string, string> = {
  segunda: 'Segunda', terca: 'Terça', quarta: 'Quarta',
  quinta: 'Quinta', sexta: 'Sexta', sabado: 'Sábado', domingo: 'Domingo',
}

function TrainingCard({ training, action }: { training: Training; action: React.ReactNode }) {
  return (
    <div className="training-card">
      <p className="training-card__title">{training.modality}</p>
      <p className="training-card__detail">{WEEKDAY_LABEL[training.weekday] ?? training.weekday} · {training.hour}</p>
      <p className="training-card__detail">{training.address}</p>
      {training.description && <p className="training-card__detail">{training.description}</p>}
      <p className="training-card__detail">Vagas: {training.maxStudents}</p>
      <div className="training-card__actions">{action}</div>
    </div>
  )
}

function StudentDashboard() {
  const [tab, setTab] = useState<Tab>('matricula')
  const [available, setAvailable] = useState<Training[]>([])
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loadingAvailable, setLoadingAvailable] = useState(true)
  const [loadingEnrolled, setLoadingEnrolled] = useState(true)
  const [enrollingId, setEnrollingId] = useState<number | null>(null)
  const [errorAvailable, setErrorAvailable] = useState('')
  const [errorEnrolled, setErrorEnrolled] = useState('')
  const { signOut, userId } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    getTrainings()
      .then(setAvailable)
      .catch(() => setErrorAvailable('Não foi possível carregar os treinos'))
      .finally(() => setLoadingAvailable(false))
  }, [])

  useEffect(() => {
    getMyEnrollments()
      .then(setEnrollments)
      .catch(() => setErrorEnrolled('Não foi possível carregar suas matrículas'))
      .finally(() => setLoadingEnrolled(false))
  }, [])

  async function handleEnroll(trainingId: number) {
    if (!userId) return
    setEnrollingId(trainingId)
    try {
      const enrollment = await enrollInTraining(trainingId, userId)
      setEnrollments(prev => [...prev, enrollment])
    } catch {
      // silently ignore; user pode tentar novamente
    } finally {
      setEnrollingId(null)
    }
  }

  function handleLogout() {
    logout()
    signOut()
    navigate('/')
  }

  const myTrainings = userId
    ? enrollments.filter(e => e.user?.id === userId).map(e => e.training)
    : []

  const enrolledIds = new Set(myTrainings.map(t => t.id))

  return (
    <div className="student-page">
      <header className="student-header">
        <span className="student-header__brand">CodeSync</span>
        <nav className="student-nav">
          <button
            className={`student-nav__tab${tab === 'matricula' ? ' student-nav__tab--active' : ''}`}
            onClick={() => setTab('matricula')}
          >
            Matrícula de Treino
          </button>
          <button
            className={`student-nav__tab${tab === 'meus-treinos' ? ' student-nav__tab--active' : ''}`}
            onClick={() => setTab('meus-treinos')}
          >
            Meus Treinos
          </button>
        </nav>
        <button className="student-header__logout" onClick={handleLogout}>Sair</button>
      </header>

      <main className="student-content">
        {tab === 'matricula' && (
          <>
            <h2 className="section-title">Treinos Disponíveis</h2>
            {loadingAvailable && <p className="empty-state">Carregando...</p>}
            {errorAvailable && <p className="empty-state error">{errorAvailable}</p>}
            {!loadingAvailable && !errorAvailable && available.length === 0 && (
              <p className="empty-state">Nenhum treino disponível no momento.</p>
            )}
            <div className="training-grid">
              {available.map(t => (
                <TrainingCard
                  key={t.id}
                  training={t}
                  action={
                    enrolledIds.has(t.id) ? (
                      <span className="enrolled-badge">Matriculado</span>
                    ) : (
                      <button
                        className="enroll-btn"
                        disabled={enrollingId === t.id || !userId}
                        onClick={() => handleEnroll(t.id)}
                      >
                        {enrollingId === t.id ? 'Aguarde...' : 'Matricular-se'}
                      </button>
                    )
                  }
                />
              ))}
            </div>
          </>
        )}

        {tab === 'meus-treinos' && (
          <>
            <h2 className="section-title">Meus Treinos</h2>
            {loadingEnrolled && <p className="empty-state">Carregando...</p>}
            {errorEnrolled && <p className="empty-state error">{errorEnrolled}</p>}
            {!loadingEnrolled && !errorEnrolled && myTrainings.length === 0 && (
              <p className="empty-state">Você ainda não está matriculado em nenhum treino.</p>
            )}
            <div className="training-grid">
              {myTrainings.map(t => (
                <TrainingCard key={t.id} training={t} action={null} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default StudentDashboard
