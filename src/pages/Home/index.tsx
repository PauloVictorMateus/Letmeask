import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import { database } from "../../services/firebase";

import { Button } from "../../components/Button";

import illustrationSvg from "../../assets/images/illustration.svg";
import logoSvg from "../../assets/images/logo.svg";
import googleIconSvg from "../../assets/images/google-icon.svg";

import "./styles.scss";

export function Home() {
  const [roomCode, setRoomCode] = useState("");
  const history = useHistory();
  const { signInWithGoogle, user } = useAuth();

  async function handleCreateRoom() {
    if (!user) {
      await signInWithGoogle();
    }
    history.push("/rooms/new");
  }

  async function handleJoinRoom(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (roomCode.trim() === "") {
      return;
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if (!roomRef.exists()) {
      alert("Sala não encontrada!");
      return;
    }

    if (roomRef.val().endedAt) {
      alert("Essa sala já foi encerrada!");
      return;
    }

    history.push(`/rooms/${roomCode}`);
  }

  return (
    <div id="page-auth">
      <aside>
        <img
          src={illustrationSvg}
          alt="Ilustração simbolizando perguntas e respostas"
        />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoSvg} alt="Letmeask" />
          <button onClick={handleCreateRoom} className="create-room">
            <img src={googleIconSvg} alt="Logo do Google" />
            Crie sua sala com o Google
          </button>
          <div className="separator">ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              value={roomCode}
              onChange={(event) => setRoomCode(event.target.value)}
              placeholder="Digite o código da sala"
            />
            <Button type="submit">Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  );
}
