import logo from "../../assets/logo.png";

/**
 * COMPONENTE: Header.jsx
 * DOCUMENTACIÓN:
 * 1. RESPONSIVE: Se apila automáticamente (flex-col) si el ancho es menor a 260px.
 * 2. LAYOUT: Mantiene 'justify-between' con un margen fijo de 30px en pantallas normales.
 * 3. LINTER: Sin variables no utilizadas para evitar advertencias.
 */
export default function Header() {
  
  const obtenerNombreInicial = () => {
    try {
      const stored = JSON.parse(localStorage.getItem("tranki_perfiles")) || [];
      return stored.length > 0 ? stored[0] : "Invitado";
    } catch {
      return "Invitado";
    }
  };

  const nombreAMostrar = obtenerNombreInicial();

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50 w-full">
      <div className="w-full flex flex-row max-[260px]:flex-col items-center justify-between px-[30px] py-2 gap-y-2 text-center">
        
        {/* LADO IZQUIERDO: Branding */}
        <div className="flex items-center gap-2">
          <img
            src={logo}
            alt="Logo TrankiFlow"
            className="w-8 h-8 rounded-full object-cover border border-tranki-background"
          />
          <h1 className="text-sm font-black tracking-tighter uppercase leading-none">
            <span className="text-tranki-primary">Benita</span>
            <span className="text-tranki-flow">Flow</span>
          </h1>
        </div>

        {/* LADO DERECHO: Usuario */}
        <div className="flex flex-col items-center max-[260px]:items-center min-[261px]:items-end">
          <p className="text-[9px] font-bold text-tranki-headerbg uppercase tracking-widest leading-none">
            Hola, <span className="text-tranki-primary">{nombreAMostrar}</span>
          </p>
          <p className="text-[8px] font-black text-tranki-flow uppercase mt-0.5">
            Sistema Privado
          </p>
        </div>

      </div>
    </header>
  );
}