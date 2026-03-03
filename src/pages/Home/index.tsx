import { useState } from 'react'
import './style.css'

function Home() {
  return (
    <div className="page">

        <form className="card-form">

          <h1>Cadastro de Atletas</h1>

          <input type="text" placeholder="Nome" />
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Senha" />

          <button>Cadastrar</button>

        </form>

      </div>

  )
}

export default Home;
