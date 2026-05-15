import request from './api'
import type { LoginPayload, RegisterPayload, AuthResponse } from '../types'
import { setToken, removeToken, setRole, removeRole, setUserId, removeUserId } from '../utils/token'

export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  const data = await request<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify(payload) })
  setToken(data.access_token)
  if (data.user?.userType) setRole(data.user.userType)
  if (data.user?.id) setUserId(data.user.id)
  return data
}

export const register = async (payload: RegisterPayload): Promise<AuthResponse> => {
  await request('/user', { method: 'POST', body: JSON.stringify(payload) })
  // Backend não retorna token no cadastro — faz login automático
  return login({ email: payload.email, password: payload.password })
}

export const logout = (): void => {
  removeToken()
  removeRole()
  removeUserId()
}
