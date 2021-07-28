import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { database } from "../../services/firebase";

import { useAuth } from "../../hooks/useAuth";
import { Button } from "../../components/Button";

import illustrationSvg from "../../assets/images/illustration.svg";
import logoSvg from "../../assets/images/logo.svg";

import "./styles.scss";

export function NewRoom() {
  const { user } = useAuth();
  const history = useHistory();
  const [newRoom, setNewRoom] = useState("");

  async function handleCreateRoom(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (newRoom.trim() === "") {
      return;
    }

    const roomRef = database.ref("rooms");

    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id,
    });

    history.push(`/admin/rooms/${firebaseRoom.key}`);
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
          <h2>Crie uma nova sala</h2>
          <form onSubmit={handleCreateRoom}>
            <input
              type="text"
              onChange={(event) => setNewRoom(event.target.value)}
              value={newRoom}
              placeholder="Nome da sala"
            />
            <Button type="submit">Criar sala</Button>
          </form>
          <p>
            Quer entrar em uma sala existente? <Link to={"/"}>clique aqui</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
