import request from './api'
import type { TournamentBracket } from '../types'

export interface BracketPayload {
  name: string
  type: 'single' | 'double' | 'round-robin'
  teamCount: number
}

export const createBracket = (payload: BracketPayload) =>
  request<TournamentBracket>('/tournament-bracket', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

export const getBrackets = () =>
  request<TournamentBracket[]>('/tournament-bracket')

export const getBracketById = (id: string) =>
  request<TournamentBracket>(`/tournament-bracket/${id}`)

export const updateBracket = (id: string, payload: Partial<BracketPayload>) =>
  request(`/tournament-bracket/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })

export const deleteBracket = (id: string) =>
  request(`/tournament-bracket/${id}`, { method: 'DELETE' })
