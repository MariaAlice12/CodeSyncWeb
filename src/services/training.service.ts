import request from './api'
import type { TrainingPayload, Training, Enrollment } from '../types'

export const createTraining = (payload: TrainingPayload) =>
  request('/training', { method: 'POST', body: JSON.stringify(payload) })

export const getTrainings = () =>
  request<Training[]>('/training')

export const enrollInTraining = (trainingId: number, userId: number) =>
  request<Enrollment>('/enrollment', { method: 'POST', body: JSON.stringify({ trainingId, userId }) })

export const getMyEnrollments = () =>
  request<Enrollment[]>('/enrollment')
