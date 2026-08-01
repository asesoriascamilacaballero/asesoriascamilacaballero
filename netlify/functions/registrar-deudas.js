// netlify/functions/registrar-deuda.js
const fetch = require('node-fetch');

exports.handler = async (event) => {
    // Solo permitir POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Método no permitido' })
        };
    }

    try {
        const datos = JSON.parse(event.body);
        const { email, monto, descripcion, nombre, apellido } = datos;

        // Validar datos mínimos
        if (!email || !monto) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Faltan datos requeridos' })
            };
        }

        // 🔐 Appkey de Libélula (se toma de las variables de entorno)
        const APPKEY = process.env.LIBELULA_APPKEY;

        if (!APPKEY) {
            console.error('ERROR: Appkey no configurada en variables de entorno');
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Appkey no configurada' })
            };
        }

        console.log('Appkey configurada correctamente');
        console.log('Datos recibidos:', { email, monto, descripcion });

        // Preparar payload para Libélula
        const payload = {
            appkey: APPKEY,
            email_cliente: email,
            identificador_deuda: `PAGO-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
            fecha_vencimiento: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            descripcion: descripcion || 'Pago de sesión',
            callback_url: 'https://asesoriascamilacaballero.netlify.app/pago-exitoso.html',
            url_retorno: 'https://asesoriascamilacaballero.netlify.app/gracias.html',
            nombre_cliente: nombre || 'Cliente',
            apellido_cliente: apellido || 'Ejemplo',
            emite_factura: false,
            moneda: 'BOB',
            lineas_detalle_deuda: [
                {
                    concepto: descripcion || 'Sesión de asesoría',
                    cantidad: 1,
                    costo_unitario: monto,
                    descuento_unitario: 0
                }
            ]
        };

        console.log('Enviando a Libélula:', JSON.stringify(payload, null, 2));

        // Llamar a la API de Libélula
        const response = await fetch('https://api.libelula.bo/rest/deuda/registrar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        console.log('Respuesta de Libélula:', data);

        if (data.error === false || data.url_pasarela_pagos) {
            return {
                statusCode: 200,
                body: JSON.stringify({
                    success: true,
                    url_pasarela_pagos: data.url_pasarela_pagos,
                    id_transaccion: data.id_transaccion
                })
            };
        } else {
            console.error('Error de Libélula:', data.mensaje);
            return {
                statusCode: 400,
                body: JSON.stringify({
                    success: false,
                    error: data.mensaje || 'Error al registrar la deuda'
                })
            };
        }

    } catch (error) {
        console.error('Error en función:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: 'Error interno del servidor: ' + error.message 
            })
        };
    }
};
