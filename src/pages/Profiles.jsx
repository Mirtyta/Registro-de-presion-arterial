import { useEffect, useState, useCallback } from "react";
import { getRegistros, deleteRegistro, updateRegistro } from "../services/api";
import { 
  PersonCircle, HeartFill, Trash3Fill, 
  PencilSquare, CheckCircleFill, XCircleFill,
  Calendar3, InfoCircle, FunnelFill,
  CalendarDateFill
} from "react-bootstrap-icons";

/**
 * COMPONENTE: History.jsx
 * DOCUMENTACIÓN:
 * 1. ACCESIBILIDAD: Se agregaron labels e IDs a todos los filtros y campos de edición.
 * 2. FILTRADO: Estricto por PACIENTE y RANGO DE FECHAS.
 * 3. UX: Mensajes de carga y placeholders descriptivos.
 */
export default function History() {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [tempData, setTempData] = useState({});

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
        const pertenece = r.userid === miIdPrivado;
        const enRango = fechaToma >= fechaDesde && fechaToma <= fechaHasta;
        return pertenece && enRango;
      });

      const ordenados = misRegistros.sort((a, b) => new Date(b.fechaHora) - new Date(a.fechaHora));
      setRegistros(ordenados);
    } catch {
      console.error("Error al cargar historial.");
    } finally {
      setLoading(false);
    }
  }, [fechaDesde, fechaHasta]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const handleBorrar = async (id) => {
    if (window.confirm("¿Borrar este registro?")) {
      try {
        await deleteRegistro(id);
        setRegistros(prev => prev.filter(r => r.id !== id));
      } catch { alert("Error al borrar"); }
    }
  };

  const iniciarEdicion = (reg) => {
    setEditandoId(reg.id);
    setTempData({ ...reg });
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setTempData({});
  };

  const guardarEdicion = async (id) => {
    try {
      await updateRegistro(id, tempData);
      setRegistros(prev => prev.map(r => r.id === id ? { ...tempData, id } : r));
      setEditandoId(null);
    } catch { alert("Error al guardar"); }
  };

  const filtrados = registros.filter(reg => 
    reg.nombre.toLowerCase().includes(filtroNombre.toLowerCase())
  );

  return (
    <div className="space-y-4 pb-20 px-2">
      <header className="sticky top-0 bg-tranki-background pb-4 pt-2 z-20 space-y-3">
        
        {/* BUSCADOR DE NOMBRE CON LABEL */}
        <div className="flex flex-col gap-1">
          <label htmlFor="search_name" className="text-[10px] font-black text-tranki-primary uppercase ml-1">
            Filtrar por Paciente
          </label>
          <div className="relative">
            <FunnelFill className="absolute left-4 top-1/2 -translate-y-1/2 text-tranki-primary" />
            <input 
              id="search_name"
              name="search_name"
              type="text"
              placeholder="Ej: Mamá..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl shadow-card focus:outline-none border-2 border-white focus:border-tranki-primary transition-all font-bold text-gray-700 text-sm"
              value={filtroNombre}
              onChange={(e) => setFiltroNombre(e.target.value)}
            />
          </div>
        </div>

        {/* RANGO DE FECHAS CON LABELS */}
        <div className="bg-white p-3 rounded-2xl shadow-card flex items-center justify-between gap-2 border border-tranki-primary/10">
          <div className="flex-1">
            <label htmlFor="date_from_hist" className="block text-[8px] font-black text-tranki-primary uppercase mb-1 ml-1">Desde</label>
            <input 
              id="date_from_hist"
              name="date_from_hist"
              type="date" 
              required
              className="w-full text-[11px] font-bold text-gray-600 focus:outline-none bg-gray-50 p-1.5 rounded-lg"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
            />
          </div>
          <CalendarDateFill className="text-tranki-primary mt-4" size={16} />
          <div className="flex-1">
            <label htmlFor="date_to_hist" className="block text-[8px] font-black text-tranki-primary uppercase mb-1 ml-1">Hasta</label>
            <input 
              id="date_to_hist"
              name="date_to_hist"
              type="date" 
              required
              className="w-full text-[11px] font-bold text-gray-600 focus:outline-none bg-gray-50 p-1.5 rounded-lg"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* LISTADO DE TARJETAS */}
      <div className="grid gap-5">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-tranki-primary border-t-transparent mb-2"></div>
            <p className="text-tranki-headerbg font-black uppercase text-[10px] tracking-widest">Cargando Historial...</p>
          </div>
        ) : filtrados.length > 0 ? (
          filtrados.map((reg) => {
            const isEditing = editandoId === reg.id;
            const esAlta = reg.sistolica >= 140 || reg.diastolica >= 90;

            return (
              <div 
                key={reg.id} 
                className={`bg-white rounded-2xl p-5 shadow-card border-l-[10px] transition-all relative ${
                  esAlta ? 'border-l-tranki-accent' : 'border-l-tranki-flow'
                }`}
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <PersonCircle className="text-tranki-primary" size={14} />
                    <span className="font-black text-[11px] uppercase text-tranki-headerbg tracking-widest">{reg.nombre}</span>
                  </div>
                  <div className="flex gap-4">
                    {isEditing ? (
                      <>
                        <button onClick={() => guardarEdicion(reg.id)} className="text-tranki-flow" title="Guardar"><CheckCircleFill size={22}/></button>
                        <button onClick={cancelarEdicion} className="text-tranki-headerbg" title="Cancelar"><XCircleFill size={22}/></button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => iniciarEdicion(reg)} className="flex items-center gap-1 text-gray-400 hover:text-tranki-primary transition-colors font-black">
                          <PencilSquare size={14}/>
                          <span className="text-[9px] uppercase">Editar</span>
                        </button>
                        <button onClick={() => handleBorrar(reg.id)} className="flex items-center gap-1 text-gray-400 hover:text-tranki-accent transition-colors font-black">
                          <Trash3Fill size={14}/>
                          <span className="text-[9px] uppercase">Borrar</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-end">
                  {isEditing ? (
                    <div className="flex flex-col gap-1 bg-tranki-background p-2 rounded-xl">
                      <label htmlFor={`edit-sis-${reg.id}`} className="text-[7px] font-black uppercase text-gray-400">Sis / Dia</label>
                      <div className="flex items-center gap-1">
                        <input id={`edit-sis-${reg.id}`} name="sistolica" className="w-14 text-2xl font-black bg-transparent border-b border-tranki-primary text-center" value={tempData.sistolica} onChange={e => setTempData({...tempData, sistolica: e.target.value})} placeholder="120" />
                        <span className="text-xl font-black text-gray-300">/</span>
                        <input name="diastolica" className="w-14 text-2xl font-black bg-transparent border-b border-tranki-primary text-center" value={tempData.diastolica} onChange={e => setTempData({...tempData, diastolica: e.target.value})} placeholder="80" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className={`text-5xl font-black tracking-tighter ${esAlta ? 'text-tranki-accent' : 'text-gray-800'}`}>{reg.sistolica}/{reg.diastolica}</span>
                      <span className="text-[10px] font-black text-tranki-headerbg uppercase">mmHg</span>
                    </div>
                  )}
                  
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1 text-tranki-accent">
                      <HeartFill size={14} className={isEditing ? "" : "animate-pulse"} />
                      {isEditing ? (
                        <div className="flex flex-col items-end gap-1">
                          <label htmlFor={`edit-pul-${reg.id}`} className="text-[7px] font-black uppercase text-gray-400">Pulso</label>
                          <input id={`edit-pul-${reg.id}`} name="pulsaciones" className="w-12 text-xl font-black border-b border-tranki-accent text-right bg-transparent" value={tempData.pulsaciones} onChange={e => setTempData({...tempData, pulsaciones: e.target.value})} placeholder="70" />
                        </div>
                      ) : (
                        <span className="text-2xl font-black">{reg.pulsaciones}</span>
                      )}
                    </div>
                    {!isEditing && <span className="text-[9px] font-bold text-tranki-headerbg uppercase">Pulsaciones</span>}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-50 flex justify-between items-center text-[10px] font-bold">
                  <div className="flex flex-col gap-1 w-full">
                    {isEditing && <label htmlFor={`edit-date-${reg.id}`} className="text-[7px] font-black uppercase text-gray-400">Fecha y Hora</label>}
                    <div className="flex items-center gap-1 text-tranki-headerbg">
                      <Calendar3 size={12} />
                      {isEditing ? (
                        <input id={`edit-date-${reg.id}`} name="fechaHora" type="datetime-local" className="bg-tranki-background p-1 rounded font-bold text-gray-600 w-full outline-none" value={tempData.fechaHora} onChange={e => setTempData({...tempData, fechaHora: e.target.value})} />
                      ) : (
                        <span>{new Date(reg.fechaHora).toLocaleString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).replace(',', ' -')}</span>
                      )}
                    </div>
                  </div>
                  {!isEditing && <span className="bg-tranki-background text-tranki-primary px-3 py-1 rounded-full uppercase text-[9px] whitespace-nowrap ml-2 shadow-sm">Brazo {reg.brazo}</span>}
                </div>

                {reg.nota && !isEditing && (
                  <div className="mt-3 flex gap-2 items-start p-2 bg-gray-50 rounded-lg border-l-2 border-tranki-primary/20">
                    <InfoCircle className="text-tranki-primary mt-0.5" size={12} />
                    <p className="text-[11px] font-medium italic text-gray-500 leading-tight">{reg.nota}</p>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border-4 border-dashed border-gray-100 text-tranki-headerbg font-black uppercase text-[10px] px-10">
            No hay registros para {filtroNombre || 'este paciente'} en las fechas elegidas
          </div>
        )}
      </div>
    </div>
  );
}