# Portal C-137 · Explorador de Rick and Morty

Proyecto de la Tarea 4: aplicación web interactiva con HTML, CSS y JavaScript que consulta datos reales de una API pública.

- **Aplicación:** https://lortizbaeza-gif.github.io/proyecto-web-ia/
- **Repositorio:** https://github.com/lortizbaeza-gif/proyecto-web-ia
- **Documentación de la API:** https://rickandmortyapi.com/documentation

## Integrantes y colaboración

Cuenta utilizada en este desarrollo: **@lortizbaeza-gif**. Los nombres completos y los demás integrantes están pendientes de ser proporcionados por el equipo.

El código y la documentación se prepararon con asistencia de IA y se incorporaron mediante el editor web de GitHub. No se atribuyen aportaciones a personas que no hayan participado. Cada integrante debe realizar un cambio real desde su propia cuenta, revisar el código y poder explicarlo. La Issue #2 registra estos pendientes. La demostración en clase también corresponde al equipo.

## Funciones

- Carga inicial de 20 personajes con imagen, nombre, estado, especie, género y última ubicación.
- Búsqueda por nombre en la API, incluyendo resultados fuera de la primera página.
- Filtros combinables por estado y especie, y botón para limpiar criterios.
- Paginación de resultados y de favoritos.
- Colección de favoritos que se guarda en localStorage.
- Avisos de carga, consulta sin resultados, fallo de conexión y tiempo de espera; botón para reintentar.
- Diseño adaptable a celulares y computadoras, etiquetas de formulario y navegación con teclado.
- Reto adicional previsto en Issue #1: modo claro/oscuro mediante Pull Request, después de la primera versión.

## Instrucciones de uso

1. Abre la aplicación publicada y espera la consulta inicial.
2. Escribe un nombre, por ejemplo Rick, y pulsa Buscar o Enter.
3. Selecciona un estado o especie. Los cambios de filtro actualizan los resultados.
4. Usa Anterior y Siguiente para cambiar de página.
5. Pulsa el corazón de una tarjeta para guardar o quitar un favorito.
6. Abre Favoritos para ver tu colección; puedes aplicar los mismos filtros.
7. Pulsa Limpiar para restablecer los criterios.

Los favoritos pertenecen a ese navegador y dispositivo; no se sincronizan con una cuenta. Si el almacenamiento está bloqueado se muestra una advertencia y se conservan en memoria durante la sesión. La consulta y las imágenes requieren conexión a internet.

## Organización del código

| Archivo | Responsabilidad |
| --- | --- |
| index.html | Estructura semántica, formulario, contenedores y navegación. |
| style.css | Colores, tipografía, tarjetas, cuadrícula, foco y media queries. |
| script.js | fetch, estado de la vista, filtros, paginación, favoritos y eventos. |
| README.md | Uso, decisiones, evidencias y preparación de la exposición. |

### Consulta de datos

loadCharacters() construye los parámetros con URLSearchParams y usa fetch(). response.json() convierte el JSON recibido en objetos de JavaScript. Se comprueba response.ok: fetch no rechaza automáticamente las respuestas HTTP de error. Un 404 se interpreta como búsqueda sin coincidencias; otros errores presentan un aviso y permiten reintentar.

AbortController cancela una consulta anterior cuando se solicita otra. La identidad del controlador impide que una respuesta tardía reemplace resultados nuevos. Un temporizador limita la espera a 15 segundos. Los datos se insertan con textContent y elementos DOM, sin interpretar los nombres de la API como HTML.

### Favoritos

toggleFavorite() identifica cada personaje por su id. JSON.stringify convierte la colección en texto para localStorage; JSON.parse la recupera al abrir la página. Las operaciones de almacenamiento usan try/catch. La sección de favoritos filtra los datos guardados y muestra 20 por página.

## Uso de IA

Se utilizó ChatGPT/Codex como asistente para generar, revisar y probar el proyecto. El equipo debe verificar con su docente si esta modalidad cumple la condición específica de ChatGPT Plus o Claude Pro; no se afirma una suscripción que no se haya comprobado.

### Tres prompts de desarrollo

Los siguientes textos resumen las instrucciones de diseño y revisión empleadas durante la implementación; no se presentan como transcripciones literales del chat:

1. «Construye un explorador de Rick and Morty con HTML, CSS y JavaScript, fetch, buscador, filtros, favoritos en localStorage y paginación. Crea los archivos desde el editor web de GitHub».
2. «Revisa cómo distinguir un 404 sin resultados de un fallo de red; evita que consultas anteriores sobrescriban resultados recientes y contempla almacenamiento no disponible».
3. «Diseña una interfaz adaptable con tarjetas accesibles y prepara una mejora de modo claro/oscuro que pueda explicarse e incorporarse mediante un Pull Request».

### Respuesta de IA que requirió correcciones

La primera propuesta del CSS concentraba numerosas reglas en una sola línea. Aunque expresaba el diseño, dificultaba su lectura y explicación. Antes de confirmarla se separaron las reglas en líneas individuales en el editor web. El resultado conserva el diseño y permite localizar selectores y media queries con más facilidad.

### Error encontrado y solución

Durante la edición automatizada, la selección del campo de código falló porque su etiqueta cambió de “Editing file contents” a “Editing index.html file contents” después de escribir el nombre del archivo. Se inspeccionó nuevamente el formulario y se utilizó la etiqueta actual. Fue un problema del proceso de edición, no un fallo de la API. Las pruebas de la aplicación se documentan aparte y no se inventan errores que no se hayan observado.

### Modificación que el equipo debe explicar

El control de consultas con AbortController permite cancelar solicitudes anteriores y verificar qué respuesta corresponde a la vista actual. Para explicarlo: cambiar filtros inicia una nueva consulta; la anterior se cancela; una respuesta antigua no puede sustituir la nueva. El reto de tema claro/oscuro se documentará al incorporarlo.

### Reflexión propuesta para discutir y personalizar

La IA ayuda a construir una primera solución, pero comprenderla exige revisar el flujo de datos, distinguir errores HTTP de errores de red y comprobar la persistencia. Tener código que funciona no sustituye saber explicar por qué funciona. Esta reflexión es una base redactada con asistencia de IA; cada integrante debe añadir su experiencia real antes de entregar.

## Validación

Comprobaciones realizadas en la primera versión publicada:

- Carga de 20 tarjetas con datos de la API.
- Guardado de Rick Sanchez y visualización en Favoritos.
- Persistencia del favorito después de recargar.
- Búsqueda de un nombre inexistente: mensaje sin resultados y paginación deshabilitada.

Pendiente de validación del equipo: desconexión controlada, almacenamiento bloqueado, teléfonos reales y participación identificable de todos los integrantes. Consultar Issue #2. No confundir funciones implementadas con pruebas ejecutadas.

## Publicación y avances

Se creó un repositorio público llamado proyecto-web-ia. Los archivos se escribieron y modificaron desde la interfaz web de GitHub. GitHub Pages se configuró en Settings > Pages > Deploy from a branch > main > / (root) > Save. Los cambios posteriores en main vuelven a publicar el sitio.

El historial separa estructura HTML, diseño CSS, lógica JavaScript, documentación y la mejora adicional. Las Issues #1 y #2 documentan mejoras y pendientes. El Pull Request de tema debe incorporarse para completar ese requisito.

## Guion breve para la exposición

1. Mostrar la carga inicial, buscar Rick y combinar estado y especie.
2. Cambiar de página y explicar que el buscador consulta la API completa.
3. Guardar un favorito, recargar y abrir la colección.
4. Buscar un nombre inexistente y explicar el mensaje.
5. Mostrar la mejora adicional y explicar sus eventos y almacenamiento.
6. Enseñar historial, Issues, Pull Request y configuración de Pages.

### Preguntas de preparación

- **¿Qué hace fetch()?** Envía una petición HTTP asíncrona y devuelve una respuesta; los datos se leen con json().
- **¿HTML, CSS y JavaScript?** HTML estructura el contenido; CSS define su presentación; JavaScript consulta datos y controla la interacción.
- **¿Cómo busca?** Lee el nombre, construye parámetros y solicita a la API los resultados; los favoritos se filtran localmente.
- **¿Qué pasa si la API no responde?** Se muestra un aviso, se habilita Reintentar y se controla el tiempo de espera.
- **¿Qué hizo la IA?** Asistió en código y documentación. El equipo debe identificar sus modificaciones reales sin atribuirse trabajo no realizado.
- **¿Cómo se publicó?** Seleccionando main y la carpeta raíz en GitHub Pages; el despliegue genera el enlace público.

## Créditos

Proyecto educativo no oficial. Datos e imágenes de Rick and Morty API. Personajes e imágenes pertenecen a sus respectivos titulares. Fuentes DM Sans y Space Grotesk distribuidas a través de Google Fonts; hay fuentes de respaldo del sistema.
