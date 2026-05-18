import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './style.css'
import { useAuth } from '../../contexts/AuthContext'
import { getUserById, updateUser } from '../../services/user.service'
import type { User } from '../../types'

function ProfilePage() {
  const { userId } = useAuth()
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [name, setName] = useState('')
  const [telephone, setTelephone] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (!userId) return
    getUserById(userId)
      .then(u => {
        setUser(u)
        setName(u.name)
        setTelephone(u.telephone)
      })
      .catch(() => setError('Não foi possível carregar o perfil'))
      .finally(() => setLoading(false))
  }, [userId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!userId) return
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const payload: Record<string, string> = { name, telephone }
      if (password) payload.password = password
      await updateUser(userId, payload)
      setSuccess('Perfil atualizado com sucesso!')
      setPassword('')
      if (user) setUser({ ...user, name, telephone })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar perfil')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <p className="empty-state">Carregando...</p>
        </div>
      </div>
    )
  }

  const ROLE_LABEL: Record<string, string> = { aluno: 'Atleta', professor: 'Professor', admin: 'Administrador' }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <button className="back-btn" onClick={() => navigate(-1)}>← Voltar</button>

        <div className="profile-header">
          <div className="profile-avatar">{user?.name[0].toUpperCase()}</div>
          <div>
            <h1 className="profile-name">{user?.name}</h1>
            <span className="profile-role">{ROLE_LABEL[user?.userType ?? ''] ?? user?.userType}</span>
          </div>
        </div>

        <form className="profile-form" onSubmit={handleSubmit}>
          <h2 className="profile-form__title">Editar Perfil</h2>

          <div className="profile-field">
            <label className="profile-field__label">Nome</label>
            <input
              className="profile-field__input"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div className="profile-field">
            <label className="profile-field__label">Email</label>
            <input
              className="profile-field__input profile-field__input--readonly"
              type="email"
              value={user?.email ?? ''}
              readOnly
            />
          </div>

          <div className="profile-field">
            <label className="profile-field__label">Telefone</label>
            <input
              className="profile-field__input"
              type="tel"
              value={telephone}
              onChange={e => setTelephone(e.target.value)}
            />
          </div>

          <div className="profile-field">
            <label className="profile-field__label">Nova Senha <span className="profile-field__optional">(deixe em branco para manter)</span></label>
            <input
              className="profile-field__input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="form-error">{error}</p>}
          {success && <p className="form-success">{success}</p>}

          <button className="profile-save-btn" type="submit" disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ProfilePage
