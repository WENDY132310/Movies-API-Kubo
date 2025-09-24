# CUESTIONARIO TÉCNICO - DESARROLLADOR BACKEND

Empresa: Kubo S.A.S
Candidato: Wendy Caroline Cardenas Villalobos
Fecha: 24 de Septiembre, 2025
Proyecto: Movies API - Prueba Técnica

## 1. Propósito de module.exports:
Permite exportar funciones, clases u objetos en Node.js para mantener el código modular, reutilizable y organizado.

## 2. ¿Qué es un middleware?
Función que se ejecuta en medio del ciclo de una petición HTTP. Lo uso para autenticación, validación y manejo de errores, evitando repetir lógica en varias rutas.

## 3. Diferencia entre código bloqueante y no bloqueante:
El bloqueante espera a que termine una operación antes de continuar. El no bloqueante (asíncrono) permite seguir ejecutando otras tareas. En mi proyecto uso async/await para mejorar rendimiento.

## 4. Biblioteca para datos en tiempo real:
Socket.IO, porque simplifica la comunicación bidireccional y es ideal para notificaciones o actualizaciones en vivo.

## 5. Ventaja de un proyecto dockerizado:
La consistencia del entorno: la aplicación se ejecuta igual en cualquier máquina, eliminando problemas de configuración.

## 6. Diferencia entre imagen y volumen en Docker:
La imagen es una plantilla inmutable para ejecutar la app. El volumen guarda datos de forma persistente, incluso si el contenedor se elimina.

## 7. Orquestación de múltiples imágenes:

En un host: Docker Compose.

En producción a gran escala: Kubernetes, con autoescalado y balanceo de carga.

## 8. Ventaja de Kubernetes en cluster:
Alta disponibilidad y auto-recuperación: reemplaza contenedores fallidos, escala automáticamente y distribuye el tráfico sin downtime.
