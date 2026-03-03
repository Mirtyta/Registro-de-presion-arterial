import { useEffect, useState, useCallback } from "react";
import { getRegistros } from "../services/api";
import { 
  Activity, CalendarDateFill, FunnelFill, 
  HeartPulseFill, ArrowDownCircleFill, ArrowUpCircleFill 
} from "react-bootstrap-icons";

/**
 * COMPONENTE: Stats.jsx
 * DOCUMENTACIÓN:
 * 1. ACCESIBILIDAD: Se incluyeron etiquetas <label> vinculadas por 'id' a cada input.
 * 2. FILTRADO: Los cálculos se realizan cruzando el Rango de Fechas y el Nombre del Paciente.
 * 3. UX: Se utiliza 'placeholder' en el buscador para guiar al usuario.
 */
export default function Stats() {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroNombre, setFiltroNombre] = useState("");

  // RANGO DE FECHAS
  const hoy = new Date().toISOString().split('T')[0];
  const haceUnMes = new Date();
  haceUnMes.setDate(haceUnMes.getDate() - 30);
  
  const [fechaDesde, setFechaDesde] = useState(haceUnMes.toISOString().split('T')[0]);
  const [fechaHasta, setFechaHasta] = useState(hoy);

  const cargarDatos = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getRegistros();
      const miId = localStorage.getItem("tranki_userid");

      // Filtrar por Usuario y Rango de fechas
      const enRango = data.filter(r => {
        const fechaToma = new Date(r.fechaHora).toISOString().split('T')[0];
        return r.userid === miId && fechaToma >= fechaDesde && fechaToma <= fechaHasta;
      });

      setRegistros(enRango);
    } catch (error) {
      console.error("Error cargando estadísticas:", error);
    } finally {
      setLoading(false);
    }
  }, [fechaDesde, fechaHasta]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  // Segundo filtro: Por el nombre del paciente
  const datosFinales = registros.filter(reg => 
    reg.nombre.toLowerCase().includes(filtroNombre.toLowerCase())
  );

  // CÁLCULOS SOBRE LOS DATOS FILTRADOS (PACIENTE + FECHA)
  const total = datosFinales.length;
  const promedioSis = total > 0 ? Math.round(datosFinales.reduce((acc, r) => acc + r.sistolica, 0) / total) : 0;
  const promedioDia = total > 0 ? Math.round(datosFinales.reduce((acc, r) => acc + r.diastolica, 0) / total) : 0;
  const promedioPul = total > 0 ? Math.round(datosFinales.reduce((acc, r) => acc + r.pulsaciones, 0) / total) : 0;
  
  const minDia = total > 0 ? Math.min(...datosFinales.map(r => r.diastolica)) : 0;
  const maxDia = total > 0 ? Math.max(...datosFinales.map(r => r.diastolica)) : 0;

  return (
    <div className="space-y-6 pb-24 px-2">
      <header className="pt-4 space-y-3 sticky top-0 bg-tranki-background z-10 pb-2">
        <div className="flex items-center gap-2 text-tranki-primary uppercase font-black tracking-tighter italic">
          <Activity size={24} />
          <h2 className="text-xl text-tranki-headerbg">Análisis Médico</h2>
        </div>

        {/* FILTROS CON LABEL, ID Y NAME */}
        <div className="space-y-3">
          {/* BUSCADOR DE PACIENTE */}
          <div className="flex flex-col gap-1">
            <label htmlFor="search_patient" className="text-[10px] font-black text-tranki-primary uppercase ml-1">
              Paciente
            </label>
            <div className="relative">
              <FunnelFill className="absolute left-3 top-1/2 -translate-y-1/2 text-tranki-primary" size={12}/>
              <input 
                id="search_patient"
                name="search_patient"
                type="text" 
                placeholder="Escribí un nombre (ej: Mirta)..."
                value={filtroNombre}
                onChange={(e) => setFiltroNombre(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl shadow-sm border focus:outline-none text-xs font-bold"
              />
            </div>
          </div>

          {/* FILTRO DE FECHAS */}
          <div className="bg-white p-3 rounded-xl shadow-sm border border-tranki-primary/10">
            <div className="flex gap-2 items-center">
              <div className="flex-1">
                <label htmlFor="date_from" className="text-[9px] font-black text-gray-400 uppercase block mb-1">Desde</label>
                <input 
                  id="date_from"
                  name="date_from"
                  type="date" 
                  className="w-full text-[10px] font-bold bg-gray-50 p-1.5 rounded-lg outline-none text-gray-600" 
                  value={fechaDesde} 
                  onChange={(e)=>setFechaDesde(e.target.value)}
                />
              </div>
              <CalendarDateFill className="text-tranki-primary mt-4" size={14} />
              <div className="flex-1">
                <label htmlFor="date_to" className="text-[9px] font-black text-gray-400 uppercase block mb-1">Hasta</label>
                <input 
                  id="date_to"
                  name="date_to"
                  type="date" 
                  className="w-full text-[10px] font-bold bg-gray-50 p-1.5 rounded-lg outline-none text-gray-600" 
                  value={fechaHasta} 
                  onChange={(e)=>setFechaHasta(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ESTADO DE CARGA */}
      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-tranki-primary border-t-transparent mb-4"></div>
          <p className="text-[10px] font-black text-tranki-headerbg uppercase tracking-widest">Calculando promedios...</p>
        </div>
      ) : total > 0 ? (
        <div className="animate-in fade-in duration-500 space-y-4">
          
          {/* TARJETAS DE PROMEDIO */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-3xl shadow-card border-b-4 border-tranki-primary text-center">
              <span className="text-[9px] font-black text-gray-400 uppercase">Media Sistólica</span>
              <div className="text-3xl font-black text-tranki-primary">{promedioSis}</div>
              <span className="text-[8px] font-bold text-gray-300 italic uppercase">La Alta</span>
            </div>
            <div className="bg-white p-4 rounded-3xl shadow-card border-b-4 border-tranki-accent text-center">
              <span className="text-[9px] font-black text-gray-400 uppercase">Media Diastólica</span>
              <div className="text-3xl font-black text-tranki-accent">{promedioDia}</div>
              <span className="text-[8px] font-bold text-gray-300 italic uppercase">La Baja</span>
            </div>
          </div>

          {/* PULSO MEDIO */}
          <div className="bg-white p-4 rounded-3xl shadow-card flex items-center justify-between px-8">
            <div className="flex items-center gap-3">
              <HeartPulseFill className="text-tranki-accent" size={20} />
              <span className="text-xs font-black text-gray-500 uppercase">Ritmo Medio</span>
            </div>
            <div className="text-2xl font-black text-tranki-headerbg">{promedioPul} <span className="text-[10px] text-gray-400 uppercase">Lpm</span></div>
          </div>

          {/* RANGOS DE LA DIÁSTOLICA (LA "BAJA") */}
          <div className="bg-tranki-headerbg p-6 rounded-[2rem] shadow-xl text-white">
            <h3 className="text-[10px] font-black uppercase tracking-widest mb-4 text-tranki-primary">Rango Presión Mínima</h3>
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center gap-1 text-[8px] font-black uppercase text-orange-400 mb-1">
                  <ArrowDownCircleFill size={10}/> Piso
                </div>
                <div className="text-3xl font-black">{minDia}</div>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end gap-1 text-[8px] font-black uppercase text-tranki-accent mb-1">
                  Techo <ArrowUpCircleFill size={10}/>
                </div>
                <div className="text-3xl font-black">{maxDia}</div>
              </div>
            </div>
            
            {/* Barra visual de tendencia */}
            <div className="mt-6 h-2 w-full bg-white/10 rounded-full overflow-hidden">
               <div className="h-full bg-tranki-primary" style={{width: `${maxDia > 0 ? (promedioDia/maxDia)*100 : 0}%`}}></div>
            </div>
            <p className="text-[8px] mt-2 opacity-50 font-bold italic text-center uppercase">Tendencia de la mínima para {filtroNombre || 'el paciente'}</p>
          </div>

        </div>
      ) : (
        <div className="text-center py-20 bg-white/50 rounded-3xl border-2 border-dashed border-gray-200 mx-2">
           <p className="text-[10px] font-black text-gray-400 uppercase px-6">No hay registros de {filtroNombre || 'pacientes'} en este rango</p>
        </div>
      )}
    </div>
  );
}