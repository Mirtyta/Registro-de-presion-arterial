import { useEffect, useState, useCallback } from "react";
import { getRegistros } from "../services/api";
import { 
  ClockHistory, FunnelFill, CalendarDateFill 
} from "react-bootstrap-icons";

/**
 * COMPONENTE: History.jsx
 * DOCUMENTACIÓN:
 * 1. UI: Formato de tabla compacta para lectura médica rápida.
 * 2. ALERTAS: Rojo (Alta), Naranja (Baja), Azul (Normal).
 * 3. ACCESIBILIDAD: Inputs con labels e IDs para cumplir estándares.
 */
export default function History() {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroNombre, setFiltroNombre] = useState("");

  // CONFIGURACIÓN DE FECHAS
  const hoy = new Date().toISOString().split('T')[0];
  const haceUnMes = new Date();
  haceUnMes.setDate(haceUnMes.getDate() - 30);
  
  const [fechaDesde, setFechaDesde] = useState(haceUnMes.toISOString().split('T')[0]);
  const [fechaHasta, setFechaHasta] = useState(hoy);

  const cargarDatos = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getRegistros();
      const miIdPrivado = localStorage.getItem("tranki_userid");

      const misRegistros = data.filter(r => {
        const fechaToma = new Date(r.fechaHora).toISOString().split('T')[0];
        const enRango = fechaToma >= fechaDesde && fechaToma <= fechaHasta;
        return r.userid === miIdPrivado && enRango;
      });

      setRegistros(misRegistros.sort((a, b) => new Date(b.fechaHora) - new Date(a.fechaHora)));
    } catch (error) {
      console.error("Error al cargar la tabla médica:", error);
    } finally {
      setLoading(false);
    }
  }, [fechaDesde, fechaHasta]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const filtrados = registros.filter(reg => 
    reg.nombre.toLowerCase().includes(filtroNombre.toLowerCase())
  );

  return (
    <div className="space-y-4 pb-24 px-1">
      {/* CABECERA: Filtros con IDs y Labels */}
      <header className="sticky top-0 bg-tranki-background pt-2 z-20 space-y-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="table_search_patient" className="text-[10px] font-black text-tranki-primary uppercase ml-1">
            Paciente
          </label>
          <div className="relative">
            <FunnelFill className="absolute left-4 top-1/2 -translate-y-1/2 text-tranki-primary" size={14}/>
            <input 
              id="table_search_patient"
              name="table_search_patient"
              type="text" 
              placeholder="Ej: Mirta..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl shadow-sm border-2 border-white focus:border-tranki-primary focus:outline-none font-bold text-sm text-gray-700"
              value={filtroNombre}
              onChange={(e) => setFiltroNombre(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white p-3 rounded-2xl shadow-sm flex items-center justify-between gap-2 border border-tranki-primary/10">
          <div className="flex-1 text-center">
            <label htmlFor="hist_date_start" className="block text-[8px] font-black text-tranki-primary uppercase mb-1">Desde</label>
            <input 
              id="hist_date_start"
              name="hist_date_start"
              type="date" 
              className="w-full text-[11px] font-bold text-gray-600 focus:outline-none bg-gray-50 p-1.5 rounded-lg text-center"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
            />
          </div>
          <CalendarDateFill className="text-tranki-primary mt-3" size={14} />
          <div className="flex-1 text-center">
            <label htmlFor="hist_date_end" className="block text-[8px] font-black text-tranki-primary uppercase mb-1">Hasta</label>
            <input 
              id="hist_date_end"
              name="hist_date_end"
              type="date" 
              className="w-full text-[11px] font-bold text-gray-600 focus:outline-none bg-gray-50 p-1.5 rounded-lg text-center"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* TABLA PRINCIPAL */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-3 text-[9px] font-black uppercase text-tranki-headerbg">Fecha/Hora</th>
              <th className="p-3 text-[9px] font-black uppercase text-tranki-headerbg text-center">Presión</th>
              <th className="p-3 text-[9px] font-black uppercase text-tranki-headerbg text-center">Pulso</th>
              <th className="p-3 text-[9px] font-black uppercase text-tranki-headerbg text-right">Brazo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan="4" className="p-10 text-center text-[10px] font-black animate-pulse uppercase">Cargando datos...</td></tr>
            ) : filtrados.length > 0 ? (
              filtrados.map((reg) => {
                const esAlta = reg.sistolica >= 140 || reg.diastolica >= 90;
                const esBaja = reg.sistolica <= 100 || reg.diastolica <= 60;
                
                let colorClase = "text-tranki-primary"; 
                let etiqueta = "NORMAL";

                if (esAlta) {
                  colorClase = "text-tranki-accent"; 
                  etiqueta = "⚠️ ALTA";
                } else if (esBaja) {
                  colorClase = "text-orange-500"; 
                  etiqueta = "📉 BAJA";
                }

                return (
                  <tr key={reg.id} className="active:bg-blue-50/50 transition-colors">
                    <td className="p-3 whitespace-nowrap">
                      <div className="text-[10px] font-black text-gray-800 uppercase">
                        {new Date(reg.fechaHora).toLocaleDateString('es-AR', {day:'2-digit', month:'2-digit'})}
                      </div>
                      <div className="text-[9px] text-gray-400 font-bold">
                        {new Date(reg.fechaHora).toLocaleTimeString('es-AR', {hour:'2-digit', minute:'2-digit', hour12:false})} hs
                      </div>
                    </td>

                    <td className="p-3 text-center">
                      <div className="flex flex-col items-center">
                        <span className={`text-base font-black tracking-tighter ${colorClase}`}>
                          {reg.sistolica}/{reg.diastolica}
                        </span>
                        <span className={`text-[7px] font-black uppercase leading-none ${colorClase}`}>
                          {etiqueta}
                        </span>
                      </div>
                    </td>

                    <td className="p-3 text-center">
                      <span className="text-sm font-black text-gray-700">{reg.pulsaciones}</span>
                    </td>

                    <td className="p-3 text-right">
                      <span className="text-[8px] font-black uppercase bg-gray-100 px-2 py-1 rounded text-gray-500 shadow-sm">
                        {reg.brazo}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4" className="p-10 text-center">
                   <p className="text-[10px] font-black text-gray-300 uppercase italic">No hay registros para este filtro</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <footer className="mt-4 px-4 text-center space-y-1">
        <p className="text-[8px] text-gray-400 font-black uppercase tracking-tight">
          * Referencia: Normal (120/80), Alta (140/90), Baja (100/60)
        </p>
        <p className="text-[9px] text-tranki-primary font-bold italic">
          Priorizando monitoreo de presión mínima para {filtroNombre || 'paciente'}.
        </p>
      </footer>
    </div>
  );
}