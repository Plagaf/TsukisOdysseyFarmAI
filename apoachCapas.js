const MODIFICADOR = "M";
const PLANTA = "P";
const AREA_EFECTO = "E";


const canvas = document.getElementById("myCanvas");
canvas.width = canvas.offsetWidth; // Ajustar el ancho 
canvas.height = canvas.offsetHeight; // Ajustar el alto

const ctx = canvas.getContext("2d");

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
    }
}

class Modificador {
    constructor(nombre, costo, efectoTiempo, efectoCosecha, areaEfecto, tipo,codigo) {
        this.nombre = nombre;
        this.costo = costo;
        this.efectoTiempo = efectoTiempo;
        this.efectoCosecha = efectoCosecha;
        this.areaEfecto = areaEfecto;
        this.tipo = tipo;
        this.codigo = codigo;
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


const barra = [
    [false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false],
    [false, false, "M", "M", "M", "M", false, false],
    [false, false, "M", "M", "M", "M", false, false],
    ["E", "E", "E", "E", "E", "E", "E", "E"],
    ["E", "E", "E", "E", "E", "E", "E", "E"],
    ["E", "E", "E", "E", "E", "E", "E", "E"],
    ["E", "E", "E", "E", "E", "E", "E", "E"],
];


const dona = [
    ["E", "E", "E", "E", "E", "E"],
    ["E", "E", "E", "E", "E", "E"],
    ["E", "E", "M", "M", "E", "E"],
    ["E", "E", "M", "M", "E", "E"],
    ["E", "E", "E", "E", "E", "E"],
    ["E", "E", "E", "E", "E", "E"],
];

const poste = [
    [false, false, false, false, false, false, "M", "M", "E", "E", "E", "E", "E", "E"],
    [false, false, false, false, false, false, "M", "M", "E", "E", "E", "E", "E", "E"]
];

const lados = [
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


const tiposDeModificadores = [
    //(nombre,costo, efectoTiempo, efectoCosecha, areaEfecto, tipo, codigo) 
    new Modificador("GigaGrow", 5000, -0.20, .25, barra, "UV-Lights","GG"),
    new Modificador("Megagrow", 3000, -0.20, .25, poste, "UV-Lights","MG"),
    new Modificador("Lane Sprinkler", 8000, -0.2, 0, lados, "Sprinklers","LS"),
    new Modificador("Rotary Sprinkler", 5000, -0.2, 0, dona, "Sprinklers","RS"),
    new Modificador("Goat Fertilizer", 250, -1 / 3, .50, dona, "Fertilizer","GF"),
];



const tiposDePlantas = [
    //          nombre, tipo,       utUnitaria, utPromedio, uPH, tiempoCosecha, cantidadCosecha, color
    new Planta("Sandía", "Consumible", 140, 140, 140 / 6, 6, 1, "#03a572", unidad,"S"),
    new Planta("Calabaza", "Consumible", 50, 50, 50 / 2, 2, 1, "#FF7518", unidad,"C"),
    new Planta("Zanahoria", "No consumible", 1, 20, 20 / 2, 2, 20, "#FFC000", unidad,"Z"),
    new Planta("Papa", "No consumible", 1, 11, 11 / 1, 1, 11, "#4C3228", unidad,"P"),
    new Planta("Fresa", "No consumible", 2, 10, 10 / 2, 2, 5, "#e42e67", unidad,"F"),
    new Planta("Uva", "No consumible", 4, 24, 24 / 2, 2, 6, "#4c00b0", unidad,"U"),
    new Planta("Nabo", "No consumible", 1, 22, 22 / 2, 2, 22, "#c3c8ac", unidad,"N"),
];

// Función para obtener posiciones relativas dentro del área de efecto
function getPosicionesRelativasTrue(capa, posicion, forma, columnas, filas) {
    let posicionesRelativas = [];
    let filaValida = Math.floor(posicion / columnas); // Usa la fila que se validó en esPosicionAceptable
    let columnaValida = posicion % columnas; // Usa la columna que se validó en esPosicionAceptable

    // Encuentra las coordenadas de la "M" o PLANTA dentro de la forma
    let filaSolido = 0;
    let columnaSolido = 0;
    let encontrado = false;
    for (let i = 0; i < forma.length; i++) {
        for (let j = 0; j < forma[i].length; j++) {
            if (forma[i][j] === MODIFICADOR || forma[i][j] === PLANTA) {
                filaSolido = i;
                columnaSolido = j;
                encontrado = true;
                break; // Se encontró la "M" o PLANTA, ya no es necesario buscar más
            }
        }
        if (encontrado) {
            break;
        }
    }

    // Calcula las posiciones relativas, ajustando para que la "M" o PLANTA esté en la posición validada
    for (let i = 0; i < forma.length; i++) {
        for (let j = 0; j < forma[i].length; j++) {
            if (forma[i][j] === PLANTA || forma[i][j] === MODIFICADOR) {
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

function getPosicionesRelativasAE(capa, posicion, forma, columnas, filas) {
    let posicionesRelativas = [];
    let filaValida = Math.floor(posicion / columnas); // Usa la fila que se validó en esPosicionAceptable
    let columnaValida = posicion % columnas; // Usa la columna que se validó en esPosicionAceptable
    let encontrado = false;

    for (let i = 0; i < forma.length; i++) {
        for (let j = 0; j < forma[i].length; j++) {
            if (forma[i][j] === MODIFICADOR || forma[i][j] === PLANTA) {
                filaSolido = i;
                columnaSolido = j;
                encontrado = true;
                break; // Se encontró la "M" o PLANTA, ya no es necesario buscar más
            }
        }
        if (encontrado) {
            break;
        }
    }

    // Calcula las posiciones relativas
    for (let i = 0; i < forma.length; i++) {
        for (let j = 0; j < forma[i].length; j++) {
            if (forma[i][j] === AREA_EFECTO) {
                let filaAbs = filaValida + (i - filaSolido);
                let columnaAbs = columnaValida + (j - columnaSolido);

                // Verifica si la posición absoluta está dentro del mapa
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

function esPosicionAceptable(capa, fila, columna, forma) {
    for (let i = 0; i < forma.length; i++) {
        for (let j = 0; j < forma[i].length; j++) {
            if (forma[i][j] === MODIFICADOR || forma[i][j] === PLANTA) {
                const filaCapa = fila + i;
                const columnaCapa = columna + j;
                // Verificar si la celda está dentro del mapa y si está vacía
                if (
                    filaCapa < 0 || filaCapa >= capa.length ||
                    columnaCapa < 0 || columnaCapa >= capa[filaCapa].length ||
                    capa[filaCapa][columnaCapa] !== null
                ) {
                    return false;
                }
            }
        }
    }
    return true;
}


// Función para crear un mapa aleatorio
function crearMapaAleatorio(filas, columnas, numPlantas, numModificadores) {
    // Validaciones para evitar bucles infinitos
    if ((numPlantas + numModificadores) > filas * columnas) {
        throw new Error("El número de plantas o modificadores es mayor que el espacio disponible en el mapa.");
    }

    // Inicializar las capas
    const capaPlantas = [];
    const capaPlantasColor = [];
    const capaModificadores = [];
    const capaObjetos = [];
    const capaAreaEfecto = [];
    const capaUvTiempo = [];
    const capaUvCosecha = [];
    const capaFertilizanteTiempo = [];
    const capaFertilizanteCosecha = [];
    const capaAspersor = [];
    let capaCodificacion = [];

    for (let i = 0; i < filas; i++) {
        capaPlantas[i] = [];
        capaPlantasColor[i] = [];
        capaModificadores[i] = [];
        capaObjetos[i] = [];
        capaAreaEfecto[i] = [];
        capaUvTiempo[i] = [];
        capaUvCosecha[i] = [];
        capaFertilizanteTiempo[i] = [];
        capaFertilizanteCosecha[i] = [];
        capaAspersor[i] = [];
        for (let j = 0; j < columnas; j++) {
            capaPlantas[i][j] = null;
            capaPlantasColor[i][j] = null;
            capaModificadores[i][j] = null;
            capaObjetos[i][j] = null;
            capaAreaEfecto[i][j] = null;
            capaUvTiempo[i][j] = 0;
            capaUvCosecha[i][j] = 0;
            capaFertilizanteTiempo[i][j] = 0;
            capaFertilizanteCosecha[i][j] = 0;
            capaAspersor[i][j] = 0;
        }
    }

    for (let i = 0; i < filas/2; i++) {
        capaCodificacion[i] = [];
        for (let j = 0; j < columnas/2; j++) {
            capaCodificacion[i][j] = 0;
        }
    }

    // Colocar modificadores (con un límite de intentos para evitar bucle infinito)
    let modificadoresColocados = 0;

    for (let i = 0; i < filas; i++) {
        capaAreaEfecto[i] = [];
        for (let j = 0; j < columnas; j++) {
            capaAreaEfecto[i][j] = false; // Inicializar la capa con false
        }
    }


    let intentosModificadores = filas * columnas * 7; // Intentos máximos:  7 veces del tamaño del mapa
    while (modificadoresColocados < numModificadores && intentosModificadores > 0) {
        const posicion = generarPosicionAleatoria(filas, columnas);
        const fila = posicion[0];
        const columna = posicion[1];
        const modificador = generarModificadorAleatorio();
        const tipoModificador = modificador.tipo;

        //console.log("buscar lugar a: ", modificador.nombre);
        if (esPosicionAceptable(capaObjetos, fila, columna, modificador.areaEfecto)) {
            capaModificadores[fila][columna] = modificador
            const posicionesRelativasObjetos = getPosicionesRelativasTrue(capaObjetos, fila * columnas + columna, modificador.areaEfecto, columnas, filas);
            const posicionesRelativasAE = getPosicionesRelativasAE(capaObjetos, fila * columnas + columna, modificador.areaEfecto, columnas, filas);

            posicionesRelativasObjetos.forEach(([filaRelativa, columnaRelativa]) => {
                const filaActual = filaRelativa;
                const columnaActual = columnaRelativa;
                if (filaActual >= 0 && filaActual < filas && columnaActual >= 0 && columnaActual < columnas) {
                    capaObjetos[filaActual][columnaActual] = MODIFICADOR;
                    capaAreaEfecto[filaActual][columnaActual] = true;
                    if (tipoModificador == "UV-Lights") {
                        capaUvTiempo[filaActual][columnaActual] = modificador.efectoTiempo;
                        capaUvCosecha[filaActual][columnaActual] = modificador.efectoCosecha;
                    } else if (tipoModificador == "Fertilizer") {
                        capaFertilizanteTiempo[filaActual][columnaActual] = modificador.efectoTiempo;
                        capaFertilizanteCosecha[filaActual][columnaActual] = modificador.efectoCosecha;
                    } else if (tipoModificador == "Sprinklers") {
                        capaAspersor[filaActual][columnaActual] = modificador.efectoTiempo;
                    } else {
                        console.warn("Tipo de modificador desconocido.");
                    }
                }
            });

            posicionesRelativasAE.forEach(([filaRelativa, columnaRelativa]) => {
                const filaActual = filaRelativa;
                const columnaActual = columnaRelativa;
                if (filaActual >= 0 && filaActual < filas && columnaActual >= 0 && columnaActual < columnas) {
                    capaAreaEfecto[filaActual][columnaActual] = true;
                }
            });
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

        if (esPosicionAceptable(capaObjetos, fila, columna, planta.forma)) {
            capaPlantas[fila][columna] = planta
            const posicionesRelativasObjetos = getPosicionesRelativasTrue(capaObjetos, fila * columnas + columna, planta.forma, columnas, filas);
            posicionesRelativasObjetos.forEach(([filaRelativa, columnaRelativa]) => {
                const filaActual = filaRelativa;
                const columnaActual = columnaRelativa;
                if (filaActual >= 0 && filaActual < filas && columnaActual >= 0 && columnaActual < columnas) {
                    capaObjetos[filaActual][columnaActual] = PLANTA;
                    capaPlantasColor[filaActual][columnaActual] = planta.color;
                }
            });
            plantasColocadas++;
        }
        intentosPlantas--;
    }

    // Validaciones adicionales (opcional)
    if (plantasColocadas < numPlantas) {
        console.warn("No se pudieron colocar todas las plantas. Se colocaron " + plantasColocadas + " de " + numPlantas);
    }
    if (modificadoresColocados < numModificadores) {
        console.warn("No se pudieron colocar todos los modificadores. Se colocaron " + modificadoresColocados + " de " + numModificadores);
    }

    capaCodificacion = crearCodigoMapa(capaPlantas, capaCodificacion);
    capaCodificacion = crearCodigoMapa(capaModificadores, capaCodificacion);

    return {
        capaPlantas,
        capaPlantasColor,
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

function crearCodigoMapa(capaOrigen, capaCodificacion){
    for (let i = 0; i < capaCodificacion.length; i++) {
        for (let j = 0; j < capaCodificacion[i].length; j++) {
            if (capaOrigen[i*2][j*2]) {
                capaCodificacion[i][j] = capaOrigen[i*2][j*2].codigo;
            }
        }
    }
    return capaCodificacion;
}


function getListado(capa) {
    // Usando el método flat() con una profundidad de 1
    const listadoObjetos = capa.flat(1).filter(elemento => elemento !== null);
    return listadoObjetos;
}



// Función para calcular la cosecha
function calcularCosecha(capaPlantas, capaAreaEfecto, capaFertilizanteCosecha, capaUvCosecha, capaUvTiempo, capaFertilizanteTiempo, capaAspersor) {
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

    return { cosechaTotal, cosechaUph, listaCosecha };
}



const svg = d3.select("#mapa-svg");

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
function dibujarMapaSVG(capaPlantasColor, capaModificadores, capaAreaEfecto, capaObjetos, filas,columnas) { // Recibe la capa de area de efecto

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
                return capaPlantasColor[d.fila][d.columna];
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
                return capaPlantasColor[d.fila][d.columna];
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
const filas = 10;
const columnas = 10;
const plantas = 1;
const modificadores = 1;

const mapaAleatorio = crearMapaAleatorio(filas, columnas, plantas, modificadores);
const capaPlantas = mapaAleatorio.capaPlantas;
const capaPlantasColor = mapaAleatorio.capaPlantasColor;
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


dibujarMapaSVG(capaPlantasColor, capaModificadores, capaAreaEfecto, capaObjetos, filas,columnas);




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
        mapaAleatorio.capaAspersor
    );


    console.log(mapaAleatorio);
    console.log("Cosecha total:", cosechaTotal);

    // Actualizar las tablas
    actualizarTablaPlantas(cosechaTotal);
    actualizarTablaModificadores(getListado(mapaAleatorio.capaModificadores));


    dibujarMapaSVG(mapaAleatorio.capaPlantasColor, mapaAleatorio.capaModificadores, mapaAleatorio.capaAreaEfecto ,mapaAleatorio.capaObjetos, filas, columnas);
}

// Agregar el evento click al botón
const botonGenerar = document.getElementById("boton-generar");


botonGenerar.addEventListener("click", function () {
    generarMapaYCalcular(
        parseInt(document.getElementById("filas").value),
        parseInt(document.getElementById("columnas").value),
        parseInt(document.getElementById("plantas").value),
        parseInt(document.getElementById("modificadores").value)
    );
});





console.log(mapaAleatorio);
console.log("Cosecha total:", cosechaTotal);


