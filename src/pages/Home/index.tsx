import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './style.css'
import Input from '../../components/Input'
import Select from '../../components/Select'
import Button from '../../components/Button'
import useForm from '../../hooks/useForm'
import { login, register } from '../../services/auth.service'
import { useAuth } from '../../contexts/AuthContext'

const ROLE_OPTIONS = [
  { value: 'professor', label: 'Professor' },
  { value: 'aluno', label: 'Atleta' },
]

const REGISTER_INITIAL = { name: '', email: '', telephone: '', password: '', userType: '' }
const LOGIN_INITIAL = { email: '', password: '' }

function parseError(err: unknown): string {
  if (err instanceof Error) {
    if (err.message.toLowerCase().includes('fetch') || err.message.toLowerCase().includes('network')) {
      return 'Não foi possível conectar ao servidor'
    }
    return err.message
  }
  return 'Erro desconhecido'
}

function Home() {
  const [isLogin, setIsLogin] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const registerForm = useForm(REGISTER_INITIAL)
  const loginForm = useForm(LOGIN_INITIAL)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const data = await register(registerForm.values as any)
      signIn(data.access_token, data.user?.userType, data.user?.id)
      navigate('/dashboard')
    } catch (err) {
      setError(parseError(err))
    } finally {
      setLoading(false)
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const data = await login(loginForm.values as any)
      signIn(data.access_token, data.user?.userType, data.user?.id)
      navigate('/dashboard')
    } catch (err) {
      setError(parseError(err))
    } finally {
      setLoading(false)
    }
  }

  function switchToLogin() {
    setIsLogin(true)
    setError('')
  }

  function switchToRegister() {
    setIsLogin(false)
    setError('')
  }

  return (
    <div className="page">
      {!isLogin ? (
        <form className="auth-card" onSubmit={handleRegister}>
          <h1>Cadastre-se</h1>
          <Input name="name" type="text" placeholder="Nome" value={registerForm.values.name} onChange={registerForm.handleChange} />
          <Input name="email" type="email" placeholder="Email" value={registerForm.values.email} onChange={registerForm.handleChange} />
          <Input name="telephone" type="tel" placeholder="Telefone" value={registerForm.values.telephone} onChange={registerForm.handleChange} />
          <Input name="password" type="password" placeholder="Senha" value={registerForm.values.password} onChange={registerForm.handleChange} />
          <Select name="userType" placeholder="Selecione sua função" options={ROLE_OPTIONS} value={registerForm.values.userType} onChange={registerForm.handleChange} />
          {error && <p className="form-error">{error}</p>}
          <Button type="submit" disabled={loading}>{loading ? 'Aguarde...' : 'Cadastrar'}</Button>
          <p className="switch">
            Já tem conta?
            <span onClick={switchToLogin}> Entrar</span>
          </p>
        </form>
      ) : (
        <form className="auth-card" onSubmit={handleLogin}>
          <h1>Bem-vindo(a) de volta</h1>
          <Input name="email" type="email" placeholder="Email" value={loginForm.values.email} onChange={loginForm.handleChange} />
          <Input name="password" type="password" placeholder="Senha" value={loginForm.values.password} onChange={loginForm.handleChange} />
          {error && <p className="form-error">{error}</p>}
          <Button type="submit" disabled={loading}>{loading ? 'Aguarde...' : 'Entrar'}</Button>
          <p className="switch">
            Não tem conta?
            <span onClick={switchToRegister}> Cadastre-se</span>
          </p>
        </form>
      )}
    </div>
  )
}

export default Home
