// Comprueba que un enlace de descarga directa (ej. el APK del VPS) responde de
// verdad antes de mostrarlo: un boton que lleva a un 404 es peor que no tener boton.
// Se cachea para no hacer una peticion por cada visita; si el archivo aparece
// (se sube un APK nuevo), el boton sale solo en el siguiente ciclo de cache.
const TTL_OK_MS = 5 * 60 * 1000;
const TTL_FAIL_MS = 60 * 1000;
const cache = new Map();

async function isAvailable(url) {
  if (!url) return false;
  if (!/^https?:\/\//i.test(url)) return true; // ruta propia del sitio: se confia

  const hit = cache.get(url);
  if (hit && Date.now() - hit.at < (hit.ok ? TTL_OK_MS : TTL_FAIL_MS)) return hit.ok;

  let ok = false;
  try {
    const res = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(3000) });
    ok = res.ok;
  } catch {
    ok = false; // sin respuesta a tiempo: mejor ocultar que enlazar a algo roto
  }
  cache.set(url, { ok, at: Date.now() });
  return ok;
}

// Quita directDownload de los proyectos cuyo enlace no responde. Muta y devuelve la lista.
async function dropBrokenDownloads(projects) {
  await Promise.all(
    projects.map(async (p) => {
      if (p.directDownload && p.directDownload.url && !(await isAvailable(p.directDownload.url))) {
        p.directDownload = { url: '', label: p.directDownload.label };
      }
    })
  );
  return projects;
}

module.exports = { isAvailable, dropBrokenDownloads };
