import { Link, useLocation } from "react-router-dom";
import { RoundIconButton } from "../RoundIconButton";
import {
  HouseFill,
  BarChartFill,
  Plus,
  PersonCheckFill, // <-- Importamos el nuevo icono
  Receipt,
} from "react-bootstrap-icons";

export const Navbar = () => {
  const location = useLocation();

  // Función auxiliar para saber si una ruta está activa
  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className="
        fixed bottom-0 left-0 right-0
        bg-tranki-primary
        z-50
      "
    >
      <div className="flex justify-around items-end pb-2">
        <Link to="/">
          <RoundIconButton
            Icon={HouseFill}
            label="Home"
            isActive={isActive("/")}
          />
        </Link>

        <Link to="/stats">
          <RoundIconButton
            Icon={BarChartFill}
            label="Stats"
            isActive={isActive("/stats")}
          />
        </Link>

        {/* BOTÓN CENTRAL: Ahora le pasamos isActive comparando su ruta */}
        <Link to="/add">
          <RoundIconButton
            Icon={Plus}
            label="Add"
            isMain={true}
            isActive={isActive("/add")}
          />
        </Link>

        <Link to="/profile">
          <RoundIconButton
            Icon={PersonCheckFill}
            label="Edición"
            isActive={isActive("/profile")}
          />
        </Link>

        <Link to="/history">
          <RoundIconButton
            Icon={Receipt}
            label="History"
            isActive={isActive("/history")}
          />
        </Link>
      </div>
    </nav>
  );
};