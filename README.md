# Driver Analytics

Aplicacion web profesional para conductores de plataformas: registra viajes, controla jornada, calcula ganancia neta, administra gastos, analiza productividad y visualiza actividad geografica con mapas y heatmaps.

## Stack

- Next.js 15 App Router
- React 19 + TypeScript estricto
- Tailwind CSS
- Zustand
- React Hook Form + Zod
- Supabase PostgreSQL/Auth
- Leaflet, React Leaflet y leaflet.heat
- Recharts
- date-fns
- PWA lista para Vercel

## Instalacion

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abre `http://localhost:3000`.

## Variables de entorno

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Supabase

1. Crea un proyecto en Supabase.
2. Copia `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Ejecuta el SQL de `lib/supabase/schema.sql` en el SQL Editor.
4. Activa Email Auth en Authentication.

## Modulos incluidos

- Navegacion fija: Viajes, Reportes, Historial y Configuracion.
- Plataformas por defecto: DiDi, inDrive, Uber y Yango.
- Jornada laboral: iniciar, pausar, reanudar y finalizar.
- Meta diaria con progreso y faltante.
- Viajes: valor, propina sin comision, libre comision, GPS, kilometraje y ticket final.
- Gastos: gasolina, comida, peajes, lavado, parqueadero, mantenimiento y otros.
- Reportes: bruto, neto, propinas, gastos, utilidad real, km, tiempos y horas muertas.
- Analisis inteligente: mejores horas, peores horas, dias y plataformas.
- Historial filtrable por plataforma y viajes libres de comision.
- Configuracion CRUD local de plataformas.
- Mapas: inicio, recogida, finalizacion, rutas y heatmap.
- PWA instalable con service worker y cache offline parcial.
- Cola local para guardar viajes/gastos sin internet y sincronizar al volver online.

## Deploy en Vercel

1. Sube el repositorio a GitHub.
2. Importa el proyecto en Vercel.
3. Configura las variables de entorno.
4. Ejecuta `npm run build` como comando de build.

## Notas de produccion

- El proyecto esta preparado para Supabase Auth con middleware de proteccion de rutas.
- Los mapas se cargan solo en cliente para evitar errores de hidratacion.
- El estado local usa Zustand persistente para una experiencia movil rapida.
- Para un uso multiusuario real, sincroniza plataformas iniciales por usuario tras el primer login.
