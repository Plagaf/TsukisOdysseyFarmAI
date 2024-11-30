
const MODIFICADOR = "M";
const PLANTA = "P";
const AREA_EFECTO = "E";

// Define el tamaño de la celda (en píxeles)
const tamanoCelda = 10;


const svg1 = d3.select("#mapa-svg");
const svg2 = d3.select("#mapa-svg-codificado");
let myChart;

class Planta {
    constructor(nombre, tipo, utUnitaria, utPromedio, uPH, tiempoCosecha, cantidadCosecha, color, forma, codigo, modificador) {
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
        this.modificador = modificador;
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
        this.UPH = 0;

        if (tipoModificador == "Fertilizer") { this.UPH = -(this.costo / 24) } else { this.UPH = 0 };
    }
}

class AreaEfecto {
    constructor(forma) {
        this.forma = forma;
    }
}

class Restricciones {
    constructor(Plantable, Cero, GG, MG, LS, RS, GF, BF, EF, C, S, Z, P, U, N, F) {
        this.Plantable = Plantable;
        this.Cero = Cero;
        this.GG = GG;
        this.MG = MG;
        this.LS = LS;
        this.RS = RS;
        this.GF = GF;
        this.BF = BF;
        this.EF = EF;
        this.C = C;
        this.S = S;
        this.Z = Z;
        this.P = P;
        this.U = U;
        this.N = N;
        this.F = F;
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

const donaM = [
    ["E", "E", "E", "E", "E", "E", "E", "E"],
    ["E", "E", "E", "E", "E", "E", "E", "E"],
    ["E", "E", "M", "M", "M", "M", "E", "E"],
    ["E", "E", "M", "M", "M", "M", "E", "E"],
    ["E", "E", "M", "M", "M", "M", "E", "E"],
    ["E", "E", "M", "M", "M", "M", "E", "E"],
    ["E", "E", "E", "E", "E", "E", "E", "E"],
    ["E", "E", "E", "E", "E", "E", "E", "E"]
];

const donaG = [
    ["E", "E", "E", "E", "E", "E", "E", "E", "E", "E"],
    ["E", "E", "E", "E", "E", "E", "E", "E", "E", "E"],
    ["E", "E", "M", "M", "M", "M", "M", "M", "E", "E"],
    ["E", "E", "M", "M", "M", "M", "M", "M", "E", "E"],
    ["E", "E", "M", "M", "M", "M", "M", "M", "E", "E"],
    ["E", "E", "M", "M", "M", "M", "M", "M", "E", "E"],
    ["E", "E", "M", "M", "M", "M", "M", "M", "E", "E"],
    ["E", "E", "M", "M", "M", "M", "M", "M", "E", "E"],
    ["E", "E", "E", "E", "E", "E", "E", "E", "E", "E"],
    ["E", "E", "E", "E", "E", "E", "E", "E", "E", "E"]
];

const posteE = [
    ["M", "M", "E", "E", "E", "E", "E", "E"],
    ["M", "M", "E", "E", "E", "E", "E", "E"]
];

const posteW = [
    ["E", "E", "E", "E", "E", "E", "M", "M"],
    ["E", "E", "E", "E", "E", "E", "M", "M"]
];

const posteS = [
    ["M", "M"],
    ["M", "M"],
    ["E", "E"],
    ["E", "E"],
    ["E", "E"],
    ["E", "E"],
    ["E", "E"],
    ["E", "E"]
];

const posteN = [
    ["E", "E"],
    ["E", "E"],
    ["E", "E"],
    ["E", "E"],
    ["E", "E"],
    ["E", "E"],
    ["M", "M"],
    ["M", "M"]
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
    new Modificador("MegagrowS", 3000, -0.20, .25, posteS, "UV-Lights", "MGS"),
    new Modificador("MegagrowN", 3000, -0.20, .25, posteN, "UV-Lights", "MGN"),
    new Modificador("MegagrowW", 3000, -0.20, .25, posteW, "UV-Lights", "MGW"),
    new Modificador("MegagrowE", 3000, -0.20, .25, posteE, "UV-Lights", "MGE"),

    new Modificador("Lane SprinklerH", 8000, -0.2, 0, ladosH, "Sprinklers", "LSH"),
    new Modificador("Lane SprinklerV", 8000, -0.2, 0, ladosV, "Sprinklers", "LSV"),

    new Modificador("Rotary Sprinkler", 5000, -0.2, 0, dona, "Sprinklers", "RS"),
    new Modificador("Goat Fertilizer", 500, -1 / 3, .50, dona, "Fertilizer", "GF"),
    new Modificador("Bull Fertilizer", 1500, -1 / 3, .50, donaM, "Fertilizer", "BF"),
    new Modificador("Elephant Fertilizer", 4500, -1 / 3, .50, donaG, "Fertilizer", "EF"),


];


const tiposDePlantas = [
    //        nombre, tipo,       utUnitaria, utPromedio, uPH, tiempoCosecha, cantidadCosecha, color

       new Planta("Sandía", "Consumible", 140, 140, 140 / 6, 6, 1, "#03a572", unidad, "S",false),
        new Planta("Calabaza", "Consumible", 50, 50, 50 / 2, 2, 1, "#FF7518", unidad, "C",false),

    new Planta("Zanahoria", "No consumible", 1, 20, 20 / 2, 2, 20, "#FFC000", unidad, "Z", false),


    new Planta("Papa", "No consumible", 1, 11, 11 / 1, 1, 11, "#4C3228", unidad, "P", false),
    new Planta("Fresa", "No consumible", 2, 10, 10 / 2, 2, 5, "#e42e67", unidad, "F", true),
    new Planta("Uva", "No consumible", 4, 24, 24 / 2, 2, 6, "#4c00b0", unidad, "U", false),
    new Planta("Nabo", "No consumible", 1, 22, 22 / 2, 2, 20, "#c3c8ac", unidad, "Z", false)
];


const genes = [
    "GGS", "GGN", "GGW", "GGE",
    "MGS", "MGN", "MGW", "MGE",
    "LSH", "LSV", "LSH", "LSV",
    "RS", "RS", "RS", "RS",
    "GF", "GF", "GF", "GF",
    "BF", "BF", "BF", "BF",
    "EF", "EF", "EF", "EF",
    "P", "P", "P", "P",
    "U", "U", "U", "U",
    "N", "N", "N", "N",
    "Z", "Z", "Z", "Z",
    "F", "F", "F", "F",
    "S", "S", "S", "S",
    "C", "C", "C", "C",
    0, 0, 0, 0
]

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
                } else {
                    //console.error("Error: Posición fuera del mapa:", filaAbs, columnaAbs);
                    dentroDeMapa = false;
                    return [];
                }
            } else if (esAE === true && forma[i][j] === AREA_EFECTO) {
                let filaAbs = filaValida + (i - filaSolido);
                let columnaAbs = columnaValida + (j - columnaSolido);

                if (filaAbs >= 0 && filaAbs < filas && columnaAbs >= 0 && columnaAbs < columnas) {
                    posicionesRelativas.push([filaAbs, columnaAbs]);
                } else {
                    //console.error("Error: Posición fuera del mapa:", filaAbs, columnaAbs);
                }
            }
        }
    }

    return posicionesRelativas;
}

function generarPosicionAleatoria(filas, columnas, centrar = false) {
    let fila, columna;

    if (centrar) {
        // Distribución normal para centrar la posición (con mayor probabilidad cerca del centro)
        const desviacionFila = filas / 15; // Ajusta este valor para controlar la dispersión
        const desviacionColumna = columnas / 15; // Ajusta este valor para controlar la dispersión

        do {
            fila = Math.round(randomNormal(filas / 2, desviacionFila));
        } while (fila < 0 || fila >= filas || fila % 2 !== 0);


        do {
            columna = Math.round(randomNormal(columnas / 2, desviacionColumna));
        } while (columna < 0 || columna >= columnas || columna % 2 !== 0);


    } else {
        // Distribución uniforme (como en la función original)
        fila = Math.floor(Math.random() * Math.floor(filas / 2)) * 2;
        columna = Math.floor(Math.random() * Math.floor(columnas / 2)) * 2;
    }

    return [fila, columna];
}

function randomNormal(media, desviacion) {
    let u = 0, v = 0;
    while (u === 0) u = Math.random(); // Evitar valores 0 para el logaritmo
    while (v === 0) v = Math.random();
    return media + desviacion * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
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
function crearMapaAleatorio(filas, columnas, numPlantas, numModificadores, restricciones) {
    // Validaciones para evitar bucles infinitos
    if ((numPlantas + numModificadores) > (filas * columnas) / 4) {
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

    function llenarCapaObjetos(fila, columna, objeto, columnas, filas) {

        const posicionesRelativasObjetos = getPosicionesRelativas(fila * columnas + columna, objeto.forma, columnas, filas, false);

        // 1. Verificar si todas las celdas están libres
        const celdasDisponibles = posicionesRelativasObjetos.every(([filaRelativa, columnaRelativa]) => {
            const filaActual = filaRelativa;
            const columnaActual = columnaRelativa;
            return capaObjetos[filaActual][columnaActual] === undefined || capaObjetos[filaActual][columnaActual] === null;
        });

        // 2. Si todas las celdas están libres, rellenar las capas
        if (celdasDisponibles) {
            posicionesRelativasObjetos.forEach(([filaRelativa, columnaRelativa]) => {
                const filaActual = filaRelativa;
                const columnaActual = columnaRelativa;
                capaObjetos[filaActual][columnaActual] = objeto.tipoObjeto;
                capaColores[filaActual][columnaActual] = objeto.color;
                if (objeto.tipoObjeto == MODIFICADOR) {
                    capaModificadores[fila][columna] = objeto;
                    llenarCapasAE(fila, columna, objeto, columnas, filas, "solido"); // Esta función también debería seguir la misma lógica de verificación previa
                } else if (objeto.tipoObjeto == PLANTA) {
                    capaPlantas[fila][columna] = objeto;
                }
            });
            return false; //  No hubo solapamiento
        } else {
            return true; // Hubo solapamiento
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

    
    const { Plantable, Cero, GG, MG, LS, RS, GF, BF, EF, C, S, Z, P, U, N, F } = restricciones;

    let limites = Object.entries(restricciones)
        //.filter(([key, value]) => key !== 'Cero' && key !== 'Plantable')
        .map(([elemento, cantidad]) => ({
            elemento,
            cantidad,
        }));

    limites.forEach(limite => {
        limite.colocados = 0;
    })

    ///// IMPORTANTE PARE EVITAR BUCLE INFINITO
    const limitesModificadores = (
        restricciones.GF + restricciones.GG + restricciones.MG + restricciones.LS + restricciones.RS);
    const limitesPlantas = (
        restricciones.C + restricciones.S + restricciones.Z +
        restricciones.P + restricciones.U + restricciones.N + restricciones.F);

    if (numPlantas > limitesPlantas) {
        numPlantas = limitesPlantas;
    }

    let plantasColocadas = 0;
let modificadoresColocados = 0;
let intentos = filas * columnas * 7 * 2; // Intentos máximos para ambos

while (
    (plantasColocadas < numPlantas || modificadoresColocados < numModificadores) &&
    intentos > 0 &&
    plantasColocadas < limitesPlantas &&
    modificadoresColocados < limitesModificadores
) {
    const colocarPlanta = Math.random() < 0.85 && plantasColocadas < numPlantas && plantasColocadas < limitesPlantas; // 85% de probabilidad si aún se pueden colocar plantas

    let objeto, codigoObjeto, limiteObjeto, indexObjeto, colocados;

    if (colocarPlanta) {
        objeto = generarPlantaAleatoria();
        codigoObjeto = objeto.codigo.slice(0, 2);
    } else if (modificadoresColocados < numModificadores) { // Intenta colocar un modificador si no se colocó una planta y aún se pueden colocar modificadores
        objeto = generarModificadorAleatorio();
        codigoObjeto = objeto.codigo.slice(0, 2);
    } else { // No se pueden colocar ni plantas ni modificadores, salta la iteracion
        intentos--;
        continue;
    }


    limiteObjeto = limites.find((element) => element.elemento == codigoObjeto).cantidad;
    indexObjeto = limites.findIndex((element) => element.elemento == codigoObjeto);
    colocados = limites.find((element) => element.elemento == codigoObjeto).colocados;

    if (colocados >= limiteObjeto) {
        intentos--;
        continue; 
    }

    const posicion = generarPosicionAleatoria(filas, columnas, true);
    const fila = posicion[0];
    const columna = posicion[1];

    if (!llenarCapaObjetos(fila, columna, objeto, columnas, filas, "solido")) {
        limites[indexObjeto].colocados++;
        if (colocarPlanta) {
            plantasColocadas++;
        } else {
            modificadoresColocados++;
        }
    }

    intentos--;
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
function calcularCosecha(capaPlantas, capaModificadores, capaAreaEfecto, capaFertilizanteCosecha, capaUvCosecha, capaUvTiempo, capaFertilizanteTiempo, capaAspersor) {
    const capaCosecha = [];
    const capaTiempo = [];
    const listaCosecha = [];
    const costoFertilizantes = [];
    let costoFertilizantesT = 0;
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

    for (let i = 0; i < capaModificadores.length; i++) {
        for (let j = 0; j < capaModificadores[i].length; j++) {
            if (capaModificadores[i][j]) {
                costoFertilizantesT += capaModificadores[i][j].UPH;
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
    cosechaUph = cosechaUph + costoFertilizantesT


    cosechaUph = Math.round(cosechaUph * 100) / 100;

    let totalUtilidad = 0;
    for (let i = 0; i < listaCosecha.length; i++) {
        totalUtilidad += listaCosecha[i].totalUtilidad;
    }

    totalUtilidad = Math.round(totalUtilidad * 100) / 100;

    return { cosechaTotal, cosechaUph, listaCosecha };
}


function dibujarAreaEfectoSVG(svg, capaAreaEfecto, tamanoCelda) {
    // Crea los datos para las celdas de área de efecto
    const data = capaAreaEfecto.flatMap((fila, i) => fila.map((valor, j) => ({
        fila: i,
        columna: j,
        valor: valor
    })));

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


function generarMapaAleatorioCalcularYDibujar(filas = 10, columnas = 10, plantas = 1, modificadores = 1, restricciones, svg) {

    // Generar el mapa aleatorio
    const mapaAleatorio = crearMapaAleatorio(filas, columnas, plantas, modificadores, restricciones);

    // Calcular la cosechacapaPlantas, capaAreaEfecto, capaModCosecha, capaModTiempo, capaFertilizanteCosecha, capaUvCosecha, capaUvTiempo,capaFertilizanteTiempo,capaAspersor)
    const cosechaTotal = calcularCosecha(
        mapaAleatorio.capaPlantas,
        mapaAleatorio.capaModificadores,
        mapaAleatorio.capaAreaEfecto,
        mapaAleatorio.capaFertilizanteCosecha,
        mapaAleatorio.capaUvCosecha,
        mapaAleatorio.capaUvTiempo,
        mapaAleatorio.capaFertilizanteTiempo,
        mapaAleatorio.capaAspersor,
    );

    dibujarMapaSVG(svg, mapaAleatorio.capaColores, mapaAleatorio.capaModificadores, mapaAleatorio.capaAreaEfecto, mapaAleatorio.capaObjetos, filas, columnas);

    return { mapaAleatorio: mapaAleatorio, cosecha: cosechaTotal };
}

function validarRestriccionesCodificacionMapa(codigoMapa, restricciones) {

    if (!(restricciones instanceof Restricciones)) {
        console.error("Error: 'restricciones' debe ser una instancia de la clase Restricciones.");
        return false; // O lanzar una excepción, según tu manejo de errores
    }

    // 1. Contar la frecuencia de cada elemento
    codigoMapa = codigoMapa.map(item =>
        typeof item === 'string' && item.length === 3 ? item.slice(0, 2) : item
    );

    // 2.  Después, calcular las frecuencias
    const frecuencias = {};
    const mapaOriginal = [...codigoMapa];

    let i = 0;
    for (const elemento of codigoMapa) {
        // Convertir 0 a string para mantener la consistencia
        const clave = elemento === 0 ? "0" : elemento;
        frecuencias[clave] = (frecuencias[clave] || 0) + 1;
    }

    // 3. Descontar los ceros basándonos en las frecuencias de GG y LS
    const cerosOcupados = (frecuencias['GG'] || 0) + (frecuencias['LS'] || 0) + (frecuencias['LS'] || 0);
    frecuencias["0"] = (frecuencias["0"] || 0) - cerosOcupados;

    if (frecuencias["0"] < 0) {
        frecuencias["0"] = 0;
    }

    const espaciosUtilizados = Object.values(frecuencias)
        .filter((_, index) => Object.keys(frecuencias)[index] !== "0") //filtrar por la clave en la posición index
        .reduce((acc, valor) => acc + valor, 0);


    const modificadores = ["GG", "MG", "LS", "RS", "GF"]; // Array de modificadores

    // Calcular la suma de los modificadores
    const sumaModificadores = modificadores.reduce((sum, mod) => sum + (frecuencias[mod] || 0), 0);

    // Crear los límites a partir de las propiedades del objeto 'restricciones'
    const limites = Object.entries(restricciones)
        .filter(([key, value]) => key !== 'Cero' && key !== 'Plantable')
        .map(([elemento, cantidad]) => ({
            elemento,
            cantidad
        }));

    const cumpleLimitesIndividuales = !limites.some(limite => {
        const cantidadActual = frecuencias[limite.elemento] || 0;
        return cantidadActual > limite.cantidad;
    });

    const indicesPorElemento = {}; // Almacena los índices de cada elemento

    // Inicializar los índices de cada elemento
    for (const limite of limites) {
        indicesPorElemento[limite.elemento] = [];
    }

    // Recorrer el códigoMapa y guardar los índices de cada elemento
    for (let i = 0; i < codigoMapa.length; i++) {
        const codigo = codigoMapa[i];
        if (indicesPorElemento.hasOwnProperty(codigo)) {
            indicesPorElemento[codigo].push(i);
        }
    }

    // Recorrer los límites y realizar la sustitución aleatoria
    for (const limite of limites) {
        const codigo = limite.elemento;
        const cantidadMaxima = limite.cantidad;
        const indices = indicesPorElemento[codigo];

        // Si la cantidad de elementos supera el límite
        if (indices.length > cantidadMaxima) {
            // Obtener los índices a sustituir aleatoriamente
            const indicesASustituir = [];
            while (indicesASustituir.length < indices.length - cantidadMaxima) {
                const indiceAleatorio = Math.floor(Math.random() * indices.length);
                if (!indicesASustituir.includes(indiceAleatorio)) {
                    indicesASustituir.push(indiceAleatorio)
                }
            }

            // Sustituir los elementos en los índices seleccionados
            for (const indiceRelativo of indicesASustituir) {
                codigoMapa[indices[indiceRelativo]] = 0;
            }
        }
    }

    let cumpleLimitePlantable = true;

    if ((espaciosUtilizados - sumaModificadores) <= restricciones.Plantable) {
        cumpleLimitePlantable = true;
    } else {
        cumpleLimitePlantable = false;
    }

    // Verificar si la suma de frecuencias (sin ceros) es menor o igual a Plantable

    const cumpleLimites = cumpleLimitesIndividuales && cumpleLimitePlantable;

    //console.log(cumpleLimites, codigoMapa, mapaOriginal);


    return {
        cumpleLimites,
        codigoMapa,
        mapaOriginal

        /*
        frecuencias,
        espaciosUtilizados,
        sumaModificadores,
*/

    };
}

function validarCodigoMapa(filas, columnas, codigoMapa) {
    const longitud = codigoMapa.length;
    const desplazamientos = {
        'W': columnas,
        'E': columnas,
        'N': 1,
        'S': 1,
        'H': [1, 2], // Desplazamientos para 'H' (horizontal)
        'V': [columnas, 2 * columnas] // Desplazamientos para 'V' (vertical)
    };

    for (let i = 0; i < longitud; i++) {
        const elemento = String(codigoMapa[i]);

        // Verificar si el elemento requiere validación (GG o LS)
        if (elemento.startsWith('GG') || elemento.startsWith('LS')) {
            const orientacion = elemento.length > 2 ? elemento.slice(-1) : null;

            // Si no hay orientación (porValidar es null), saltar a la siguiente iteración
            if (!orientacion) continue;

            const desplazamiento = desplazamientos[orientacion];

            if (Array.isArray(desplazamiento)) {
                // Manejo de desplazamientos múltiples (H y V)
                const pos1 = i + desplazamiento[0];
                const pos2 = i + desplazamiento[1];

                // Verificar límites del array y que las posiciones estén ocupadas por 'V'
                if (pos2 >= longitud || codigoMapa[pos1] !== 'V' || codigoMapa[pos2] !== 'V') return false;
            } else {
                // Manejo de un solo desplazamiento (W, E, N, S)
                const pos = i + desplazamiento;
                if (pos >= longitud || codigoMapa[pos] !== 'V') return false;
            }
        }
    }

    // Si todas las validaciones pasan, retornar true
    return true;
}

function validarRestricciones(codigoMapa, restricciones) {


}


// Función para crear un mapa aleatorio
function crearMapaCodificado(filas, columnas, codigoMapa, restricciones = new Restricciones(999, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999)) {
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

        // 1. Verificar si todas las celdas están libres
        const celdasDisponibles = posicionesRelativasObjetos.every(([filaRelativa, columnaRelativa]) => {
            const filaActual = filaRelativa;
            const columnaActual = columnaRelativa;
            return capaObjetos[filaActual][columnaActual] === undefined || capaObjetos[filaActual][columnaActual] === null;
        });

        // 2. Si todas las celdas están libres, rellenar las capas
        if (celdasDisponibles) {
            posicionesRelativasObjetos.forEach(([filaRelativa, columnaRelativa]) => {
                const filaActual = filaRelativa;
                const columnaActual = columnaRelativa;
                capaObjetos[filaActual][columnaActual] = objeto.tipoObjeto;
                capaColores[filaActual][columnaActual] = objeto.color;
                if (objeto.tipoObjeto == MODIFICADOR) {
                    capaModificadores[fila][columna] = objeto;
                    llenarCapasAE(fila, columna, objeto, columnas, filas, "solido"); // Esta función también debería seguir la misma lógica de verificación previa
                } else if (objeto.tipoObjeto == PLANTA) {
                    capaPlantas[fila][columna] = objeto;
                }
            });
            return false; //  No hubo solapamiento
        } else {
            return true; // Hubo solapamiento
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

    const f = filas / 2; // Número de filas
    const c = columnas / 2; // Número de columnas

    // const mapaValidado = validarRestriccionesCodificacionMapa(codigoMapa, restricciones);
    /*
        if (!mapaValidado.cumpleLimites) {
            codigoMapa = mapaValidado.codigoMapa;
            //console.log("no cumple restricciones", mapaValidado.codigoMapa);
            //console.log("no cumple restricciones");
        }
            */
    const matriz = decodificarMapa(codigoMapa, f, c);

    //console.log(matriz);

    for (let i = 0; i < matriz.length; i++) {
        for (let j = 0; j < matriz[i].length; j++) {
            const fila = i * 2;
            const columna = j * 2;
            const objeto = obtenerObjetoPorCodigo(matriz[i][j]);

            if (objeto == null) {
                //console.log("objeto nulo");
                continue;
            }

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

            }
        }

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


function mostrarPoblacionEnTextBoxes(poblacion) {
    const contenedor = document.getElementById("poblacion");
    contenedor.innerHTML = ""; // Limpiar el contenedor

    /* poblacion.forEach(individuo => {
      const textBox = document.createElement("textarea");
      textBox.value = individuo.join(","); // Unir los elementos con comas
      textBox.rows = 1; // Ajustar el número de filas según sea necesario
      textBox.cols = individuo.length;  //Ajustar el ancho, puedes definir un valor fijo. O calcularlo dinamicamente.
      contenedor.appendChild(textBox);
      contenedor.appendChild(document.createElement("br")); // Agregar un salto de línea
    }); */


    poblacion.forEach(individuo => {
        const preElement = document.createElement("pre");
        preElement.classList.add("poblacion-pre"); // Agregar la clase
        preElement.textContent = individuo.join(","); // Usar textContent para <pre>
        contenedor.appendChild(preElement);
        // contenedor.appendChild(document.createElement("br"));
    });
}

function prepararTextoCodigoMapa(textBox) {
    return textBox.replace(/\s/g, '').split(',')
        .map(elemento =>
            typeof elemento === 'string' ? elemento.replace(/"/g, '').toUpperCase() : elemento
        );
}


function obtenerRestricciones() {
    const plantable = parseInt(document.getElementById("Plantable").value);
    const cero = parseInt(document.getElementById("Cero").value);
    const gg = parseInt(document.getElementById("GG").value);
    const mg = parseInt(document.getElementById("MG").value);
    const ls = parseInt(document.getElementById("LS").value);
    const rs = parseInt(document.getElementById("RS").value);
    const gf = parseInt(document.getElementById("GF").value);
    const bf = parseInt(document.getElementById("BF").value);
    const ef = parseInt(document.getElementById("EF").value);
    const c = parseInt(document.getElementById("C").value);
    const s = parseInt(document.getElementById("S").value);
    const z = parseInt(document.getElementById("Z").value);
    const p = parseInt(document.getElementById("P").value);
    const u = parseInt(document.getElementById("U").value);
    const n = parseInt(document.getElementById("N").value);
    const f = parseInt(document.getElementById("F").value);

    return new Restricciones(plantable, cero, gg, mg, ls, rs, gf, bf, ef, c, s, z, p, u, n, f)

}

window.onload = (event) => {
    botonGenerarMapaAletorio.click();
    botonCalcularCodificado.click();
};


// Agregar el evento click al botón
const botonGenerarMapaAletorio = document.getElementById("boton-generar");

botonGenerarMapaAletorio.addEventListener("click", function () {

    let filas = parseInt(document.getElementById("filas").value);
    let columnas = parseInt(document.getElementById("columnas").value);

    // Plantable, Cero, GG, MG, LS, RS, GF,BF,EF, C, S, Z, P, U, N, F
    const restricciones = obtenerRestricciones();

    const nuevoMapa = generarMapaAleatorioCalcularYDibujar(
        filas,
        columnas,
        parseInt(document.getElementById("plantas").value),
        parseInt(document.getElementById("modificadores").value),
        restricciones,
        svg1
    );

    //console.log(nuevoMapa);

    actualizarTablaPlantas(nuevoMapa.cosecha);
    const listaModificadores = getListado(nuevoMapa.mapaAleatorio.capaModificadores);
    actualizarTablaModificadores(listaModificadores);

    document.getElementById('totalCosechado').textContent = nuevoMapa.cosecha.cosechaTotal;
    document.getElementById('cosechaUph').textContent = nuevoMapa.cosecha.cosechaUph;
    document.getElementById('utilidadTotal').textContent = nuevoMapa.cosecha.totalUtilidad;
    document.getElementById('coidgoMapaAleatorio').textContent = nuevoMapa.mapaAleatorio.capaCodificacion;

});


const botonCalcularCodificado = document.getElementById("calcularUPH");

botonCalcularCodificado.addEventListener("click", function () {

    let codigoMapa = document.getElementById("codigoMapa").value
    const filas = parseInt(document.getElementById("anchoMapa").value)
    const columnas = parseInt(document.getElementById("largoMapa").value)

    const form = document.getElementById('restriccionesForm');
    const restricciones = new Restricciones(
        parseInt(form.Plantable.value, 10),
        parseInt(form.Cero.value, 10),
        parseInt(form.GG.value, 10),
        parseInt(form.MG.value, 10),
        parseInt(form.LS.value, 10),
        parseInt(form.RS.value, 10),
        parseInt(form.GF.value, 10),
        parseInt(form.BF.value, 10),
        parseInt(form.EF.value, 10),
        parseInt(form.C.value, 10),
        parseInt(form.S.value, 10),
        parseInt(form.Z.value, 10),
        parseInt(form.P.value, 10),
        parseInt(form.U.value, 10),
        parseInt(form.N.value, 10),
        parseInt(form.F.value, 10),

    );

    // Plantable, Cero, GG, MG, LS, RS, GF,BF,EF, C, S, Z, P, U, N, F
    //const restricciones = new Restricciones(999, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999);
    //const restricciones = new Restricciones(999, 999, 0, 0, 0, 0, 0, 999, 999, 999, 999, 999, 999, 999);

    codigoMapa = prepararTextoCodigoMapa(codigoMapa)

    if (codigoMapa.length !== filas / 2 * columnas / 2) {
        //console.log("La longitud de la codificación no coincide con las filas y columnas del mapa");
        alert("La longitud de la codificación no coincide con las filas y columnas del mapa");
    } else {
        const mapaCodificado = crearMapaCodificado(filas, columnas, codigoMapa, restricciones);



        const cosechaTotalCodificado = calcularCosecha(
            mapaCodificado.capaPlantas,
            mapaCodificado.capaModificadores,
            mapaCodificado.capaAreaEfecto,
            mapaCodificado.capaFertilizanteCosecha,
            mapaCodificado.capaUvCosecha,
            mapaCodificado.capaUvTiempo,
            mapaCodificado.capaFertilizanteTiempo,
            mapaCodificado.capaAspersor
        );

        //console.log("cosecha codificado btn: ", cosechaTotalCodificado);
        //console.log("crearMapaCodificado  btn: ", mapaCodificado);

        const resultadoDiv = document.getElementById("resultadoUPH");
        resultadoDiv.innerHTML = "UPH: " + JSON.stringify(cosechaTotalCodificado.cosechaUph);


        dibujarMapaSVG(svg2, mapaCodificado.capaColores, mapaCodificado.capaModificadores, mapaCodificado.capaAreaEfecto, mapaCodificado.capaObjetos, filas, columnas);

    }


});



const botonResetGA = document.getElementById("resetGA");
botonResetGA.addEventListener("click", function () {
    let mejoresPuntuaciones = [];
    let seleccion = [];
    let poblacionMapa = [];
    let mejorPuntuacionAbs = [];
    let resultado = [];

    if (myChart) {
        myChart.destroy();
    }

    mostrarPoblacionEnTextBoxes(poblacionMapa);
    document.getElementById("seleccion").innerHTML = JSON.stringify(seleccion);
    document.getElementById("mejorPuntuacionAbs").innerHTML = "";
    document.getElementById("mejorPuntuacionAbs").innerHTML = JSON.stringify(mejorPuntuacionAbs);
    document.getElementById("poblacion").innerHTML = "";

    createTableMejoresResultados(mejoresPuntuaciones, "mejoresPuntuaciones");




});

function updateFitPlot(data) {

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

function generarEnteroAleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Crear población y fitness

function crearPoblacion(filas, columnas, poblacion, restricciones) {
    let resultados = [];
    for (let index = 0; index < poblacion; index++) {
        let randPlantas = generarEnteroAleatorio(1, filas / 2 * columnas / 2)
        let randMods = generarEnteroAleatorio(0, (filas / 2 * columnas / 2) * .8)
        while (randPlantas + randMods > filas / 2 * columnas / 2) {
            randPlantas = generarEnteroAleatorio(1, filas / 2 * columnas / 2)
            randMods = generarEnteroAleatorio(0, (filas / 2 * columnas / 2) * .8)
        }
        let resultado = crearMapaAleatorio(filas, columnas, randPlantas, randMods, restricciones);
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
            poblacion[index].capaModificadores,
            poblacion[index].capaAreaEfecto,
            poblacion[index].capaFertilizanteCosecha,
            poblacion[index].capaUvCosecha,
            poblacion[index].capaUvTiempo,
            poblacion[index].capaFertilizanteTiempo,
            poblacion[index].capaAspersor
        );
        evaluado.push({ UPH: cosechaTotalCodificado.cosechaUph, Mapa: poblacion[index].capaCodificacion.flat() });
    }
    return (evaluado);
}

function naturalSelection(jsonData, n) {
    const data = jsonData.sort((a, b) => b.UPH - a.UPH);
    return { UPH: data.slice(0, n).map(resultado => resultado.UPH), Mapa: data.slice(0, n).map(resultado => resultado.Mapa) };
}

// TODO: Agregar función de corssover basado en centroide
function crossover(parent1, parent2) {
    // Verifica que los padres tengan la misma longitud
    if (parent1.length !== parent2.length) {
        throw new Error("Los padres deben tener la misma longitud.");
    }

    // Selecciona un punto de cruce aleatorio
    const crossoverPoint = Math.floor(Math.random() * parent1.length);

    // Crea los hijos combinando segmentos de los padres
    const child1 = parent1.slice(0, crossoverPoint).concat(parent2.slice(crossoverPoint));
    const child2 = parent2.slice(0, crossoverPoint).concat(parent1.slice(crossoverPoint));

    return [child1, child2];
}

function mutacion(genoma, tasaMutacion) {
    // Crea una copia para evitar modificar el genoma original
    const genomaMutado = [...genoma];

    // Itera sobre cada gen
    for (let i = 0; i < genomaMutado.length; i++) {
        // Genera un número aleatorio entre 0 y 1
        const random = Math.random();

        // Si el número aleatorio es menor que la tasa de mutación, muta el gen
        if (random < tasaMutacion) {
            const nuevogen = genes[generarEnteroAleatorio(0, genes.length - 1)]
            //console.log("mutado: ", nuevogen );
            genomaMutado[i] = nuevogen;
        }
    }



    return genomaMutado;
}

function performCrossover(population, crossoverRate = 0.8, mutacionProb = 0.01, restricciones) {
    const newPopulation = [];
    const populationSize = population.length;

    if (populationSize % 2 != 0) {
        population.pop();
    }

    for (let i = 0; i < populationSize; i += 2) {
        if (Math.random() < crossoverRate) {
            const maxIntentos = 20;
            let childrenFound = false; // Bandera para indicar si se encontraron hijos válidos

            for (let intentos = 0; intentos < maxIntentos; intentos++) {
                const children = crossover(population[i], population[i + 1]);
                let child1 = mutacion(children[0], mutacionProb);
                let child2 = mutacion(children[1], mutacionProb);

                const child1Validation = validarRestriccionesCodificacionMapa(child1, restricciones);
                const child2Validation = validarRestriccionesCodificacionMapa(child2, restricciones);

                if (validarCodigoMapa(filas, columnas, child1) && validarCodigoMapa(filas, columnas, child2)) {


                    //console.log(child1Validation);

                    if (child1Validation.cumpleLimites && child2Validation.cumpleLimites) {
                        newPopulation.push(child1);
                        newPopulation.push(child2);
                        childrenFound = true;
                        break;
                    }
                } else {
                    // Intenta reparar
                    const repairedChild1 = child1Validation.codigoMapa;
                    const repairedChild2 = child2Validation.codigoMapa
                    if (validarCodigoMapa(filas, columnas, repairedChild1) && validarCodigoMapa(filas, columnas, repairedChild2) &&
                        validarRestriccionesCodificacionMapa(repairedChild1, restricciones).cumpleLimites &&
                        validarRestriccionesCodificacionMapa(repairedChild2, restricciones).cumpleLimites) {
                        //console.log("insertar hijos reparados");
                        newPopulation.push(repairedChild1);
                        newPopulation.push(repairedChild2);
                        childrenFound = true;
                    }
                }
            }

            if (!childrenFound) { // Si no se encontraron hijos, añade los padres.

                //console.log("insertar no se encontraron hijos");
                newPopulation.push(population[i]);
                newPopulation.push(population[i + 1]);
            }
        } else {

            //console.log("insertar otro padres");
            newPopulation.push(population[i]);
            newPopulation.push(population[i + 1]);
        }
    }

    return newPopulation;
}

function offspring(filas, columnas, crossovers, restricciones) {

    let resultados = [];
    for (let index = 0; index < crossovers.length; index++) {
        let resultado = crearMapaCodificado(filas, columnas, crossovers[index], restricciones);
        resultados.push(resultado);
        if (index % 10000 === 0) {
            //console.log(`Iteración: ${index}`, );
        }
    }
    return resultados;
}

if (1 === 1) {
    let mejoresPuntuaciones = [];
    let seleccion = [];
    let poblacionIni = [];
    let poblacionMapa = [];
    let nPoblacion = [];
    let nf = 0;
    let nc = 0;
    let mutacionProb = 0;
    let coRate = 0;
    let mejorPuntuacionAbs = [];


    const botonPobIni = document.getElementById("generacionbtn");
    botonPobIni.addEventListener("click", function () {

        const restricciones = obtenerRestricciones();

        nf = parseInt(document.getElementById("nf").value);
        nc = parseInt(document.getElementById("nc").value);
        coRate = parseInt(document.getElementById("coRate").value) / 100;
        mutacionProb = parseInt(document.getElementById("mutacionProb").value) / 100;
        nPoblacion = parseInt(document.getElementById("nPoblacion").value);

        poblacionIni = crearPoblacion(nf, nc, nPoblacion, restricciones);

        let i = 0;
        for (const objeto of poblacionIni) {
            poblacionMapa.push(objeto.capaCodificacion.flat());

            //console.log(i);

            i++;

        }

        mostrarPoblacionEnTextBoxes(poblacionMapa);

        poblacionMapa = [];


    });

    const botonGA = document.getElementById("evolucionbtn");
    botonGA.addEventListener("click", function () {

        let tamSeleccion = parseInt(document.getElementById("tamSeleccion").value);

        const restricciones = obtenerRestricciones();

        if (tamSeleccion % 2 != 0) {
            tamSeleccion--;
        }

        nf = parseInt(document.getElementById("nf").value);
        nc = parseInt(document.getElementById("nc").value);

        coRate = parseInt(document.getElementById("coRate").value) / 100;
        mutacionProb = parseInt(document.getElementById("mutacionProb").value) / 100;

        let evaluado = evaluar(poblacionIni);
        seleccion = naturalSelection(evaluado, tamSeleccion);

        mejoresPuntuaciones.unshift({ UPH: seleccion.UPH[0], Mapa: seleccion.Mapa[0] });

        document.getElementById("seleccion").innerHTML = JSON.stringify(seleccion);

        if (mejoresPuntuaciones.length == 1) {
            mejorPuntuacionAbs = mejoresPuntuaciones[0]
        } else if (mejoresPuntuaciones[0].UPH > mejorPuntuacionAbs.UPH) {
            mejorPuntuacionAbs = mejoresPuntuaciones[0]
        }

        document.getElementById("mejorPuntuacionAbs").innerHTML = "";
        document.getElementById("mejorPuntuacionAbs").innerHTML = JSON.stringify(mejorPuntuacionAbs);

        createTableUPHMapa(evaluado, "evaluacion");
        createTableMejoresResultados(mejoresPuntuaciones, "mejoresPuntuaciones");
        updateFitPlot(mejoresPuntuaciones);

        poblacionIni = performCrossover(seleccion.Mapa, coRate, mutacionProb, restricciones);
        poblacionIni = offspring(nf, nc, poblacionIni, restricciones);

        document.getElementById("poblacion").innerHTML = "";

        poblacionMapa = [];
        for (const objeto of poblacionIni) {
            poblacionMapa.push(objeto.capaCodificacion.flat());
        }
        document.getElementById("poblacion").innerHTML = JSON.stringify(poblacionMapa);

        codigoMapa = seleccion.Mapa[0];

        const mapaCodificado = crearMapaCodificado(nf, nc, seleccion.Mapa[0]);
        const cosechaTotalCodificado = calcularCosecha(
            mapaCodificado.capaPlantas,
            mapaCodificado.capaModificadores,
            mapaCodificado.capaAreaEfecto,
            mapaCodificado.capaFertilizanteCosecha,
            mapaCodificado.capaUvCosecha,
            mapaCodificado.capaUvTiempo,
            mapaCodificado.capaFertilizanteTiempo,
            mapaCodificado.capaAspersor
        );

        const resultadoDiv = document.getElementById("resultadoUPH");
        resultadoDiv.innerHTML = "UPH: " + JSON.stringify(cosechaTotalCodificado.cosechaUph);

        dibujarMapaSVG(svg2, mapaCodificado.capaColores, mapaCodificado.capaModificadores, mapaCodificado.capaAreaEfecto, mapaCodificado.capaObjetos, nf, nc);
    });





    const evolucionLoop = document.getElementById("evolucionLoopbtn");
    evolucionLoop.addEventListener("click", function () {

        const evolucionesLoop = parseInt(document.getElementById("evolucionesLoop").value);

        for (let index = 0; index < evolucionesLoop; index++) {
            botonGA.click();

        }
    });



}



