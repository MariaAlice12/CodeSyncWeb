import request from './api'
import type { StravaActivity } from '../types'

export const getStravaActivities = () =>
  request<StravaActivity[]>('/strava')

export const syncStravaActivities = (perPage = 5) =>
  request<StravaActivity[]>(`/strava/sync?perPage=${perPage}`)
