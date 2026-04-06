/**
 * Valida los datos de entrada al momento de crear o registrar una tarea.
 */
function validateTaskInput(title, progress) {
    if (!title || typeof title !== 'string' || title.trim() === '') {
        return { isValid: false, error: 'El título es obligatorio.' };
    }
    if (progress < 0 || progress > 100) {
        return { isValid: false, error: 'El progreso debe estar entre 0 y 100.' };
    }
    return { isValid: true };
}

/**
 * Regla de negocio simple: Evalúa el estado situacional de la tarea 
 * basado en su porcentaje exacto de progreso.
 */
function getTaskStatus(progress, completed) {
    if (completed) return 'COMPLETED';
    if (progress === 0) return 'NOT_STARTED';
    if (progress > 0 && progress < 100) return 'IN_PROGRESS';
    if (progress === 100 && !completed) return 'READY_TO_COMPLETE';
    return 'UNKNOWN';
}

module.exports = { validateTaskInput, getTaskStatus };
