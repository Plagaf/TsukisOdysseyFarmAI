const fs = require('fs');

const MODIFICADOR = "M";
const PLANTA = "P";
const AREA_EFECTO = "E";

// Define el tamaño de la celda (en píxeles)
const tamanoCelda = 10;


class Planta {
    constructor(nombre, tipo, utUnitaria, utPromedio, uPH, tiempoCosecha, cantidadCosecha, color, forma, codigo) {
        this.nombre = nombre;
        this.tipo = tipo;
        this.utUnitaria = utUnitaria;
        this.utPromedio = utPromedio;
        this.uPH = uPH;
        this.tiempoCosecha = tiempoCosecha;
        this.cantidadCosecha = cantidadCosecha;
        this.color = color;
        this.forma = forma;
        this.codigo = codigo;
        this.tipoObjeto = PLANTA;
    }
}

class Modificador {
    constructor(nombre, costo, efectoTiempo, efectoCosecha, forma, tipoModificador, codigo) {
        this.nombre = nombre;
        this.costo = costo;
        this.efectoTiempo = efectoTiempo;
        this.efectoCosecha = efectoCosecha;
        this.forma = forma;
        this.tipoModificador = tipoModificador;
        this.codigo = codigo;
        this.tipoObjeto = MODIFICADOR;
        this.color = "#F00";
    }
}

class AreaEfecto {
    constructor(forma) {
        this.forma = forma;
    }
}

const unidad = [
    ["P", "P"],
    ["P", "P"]
];

const barraS = [
    [false, false, "M", "M", "M", "M", false, false],
    [false, false, "M", "M", "M", "M", false, false],
    ["E", "E", "E", "E", "E", "E", "E", "E"],
    ["E", "E", "E", "E", "E", "E", "E", "E"],
    ["E", "E", "E", "E", "E", "E", "E", "E"],
    ["E", "E", "E", "E", "E", "E", "E", "E"],
];

const barraN = [
    ["E", "E", "E", "E", "E", "E", "E", "E"],
    ["E", "E", "E", "E", "E", "E", "E", "E"],
    ["E", "E", "E", "E", "E", "E", "E", "E"],
    ["E", "E", "E", "E", "E", "E", "E", "E"],
    [false, false, "M", "M", "M", "M", false, false],
    [false, false, "M", "M", "M", "M", false, false]
];

const barraW = [
    ["E", "E", "E", "E", "E", "E", false, false],
    ["E", "E", "E", "E", "E", "E", false, false],
    ["E", "E", "E", "E", "E", "E", "M", "M"],
    ["E", "E", "E", "E", "E", "E", "M", "M"],
    ["E", "E", "E", "E", "E", "E", "M", "M"],
    ["E", "E", "E", "E", "E", "E", "M", "M"],
    ["E", "E", "E", "E", "E", "E", false, false],
    ["E", "E", "E", "E", "E", "E", false, false],
];

const barraE = [
    [false, false, "E", "E", "E", "E", "E", "E"],
    [false, false, "E", "E", "E", "E", "E", "E"],
    ["M", "M", "E", "E", "E", "E", "E", "E"],
    ["M", "M", "E", "E", "E", "E", "E", "E"],
    ["M", "M", "E", "E", "E", "E", "E", "E"],
    ["M", "M", "E", "E", "E", "E", "E", "E"],
    [false, false, "E", "E", "E", "E", "E", "E"],
    [false, false, "E", "E", "E", "E", "E", "E"]
];



const dona = [
    ["E", "E", "E", "E", "E", "E"],
    ["E", "E", "E", "E", "E", "E"],
    ["E", "E", "M", "M", "E", "E"],
    ["E", "E", "M", "M", "E", "E"],
    ["E", "E", "E", "E", "E", "E"],
    ["E", "E", "E", "E", "E", "E"],
];

const posteH = [
    ["M", "M", "E", "E", "E", "E", "E", "E"],
    ["M", "M", "E", "E", "E", "E", "E", "E"]
];

const posteV = [
    ["M", "M"],
    ["M", "M"],
    ["E", "E"],
    ["E", "E"],
    ["E", "E"],
    ["E", "E"],
    ["E", "E"],
    ["E", "E"]
];

const ladosH = [
    [false, false, "E", "E", "E", "E", "E", "E", false, false],
    [false, false, "E", "E", "E", "E", "E", "E", false, false],
    ["E", "E", "E", "E", "E", "E", "E", "E", "E", "E"],
    ["E", "E", "E", "E", "E", "E", "E", "E", "E", "E"],
    [false, false, "M", "M", "M", "M", "M", "M", false, false],
    [false, false, "M", "M", "M", "M", "M", "M", false, false],
    ["E", "E", "E", "E", "E", "E", "E", "E", "E", "E"],
    ["E", "E", "E", "E", "E", "E", "E", "E", "E", "E"],
    [false, false, "E", "E", "E", "E", "E", "E", false, false],
    [false, false, "E", "E", "E", "E", "E", "E", false, false],
];

const ladosV = [
    [false, false, "E", "E", false, false, "E", "E", false, false],
    [false, false, "E", "E", false, false, "E", "E", false, false],
    ["E", "E", "E", "E", "M", "M", "E", "E", "E", "E"],
    ["E", "E", "E", "E", "M", "M", "E", "E", "E", "E"],
    ["E", "E", "E", "E", "M", "M", "E", "E", "E", "E"],
    ["E", "E", "E", "E", "M", "M", "E", "E", "E", "E"],
    ["E", "E", "E", "E", "M", "M", "E", "E", "E", "E"],
    ["E", "E", "E", "E", "M", "M", "E", "E", "E", "E"],
    [false, false, "E", "E", false, false, "E", "E", false, false],
    [false, false, "E", "E", false, false, "E", "E", false, false]
];

const tiposDeModificadores = [
    //(nombre,costo, efectoTiempo, efectoCosecha, forma, tipo, codigo) 
    new Modificador("GigaGrowS", 5000, -0.20, .25, barraS, "UV-Lights", "GGS"),
    new Modificador("GigaGrowN", 5000, -0.20, .25, barraN, "UV-Lights", "GGN"),
    new Modificador("GigaGrowW", 5000, -0.20, .25, barraW, "UV-Lights", "GGW"),
    new Modificador("GigaGrowE", 5000, -0.20, .25, barraE, "UV-Lights", "GGE"),
    new Modificador("Megagrow", 3000, -0.20, .25, posteH, "UV-Lights", "MG"),
    new Modificador("MegagrowV", 3000, -0.20, .25, posteV, "UV-Lights", "MGV"),
    new Modificador("Lane SprinklerH", 8000, -0.2, 0, ladosH, "Sprinklers", "LSH"),
    new Modificador("Lane SprinklerV", 8000, -0.2, 0, ladosV, "Sprinklers", "LSV"),
    new Modificador("Rotary Sprinkler", 5000, -0.2, 0, dona, "Sprinklers", "RS"),
    new Modificador("Goat Fertilizer", 250, -1 / 3, .50, dona, "Fertilizer", "GF"),
];


const tiposDePlantas = [
    //          nombre, tipo,       utUnitaria, utPromedio, uPH, tiempoCosecha, cantidadCosecha, color
    new Planta("Sandía", "Consumible", 140, 140, 140 / 6, 6, 1, "#03a572", unidad, "S"),
    new Planta("Calabaza", "Consumible", 50, 50, 50 / 2, 2, 1, "#FF7518", unidad, "C"),
    new Planta("Zanahoria", "No consumible", 1, 20, 20 / 2, 2, 20, "#FFC000", unidad, "Z"),
    new Planta("Papa", "No consumible", 1, 11, 11 / 1, 1, 11, "#4C3228", unidad, "P"),
    new Planta("Fresa", "No consumible", 2, 10, 10 / 2, 2, 5, "#e42e67", unidad, "F"),
    new Planta("Uva", "No consumible", 4, 24, 24 / 2, 2, 6, "#4c00b0", unidad, "U"),
    new Planta("Nabo", "No consumible", 1, 22, 22 / 2, 2, 22, "#c3c8ac", unidad, "N"),
];

// Función para obtener posiciones relativas del objeto o area de efecto
function getPosicionesRelativas(posicion, forma, columnas, filas, esAE) {
    let posicionesRelativas = [];
    let filaValida = Math.floor(posicion / columnas);
    let columnaValida = posicion % columnas;
    let filaSolido = 0;
    let columnaSolido = 0;
    let encontrado = false;

    // Encuentra las coordenadas de la "M" o PLANTA dentro de la forma
    for (let i = 0; i < forma.length; i++) {
        for (let j = 0; j < forma[i].length; j++) {
            if (forma[i][j] === MODIFICADOR || forma[i][j] === PLANTA) {
                filaSolido = i;
                columnaSolido = j;
                encontrado = true;
                break;
            }
        }
        if (encontrado) {
            break;
        }
    }
    // Calcula las posiciones relativas
    for (let i = 0; i < forma.length; i++) {
        for (let j = 0; j < forma[i].length; j++) {
            if (esAE === false && (forma[i][j] === PLANTA || forma[i][j] === MODIFICADOR)) {
                let filaAbs = filaValida + (i - filaSolido);
                let columnaAbs = columnaValida + (j - columnaSolido);

                if (filaAbs >= 0 && filaAbs < filas && columnaAbs >= 0 && columnaAbs < columnas) {
                    posicionesRelativas.push([filaAbs, columnaAbs]);
                }
            } else if (esAE === true && forma[i][j] === AREA_EFECTO) {
                let filaAbs = filaValida + (i - filaSolido);
                let columnaAbs = columnaValida + (j - columnaSolido);

                if (filaAbs >= 0 && filaAbs < filas && columnaAbs >= 0 && columnaAbs < columnas) {
                    posicionesRelativas.push([filaAbs, columnaAbs]);
                }
            }
        }
    }

    return posicionesRelativas;
}

function generarPosicionAleatoria(filas, columnas) {

    // Genera un número aleatorio para la fila
    let fila = Math.floor(Math.random() * Math.floor(filas / 2));
    fila *= 2;

    // Genera un número aleatorio para la columna
    let columna = Math.floor(Math.random() * Math.floor(columnas / 2));
    columna *= 2;

    return [fila, columna];
}

function generarPlantaAleatoria() {
    const indiceAleatorio = Math.floor(Math.random() * tiposDePlantas.length);
    const tipoPlanta = tiposDePlantas[indiceAleatorio];

    return tipoPlanta;
}

function generarModificadorAleatorio() {
    const indiceAleatorio = Math.floor(Math.random() * tiposDeModificadores.length);
    const tipoModificador = tiposDeModificadores[indiceAleatorio];

    return tipoModificador;

}

// Función para crear un mapa aleatorio
function crearMapaAleatorio(filas, columnas, numPlantas, numModificadores) {
    // Validaciones para evitar bucles infinitos
    if ((numPlantas + numModificadores) > filas / 2 * columnas / 2) {
        //console.warn("El número de plantas o modificadores es mayor que el espacio disponible en el mapa.");
    }

    // Inicializar las capas
    const capaPlantas = Array(filas).fill(null).map(() => Array(columnas).fill(null));
    const capaColores = Array(filas).fill(null).map(() => Array(columnas).fill(null));
    const capaModificadores = Array(filas).fill(null).map(() => Array(columnas).fill(null));
    const capaObjetos = Array(filas).fill(null).map(() => Array(columnas).fill(null));
    const capaAreaEfecto = Array(filas).fill(false).map(() => Array(columnas).fill(false));
    const capaUvTiempo = Array(filas).fill(0).map(() => Array(columnas).fill(0));
    const capaUvCosecha = Array(filas).fill(0).map(() => Array(columnas).fill(0));
    const capaFertilizanteTiempo = Array(filas).fill(0).map(() => Array(columnas).fill(0));
    const capaFertilizanteCosecha = Array(filas).fill(0).map(() => Array(columnas).fill(0));
    const capaAspersor = Array(filas).fill(0).map(() => Array(columnas).fill(0));
    let capaCodificacion = Array(filas / 2).fill(0).map(() => Array(columnas / 2).fill(0));

    function esPosicionAceptable(capaObjetos, fila, columna, objeto, columnas, filas) {

        const posicionesRelativasObjetos = getPosicionesRelativas(fila * columnas + columna, objeto.forma, columnas, filas, false);

        const hayCeldaOcupada = posicionesRelativasObjetos.some(([filaRelativa, columnaRelativa]) => {
            const filaActual = filaRelativa;
            const columnaActual = columnaRelativa;

            if (capaObjetos[filaActual][columnaActual] !== undefined && capaObjetos[filaActual][columnaActual] !== null) {
                //console.log("celda ocupada: ", filaActual, columnaActual, objeto);
                return true; // Detenemos la iteración de some()
            } else {
                return false; // Seguimos iterando
            }
        });

        if (hayCeldaOcupada) {
            return false;
        } else {
            return true;
        }


    }

    function llenarCapaObjetos(fila, columna, objeto, columnas, filas) {

        const posicionesRelativasObjetos = getPosicionesRelativas(fila * columnas + columna, objeto.forma, columnas, filas, false);

        const hayCeldaOcupada = posicionesRelativasObjetos.some(([filaRelativa, columnaRelativa]) => {
            const filaActual = filaRelativa;
            const columnaActual = columnaRelativa;

            if (capaObjetos[filaActual][columnaActual] !== undefined && capaObjetos[filaActual][columnaActual] !== null) {
                // Acción opcional si se desea ejecutar algo al detectar la celda ocupada (opcional)
                return true; // Detenemos la iteración de some()
            } else {
                capaObjetos[filaActual][columnaActual] = objeto.tipoObjeto;
                capaColores[filaActual][columnaActual] = objeto.color;
                return false; // Seguimos iterando
            }
        });

        if (hayCeldaOcupada) {
            return true;
        } else {
            return false;
        }


    }

    function llenarCapasAE(fila, columna, modificador, columnas, filas) {
        const posicionesRelativasObjetos = getPosicionesRelativas(fila * columnas + columna, modificador.forma, columnas, filas, true);
        posicionesRelativasObjetos.forEach(([filaRelativa, columnaRelativa]) => {
            const filaActual = filaRelativa;
            const columnaActual = columnaRelativa;
            capaAreaEfecto[filaActual][columnaActual] = true;
            switch (modificador.tipoModificador) {
                case "UV-Lights":
                    capaUvTiempo[filaActual][columnaActual] = modificador.efectoTiempo;
                    capaUvCosecha[filaActual][columnaActual] = modificador.efectoCosecha;
                    break;
                case "Fertilizer":
                    capaFertilizanteTiempo[filaActual][columnaActual] = modificador.efectoTiempo;
                    capaFertilizanteCosecha[filaActual][columnaActual] = modificador.efectoCosecha;
                    break;
                case "Sprinklers":
                    capaAspersor[filaActual][columnaActual] = modificador.efectoTiempo;
                    break;
                default:
                    console.warn("Tipo de modificador desconocido.");
                    break;
            }
        });
    }

    // Colocar modificadores (con un límite de intentos para evitar bucle infinito)
    let modificadoresColocados = 0;

    let intentosModificadores = filas * columnas * 7; // Intentos máximos:  7 veces del tamaño del mapa
    while (modificadoresColocados < numModificadores && intentosModificadores > 0) {
        const posicion = generarPosicionAleatoria(filas, columnas);
        const fila = posicion[0];
        const columna = posicion[1];
        const modificador = generarModificadorAleatorio();

        esPosAceptable = esPosicionAceptable(capaObjetos, fila, columna, modificador, columnas, filas);

        if (esPosAceptable) {
            capaModificadores[fila][columna] = modificador
            llenarCapaObjetos(fila, columna, modificador, columnas, filas, "solido")
            llenarCapasAE(fila, columna, modificador, columnas, filas, "solido")

            modificadoresColocados++;
        }
        intentosModificadores--;
    }

    // Colocar plantas (con un límite de intentos para evitar bucle infinito)
    let plantasColocadas = 0;
    let intentosPlantas = filas * columnas * 7; // Intentos máximos: 7 veces del tamaño del mapa
    while (plantasColocadas < numPlantas && intentosPlantas > 0) {
        const posicion = generarPosicionAleatoria(filas, columnas);
        const fila = posicion[0];
        const columna = posicion[1];
        const planta = generarPlantaAleatoria();

        esPosAceptable = esPosicionAceptable(capaObjetos, fila, columna, planta, columnas, filas);
        //console.log("planta: ", esPosAceptable);

        if (esPosAceptable) {
            capaPlantas[fila][columna] = planta
            llenarCapaObjetos(fila, columna, planta, columnas, filas, "solido")
            plantasColocadas++;
        }
        intentosPlantas--;
    }

    // Validaciones adicionales (opcional)
    if (plantasColocadas < numPlantas) {
        //console.warn("No se pudieron colocar todas las plantas. Se colocaron " + plantasColocadas + " de " + numPlantas);
    }
    if (modificadoresColocados < numModificadores) {
        //console.warn("No se pudieron colocar todos los modificadores. Se colocaron " + modificadoresColocados + " de " + numModificadores);
    }

    capaCodificacion = crearCodigoMapa(capaPlantas, capaCodificacion);
    capaCodificacion = crearCodigoMapa(capaModificadores, capaCodificacion);

    return {
        capaPlantas,
        capaColores,
        capaModificadores,
        capaAreaEfecto,
        capaObjetos,
        capaUvTiempo,
        capaUvCosecha,
        capaFertilizanteTiempo,
        capaFertilizanteCosecha,
        capaAspersor,
        capaCodificacion
    };
}

function crearCodigoMapa(capaOrigen, capaCodificacion) {
    for (let i = 0; i < capaCodificacion.length; i++) {
        for (let j = 0; j < capaCodificacion[i].length; j++) {
            if (capaOrigen[i * 2][j * 2]) {
                capaCodificacion[i][j] = capaOrigen[i * 2][j * 2].codigo;
            }
        }
    }
    return capaCodificacion;
}



function obtenerObjetoPorCodigo(codigo) {
    // Busca en los tipos de modificadores
    const modificador = tiposDeModificadores.find(mod => mod.codigo === codigo);
    if (modificador) {
        return modificador;
    }

    // Busca en los tipos de plantas
    const planta = tiposDePlantas.find(pl => pl.codigo === codigo);
    if (planta) {
        return planta;
    }

    // Si no se encuentra el objeto, devuelve null
    return null;
}


function decodificarMapa(codigoMapa, filas, columnas) {
    const matrizCultivos = [];

    // Inicializa la matriz con filas y columnas vacías
    for (let i = 0; i < filas; i++) {
        matrizCultivos[i] = [];
        for (let j = 0; j < columnas; j++) {
            matrizCultivos[i][j] = 0;
        }
    }

    let fila = 0;
    let columna = 0;
    let i = 0;

    while (i < codigoMapa.length) {
        const elemento = codigoMapa[i];

        // Si es un string, añade el cultivo a la matriz
        matrizCultivos[fila][columna] = elemento;

        columna++;
        if (columna >= columnas) {
            columna = 0;
            fila++;
        }
        i += 1;
    }
    return matrizCultivos;
}


function crearMapaCodificado(filas, columnas, codigoMapa) {

    // Inicializar las capas
    const capaPlantas = Array(filas).fill(null).map(() => Array(columnas).fill(null));
    const capaColores = Array(filas).fill(null).map(() => Array(columnas).fill(null));
    const capaModificadores = Array(filas).fill(null).map(() => Array(columnas).fill(null));
    const capaObjetos = Array(filas).fill(null).map(() => Array(columnas).fill(null));
    const capaAreaEfecto = Array(filas).fill(false).map(() => Array(columnas).fill(false));
    const capaUvTiempo = Array(filas).fill(0).map(() => Array(columnas).fill(0));
    const capaUvCosecha = Array(filas).fill(0).map(() => Array(columnas).fill(0));
    const capaFertilizanteTiempo = Array(filas).fill(0).map(() => Array(columnas).fill(0));
    const capaFertilizanteCosecha = Array(filas).fill(0).map(() => Array(columnas).fill(0));
    const capaAspersor = Array(filas).fill(0).map(() => Array(columnas).fill(0));
    let capaCodificacion = Array(filas / 2).fill(0).map(() => Array(columnas / 2).fill(0));

    let creacionIncorrecta = 0;


    function llenarCapaObjetos(fila, columna, objeto, columnas, filas) {

        const posicionesRelativasObjetos = getPosicionesRelativas(fila * columnas + columna, objeto.forma, columnas, filas, false);

        const hayCeldaOcupada = posicionesRelativasObjetos.some(([filaRelativa, columnaRelativa]) => {
            const filaActual = filaRelativa;
            const columnaActual = columnaRelativa;

            if (capaObjetos[filaActual][columnaActual] !== undefined && capaObjetos[filaActual][columnaActual] !== null) {
                // Acción opcional si se desea ejecutar algo al detectar la celda ocupada (opcional)
                return true; // Detenemos la iteración de some()
            } else {
                capaObjetos[filaActual][columnaActual] = objeto.tipoObjeto;
                capaColores[filaActual][columnaActual] = objeto.color;
                return false; // Seguimos iterando
            }
        });

        if (hayCeldaOcupada) {
            return true;
        } else {
            return false;
        }


    }

    function llenarCapasAE(fila, columna, modificador, columnas, filas) {
        const posicionesRelativasObjetos = getPosicionesRelativas(fila * columnas + columna, modificador.forma, columnas, filas, true);
        posicionesRelativasObjetos.forEach(([filaRelativa, columnaRelativa]) => {
            const filaActual = filaRelativa;
            const columnaActual = columnaRelativa;
            capaAreaEfecto[filaActual][columnaActual] = true;
            switch (modificador.tipoModificador) {
                case "UV-Lights":
                    capaUvTiempo[filaActual][columnaActual] = modificador.efectoTiempo;
                    capaUvCosecha[filaActual][columnaActual] = modificador.efectoCosecha;
                    break;
                case "Fertilizer":
                    capaFertilizanteTiempo[filaActual][columnaActual] = modificador.efectoTiempo;
                    capaFertilizanteCosecha[filaActual][columnaActual] = modificador.efectoCosecha;
                    break;
                case "Sprinklers":
                    capaAspersor[filaActual][columnaActual] = modificador.efectoTiempo;
                    break;
                default:
                    console.warn("Tipo de modificador desconocido.");
                    break;
            }
        });
    }

    //const codigoMapaInput = mapaAleatorio.capaCodificacion.flat();
    //const codigoMapaInput = ["S",0, 0, 0,  0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const f = filas / 2; // Número de filas
    const c = columnas / 2; // Número de columnas
    const matriz = decodificarMapa(codigoMapa, f, c);


    for (let i = 0; i < matriz.length; i++) {
        for (let j = 0; j < matriz[i].length; j++) {
            const fila = i * 2;
            const columna = j * 2;
            const objeto = obtenerObjetoPorCodigo(matriz[i][j]);

            if (objeto == null) {
                //console.log("objeto nulo");
                continue;
            }

            const claseObjeto = objeto.constructor.name;

            if (llenarCapaObjetos(fila, columna, objeto, columnas, filas, "solido")) {
                creacionIncorrecta = 1;
                //console.warn("Codificación incorrecta, no se pueden sobreponer modificadores.",fila, columna)
                capaCodificacion = matriz;
                return {
                    capaPlantas,
                    capaColores,
                    capaModificadores,
                    capaAreaEfecto,
                    capaObjetos,
                    capaUvTiempo,
                    capaUvCosecha,
                    capaFertilizanteTiempo,
                    capaFertilizanteCosecha,
                    capaAspersor,
                    capaCodificacion,
                    creacionIncorrecta
                }

            } else {

                if (claseObjeto == "Modificador") {

                    capaModificadores[fila][columna] = objeto;
                    llenarCapasAE(fila, columna, objeto, columnas, filas, "solido");
                } else if (claseObjeto == "Planta") {
                    llenarCapaObjetos(fila, columna, objeto, columnas, filas, "solido");
                    capaPlantas[fila][columna] = objeto;
                }
            }

        }

    }

    capaCodificacion = crearCodigoMapa(capaPlantas, capaCodificacion);
    capaCodificacion = crearCodigoMapa(capaModificadores, capaCodificacion);


    /* console.log("Mapa codificado: ", {
        capaPlantas,
        capaColores,
        capaModificadores,
        capaAreaEfecto,
        capaObjetos,
        capaUvTiempo,
        capaUvCosecha,
        capaFertilizanteTiempo,
        capaFertilizanteCosecha,
        capaAspersor,
        capaCodificacion,
        creacionIncorrecta
    }); */


    return {
        capaPlantas,
        capaColores,
        capaModificadores,
        capaAreaEfecto,
        capaObjetos,
        capaUvTiempo,
        capaUvCosecha,
        capaFertilizanteTiempo,
        capaFertilizanteCosecha,
        capaAspersor,
        capaCodificacion,
        creacionIncorrecta
    };

}



// Función para calcular la cosecha
function calcularCosecha(capaPlantas, capaAreaEfecto, capaFertilizanteCosecha, capaUvCosecha, capaUvTiempo, capaFertilizanteTiempo, capaAspersor, capaCodificacion) {
    const capaCosecha = [];
    const capaTiempo = [];
    const listaCosecha = [];
    let id = 0;
    for (let i = 0; i < capaPlantas.length; i++) {
        capaCosecha[i] = [];
        capaTiempo[i] = [];
        for (let j = 0; j < capaPlantas[i].length; j++) {
            if (capaPlantas[i][j]) {

                capaCosecha[i][j] = capaPlantas[i][j].cantidadCosecha;
                id++;
                listaCosecha.push({
                    id: id, planta: capaPlantas[i][j].nombre,
                    cosecha: capaPlantas[i][j].cantidadCosecha,
                    tiempoCosecha: capaPlantas[i][j].tiempoCosecha,
                    utUnitaria: capaPlantas[i][j].utUnitaria,
                    modCosecha: 1,
                    modTiempo: 1,
                    totalCosecha: capaPlantas[i][j].cantidadCosecha,
                    totalTiempo: capaPlantas[i][j].tiempoCosecha,
                    totalUtilidad: capaPlantas[i][j].cantidadCosecha * capaPlantas[i][j].utUnitaria,
                    uPH: Math.round(capaPlantas[i][j].uPH * 100) / 100
                });
            } else {
                capaCosecha[i][j] = 0;
                capaTiempo[i][j] = 0;
            }

            if (capaPlantas[i][j] && capaAreaEfecto[i][j]) { // Verificar si la celda está afectada por un AreaEfecto
                if (capaPlantas[i][j].tipo == "No consumible") {
                    capaCosecha[i][j] = capaCosecha[i][j] * (1 + capaFertilizanteCosecha[i][j] + capaUvCosecha[i][j]);
                    capaTiempo[i][j] = capaPlantas[i][j].tiempoCosecha * (1 + capaAspersor[i][j]);
                    listaCosecha[id - 1].modCosecha = 1 + (capaFertilizanteCosecha[i][j] + capaUvCosecha[i][j]);
                    listaCosecha[id - 1].totalCosecha = Math.round(listaCosecha[id - 1].cosecha * (1 + capaFertilizanteCosecha[i][j] + capaUvCosecha[i][j]));
                    listaCosecha[id - 1].modTiempo = (1 + capaAspersor[i][j])
                } else if (capaPlantas[i][j].tipo == "Consumible") {
                    capaTiempo[i][j] = capaPlantas[i][j].tiempoCosecha * (1 + capaFertilizanteTiempo[i][j] + capaUvTiempo[i][j] + capaFertilizanteTiempo[i][j] + capaAspersor[i][j]);
                    listaCosecha[id - 1].modTiempo = (1 + capaUvTiempo[i][j]) * (1 + capaFertilizanteTiempo[i][j]) * (1 + capaAspersor[i][j]);
                }
                listaCosecha[id - 1].totalTiempo = listaCosecha[id - 1].totalTiempo * listaCosecha[id - 1].modTiempo;
                listaCosecha[id - 1].totalUtilidad = Math.round(
                    listaCosecha[id - 1].totalCosecha *
                    listaCosecha[id - 1].utUnitaria) *
                    100
                    / 100;
                listaCosecha[id - 1].uPH = Math.round(
                    capaPlantas[i][j].utUnitaria *
                    listaCosecha[id - 1].totalCosecha /
                    listaCosecha[id - 1].totalTiempo *
                    100
                ) / 100;

            }

        }
    }


    // Calcular la cosecha total
    let cosechaTotal = 0;
    for (let i = 0; i < capaCosecha.length; i++) {
        for (let j = 0; j < capaCosecha[i].length; j++) {
            cosechaTotal += capaCosecha[i][j];
        }
    }

    let cosechaUph = 0;
    for (let i = 0; i < listaCosecha.length; i++) {
        cosechaUph += listaCosecha[i].uPH;
    }

    cosechaUph = Math.round(cosechaUph * 100) / 100;

    let totalUtilidad = 0;
    for (let i = 0; i < listaCosecha.length; i++) {
        totalUtilidad += listaCosecha[i].totalUtilidad;
    }

    totalUtilidad = Math.round(totalUtilidad * 100) / 100;


    return { cosechaTotal, cosechaUph, listaCosecha };
}



function guardarDatos(nombreArchivo, data) {
    fs.writeFile(nombreArchivo, JSON.stringify(data), 'utf8', (err) => {
        if (err) {
            console.error("Error al guardar el archivo:", err);
        } else {
            console.log(`Archivo ${nombreArchivo} guardado correctamente.`);
        }
    });
}


function generarEnteroAleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


//#############################




// Función que se ejecuta al hacer click en el botón
function generarMapaYCalcular(filas = 10, columnas = 10, plantas = 1, modificadores = 1) {

    // Generar el mapa aleatorio
    const mapaReconstruido = crearMapaAleatorio(filas, columnas, plantas, modificadores);

    // Calcular la cosechacapaPlantas, capaAreaEfecto, capaModCosecha, capaModTiempo, capaFertilizanteCosecha, capaUvCosecha, capaUvTiempo,capaFertilizanteTiempo,capaAspersor)
    const cosechaTotal = calcularCosecha(
        mapaReconstruido.capaPlantas,
        mapaReconstruido.capaAreaEfecto,
        mapaReconstruido.capaFertilizanteCosecha,
        mapaReconstruido.capaUvCosecha,
        mapaReconstruido.capaUvTiempo,
        mapaReconstruido.capaFertilizanteTiempo,
        mapaReconstruido.capaAspersor,
        mapaReconstruido.capaCodificacion
    );


    //console.log(mapaAleatorio);
    //console.log("UPH", cosechaTotal.cosechaUph, "Mapa", mapaAleatorio.capaCodificacion.flat());

    //guardarDatos('codigo.txt', { "UPH": cosechaTotal.cosechaUph, "Mapa": mapaAleatorio.capaCodificacion.flat() });
    return { UPH: cosechaTotal.cosechaUph, Mapa: mapaReconstruido.capaCodificacion.flat() }
}

let resultados = [];
let UPHprevio = 0;

filas = 10;
columnas = 10;


//for (let index = 0; index < 1e6; index++) {

for (let index = 0; index < 10; index++) {
    let randPlantas = generarEnteroAleatorio(1, filas / 2 * columnas / 2)
    let randMods = generarEnteroAleatorio(0, (filas / 2 * columnas / 2) * .8)

    while (randPlantas + randMods > filas / 2 * columnas / 2) {
        randPlantas = generarEnteroAleatorio(1, filas / 2 * columnas / 2)
        randMods = generarEnteroAleatorio(0, (filas / 2 * columnas / 2) * .8)
    }

    let resultado = generarMapaYCalcular(filas, columnas, randPlantas, randMods)

    //resultado = resultado.UPHprevio = UPHprevio;

    //console.log(index,": ", UPHprevio, resultado.UPH);

    if (resultado.UPH > UPHprevio) {
        resultados.push(resultado);
        UPHprevio = resultado.UPH;
    } else {

        //resultados.push(resultado);
    }

    if (index % 10000 === 0) {
        console.log(`Iteración: ${index}`, "Uph Max: ", UPHprevio);
    }

}

guardarDatos('codigo.json', resultados);




//##############################


const mapaCodificado = crearMapaCodificado(
    10,
    10,
    ["Z", "S", "U", "U", "GGE", "C", "C", "S", "Z", 0, "S", "N", "U", "F", "S", "Z", "C", "N", "N", "P", "N", 0, "N", "S", "F"]
);


const cosechaTotalCodificado = calcularCosecha(
    mapaCodificado.capaPlantas,
    mapaCodificado.capaAreaEfecto,
    mapaCodificado.capaFertilizanteCosecha,
    mapaCodificado.capaUvCosecha,
    mapaCodificado.capaUvTiempo,
    mapaCodificado.capaFertilizanteTiempo,
    mapaCodificado.capaAspersor,
    mapaCodificado.capaCodificacion
);


if (mapaCodificado.creacionIncorrecta == 1) {
    cosechaTotalCodificado.cosechaUph = 0;
}

console.log("cosecha codificado btn: ", cosechaTotalCodificado.cosechaUph, mapaCodificado.capaCodificacion, mapaCodificado.creacionIncorrecta);




//#######################
