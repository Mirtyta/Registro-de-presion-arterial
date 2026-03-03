import { useEffect, useState } from "react";
import { getRegistros } from "../services/api";
import { 
  HeartPulseFill, 
  InfoCircleFill, 
  Check2Circle, 
  ExclamationTriangleFill 
} from "react-bootstrap-icons";

/**
 * HOME: El centro de control / Guía de Salud.
 * DOCUMENTACIÓN DE CAMBIOS:
 * 1. PRIVACIDAD: Se agregó el filtrado por 'tranki_userid' para asegurar que el usuario vea solo sus datos.
 * 2. LÓGICA: Se mantiene la carga de datos original pero integrada con el ID privado del dispositivo.
 */
export default function Home() {
  const [ultimo, setUltimo] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. CARGA DE DATOS: Obtenemos el registro más reciente (FILTRADO POR DISPOSITIVO)
  useEffect(() => {
    getRegistros()
      .then(data => {
        // RECUPERAMOS EL ID ÚNICO DEL DISPOSITIVO
        const miIdPrivado = localStorage.getItem("tranki_userid");

        // FILTRAMOS: Solo los que pertenecen a este celular
        const misRegistros = data.filter(r => r.userid === miIdPrivado);

        if (misRegistros.length > 0) {
          // Ordenamos: el más nuevo primero basado en fechaHora
          const ordenados = misRegistros.sort((a, b) => new Date(b.fechaHora) - new Date(a.fechaHora));
          setUltimo(ordenados[0]);
        }
      })
      .catch(err => console.error("Error al cargar datos:", err)) // Mantenemos el catch por seguridad
      .finally(() => setLoading(false));
  }, []);

  // 2. LÓGICA DE SEMÁFORO: Para alertar visualmente sobre la presión
  const getAlertStyle = (sis, dia) => {
    if (sis >= 140 || dia >= 90) return { color: "text-tranki-accent", icon: <ExclamationTriangleFill /> }; 
    return { color: "text-tranki-flow", icon: <Check2Circle /> };
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* TARJETA DE ÚLTIMO ESTADO */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border-b-4 border-tranki-primary">
        <h2 className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
          Estado Actual
        </h2>

        {loading ? (
          <div className="animate-pulse flex flex-col gap-2">
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-100 rounded w-1/3"></div>
          </div>
        ) : ultimo ? (
          <div className="flex justify-between items-center">
            <div>
              <div className={`text-5xl font-black flex items-center gap-3 ${getAlertStyle(ultimo.sistolica, ultimo.diastolica).color}`}>
                {ultimo.sistolica}/{ultimo.diastolica}
                <span className="text-xl">{getAlertStyle(ultimo.sistolica, ultimo.diastolica).icon}</span>
              </div>
              <p className="text-gray-500 font-medium mt-1">
                Paciente: <span className="text-tranki-primary">{ultimo.nombre}</span>
              </p>
            </div>
            
            {/* Campo de Pulsaciones (EL CORAZÓN QUE TE GUSTABA) */}
            <div className="flex flex-col items-center bg-tranki-background/30 p-3 rounded-2xl border border-tranki-background">
              <HeartPulseFill className="text-tranki-accent animate-pulse" size={24} />
              <span className="text-2xl font-black text-tranki-primary">{ultimo.pulsaciones || "--"}</span>
              <span className="text-[10px] font-bold text-gray-400">LPM</span>
            </div>
          </div>
        ) : (
          <p className="text-gray-400 italic">No hay datos en este dispositivo. Presiona el (+) para empezar.</p>
        )}
      </section>

      {/* GUÍA MÉDICA PARA LA CARDILÓLOGA */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-tranki-primary">
          <InfoCircleFill size={20} />
          <h3 className="font-bold text-lg">Guía de Toma Correcta</h3>
        </div>

        <div className="space-y-3">
          {/* Item 1 */}
          <div className="flex gap-4 p-4 bg-white rounded-xl shadow-sm">
            <span className="text-2xl">🧘</span>
            <div>
              <p className="font-bold text-sm text-tranki-primary">Reposo previo</p>
              <p className="text-xs text-gray-500 font-medium leading-tight">Debes estar sentado y tranquilo al menos 5 minutos antes de la medición.</p>
            </div>
          </div>

          {/* Item 2 */}
          <div className="flex gap-4 p-4 bg-white rounded-xl shadow-sm">
            <span className="text-2xl">📏</span>
            <div>
              <p className="font-bold text-sm text-tranki-primary">Postura</p>
              <p className="text-xs text-gray-500 font-medium leading-tight">Espalda apoyada, piernas sin cruzar y brazo a la altura del corazón.</p>
            </div>
          </div>

          {/* Item 3 */}
          <div className="flex gap-4 p-4 bg-white rounded-xl shadow-sm">
            <span className="text-2xl">🤐</span>
            <div>
              <p className="font-bold text-sm text-tranki-primary">Sin distracciones</p>
              <p className="text-xs text-gray-500 font-medium leading-tight">No hables ni uses el celular mientras el tensiómetro está trabajando.</p>
            </div>
          </div>
        </div>
      </section>

      {/* RECORDATORIO VISUAL HACIA EL NAVBAR */}
      <div className="mt-4 p-4 bg-tranki-primary/10 rounded-2xl border-2 border-dashed border-tranki-primary/30 text-center">
        <p className="text-tranki-primary text-sm font-bold">
          ¿Listo para medir? Dale al <span className="text-tranki-accent text-xl">+</span> central
        </p>
      </div>

    </div>
  );
}