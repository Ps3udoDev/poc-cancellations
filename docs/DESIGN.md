# Sistema de Diseño: La Arquitectura de la Confianza

Este documento define la dirección visual y técnica para la plataforma de gestión de seguros. Como diseñadores, nuestro objetivo es trascender la interfaz de usuario convencional y crear una experiencia **Editorial de Alta Gama**. No estamos construyendo solo tablas y formularios; estamos diseñando un entorno de serenidad, precisión y autoridad técnica.

## 1. El Norte Creativo: "El Santuario de la Eficiencia"

Nuestra filosofía visual se aleja del software transaccional ruidoso para adoptar un estilo de **Minimalismo Atmosférico**. La interfaz debe sentirse como una oficina privada de alto nivel: silenciosa, espaciosa y profundamente organizada.

Para lograr esto, rompemos la rigidez del "grid estándar" mediante:
- **Asimetría Intencional:** El uso de espacios en blanco generosos para guiar el ojo, permitiendo que la información "respire".
- **Capas Editoriales:** El contenido no está "pegado" sobre un fondo; habita en un ecosistema de superficies con diferentes profundidades tonales.
- **Autoridad Tipográfica:** Una jerarquía dramática entre títulos de gran escala y datos técnicos compactos.

---

## 2. Paleta de Colores y Capas de Superficie

La confianza en el sector asegurador se construye a través de la estabilidad. Nuestra paleta utiliza la profundidad del **Deep Navy** y la frescura del **Teal** para crear un entorno profesional pero moderno.

### La Regla de "Sin Líneas" (The No-Line Rule)
**Prohibición absoluta:** No se permite el uso de bordes sólidos de 1px para seccionar la interfaz. La estructura se define exclusivamente mediante:
1.  **Cambios de Tono:** Un contenedor `surface-container-low` sobre un fondo `surface`.
2.  **Espaciado Negativo:** El uso de los valores altos de nuestra escala (16, 20, 24) para separar secciones.

### Jerarquía de Superficies y Anidación
Tratamos la UI como hojas de papel fino o cristal esmerilado apiladas:
-   **Base:** `surface` (#f8f9fa) para el lienzo principal.
-   **Nivel 1:** `surface-container-low` para áreas de navegación o paneles laterales.
-   **Nivel 2 (Énfasis):** `surface-container-lowest` (#ffffff) para tarjetas de contenido crítico que deben "flotar" sutilmente hacia el usuario.

### El Toque de "Glass & Gradient"
Para evitar un aspecto plano y genérico, los elementos flotantes (modales, menús desplegables) deben utilizar **Glassmorphism**:
-   Fondo: `surface_container_lowest` con opacidad al 80%.
-   Efecto: `backdrop-blur` de 12px a 20px.
-   **Gradients de Firma:** Los botones principales no son planos; utilizan un degradado sutil de `primary_container` (#002b5b) a `primary` (#001736) para aportar una "vibración" de calidad premium.

---

## 3. Tipografía: Voz y Estructura

Utilizamos un sistema de doble fuente para equilibrar la elegancia con la legibilidad técnica.

*   **Manrope (Display & Headlines):** Nuestra voz institucional. Se usa en tamaños grandes (`display-lg` a `headline-sm`) para transmitir seguridad y modernidad.
*   **Inter (Title & Body):** Nuestra herramienta de precisión. Se utiliza para la lectura de pólizas, datos de clientes y etiquetas.

**Jerarquía Sugerida (Español):**
-   **H1 (Display-MD):** "Tu tranquilidad, bajo control." (Manrope, Semibold).
-   **Body-LG:** "Detalles de la póliza de vida." (Inter, Regular).
-   **Label-MD:** "FECHA DE VENCIMIENTO" (Inter, Bold, All-caps, Tracking +5%).

---

## 4. Elevación y Profundidad Tonal

Olvídate de las sombras pesadas. La profundidad se logra mediante la **Capas Tonales**.

-   **El Principio de Apilamiento:** Para elevar una tarjeta, no uses sombra; colócala sobre un fondo ligeramente más oscuro (`surface-dim`) para que el blanco puro de la tarjeta destaque por contraste natural.
-   **Sombras Ambientales:** Si un elemento debe flotar (ej. un botón de acción flotante), usa una sombra con `blur: 32px`, `spread: -4px` y una opacidad del 4% usando el color `primary`. Esto imita la luz natural, no el diseño digital.
-   **Bordes Fantasma (Ghost Borders):** Solo si es estrictamente necesario para accesibilidad, usa `outline-variant` con una opacidad del 15%. Nunca uses negro o gris sólido.

---

## 5. Componentes Principales

### Botones (Botones)
-   **Primario:** Degradado sutil de Navy, `border-radius: lg (8px)`. Texto en `on_primary`. Sin sombra externa, solo un brillo interno mínimo.
-   **Secundario (Teal):** Uso exclusivo para acciones de "éxito" o "nuevo" (ej: "Nueva Póliza").
-   **Terciario:** Solo texto con `label-md` en `primary`, sin contenedor, para acciones secundarias.

### Tarjetas e Información (Tarjetas y Listas)
-   **Regla de Oro:** Prohibido el uso de líneas divisorias entre filas.
-   **Alternativa:** Usa un ligero cambio de color en el `hover` (`surface-container-high`) o aumenta el espaciado vertical (`spacing-4`) para separar registros de siniestros o asegurados.

### Campos de Entrada (Inputs)
-   Fondo: `surface-container-low`.
-   Estado Activo: Un borde inferior de 2px en `secondary` (Teal).
-   Label: Siempre visible en `label-sm` para evitar la pérdida de contexto.

### Componente Especial: "El Resumen Ejecutivo"
Un componente de cabecera que utiliza `glassmorphism` y `display-sm` para mostrar el valor total asegurado o el estado de cuenta del cliente, actuando como el foco visual de cada pantalla.

---

## 6. Do’s and Don’ts (Qué hacer y qué evitar)

### SÍ (Do)
-   **Espacio Blanco:** Usa el doble de espacio del que crees necesario. El espacio es lujo.
-   **Alineación Óptica:** Alinea los iconos visualmente, no solo matemáticamente, para que la interfaz se sienta "equilibrada".
-   **Micro-interacciones:** Usa transiciones suaves (300ms, ease-out) para los cambios de estado de superficie.

### NO (Don’t)
-   **No uses sombras estándar:** Evita las sombras de "caja" que hacen que el diseño se vea anticuado (2014).
-   **No uses bordes para todo:** Si sientes que una sección necesita un borde, prueba primero aumentando el espaciado o cambiando sutilmente el color de fondo.
-   **No satures el Teal:** El color secundario Teal es un bisturí, no un mazo. Úsalo solo para puntos de atención específicos.

---

Este sistema no es solo una guía; es un compromiso con la claridad. En el mundo de los seguros, **la claridad es la forma más alta de servicio al cliente.**