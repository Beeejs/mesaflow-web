
import { useEffect, useMemo, useState } from 'react'

// Convierte la respuesta del backend al formato del PUT.
const normalizeDistribution = (distribution) => {
  if (!distribution) return null

  return {
    version: distribution.version,

    mesas: (distribution.mesas ?? []).map((mesa) => ({
      idMesa: mesa.idMesa,
      idSector: mesa.idSector,
      posicionX: mesa.posicionX,
      posicionY: mesa.posicionY,
      activa: mesa.activa,
    })),

    grupos: (distribution.grupos ?? []).map((grupo) => ({
      nombre: grupo.nombre,
      idSector: grupo.idSector,
      idsMesas: [...(grupo.idsMesas ?? [])],
      idUsuario: grupo.idUsuario ?? null,
    })),

    mozosSectores: (
      distribution.mozosSectores ?? []
    ).map((assignment) => ({
      idSector: assignment.idSector,
      idUsuario: assignment.idUsuario,
    })),

    mozosMesas: (
      distribution.mozosMesas ?? []
    ).map((assignment) => ({
      idMesa: assignment.idMesa,
      idUsuario: assignment.idUsuario,
    })),
  }
}

const clone = (value) => structuredClone(value)

const clampPosition = (value) =>
  Math.min(1, Math.max(0, value))

const useTableDistributionDraft = (
  distribution,
  idConfiguracionMesa
) => {
  const configurationId =
    idConfiguracionMesa == null
      ? null
      : Number(idConfiguracionMesa)

  const [snapshot, setSnapshot] = useState({
    configurationId: null,
    baseline: null,
    draft: null,
  })

  const incoming = useMemo(() => {
    if (
      !distribution ||
      Number(distribution.idConfiguracionMesa) !==
        configurationId
    ) {
      return null
    }

    return normalizeDistribution(distribution)
  }, [distribution, configurationId])

  const belongsToSelection =
    snapshot.configurationId === configurationId

  const baseline = belongsToSelection
    ? snapshot.baseline
    : null

  const draft = belongsToSelection
    ? snapshot.draft
    : null

  const isDirty =
    baseline != null &&
    draft != null &&
    JSON.stringify(baseline) !== JSON.stringify(draft)

  // Inicializar o sincronizar con los datos del servidor.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSnapshot((current) => {
      if (current.configurationId !== configurationId) {
        return {
          configurationId,
          baseline: incoming ? clone(incoming) : null,
          draft: incoming ? clone(incoming) : null,
        }
      }

      if (!incoming) {
        return current
      }

      const currentDirty =
        current.baseline != null &&
        current.draft != null &&
        JSON.stringify(current.baseline) !==
          JSON.stringify(current.draft)

      // No pisar modificaciones locales.
      if (currentDirty) {
        return current
      }

      if (
        JSON.stringify(current.baseline) ===
        JSON.stringify(incoming)
      ) {
        return current
      }

      return {
        configurationId,
        baseline: clone(incoming),
        draft: clone(incoming),
      }
    })
  }, [configurationId, incoming])

  // El servidor cambió la versión mientras editábamos.
  const hasRemoteChanges =
    isDirty &&
    incoming?.version != null &&
    baseline?.version != null &&
    incoming.version !== baseline.version

  // Mover una mesa localmente.
  const moveTable = (idMesa, posicionX, posicionY) => {
    if (
      !Number.isFinite(posicionX) ||
      !Number.isFinite(posicionY)
    ) {
      return
    }

    setSnapshot((current) => {
      if (
        current.configurationId !== configurationId ||
        !current.draft
      ) {
        return current
      }

      return {
        ...current,
        draft: {
          ...current.draft,
          mesas: current.draft.mesas.map((mesa) =>
            Number(mesa.idMesa) === Number(idMesa)
              ? {
                  ...mesa,
                  posicionX: clampPosition(posicionX),
                  posicionY: clampPosition(posicionY),
                }
              : mesa
          ),
        },
      }
    })
  }

  // Cambiar una mesa de sector dentro del borrador.
  const moveTableToSector = (idMesa, idSector) => {
    const sectorId = Number(idSector)

    if (!Number.isInteger(sectorId) || sectorId <= 0) {
      return
    }

    setSnapshot((current) => {
      if (
        current.configurationId !== configurationId ||
        !current.draft
      ) {
        return current
      }

      return {
        ...current,
        draft: {
          ...current.draft,
          mesas: current.draft.mesas.map((mesa) =>
            Number(mesa.idMesa) === Number(idMesa)
              ? {
                  ...mesa,
                  idSector: sectorId,
                  posicionX: 0.5,
                  posicionY: 0.5,
                }
              : mesa
          ),
        },
      }
    })
  }

  // Volver a la última versión confirmada.
  const discardChanges = () => {
    setSnapshot((current) => {
      if (
        current.configurationId !== configurationId ||
        !current.baseline
      ) {
        return current
      }

      return {
        ...current,
        draft: clone(current.baseline),
      }
    })
  }

  // Confirmar que un borrador fue guardado.
  const markSaved = (savedDraft, newVersion) => {
    if (newVersion == null) return

    setSnapshot((current) => {
      if (current.configurationId !== configurationId) {
        return current
      }

      const saved = {
        ...clone(savedDraft),
        version: newVersion,
      }

      return {
        ...current,
        baseline: clone(saved),
        draft: clone(saved),
      }
    })
  }

  return {
    draft,
    baseline,
    isDirty,
    hasRemoteChanges,
    moveTable,
    moveTableToSector,
    discardChanges,
    markSaved,
  }
}

export default useTableDistributionDraft
