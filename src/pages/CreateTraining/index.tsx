import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './style.css'
import Input from '../../components/Input'
import Select from '../../components/Select'
import Button from '../../components/Button'
import useForm from '../../hooks/useForm'
import { createTraining } from '../../services/training.service'
import type { TrainingPayload } from '../../types'

const MODALIDADE_OPTIONS = [
  { value: 'atletismo', label: 'Atletismo' },
  { value: 'futebol', label: 'Futebol' },
  { value: 'volei', label: 'Vôlei' },
  { value: 'basquete', label: 'Basquete' },
  { value: 'judo', label: 'Judô' },
]

const DIA_OPTIONS = [
  { value: 'segunda', label: 'Segunda' },
  { value: 'terca', label: 'Terça' },
  { value: 'quarta', label: 'Quarta' },
  { value: 'quinta', label: 'Quinta' },
  { value: 'sexta', label: 'Sexta' },
  { value: 'sabado', label: 'Sábado' },
  { value: 'domingo', label: 'Domingo' },
]

const INITIAL = {
  modality: '',
  hour: '',
  address: '',
  weekday: '',
  description: '',
  maxStudents: '',
  minStudents: '',
}

function CreateTraining() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { values, handleChange } = useForm(INITIAL)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const payload: TrainingPayload = {
        modality: values.modality,
        hour: values.hour,
        address: values.address,
        weekday: values.weekday,
        description: values.description || undefined,
        maxStudents: Number(values.maxStudents),
        minStudents: Number(values.minStudents),
      }
      await createTraining(payload)
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar treino')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="training-page">
      <form className="training-container" onSubmit={handleSubmit}>
        <h1>Criar Treino</h1>

        <div className="form-section">
          <h2>Informações do Treino</h2>
          <Select name="modality" placeholder="Modalidade" options={MODALIDADE_OPTIONS} value={values.modality} onChange={handleChange} />
          <textarea
            name="description"
            placeholder="Descrição do treino (opcional)"
            value={values.description}
            onChange={handleChange}
          />
        </div>

        <div className="form-section">
          <h2>Agendamento</h2>
          <Select name="weekday" placeholder="Dia da semana" options={DIA_OPTIONS} value={values.weekday} onChange={handleChange} />
          <Input name="hour" type="time" value={values.hour} onChange={handleChange} />
        </div>

        <div className="form-section">
          <h2>Local</h2>
          <Input name="address" type="text" placeholder="Endereço / Local do treino" value={values.address} onChange={handleChange} />
        </div>

        <div className="form-section">
          <h2>Vagas</h2>
          <div className="row">
            <Input name="minStudents" type="number" placeholder="Mínimo de alunos" value={values.minStudents} onChange={handleChange} />
            <Input name="maxStudents" type="number" placeholder="Máximo de alunos" value={values.maxStudents} onChange={handleChange} />
          </div>
        </div>

        {error && <p className="form-error">{error}</p>}
        <Button type="submit" disabled={loading}>{loading ? 'Salvando...' : 'Salvar Treino'}</Button>
      </form>
    </div>
  )
}

export default CreateTraining
