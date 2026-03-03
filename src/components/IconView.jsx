// ------------------------------------------------------------
// COMPONENTE: IconView
// ------------------------------------------------------------
// Responsabilidad única: renderizar el ícono.
// Esto permite reutilizarlo y mantener limpio RoundIconButton.
// ------------------------------------------------------------

import PropTypes from "prop-types";

// eslint-disable-next-line no-unused-vars
export const IconView = ({ Icon, size = 22, color = '#DFDCE3' }) => {
  return <Icon className="icon" size={size} color={color} />;
};

IconView.propTypes = {
  Icon: PropTypes.elementType.isRequired,
  size: PropTypes.number,
  color: PropTypes.string,
};