/**
 * ARCHIVO: api.js
 * DESCRIPCIÓN: Servicio centralizado para la comunicación con MockAPI.
 * MÉTODOS: GET (Leer), POST (Crear), PUT (Actualizar), DELETE (Borrar).
 */

const BASE_URL = "https://69a5c154885dcb6bd6a93800.mockapi.io/api/registros";

/**
 * Obtener todos los registros de presión arterial.
 * @returns {Promise<Array>} Lista de registros.
 */
export const getRegistros = async () => {
  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) throw new Error("No se pudo obtener la información.");
    return await response.json();
  } catch (error) {
    console.error("Error en getRegistros:", error);
    throw error;
  }
};

/**
 * Crear un nuevo registro médico.
 * @param {Object} data - Objeto con sistolica, diastolica, pulsaciones, etc.
 */
export const createRegistro = async (data) => {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Error al crear el registro.");
    return await response.json();
  } catch (error) {
    console.error("Error en createRegistro:", error);
    throw error;
  }
};

/**
 * Actualizar (Update) un registro existente por su ID.
 * @param {string} id - ID único del registro en MockAPI.
 * @param {Object} data - Datos actualizados.
 */
export const updateRegistro = async (id, data) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Error al actualizar el registro.");
    return await response.json();
  } catch (error) {
    console.error("Error en updateRegistro:", error);
    throw error;
  }
};

/**
 * Eliminar (Delete) un registro por su ID.
 * @param {string} id - ID único del registro.
 */
export const deleteRegistro = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Error al eliminar el registro.");
    return await response.json();
  } catch (error) {
    console.error("Error en deleteRegistro:", error);
    throw error;
  }
};