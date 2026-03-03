import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createRegistro, updateRegistro } from "../services/api";
import { HeartFill, PersonFill, Calendar2Event, CheckCircleFill, ChatLeftTextFill } from "react-bootstrap-icons";

/**
 * COMPONENTE: Add.jsx
 * DOCUMENTACIÓN:
 * 1. ACCESIBILIDAD: Se agregaron 'id', 'name' y 'htmlFor' a todos los inputs.
 * 2. UX: Se incluyeron 'placeholder' descriptivos para guiar la carga.
 * 3. VALIDACIÓN: Mantiene los límites lógicos de presión y pulso.
 */
export default function Add() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const registroParaEditar = location.state?.registroParaEditar;
  const esEdicion = Boolean(registroParaEditar);

  const [nombre, setNombre] = useState(registroParaEditar?.nombre || "");
  const [perfiles, setPerfiles] = useState([]);
  const [sistolica, setSistolica] = useState(registroParaEditar?.sistolica || "");
  const [diastolica, setDiastolica] = useState(registroParaEditar?.diastolica || "");
  const [pulsaciones, setPulsaciones] = useState(registroParaEditar?.pulsaciones || "");
  const [brazo, setBrazo] = useState(registroParaEditar?.brazo || "izquierdo");
  const [fechaHora, setFechaHora] = useState(registroParaEditar?.fechaHora || "");
  const [nota, setNota] = useState(registroParaEditar?.nota || "");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let privateId = localStorage.getItem("tranki_userid");
    if (!privateId) {
      privateId = "user_" + Math.random().toString(36).substr(2, 9) + Date.now();
      localStorage.setItem("tranki_userid", privateId);
    }

    const stored = JSON.parse(localStorage.getItem("tranki_perfiles")) || [];
    setPerfiles(stored);
    
    if (!esEdicion && !fechaHora) {
      const now = new Date();
      const offset = now.getTimezoneOffset() * 60000;
      setFechaHora(new Date(now - offset).toISOString().slice(0, 16));
    }
  }, [esEdicion, fechaHora]);

  const normalizar = (valor) => {
    if (!valor) return null;
    let num = parseFloat(valor.toString().replace(",", "."));
    if (isNaN(num)) return null;
    if (num > 300) num = num / 10;
    if (num < 35) num = num * 10;
    return Math.round(num);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const sis = normalizar(sistolica);
    const dia = normalizar(diastolica);
    const pul = Math.round(parseFloat(pulsaciones.toString().replace(",", ".")));

    if (!sis || !dia || isNaN(pul)) {
      setError("Por favor, ingresa números válidos.");
      setLoading(false);
      return;
    }
    if (pul < 35 || pul > 180) {
      setError("Pulso fuera de rango (35-180 LPM).");
      setLoading(false);
      return;
    }
    if (sis < 70 || sis > 210 || dia < 40 || dia > 130) {
      setError("Valores de presión fuera de límites razonables.");
      setLoading(false);
      return;
    }

    const payload = {
      fechaHora,
      sistolica: sis,
      diastolica: dia,
      pulsaciones: pul,
      brazo,
      nota: nota.trim(),
      nombre: nombre.trim(),
      userid: localStorage.getItem("tranki_userid")
    };

    try {
      if (esEdicion) {
        await updateRegistro(registroParaEditar.id, payload);
      } else {
        await createRegistro(payload);
        const name = nombre.trim();
        const updated = [name, ...perfiles.filter(p => p !== name)].slice(0, 10);
        localStorage.setItem("tranki_perfiles", JSON.stringify(updated));
      }
      // Volvemos a la pantalla de Edición (donde están las tarjetas) tras guardar
      navigate("/profile");
    } catch {
      setError("Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6 pb-20 px-2">
      <header className="text-center pt-4">
        <h2 className="text-3xl font-black text-tranki-primary uppercase tracking-tighter">
          {esEdicion ? "Corregir" : "Nueva Toma"}
        </h2>
        <div className="h-1.5 w-12 bg-tranki-button mx-auto mt-1 rounded-full"></div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* INPUT: PACIENTE */}
        <div className="bg-white p-4 rounded-2xl shadow-card flex flex-col gap-1">
          <label htmlFor="nombre_paciente" className="flex items-center gap-2 text-[10px] font-black text-tranki-headerbg uppercase mb-1">
            <PersonFill className="text-tranki-primary" /> Nombre del Paciente
          </label>
          <input
            id="nombre_paciente"
            name="nombre_paciente"
            list="perfiles-list"
            type="text" 
            required
            placeholder="Ej: Mamá, Mirta..."
            className="w-full text-lg font-bold focus:outline-none border-b border-gray-50 focus:border-tranki-primary"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <datalist id="perfiles-list">
            {perfiles.map((p, i) => <option key={i} value={p} />)}
          </datalist>
        </div>

        {/* INPUTS: VALORES PRESIÓN */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-2xl shadow-card text-center flex flex-col gap-1">
            <label htmlFor="sistolica" className="block text-[10px] font-black text-tranki-headerbg mb-1 uppercase">Máxima (SIS)</label>
            <input
              id="sistolica"
              name="sistolica"
              type="text" 
              inputMode="decimal" 
              required
              placeholder="120"
              className="w-full text-4xl font-black text-tranki-accent focus:outline-none text-center"
              value={sistolica}
              onChange={(e) => setSistolica(e.target.value)}
            />
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-card text-center flex flex-col gap-1">
            <label htmlFor="diastolica" className="block text-[10px] font-black text-tranki-headerbg mb-1 uppercase">Mínima (DIA)</label>
            <input
              id="diastolica"
              name="diastolica"
              type="text" 
              inputMode="decimal" 
              required
              placeholder="80"
              className="w-full text-4xl font-black text-tranki-primary focus:outline-none text-center"
              value={diastolica}
              onChange={(e) => setDiastolica(e.target.value)}
            />
          </div>
        </div>

        {/* INPUT: PULSO */}
        <div className="bg-white p-4 rounded-2xl shadow-card flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <label htmlFor="pulsaciones" className="flex items-center gap-2 text-[10px] font-black text-gray-600 uppercase">
              <HeartFill className="text-tranki-accent animate-pulse" /> Pulso (LPM)
            </label>
            <span className="text-[8px] font-bold text-gray-300 ml-6 uppercase">Latidos por minuto</span>
          </div>
          <input
            id="pulsaciones"
            name="pulsaciones"
            type="text" 
            inputMode="numeric" 
            required
            placeholder="70"
            className="w-20 text-3xl font-black text-right focus:outline-none text-tranki-accent"
            value={pulsaciones}
            onChange={(e) => setPulsaciones(e.target.value)}
          />
        </div>

        {/* SELECTOR: BRAZO */}
        <div className="flex flex-col gap-2">
           <span className="text-[10px] font-black text-tranki-headerbg uppercase ml-2">Brazo de la medición</span>
           <div className="flex bg-gray-200 p-1 rounded-2xl shadow-inner">
            {['izquierdo', 'derecho'].map(lado => (
              <button
                key={lado}
                type="button"
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${
                  brazo === lado 
                    ? 'bg-white shadow-sm text-tranki-primary' 
                    : 'text-tranki-headerbg hover:text-gray-600'
                }`}
                onClick={() => setBrazo(lado)}
              >
                Brazo {lado}
              </button>
            ))}
          </div>
        </div>

        {/* INPUT: FECHA */}
        <div className="bg-white p-4 rounded-2xl shadow-card flex flex-col gap-1">
          <label htmlFor="fechaHora" className="flex items-center gap-2 text-[10px] font-black text-tranki-headerbg uppercase mb-1">
            <Calendar2Event className="text-tranki-primary" /> Fecha y Hora de la Toma
          </label>
          <input
            id="fechaHora"
            name="fechaHora"
            type="datetime-local" 
            required
            className="w-full font-bold text-gray-600 focus:outline-none bg-gray-50 p-2 rounded-lg"
            value={fechaHora}
            onChange={(e) => setFechaHora(e.target.value)}
          />
        </div>

        {/* INPUT: NOTAS */}
        <div className="bg-white p-4 rounded-2xl shadow-card flex flex-col gap-1">
          <label htmlFor="nota" className="flex items-center gap-2 text-[10px] font-black text-tranki-headerbg uppercase mb-1">
            <ChatLeftTextFill className="text-tranki-primary" size={12} /> Notas Adicionales
          </label>
          <textarea
            id="nota"
            name="nota"
            className="w-full text-sm text-gray-600 focus:outline-none resize-none border-t border-gray-50 pt-2"
            rows="2"
            placeholder="¿Algún síntoma o medicamento nuevo?"
            value={nota}
            onChange={(e) => setNota(e.target.value)}
          />
        </div>

        {/* MENSAJES DE ERROR */}
        {error && (
          <div className="p-4 bg-tranki-accent/10 text-tranki-accent text-[10px] font-black rounded-2xl text-center border border-tranki-accent/20 animate-bounce">
            {error}
          </div>
        )}

        {/* BOTÓN ACCIÓN */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-5 rounded-3xl font-black text-xl text-white shadow-lg transition-all active:scale-95 ${
            loading ? 'bg-gray-400' : 'bg-tranki-button hover:brightness-105'
          }`}
        >
          {loading ? "PROCESANDO..." : (esEdicion ? "ACTUALIZAR DATOS" : "GUARDAR REGISTRO")}
        </button>
      </form>
    </div>
  );
}