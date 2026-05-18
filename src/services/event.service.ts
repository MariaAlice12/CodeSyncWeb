import request from './api'
import type { Event, EventPayload } from '../types'

export const createEvent = (payload: EventPayload) =>
  request<Event>('/event', { method: 'POST', body: JSON.stringify(payload) })

export const getEvents = () =>
  request<Event[]>('/event')

export const getEventById = (id: number) =>
  request<Event>(`/event/${id}`)

export const updateEvent = (id: number, payload: Partial<EventPayload>) =>
  request(`/event/${id}`, { method: 'PATCH', body: JSON.stringify(payload) })

export const deleteEvent = (id: number) =>
  request(`/event/${id}`, { method: 'DELETE' })
