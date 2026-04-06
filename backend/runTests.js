const assert = require('assert');
const { validateTaskInput, getTaskStatus } = require('./utils/taskUtils');

console.log("-----------------------------------------");
console.log("Iniciando pruebas automatizadas...");


try {
    
    const result1 = validateTaskInput('', 50);
    assert.strictEqual(result1.isValid, false, "Debió bloquear registro de tarea sin título");
    assert.strictEqual(result1.error, 'El título es obligatorio.');

  
    const result2 = validateTaskInput('Hacer ejercicio', 150);
    assert.strictEqual(result2.isValid, false, "Debió bloquear registro con progreso mayor a 100");
    
    console.log(" Prueba 1 PASÓ: Función de validación de registro.");
} catch (e) {
    console.error(" Prueba 1 FALLÓ:", e.message);
    process.exit(1);
}

try {
    
    const status1 = getTaskStatus(75, false);
    assert.strictEqual(status1, 'IN_PROGRESS', "El estatus debió ser IN_PROGRESS a 75%");


    const status2 = getTaskStatus(0, true);
    assert.strictEqual(status2, 'COMPLETED', "El estatus debió asimilarse a COMPLETED por el flag estricto");

    console.log(" Prueba 2 PASÓ: Regla de negocio de salidas esperadas.");
} catch (e) {
    console.error(" Prueba 2 FALLÓ:", e.message);
    process.exit(1);
}

console.log("");
console.log(" ¡ÉXITO! Todas las pruebas (2/2) pasaron correctamente.");
console.log("-----------------------------------------");
