import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [started, setStarted] = useState(false);
  const [viewHistorial, setViewHistorial] = useState(false);
  const [historial, setHistorial] = useState([]);

  const [resultado, setResultado] = useState({});
  const [step, setStep] = useState(0);
  const [respuestas, setRespuestas] = useState({});
  const [showResult, setShowResult] = useState(false);

  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  const preguntas = [
    { id: "nombre", cat: "Perfil", q: "¿Cuál es tu nombre?", tipo: "input" },
    { id: "edad", cat: "Perfil", q: "¿Qué edad tienes?", tipo: "input" },
    { id: "genero", cat: "Perfil", q: "Género", tipo: "btn", opciones: ["Hombre", "Mujer"] },
    { id: "estatura", cat: "Perfil", q: "¿Cuánto mides?", tipo: "input" },
    { id: "peso", cat: "Perfil", q: "¿Cuánto pesas?", tipo: "input" },
    { id: "cintura", cat: "Riesgo Preventivo", q: "¿Cómo consideras la medida de tu cintura?", tipo: "btn", opciones: [] },
    { id: "ejercicio", cat: "Riesgo Preventivo", q: "¿Realizas al menos 30 min de ejercicio diario?", tipo: "btn", opciones: ["Sí", "No"] },
    { id: "dieta_frutas", cat: "Riesgo Preventivo", q: "¿Con qué frecuencia comes verduras o frutas?", tipo: "btn", opciones: ["Todos los días", "No todos los días"] },
    { id: "presion_medicina", cat: "Riesgo Preventivo", q: "¿Tomas medicina para la presión alta?", tipo: "btn", opciones: ["Sí", "No"] },
    { id: "glucosa_alta", cat: "Riesgo Preventivo", q: "¿Alguna vez has tenido la glucosa alta?", tipo: "btn", opciones: ["Sí", "No"] },
    { id: "sed_polidipsia", cat: "Chequeo Síntomas", q: "¿Sientes mucha sed frecuentemente?", tipo: "btn", opciones: ["Nunca", "A veces", "Siempre"] },
    { id: "hambre_polifagia", cat: "Chequeo Síntomas", q: "¿Sientes hambre excesiva poco después de comer?", tipo: "btn", opciones: ["Nunca", "A veces", "Siempre"] },
    { id: "orina_poliuria", cat: "Chequeo Síntomas", q: "¿Sientes necesidad de orinar muy seguido?", tipo: "btn", opciones: ["Nunca", "A veces", "Siempre"] },
    { id: "peso_perdida", cat: "Chequeo Síntomas", q: "¿Has perdido peso recientemente sin dieta?", tipo: "btn", opciones: ["Sí", "No"] },
    { id: "acantosis", cat: "Signos Físicos", q: "¿Tienes manchas oscuras en cuello o axilas?", tipo: "btn", opciones: ["Sí", "No"] },
    { id: "acrocordones", cat: "Signos Físicos", q: "¿Tienes pequeñas verrugas de carne en el cuello?", tipo: "btn", opciones: ["Sí", "No"] },
    { id: "herencia", cat: "Carga Genética", q: "¿Familiares directos con Diabetes?", tipo: "btn", opciones: ["Nadie", "Abuelos / Tíos", "Padres / Hermanos"] }
  ];

  // 🔹 VALIDACIONES
  const validar = (id, value) => {
    if (!value) return "Campo requerido";

    if (id === "nombre" && value.length < 3) return "Nombre muy corto";
    if (id === "edad" && (isNaN(value) || value < 1 || value > 120)) return "Edad inválida";
    if (id === "estatura") { let num = parseFloat(value);
    if (num >= 0.5 && num <= 2.5) { value = num * 100;} if (isNaN(value) || value < 50 || value > 250) return "Estatura inválida";}
    if (id === "peso" && (isNaN(value) || value < 20 || value > 300)) return "Peso inválido";

    return "";
  };

  const capturarRespuesta = (valor) => {
    const nuevaData = { ...respuestas, [preguntas[step].id]: valor };
    setRespuestas(nuevaData);

    if (step < preguntas.length - 1) {
      setStep(step + 1);
      setInputValue("");
    } else {
      enviarBackend(nuevaData);
    }
  };

  const enviarBackend = (data) => {
    fetch("https://nivelaback.onrender.com/evaluar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(data => {
      setResultado(data);
      setShowResult(true);
    });
  };

  const retroceder = () => {
    if (step > 0) setStep(step - 1);
  };

  const siguienteManual = () => {
    const id = preguntas[step].id;
    const err = validar(id, inputValue);

    if (err) {
      setError(err);
      return;
    }

    setError("");
    capturarRespuesta(inputValue);
  };

  const obtenerHistorial = () => {
    fetch("https://nivelaback.onrender.com/historial")
      .then(res => res.json())
      .then(data => {
        setHistorial(data);
        setViewHistorial(true);
      });
  };

  // CINTURA DINÁMICA
  const obtenerOpcionesCintura = () => {
    const genero = respuestas.genero || "Mujer";
    return genero === "Hombre"
      ? ["Normal (Menos de 94 cm / Talla < 36)", "Elevada (Más de 94 cm / Talla > 36)"]
      : ["Normal (Menos de 80 cm / Talla < 32)", "Elevada (Más de 80 cm / Talla > 32)"];
  };

  // 🟢 LANDING
  if (!started && !viewHistorial) {
    return (
      <div className="main-test-wrapper">
        <div className="landing-card">
          <span className="category-tag">Bienvenido a NIVELA</span>
          <h1 className="question-text">
            Detecta la diabetes a tiempo.<br />
            Conoce tus niveles y asegura el bienestar de tu familia.
          </h1>

          <h1>
            <button className="buzz-button start-btn" onClick={() => setStarted(true)}>
            Empezar Test
            </button>
          </h1>

          <h1>
              <button className="buzz-button" style={{ marginTop: "10px" }} onClick={obtenerHistorial}>
                Ver historial
              </button>
          </h1>
          

          
        </div>
      </div>
    );
  }

  // 🟣 HISTORIAL (MISMO ESTILO)
  if (viewHistorial) {
    return (
      <div className="main-test-wrapper">
        <div className="question-container">
          <h1 className="question-text">Historial de consultas</h1>

          <div className="recommendations-box">
            {historial.map((h, i) => (
              <p key={i}>
                <strong>{h.nombre}</strong> ({h.edad}) → {h.resultado}
              </p>
            ))}
          </div>

          <button className="reset-btn" onClick={() => setViewHistorial(false)}>
            Volver
          </button>
        </div>
      </div>
    );
  }

  const esPreguntaCintura = preguntas[step].id === "cintura";
  const opcionesActuales = esPreguntaCintura ? obtenerOpcionesCintura() : preguntas[step].opciones;

  return (
    <div className="main-test-wrapper">
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${((step + 1) / preguntas.length) * 100}%` }}></div>
      </div>

      {!showResult ? (
        <div className="question-container">
          <span className="category-tag">{preguntas[step].cat}</span>
          <h1 className="question-text">{preguntas[step].q}</h1>

{preguntas[step].tipo === 'input' ? (
  <div className="input-box">
    
    <div className="input-wrapper">
      <input
        type="text"
        value={inputValue}
        autoFocus
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && siguienteManual()}
        placeholder={
          preguntas[step].id === "peso"
            ? "kg"
            : preguntas[step].id === "estatura"
            ? "m/cm"
            : "Escribe aquí..."
        }
      />

      {inputValue && preguntas[step].id === "peso" && (
        <span className="unidad">kg</span>
      )}

      {inputValue && preguntas[step].id === "estatura" && (
        <span className="unidad">m</span>
      )}
    </div>

    <p className="hint">Presiona Enter para continuar</p>
    {error && <p style={{ color: "red" }}>{error}</p>}
  </div>

          ) : (
            <div className="options-grid">
              {opcionesActuales.map((opc, i) => (
                <button key={i} className="buzz-button" onClick={() => capturarRespuesta(opc)}>
                  {opc}
                </button>
              ))}
            </div>
          )}

          {/* BOTONES NUEVOS */}
          <div style={{ marginTop: "20px", display: "flex", gap: "10px", justifyContent: "center" }}>
            <button className="buzz-button" onClick={retroceder}>
              ← Anterior
            </button>

            {preguntas[step].tipo === "input" && inputValue && (
              <button className="buzz-button" onClick={siguienteManual}>
                Siguiente →
              </button>
            )}

            {preguntas[step].tipo === "btn" && respuestas[preguntas[step].id] && (
              <button className="buzz-button" onClick={() => setStep(step + 1)}>
                Siguiente →
              </button>
            )}
          </div>

          <p className="step-indicator">Pregunta {step + 1} de {preguntas.length}</p>
        </div>
      ) : (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Respuesta</h2>
            <div className="recommendations-box">
              <p><strong>{resultado.diagnostico}</strong></p>
              <ul>
                {resultado.recomendaciones.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
            <button className="reset-btn" onClick={() => window.location.reload()}>
              Finalizar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
