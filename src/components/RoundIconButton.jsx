import PropTypes from "prop-types";
import { IconView } from "./IconView";

/**
 * RoundIconButton: Botón circular para la Navbar.
 * Se ha modificado para que el borde grueso blanco sea EXCLUSIVO del botón Main.
 */
export const RoundIconButton = ({
  Icon,
  label,
  isMain = false,
  isActive = false,
}) => {
  // 1. ESTADO: ¿Es el botón central y está seleccionado?
  const isMainActive = isMain && isActive;

  // 2. DINÁMICA DE FONDO:
  // Si está activo (sea main o no) -> Verde (tranki-flow)
  // Si es main pero no está en su ruta -> Naranja (tranki-accent)
  // Por defecto -> Fondo de la app
  const backgroundColor = isMainActive
    ? "bg-tranki-primary"
    : isMain
    ? "bg-tranki-accent"
    : isActive
    ? "bg-tranki-flow"
    : "bg-tranki-background";

  // 3. LÓGICA DE BORDES (Aquí está el cambio clave):
  // Solo aplicamos el borde blanco grueso si isMain es true.
  // border-[6px] es una clase arbitraria de Tailwind para dar más grosor que el border-4.
  const mainBorderStyles = isMain 
    ? "border-[10px] border-tranki-background" 
    : "border-0"; // Los otros iconos no llevan borde interno

  // 4. HOVER DIFERENCIADO:
  // Solo el main escala más y mantiene su estilo naranja/verde.
  const hoverEffect = isMain
    ? "hover:bg-tranki-accent hover:scale-110"
    : "hover:bg-tranki-flow hover:scale-105";

  // 5. COLOR DEL ICONO:
  const iconColor = (isMainActive || isActive) ? "#000" : isMain ? "white" : "#4ABDAC";

  return (
    <div className="flex flex-col items-center">
      {/* CONTENEDOR EXTERIOR: 
          La clase 'main-button-outer-ring' (definida en index.css) 
          solo se aplica si es el botón principal. 
      */}
      <div className={isMain ? "main-button-outer-ring -mt-10" : ""}>
        
        <div
          className={`
            flex items-center justify-center
            rounded-full
            transition-all duration-300
            
            ${isMain ? "w-16 h-16 md:w-20 md:h-20" : "w-12 h-12 md:w-14 md:h-14"}
            ${backgroundColor}
            ${hoverEffect}
            ${mainBorderStyles}
          `}
        >
          <IconView
            Icon={Icon}
            size={isMain ? 36 : 24}
            color={iconColor}
          />
        </div>
      </div>

      <span
        className={`
          text-xs mt-1 font-medium
          ${isActive ? "text-tranki-flow" : "text-gray-400"}
        `}
      >
        {label}
      </span>
    </div>
  );
};

RoundIconButton.propTypes = {
  Icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  isMain: PropTypes.bool,
  isActive: PropTypes.bool,
};