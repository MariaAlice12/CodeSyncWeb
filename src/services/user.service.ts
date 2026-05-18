import request from './api'
import type { User } from '../types'

export interface CreateUserPayload {
  name: string
  email: string
  telephone: string
  password: string
  userType: 'aluno' | 'professor' | 'admin'
}

export const getUsers = () =>
  request<User[]>('/user')

export const getUserById = (id: number) =>
  request<User>(`/user/${id}`)

export const updateUser = (id: number, payload: Partial<CreateUserPayload>) =>
  request(`/user/${id}`, { method: 'PATCH', body: JSON.stringify(payload) })

export const deleteUser = (id: number) =>
  request(`/user/${id}`, { method: 'DELETE' })
