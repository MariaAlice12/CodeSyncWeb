import { useState } from "react"
import "./style.css"

function CreateTraining() {

  const [tipoTreino, setTipoTreino] = useState("esporadico")
  const [horaInicio, setHoraInicio] = useState("")
  const [horaFim, setHoraFim] = useState("")

  return (
    <div className="training-page">

      <div className="training-container">

        <h1>Criar Treino</h1>

        {/* Informações */}
        <div className="form-section">
          <h2>Informações do Treino</h2>

          <input type="text" placeholder="Nome do treino" />

          <select>
            <option>Modalidade</option>
            <option>Atletismo</option>
            <option>Futebol</option>
            <option>Vôlei</option>
            <option>Basquete</option>
            <option>Judô</option>
          </select>

          <textarea placeholder="Descrição do treino"></textarea>
        </div>

        {/* Agendamento */}
        <div className="form-section">
          <h2>Agendamento</h2>

          {/* Tipo de treino */}
          <select
            value={tipoTreino}
            onChange={(e) => setTipoTreino(e.target.value)}
          >
            <option value="esporadico">Treino Esporádico</option>
            <option value="fixo">Treino Fixo Semanal</option>
          </select>

          {/* Se for esporádico */}
          {tipoTreino === "esporadico" && (
            <div className="row">
              <input type="date" />

              <input
                type="time"
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
              />

              <input
                type="time"
                value={horaFim}
                onChange={(e) => setHoraFim(e.target.value)}
              />
            </div>
          )}

          {/* Se for fixo */}
          {tipoTreino === "fixo" && (
            <div className="row">
              <select>
                <option>Dia da semana</option>
                <option>Segunda</option>
                <option>Terça</option>
                <option>Quarta</option>
                <option>Quinta</option>
                <option>Sexta</option>
                <option>Sábado</option>
                <option>Domingo</option>
              </select>

              <input
                type="time"
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
              />

              <input
                type="time"
                value={horaFim}
                onChange={(e) => setHoraFim(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Local */}
        <div className="form-section">
          <h2>Local</h2>

          <input type="text" placeholder="Local do treino" />

          <h2>Capacidade de atletas</h2>
          <input type="number" />
        </div>

        {/* Configuração */}
        <div className="form-section">
          <h2>Configurações</h2>

          <select>
            <option>Nível do treino</option>
            <option>Iniciante</option>
            <option>Intermediário</option>
            <option>Avançado</option>
          </select>

          <input type="text" placeholder="Treinador responsável" />
        </div>

        <button className="save-btn">
          Salvar Treino
        </button>

      </div>

    </div>
  )
}

export default CreateTraining