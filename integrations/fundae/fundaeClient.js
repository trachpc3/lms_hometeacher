import soap from 'soap';

// URL del WSDL de FUNDAE (reemplazar cuando tengas la real)
const FUNDAE_WSDL_URL = 'https://fundae.example.com/ws/service?wsdl';

let client = null;

/**
 * Inicializa el cliente SOAP (si no está ya creado)
 */
export const getClient = async () => {
  if (!client) {
    client = await soap.createClientAsync(FUNDAE_WSDL_URL);
  }
  return client;
};

/**
 * Ejemplo de llamada SOAP a FUNDAE
 */
// export const enviarParticipante = async (datosParticipante) => {
//   try {
//     const client = await getClient();

//     const args = {
//       nombre: datosParticipante.nombre,
//       dni: datosParticipante.dni,
//       cursoId: datosParticipante.cursoId,
//     };

//     const [result] = await client.EnviarParticipanteAsync(args);

//     return result;
//   } catch (error) {
//     console.error('❌ Error al comunicar con FUNDAE:', error.message);
//     throw error;
//   }
// };

export const enviarParticipante = async (datosParticipante) => {
  return {
    estado: 'OK',
    participanteId: 'FND12345',
    recibido: datosParticipante
  };
};
