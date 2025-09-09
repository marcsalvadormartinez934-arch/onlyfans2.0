# Next.js — Generador SFW de Imágenes Adultas (Lingerie)

Demo que muestra:
- Frontend (Next.js) que envía prompts a `/api/generate`.
- API route que valida prompts y simula generación + moderación.
- Utilidades de moderación básicas.

**IMPORTANTE**: Este repositorio es un *starter*. Reemplaza los placeholders:
- Integrar proveedor de generación (Stability/Replicate/otro).
- Integrar clasificador NSFW (Sightengine, Google Vision SafeSearch, AWS Rekognition, o solución local).
- Implementar verificación KYC/edad real antes de permitir descargas/publicación.
- Ajustar umbrales y añadir revisión humana cuando el clasificador sea incierto.
- Cumplir la normativa local (protección de datos, derechos de imagen, contenidos sexualizados).

Despliegue recomendado: Vercel (configura variables de entorno en su panel).