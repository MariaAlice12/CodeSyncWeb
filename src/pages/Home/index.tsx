import { useState } from "react";
import "./style.css";

function Home() {

  const [isLogin, setIsLogin] = useState(false);

  return (
    <div className="page">

      <div className="auth-card">

        {!isLogin ? (
          <>
            <h1>Cadastre-se</h1>

            <input type="text" placeholder="Nome" />
            <input type="email" placeholder="Email" />
            <input type="tel" placeholder="Telefone" />
            <input type="password" placeholder="Senha" />

            <select>
              <option>Administrador</option>
              <option>Professor</option>
              <option>Atleta</option>
            </select>

            <button>Cadastrar</button>

            <p className="switch">
              Já tem conta?
              <span onClick={() => setIsLogin(true)}> Entrar</span>
            </p>
          </>
        ) : (
          <>
            <h1>Bem-vindo(a) de volta</h1>

            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Senha" />

            <button>Entrar</button>

            <p className="switch">
              Não tem conta?
              <span onClick={() => setIsLogin(false)}> Cadastre-se</span>
            </p>
          </>
        )}

      </div>

    </div>
  );
}

export default Home;