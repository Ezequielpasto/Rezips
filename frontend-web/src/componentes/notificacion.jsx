import { useEffect } from 'react'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'
import '../estilos/notificacion.css'

function Notificacion({ mensaje, tipo = 'exito', onCerrar, duracion = 3000 }) {

    useEffect(() => {
        if (!mensaje) return

        const temporizador = setTimeout(() => {
            onCerrar()
        }, duracion)

        return () => clearTimeout(temporizador)
    }, [mensaje, duracion, onCerrar])

    if (!mensaje) return null

    const iconos = {
        exito: <CheckCircle />,
        error: <XCircle />,
        advertencia: <AlertTriangle />,
        info: <Info />
    }

    return (
        <div className={`notificacion notificacion-${tipo}`}>
            <div className="iconoNotificacion">
                {iconos[tipo] || <Info />}
            </div>

            <p>{mensaje}</p>

            <button
                type="button"
                className="cerrarNotificacion"
                onClick={onCerrar}
            >
                <X size={18} />
            </button>
        </div>
    )
}

export default Notificacion