
const MODIFICADOR = "M";
const PLANTA = "P";
const AREA_EFECTO = "E";

// Define el tamaño de la celda (en píxeles)
const tamanoCelda = 10;



const svg1 = d3.select("#mapa-svg");
const svg2 = d3.select("#mapa-svg-codificado");

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
    ["E", "E", "E", "E", false, false],
    ["E", "E", "E", "E", false, false],
    ["E", "E", "E", "E", "M", "M"],
    ["E", "E", "E", "E", "M", "M"],
    ["E", "E", "E", "E", "M", "M"],
    ["E", "E", "E", "E", "M", "M"],
    ["E", "E", "E", "E", false, false],
    ["E", "E", "E", "E", false, false],
];

const barraE = [
    [false, false, "E", "E", "E", "E"],
    [false, false, "E", "E", "E", "E"],
    ["M", "M", "E", "E", "E", "E"],
    ["M", "M", "E", "E", "E", "E"],
    ["M", "M", "E", "E", "E", "E"],
    ["M", "M", "E", "E", "E", "E"],
    [false, false, "E", "E", "E", "E"],
    [false, false, "E", "E", "E", "E"]
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
    //  new Planta("Sandía", "Consumible", 140, 140, 140 / 6, 6, 1, "#03a572", unidad, "S"),
    new Planta("Calabaza", "Consumible", 50, 50, 50 / 2, 2, 1, "#FF7518", unidad, "C"),
    //   new Planta("Zanahoria", "No consumible", 1, 20, 20 / 2, 2, 20, "#FFC000", unidad, "Z"),
    //   new Planta("Papa", "No consumible", 1, 11, 11 / 1, 1, 11, "#4C3228", unidad, "P"),
    //   new Planta("Fresa", "No consumible", 2, 10, 10 / 2, 2, 5, "#e42e67", unidad, "F"),
    //   new Planta("Uva", "No consumible", 4, 24, 24 / 2, 2, 6, "#4c00b0", unidad, "U"),
    //  new Planta("Nabo", "No consumible", 1, 22, 22 / 2, 2, 22, "#c3c8ac", unidad, "N"),
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
        throw new Error("El número de plantas o modificadores es mayor que el espacio disponible en el mapa.");
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






function getListado(capa) {
    // Usando el método flat() con una profundidad de 1
    const listadoObjetos = capa.flat(1).filter(elemento => elemento !== null);
    return listadoObjetos;
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

    //console.log(listaCosecha);
    document.getElementById('totalCosechado').textContent = cosechaTotal;
    document.getElementById('cosechaUph').textContent = cosechaUph;
    document.getElementById('utilidadTotal').textContent = totalUtilidad;
    document.getElementById('coidgoMapaAleatorio').textContent = capaCodificacion;


    return { cosechaTotal, cosechaUph, listaCosecha };
}





function dibujarAreaEfectoSVG(svg, capaAreaEfecto, tamanoCelda) {
    // Crea los datos para las celdas de área de efecto
    const data = capaAreaEfecto.flatMap((fila, i) => fila.map((valor, j) => ({
        fila: i,
        columna: j,
        valor: valor
    })));

    //console.log("dataAE: ", data);


    // Selecciona las celdas de área de efecto existentes o crea nuevas para este modificador
    const areaEfectoCeldas = svg.selectAll(".area-efecto")
        .data(data.filter(d => d.valor)); // Filtra los datos solo para AREA_EFECTO


    // Actualiza las celdas existentes
    areaEfectoCeldas
        .attr("x", d => d.columna * tamanoCelda)
        .attr("y", d => d.fila * tamanoCelda);

    // Añadir nuevas celdas
    areaEfectoCeldas.enter()
        .append("rect")
        .attr("class", "area-efecto")
        .attr("x", d => d.columna * tamanoCelda)
        .attr("y", d => d.fila * tamanoCelda)
        .attr("width", tamanoCelda)
        .attr("height", tamanoCelda)
        .style("fill", "rgba(255, 0, 0, 0.25)"); // Color semitransparente rojo



    // Eliminar las celdas que ya no existen
    areaEfectoCeldas.exit().remove();
}

// Dibuja el mapa
// Función para dibujar el mapa en SVG (modificada)
function dibujarMapaSVG(svg, capaColores, capaModificadores, capaAreaEfecto, capaObjetos, filas, columnas) { // Recibe la capa de area de efecto

    svg.selectAll(".area-efecto").remove();

    // Actualizar las celdas existentes o crear nuevas

    const celdas = svg.selectAll(".celda")
        .data(capaObjetos.flatMap((fila, i) => fila.map((objeto, j) => ({
            fila: i,
            columna: j,
            planta: objeto === PLANTA, // Verifica si la celda contiene una PLANTA
            objeto: objeto
        }))));

    //console.log("celdas:", celdas);

    // Actualizar las celdas existentes
    celdas
        .attr("x", d => d.columna * tamanoCelda)
        .attr("y", d => d.fila * tamanoCelda)
        .style("fill", d => {
            if (d.planta) {
                return capaColores[d.fila][d.columna];
            } else if (d.objeto === MODIFICADOR) {
                return "red";
            } else {
                return "gray";
            }
        });

    // Añadir nuevas celdas
    celdas.enter()
        .append("rect")
        .attr("class", "celda")
        .attr("x", d => d.columna * tamanoCelda)
        .attr("y", d => d.fila * tamanoCelda)
        .attr("width", tamanoCelda)
        .attr("height", tamanoCelda)
        .style("fill", d => {
            if (d.planta) {
                return capaColores[d.fila][d.columna];
            } else if (d.objeto === MODIFICADOR) {
                return "red";
            } else {
                return "gray";
            }
        });

    // Eliminar las celdas que ya no existen
    celdas.exit().remove();

    // Dibujar los áreas de efecto de los modificadores (igual que antes)
    capaModificadores.forEach((fila, i) => {
        fila.forEach((modificador, j) => {
            if (modificador) {
                dibujarAreaEfectoSVG(svg, capaAreaEfecto, tamanoCelda);
            }
        });
    });

    // Calcular el centro del SVG
    const centroX = columnas * tamanoCelda / 2;
    const centroY = filas * tamanoCelda / 2;

    svg
        .attr("width", columnas * tamanoCelda)
        .attr("height", filas * tamanoCelda)
    //.attr("transform", `rotate(45, ${columnas * tamanoCelda / 2}, ${filas * tamanoCelda / 2})`);
}



//#############################




// Crear un mapa aleatorio de 10x10 con 10 plantas y 5 modificadores
const filas = 8;
const columnas = 8;
const plantas = 1;
const modificadores = 1;

const mapaAleatorio = crearMapaAleatorio(filas, columnas, plantas, modificadores);
const capaPlantas = mapaAleatorio.capaPlantas;
const capaColores = mapaAleatorio.capaColores;
const capaModificadores = mapaAleatorio.capaModificadores;
const capaAreaEfecto = mapaAleatorio.capaAreaEfecto;
const capaObjetos = mapaAleatorio.capaObjetos;
const capaFertilizanteCosecha = mapaAleatorio.capaFertilizanteCosecha;
const capaUvCosecha = mapaAleatorio.capaUvCosecha;
const capaUvTiempo = mapaAleatorio.capaUvTiempo;
const capaFertilizanteTiempo = mapaAleatorio.capaFertilizanteTiempo;
const capaAspersor = mapaAleatorio.capaAspersor;

//function calcularCosecha(capaPlantas, capaAreaEfecto, capaModCosecha, capaModTiempo, capaFertilizanteCosecha, capaUvCosecha, capaUvTiempo,capaFertilizanteTiempo,capaAspersor )
const cosechaTotal = calcularCosecha(capaPlantas, capaAreaEfecto, capaFertilizanteCosecha, capaUvCosecha, capaUvTiempo, capaFertilizanteTiempo, capaAspersor);



function actualizarTablaPlantas(cosechaTotal) {
    const listadoPlantas = document.getElementById("listado-plantas");
    listadoPlantas.innerHTML = ""; // Limpiar la tabla

    // Agregar la fila de encabezados
    const encabezados = listadoPlantas.insertRow();
    encabezados.insertCell().textContent = "ID";
    encabezados.insertCell().textContent = "Planta";
    encabezados.insertCell().textContent = "Cosecha";
    encabezados.insertCell().textContent = "UT Unitaria";
    encabezados.insertCell().textContent = "Mod Cosecha";
    encabezados.insertCell().textContent = "Total Cosecha";
    encabezados.insertCell().textContent = "Total Utilidad";
    encabezados.insertCell().textContent = "Tiempo Cosecha";
    encabezados.insertCell().textContent = "Mod Tiempo";
    encabezados.insertCell().textContent = "Total Tiempo";
    encabezados.insertCell().textContent = "UPH";

    // Calcular la suma de cada columna
    let cuentaId = 0;
    let sumaCosecha = 0;
    let sumaTotalCosecha = 0;
    let sumaPrelUtilidad = 0;
    let sumaTotalUtilidad = 0;
    let sumaUPH = 0;

    cosechaTotal.listaCosecha.forEach(elemento => {
        cuentaId++;
        sumaCosecha += parseFloat(elemento.cosecha);
        sumaTotalCosecha += parseFloat(elemento.totalCosecha);
        sumaPrelUtilidad += parseInt(elemento.utUnitaria * elemento.cosecha);
        sumaTotalUtilidad += parseFloat(elemento.totalUtilidad);
        sumaUPH += parseFloat(elemento.uPH);
    });



    cosechaTotal.listaCosecha.forEach(elemento => {
        // Crea un nuevo elemento <li> para cada producto
        const fila = listadoPlantas.insertRow();

        // Crea una celda para cada propiedad del producto
        fila.insertCell().textContent = elemento.id;
        fila.insertCell().textContent = elemento.planta;
        fila.insertCell().textContent = elemento.cosecha;
        fila.insertCell().textContent = elemento.utUnitaria;
        fila.insertCell().textContent = elemento.modCosecha;
        fila.insertCell().textContent = elemento.totalCosecha;
        fila.insertCell().textContent = elemento.totalUtilidad;
        fila.insertCell().textContent = elemento.tiempoCosecha;
        fila.insertCell().textContent = Math.round(elemento.modTiempo * 100) / 100;
        fila.insertCell().textContent = Math.round(elemento.totalTiempo * 100) / 100;
        fila.insertCell().textContent = elemento.uPH;
    });

    // Agregar la fila de suma
    const sumaFila = listadoPlantas.insertRow();
    sumaFila.insertCell().textContent = "Total";
    sumaFila.insertCell().textContent = cuentaId;
    sumaFila.insertCell().textContent = sumaCosecha;
    sumaFila.insertCell().textContent = sumaPrelUtilidad;; // Deja la columna UT Unitaria vacía
    sumaFila.insertCell(); // Deja la columna Mod Cosecha vacía
    sumaFila.insertCell().textContent = sumaTotalCosecha;
    sumaFila.insertCell().textContent = sumaTotalUtilidad;
    sumaFila.insertCell(); // Deja la columna Tiempo Cosecha vacía
    sumaFila.insertCell(); // Deja la columna Mod Tiempo vacía
    sumaFila.insertCell(); // Deja la columna Total Tiempo vacía
    sumaFila.insertCell().textContent = Math.round(sumaUPH * 100) / 100;

}


actualizarTablaPlantas(cosechaTotal);


const listaModificadores = getListado(mapaAleatorio.capaModificadores);

// Función para actualizar la tabla de modificadores
function actualizarTablaModificadores(listaModificadores) {
    const listaPlantas = document.getElementById("listado-modificadores");
    listaPlantas.innerHTML = ""; // Limpiar la tabla

    // Agregar la fila de encabezados
    const encabezados = listaPlantas.insertRow();
    encabezados.insertCell().textContent = "ID";
    encabezados.insertCell().textContent = "Nombre";
    encabezados.insertCell().textContent = "Tipo";
    encabezados.insertCell().textContent = "Costo";
    encabezados.insertCell().textContent = "Efecto Tiempo";
    encabezados.insertCell().textContent = "Efecto Cosecha";

    listaModificadores.forEach(elemento => {
        // Crea un nuevo elemento <li> para cada producto
        const fila = listaPlantas.insertRow();

        // Crea una celda para cada propiedad del producto
        fila.insertCell().textContent = elemento.id;
        fila.insertCell().textContent = elemento.nombre;
        fila.insertCell().textContent = elemento.tipo;
        fila.insertCell().textContent = elemento.costo;
        fila.insertCell().textContent = Math.round(elemento.efectoTiempo * 100) / 100;
        fila.insertCell().textContent = elemento.efectoCosecha;
    });


    const sumaFilaMods = listaPlantas.insertRow();
    sumaFilaMods.insertCell();
    sumaFilaMods.insertCell();
    sumaFilaMods.insertCell();
    sumaFilaMods.insertCell();
    sumaFilaMods.insertCell();
    sumaFilaMods.insertCell();
}

actualizarTablaModificadores(listaModificadores);


dibujarMapaSVG(svg1, capaColores, capaModificadores, capaAreaEfecto, capaObjetos, filas, columnas);




// Función que se ejecuta al hacer click en el botón
function generarMapaYCalcular(filas = 10, columnas = 10, plantas = 1, modificadores = 1) {

    // Generar el mapa aleatorio
    const mapaAleatorio = crearMapaAleatorio(filas, columnas, plantas, modificadores);

    // Calcular la cosechacapaPlantas, capaAreaEfecto, capaModCosecha, capaModTiempo, capaFertilizanteCosecha, capaUvCosecha, capaUvTiempo,capaFertilizanteTiempo,capaAspersor)
    const cosechaTotal = calcularCosecha(
        mapaAleatorio.capaPlantas,
        mapaAleatorio.capaAreaEfecto,
        mapaAleatorio.capaFertilizanteCosecha,
        mapaAleatorio.capaUvCosecha,
        mapaAleatorio.capaUvTiempo,
        mapaAleatorio.capaFertilizanteTiempo,
        mapaAleatorio.capaAspersor,
        mapaAleatorio.capaCodificacion
    );


    console.log("Mapa aleatorio: ", mapaAleatorio);
    console.log("Aleatorio Cosecha total:", cosechaTotal);

    // Actualizar las tablas
    actualizarTablaPlantas(cosechaTotal);
    actualizarTablaModificadores(getListado(mapaAleatorio.capaModificadores));


    dibujarMapaSVG(svg1, mapaAleatorio.capaColores, mapaAleatorio.capaModificadores, mapaAleatorio.capaAreaEfecto, mapaAleatorio.capaObjetos, filas, columnas);

    return mapaAleatorio;
}


function generarMapaYCalcularGA(filas = 10, columnas = 10, plantas = 1, modificadores = 1) {

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



// Función para crear un mapa aleatorio
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
                //console.warn("Codificación incorrecta, no se pueden sobreponer modificadores.", fila, columna, objeto)
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
                    capaCodificacion
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
        capaCodificacion
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
        capaCodificacion
    };

}




const mapaCodificado = crearMapaCodificado(10, 10, mapaAleatorio.capaCodificacion.flat());
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


const resultadoDiv = document.getElementById("resultadoUPH");
resultadoDiv.innerHTML = "UPH: " + JSON.stringify(cosechaTotalCodificado.cosechaUph);
dibujarMapaSVG(svg2, mapaCodificado.capaColores, mapaCodificado.capaModificadores, mapaCodificado.capaAreaEfecto, mapaCodificado.capaObjetos, filas, columnas);



function createTableUPHMapa(data, div) {
    document.getElementById(div).innerHTML = '';

    const table = document.createElement('table');
    table.className = "table-ga";
    const headerRow = table.insertRow();



    // Crear encabezado de la tabla
    headerRow.insertCell().textContent = "UPH";
    for (let i = 1; i <= data[0].Mapa.length; i++) {
        headerRow.insertCell().textContent = `Mapa${i}`;
    }

    // Crear filas de datos
    data.forEach(item => {
        const row = table.insertRow();
        row.insertCell().textContent = item.UPH;
        item.Mapa.forEach(mapItem => {
            row.insertCell().textContent = mapItem;
        });
    });

    document.getElementById(div).appendChild(table);

}



function createTableMejoresResultados(data, div) {
    document.getElementById(div).innerHTML = '';

    const table = document.createElement('table');
    table.className = "table-ga";
    const headerRow = table.insertRow();

    // Crear encabezado de la tabla
    headerRow.insertCell().textContent = "UPH";
    headerRow.insertCell().textContent = "Mapa";

    // Crear filas de datos
    data.forEach(item => {
        const row = table.insertRow();
        row.insertCell().textContent = item.UPH;

        // Join Mapa elements with commas
        const mapaString = item.Mapa.join(', ');
        row.insertCell().textContent = mapaString;
    });

    document.getElementById(div).appendChild(table);

}


function createTableMutaciones(data, div) {
    document.getElementById(div).innerHTML = '';

    const table = document.createElement('table');
    table.className = "table-ga";
    const headerRow = table.insertRow();

    // Crear encabezado de la tabla
    for (let i = 0; i < data[0].length; i++) {
        headerRow.insertCell().textContent = `Columna ${i + 1}`; // O puedes poner nombres descriptivos aquí.
    }

    // Crear filas de datos
    data.forEach(row => {
        if (Array.isArray(row) && row.length === data[0].length) { //Verifica que es un array y que tiene la misma longitud
            const tableRow = table.insertRow();
            row.forEach(cellData => {
                const cell = tableRow.insertCell();
                cell.textContent = cellData;
            });
        } else {
            console.error("Fila inválida:", row); // Imprime las filas problematicas
        }
    });

    document.getElementById(div).appendChild(table);

}


function createTableG(data, div) {

    document.getElementById(div).innerHTML = '';

    const table = document.createElement('table');
    table.className = "table-ga";

    const headerRow = table.insertRow();
    headerRow.insertCell().textContent = 'Columna';
    headerRow.insertCell().textContent = 'Valor';

    data.forEach(item => {
        const row = table.insertRow();
        row.insertCell().textContent = item.Columna;
        row.insertCell().textContent = item.Valor;
    });

    document.getElementById(div).appendChild(table);
}

// Agregar el evento click al botón
const botonGenerar = document.getElementById("boton-generar");

botonGenerar.addEventListener("click", function () {

    let filas =parseInt(document.getElementById("filas").value);
    let columnas = parseInt(document.getElementById("columnas").value);

    const nuevoMapa = generarMapaYCalcular(
        filas,
        columnas,
        parseInt(document.getElementById("plantas").value),
        parseInt(document.getElementById("modificadores").value)
    );

    const mapaCodificado = crearMapaCodificado(filas, columnas, nuevoMapa.capaCodificacion.flat());

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

    console.log("cosecha codificado btn: ", cosechaTotalCodificado);

    console.log("mapaCodificado codificado btn: ", mapaCodificado);



});

let myChart;

function updateFitPlot(data){

    if (myChart) {
        myChart.destroy();
    }



    const uphValues = data.slice().reverse().map(item => item.UPH);


    // Chart.js configuration
    const ctx = document.getElementById('myChart').getContext('2d');
    myChart = new Chart(ctx, { // Assign the new chart instance to myChart
        type: 'line',
        data: {
            labels: data.map((item, index) => index + 1),
            datasets: [{
                label: 'UPH Values',
                data: uphValues,
                borderColor: 'blue',
                fill: false
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Data Point'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'UPH'
                    }
                }
            }
        }
    });
}


const botonCalcularCodificado = document.getElementById("calcularUPH");


botonCalcularCodificado.addEventListener("click", function () {

    let codigoMapa = document.getElementById("codigoMapa").value
    const filas = parseInt(document.getElementById("anchoMapa").value)
    const columnas = parseInt(document.getElementById("largoMapa").value)

    codigoMapa = prepararTextoCodigoMapa(codigoMapa)

    if (codigoMapa.length !== filas / 2 * columnas / 2) {

        console.log("La longitud de la codificación no coincide con las filas y columnas del mapa");
        alert("La longitud de la codificación no coincide con las filas y columnas del mapa");

    } else {
        const mapaCodificado = crearMapaCodificado(filas, columnas, codigoMapa);

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

        console.log("cosecha codificado btn: ", cosechaTotalCodificado);
        console.log("crearMapaCodificado  btn: ", mapaCodificado);


        const resultadoDiv = document.getElementById("resultadoUPH");
        resultadoDiv.innerHTML = "UPH: " + JSON.stringify(cosechaTotalCodificado.cosechaUph);


        dibujarMapaSVG(svg2, mapaCodificado.capaColores, mapaCodificado.capaModificadores, mapaCodificado.capaAreaEfecto, mapaCodificado.capaObjetos, filas, columnas);

    }


});


function prepararTextoCodigoMapa(textBox) {
    return textBox.replace(/\s/g, '').split(',')
        .map(elemento =>
            typeof elemento === 'string' ? elemento.replace(/"/g, '').toUpperCase() : elemento
        );
}




console.log("Mapa aleatorio: ", mapaAleatorio);
console.log("Aleatorio Cosecha total:", cosechaTotal);



function generarEnteroAleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Crear población y fitness

function crearPoblacion(filas, columnas, poblacion) {

    let resultados = [];

    for (let index = 0; index < poblacion; index++) {
        let randPlantas = generarEnteroAleatorio(1, filas / 2 * columnas / 2)
        let randMods = generarEnteroAleatorio(0, (filas / 2 * columnas / 2) * .8)

        while (randPlantas + randMods > filas / 2 * columnas / 2) {
            randPlantas = generarEnteroAleatorio(1, filas / 2 * columnas / 2)
            randMods = generarEnteroAleatorio(0, (filas / 2 * columnas / 2) * .8)
        }

        let resultado = crearMapaAleatorio(filas, columnas, randPlantas, randMods);

        resultados.push(resultado);

        if (index % 10000 === 0) {
            //console.log(`Iteración: ${index}`, );
        }

    }

    return resultados;

}

function evaluar(poblacion) {

    let evaluado = [];

    for (let index = 0; index < poblacion.length; index++) {

        const cosechaTotalCodificado = calcularCosecha(
            poblacion[index].capaPlantas,
            poblacion[index].capaAreaEfecto,
            poblacion[index].capaFertilizanteCosecha,
            poblacion[index].capaUvCosecha,
            poblacion[index].capaUvTiempo,
            poblacion[index].capaFertilizanteTiempo,
            poblacion[index].capaAspersor,
            poblacion[index].capaCodificacion
        );
        evaluado.push({ UPH: cosechaTotalCodificado.cosechaUph, Mapa: poblacion[index].capaCodificacion.flat() });
    }

    return (evaluado);
}

function naturalSelection(jsonData, n) {
    const data = jsonData.sort((a, b) => b.UPH - a.UPH);
    return { UPH: data.slice(0, n).map(resultado => resultado.UPH), Mapa: data.slice(0, n).map(resultado => resultado.Mapa) };
}


function mutacion(seleccion, elementosAMutar) {
    cambiar = [];
    for (let i = 0; i < elementosAMutar; i++) {
        elemento = seleccion[0].length;
        gen = seleccion.length;
        let fila = generarEnteroAleatorio(0, gen - 1);
        let valor = generarEnteroAleatorio(0, elemento - 1);
        cambiar.push({ Columna: valor, Valor: seleccion[fila][valor] });
    }
    //console.log("cambiar: ", cambiar);
    return cambiar;
}

function reproducir(filas, columnas, poblacion, mutaciones) {

    nuevaPoblacion = crearPoblacion(filas, columnas, poblacion);
    nuevaPoblacion = nuevaPoblacion.map(nuevaPoblacion => nuevaPoblacion.capaCodificacion.flat());

    const resultado = [];

    for (let i = 0; i < poblacion; i++) {
        for (let j = 0; j < mutaciones.length; j++) {

            nuevaPoblacion[i][mutaciones[j].Columna] = mutaciones[j].Valor;
        }
        //console.log(nuevaPoblacion[i]);
        resultado.push(crearMapaCodificado(filas, columnas, nuevaPoblacion[i]));
    }
    return resultado;
}


nPoblacion = 5000
elementosAMutar = 15
tamSeleccion = 1
mejoresPuntuaciones = []
nf = 8;
nc = 8;

poblacion = crearPoblacion(nf, nc, nPoblacion);

evaluado = evaluar(poblacion);
console.log("evluado:", evaluado[0].UPH, "Mapa", evaluado[0].Mapa);

createTableUPHMapa(evaluado, "evaluacion");


seleccion = naturalSelection(evaluado, tamSeleccion);
console.log("seleccionado: ", seleccion);
document.getElementById("seleccion").innerHTML = JSON.stringify(seleccion);


mutaciones = mutacion(seleccion.Mapa, elementosAMutar);

createTableG(mutaciones, "mutaciones")

reproduccion = reproducir(nf, nc, nPoblacion, mutaciones);

createTableMutaciones(reproduccion.map(reproduccion => reproduccion.capaCodificacion.flat()), "reproduccion");


const botonGA = document.getElementById("generacionbtn");


botonGA.addEventListener("click", function () {

    evaluado = evaluar(reproduccion);

    createTableUPHMapa(evaluado, "evaluacion");

    seleccion = naturalSelection(evaluado, tamSeleccion);
    document.getElementById("seleccion").innerHTML = JSON.stringify(seleccion);

    mejoresPuntuaciones.unshift({ UPH: seleccion.UPH[0], Mapa: seleccion.Mapa[0] });

    document.getElementById("mejoresPuntuaciones").innerHTML = JSON.stringify(mejoresPuntuaciones);
    createTableMejoresResultados(mejoresPuntuaciones, "mejoresPuntuaciones");
    updateFitPlot(mejoresPuntuaciones);

    mutaciones = mutacion(seleccion.Mapa, elementosAMutar);
    createTableG(mutaciones, "mutaciones")

    reproduccion = reproducir(nf, nc, nPoblacion, mutaciones);
    //document.getElementById("reproduccion").innerHTML = JSON.stringify(
    //    reproduccion.map(reproduccion => reproduccion.capaCodificacion.flat()));

    createTableMutaciones(reproduccion.map(reproduccion => reproduccion.capaCodificacion.flat()), "reproduccion");

    console.log("preprado:", seleccion.Mapa[0]);

    codigoMapa = seleccion.Mapa[0];
    const mapaCodificado = crearMapaCodificado(8, 8, seleccion.Mapa[0]);

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

    //console.log("cosecha codificado btn: ", cosechaTotalCodificado);


    const resultadoDiv = document.getElementById("resultadoUPH");
    resultadoDiv.innerHTML = "UPH: " + JSON.stringify(cosechaTotalCodificado.cosechaUph);

    

    dibujarMapaSVG(svg2, mapaCodificado.capaColores, mapaCodificado.capaModificadores, mapaCodificado.capaAreaEfecto, mapaCodificado.capaObjetos, filas, columnas);


});