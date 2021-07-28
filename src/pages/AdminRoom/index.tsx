import { useHistory } from "react-router-dom";
import { useParams } from "react-router";

import { useRoom } from "../../hooks/useRoom";
import { database } from "../../services/firebase";

import { Button } from "../../components/Button";
import { RoomCode } from "../../components/RoomCode";
import { Question } from "../../components/Question";

import logoSvg from "../../assets/images/logo.svg";
import deleteSvg from "../../assets/images/delete.svg";
import checkSvg from "../../assets/images/check.svg";
import answerSvg from "../../assets/images/answer.svg";

import "./styles.scss";
import { useState } from "react";

type RoomParams = {
  id: string;
};

export function AdminRoom() {
  const history = useHistory();
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const [modalToCloseRoomIsOpen, setModalToCloseRoomIsOpen] = useState(false);
  const [modalToDeleteQuestionIsOpen, setModalToDeleteQuestionIsOpen] =
    useState(false);

  const { title, questions } = useRoom(roomId);

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    });
    history.push("/");
  }

  async function handleDeleteQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    });
  }

  async function handleHighlightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighLighted: true,
    });
  }

  function toggleModalToCloseRoom() {
    setModalToCloseRoomIsOpen(!modalToCloseRoomIsOpen);
  }

  function toggleModalToDeleteQuestion() {
    setModalToDeleteQuestionIsOpen(!modalToDeleteQuestionIsOpen);
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoSvg} alt="Letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button onClick={toggleModalToCloseRoom} isOutlined>
              Encerrar sala
            </Button>
          </div>
        </div>
      </header>
      <main className="content">
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && (
            <span>
              {questions.length}{" "}
              {questions.length === 1 ? "pergunta" : "perguntas"}
            </span>
          )}
        </div>

        <div
          className="modal"
          style={{ display: modalToCloseRoomIsOpen ? "block" : "none" }}
        >
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-info">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M29.66 18.3398L18.34 29.6598"
                    stroke="#E73F5D"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M29.66 29.6598L18.34 18.3398"
                    stroke="#E73F5D"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M24 42V42C14.058 42 6 33.942 6 24V24C6 14.058 14.058 6 24 6V6C33.942 6 42 14.058 42 24V24C42 33.942 33.942 42 24 42Z"
                    stroke="#E73F5D"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <h1>Encerrar sala</h1>
                <p>Tem certeza que você deseja encerrar esta sala?</p>
              </div>
              <div className="buttons">
                <button className="cancel" onClick={toggleModalToCloseRoom}>
                  Cancelar
                </button>
                <button className="close-room" onClick={handleEndRoom}>
                  Sim, encerrar
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="question-list">
          {questions.length === 0 && (
            <p className="message">Ainda não enviaram nenhuma pergunta...</p>
          )}
          {questions.map((question) => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
                isAnswered={question.isAnswered}
                isHighLighted={question.isHighLighted}
              >
                {!question.isAnswered && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleCheckQuestionAsAnswered(question.id)}
                    >
                      <img
                        src={checkSvg}
                        alt="Marcar pergunta como respondida"
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleHighlightQuestion(question.id)}
                    >
                      <img src={answerSvg} alt="Dar a destaque à pergunta" />
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => toggleModalToDeleteQuestion()}
                >
                  <img src={deleteSvg} alt="Excluir pergunta" />
                </button>

                <div
                  className="modal"
                  style={{
                    display: modalToDeleteQuestionIsOpen ? "block" : "none",
                  }}
                >
                  <div className="modal-overlay">
                    <div className="modal-content">
                      <div className="modal-info">
                        <svg
                          width="48"
                          height="48"
                          viewBox="0 0 48 48"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6 12H10H42"
                            stroke="#E73F5D"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M15.9995 12.0001V8.00012C15.9995 6.93926 16.4209 5.92184 17.1711 5.17169C17.9212 4.42155 18.9386 4.00012 19.9995 4.00012H27.9995C29.0604 4.00012 30.0778 4.42155 30.8279 5.17169C31.5781 5.92184 31.9995 6.93926 31.9995 8.00012V12.0001M37.9995 12.0001V40.0001C37.9995 41.061 37.5781 42.0784 36.8279 42.8285C36.0778 43.5787 35.0604 44.0001 33.9995 44.0001H13.9995C12.9386 44.0001 11.9212 43.5787 11.1711 42.8285C10.4209 42.0784 9.99951 41.061 9.99951 40.0001V12.0001H37.9995Z"
                            stroke="#E73F5D"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <h1>Excluir pergunta</h1>
                        <p>
                          Tem certeza que você deseja excluir esta pergunta?
                        </p>
                      </div>
                      <div className="buttons">
                        <button
                          className="cancel"
                          onClick={toggleModalToDeleteQuestion}
                        >
                          Cancelar
                        </button>
                        <button
                          className="close-room"
                          onClick={() => handleDeleteQuestion(question.id)}
                        >
                          Sim, excluir
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Question>
            );
          })}
        </div>
      </main>
    </div>
  );
}
