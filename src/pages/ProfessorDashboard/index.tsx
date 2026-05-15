import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './style.css'
import { useAuth } from '../../contexts/AuthContext'
import { logout } from '../../services/auth.service'
import { getTrainings } from '../../services/training.service'
import type { Training } from '../../types'

const WEEKDAY_LABEL: Record<string, string> = {
  segunda: 'Segunda', terca: 'Terça', quarta: 'Quarta',
  quinta: 'Quinta', sexta: 'Sexta', sabado: 'Sábado', domingo: 'Domingo',
}

function ProfessorDashboard() {
  const [trainings, setTrainings] = useState<Training[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { signOut } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    getTrainings()
      .then(setTrainings)
      .catch(() => setError('Não foi possível carregar os treinos'))
      .finally(() => setLoading(false))
  }, [])

  function handleLogout() {
    logout()
    signOut()
    navigate('/')
  }

  return (
    <div className="professor-page">
      <header className="professor-header">
        <span className="professor-header__brand">CodeSync</span>
        <button className="professor-header__create" onClick={() => navigate('/criar-treino')}>
          + Criar Treino
        </button>
        <button className="professor-header__logout" onClick={handleLogout}>Sair</button>
      </header>

      <main className="professor-content">
        <h2 className="section-title">Treinos Cadastrados</h2>

        {loading && <p className="empty-state">Carregando...</p>}
        {error && <p className="empty-state error">{error}</p>}
        {!loading && !error && trainings.length === 0 && (
          <p className="empty-state">Nenhum treino cadastrado ainda.</p>
        )}

        <div className="training-list">
          {trainings.map(t => (
            <div key={t.id} className="training-row">
              <div className="training-row__info">
                <span className="training-row__name">{t.modality}</span>
                <span className="training-row__meta">
                  {WEEKDAY_LABEL[t.weekday] ?? t.weekday} · {t.hour} · {t.address}
                </span>
              </div>
              <span className="training-row__level">{t.maxStudents} vagas</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default ProfessorDashboard
