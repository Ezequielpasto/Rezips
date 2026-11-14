
import { AlertTriangle, X } from 'lucide-react'
import '../estilos/confirmacion.css'

function Confirmacion({
    mensaje,
    onConfirmar,
    onCancelar,
    textoConfirmar = 'Eliminar'
}) {
    if (!mensaje) return null

    return (
        <div className="fondoConfirmacion" onClick={onCancelar}>
            <div
                className="confirmacion"
                role="dialog"
                aria-modal="true"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    className="cerrarConfirmacion"
                    onClick={onCancelar}
                >
                    <X size={20} />
                </button>

                <div className="iconoConfirmacion">
                    <AlertTriangle size={26} />
                </div>

                <h3>¿Estás seguro?</h3>

                <p>{mensaje}</p>

                <div className="accionesConfirmacion">
                    <button
                        type="button"
                        className="botonCancelar"
                        onClick={onCancelar}
                    >
                        Cancelar
                    </button>

                    <button
                        type="button"
                        className="botonConfirmar"
                        onClick={onConfirmar}
                    >
                        {textoConfirmar}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Confirmacion
