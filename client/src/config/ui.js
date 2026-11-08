// Textos de la interfaz que NO se editan desde el panel (etiquetas de accesibilidad y botones del visor).
// Los textos de contenido (portada, apps, servicios…) vienen de la API y sí son editables en /admin.
export const ui = {
  en: {
    menu: 'Menu',
    language: 'Language',
    close: 'Close',
    previous: 'Previous',
    next: 'Next',
    previousShots: 'Previous screenshots',
    nextShots: 'Next screenshots',
    viewer: 'Enlarged screenshots',
    shotsOf: (name) => `${name} screenshots`,
    enlarge: (i, n, name) => `Enlarge screenshot ${i}/${n} · ${name}`,
    platforms: 'Platforms',
    loadError: 'The site could not be loaded. Please try again in a moment.',
    retry: 'Retry',
  },
  es: {
    menu: 'Menú',
    language: 'Idioma',
    close: 'Cerrar',
    previous: 'Anterior',
    next: 'Siguiente',
    previousShots: 'Capturas anteriores',
    nextShots: 'Capturas siguientes',
    viewer: 'Capturas ampliadas',
    shotsOf: (name) => `Capturas de ${name}`,
    enlarge: (i, n, name) => `Ampliar captura ${i}/${n} · ${name}`,
    platforms: 'Plataformas',
    loadError: 'No se pudo cargar el sitio. Inténtalo de nuevo en un momento.',
    retry: 'Reintentar',
  },
}
