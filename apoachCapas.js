
const MODIFICADOR = "M";
const PLANTA = "P";
const AREA_EFECTO = "E";

// Define el tamaño de la celda (en píxeles)
const tamanoCelda = 20;


const svg1 = d3.select("#mapa-svg");
const svg2 = d3.select("#mapa-svg-codificado");
let myChart;


const unidad = [
    ["P", "P"],
    ["P", "P"]
];

const barraS = [
    [false, "M", "M", false],
    ["E", "E", "E", "E"],
    ["E", "E", "E", "E"]
];

const barraN = [
    ["E", "E", "E", "E"],
    ["E", "E", "E", "E"],
    [false, , "M", "M", false]
];

const barraW = [
    ["E", "E", false],
    ["E", "E", "M"],
    ["E", "E", "M"],
    ["E", "E", false]
];

const barraE = [
    [false, "E", "E",],
    ["M", "E", "E"],
    ["M", "E", "E"],
    [false, "E", "E"]
];

const dona = [
    ["E", "E", "E"],
    ["E", "M", "E"],
    ["E", "E", "E"]
];

const donaM = [
    ["E", "E", "E", "E"],
    ["E", "M", "M", "E"],
    ["E", "M", "M", "E"],
    ["E", "E", "E", "E"]
];

const donaG = [
    ["E", "E", "E", "E", "E"],
    ["E", "M", "M", "M", "E"],
    ["E", "M", "M", "M", "E"],
    ["E", "M", "M", "M", "E"],
    ["E", "E", "E", "E", "E"]
];

const posteE = [
    ["M", "E", "E", "E"]
];

const posteW = [
    ["E", "E", "E", "M"]
];

const posteS = [
    ["M"],
    ["E"],
    ["E"],
    ["E"]
];

const posteN = [
    ["E"],
    ["E"],
    ["E"],
    ["M"]
];

const ladosH = [
    [false, "E", "E", "E", false],
    ["E", "E", "E", "E", "E"],
    [false, "M", "M", "M", false],
    ["E", "E", "E", "E", "E"],
    [false, "E", "E", "E", false],
];

const ladosV = [
    [false, "E", false, "E", false],
    ["E", "E", "M", "E", "E"],
    ["E", "E", "M", "E", "E"],
    ["E", "E", "M", "E", "E"],
    [false, "E", false, "E", false],
];


class Objeto {

    constructor(
        { nombre, clase, tipo, codigo, costo, imagen, placeHolder, orientacion, color, formaAoE, precio, esConsumible, efectoCosecha, efectoTiempo, qtyCompra, qtyVenta, tiempo, reduccionTiempo }
    ) {
        this.nombre = nombre;
        this.clase = clase; //Planta o Modificador
        this.tipo = tipo; // Planta, UV, aspersor, etc
        this.codigo = codigo;
        this.costo = costo; // compra
        this.imagen = imagen;
        this.placeHolder = placeHolder;
        this.orientacion = orientacion; //N, W, S, E
        this.color = color; //HEX
        this.formaAoE = formaAoE;
        this.precio = precio;
        this.esConsumible = esConsumible;
        this.efectoCosecha = efectoCosecha;
        this.efectoTiempo = efectoTiempo;
        this.reduccionTiempo = reduccionTiempo;
        this.qtyCompra = qtyCompra; //cantidad de semillas al comprar consumible
        this.qtyVenta = qtyVenta; // Cuantas frutas salen al cosecharse
        this.tiempo = tiempo; // en horas
        this.codigoLargo = this.codigo + this.orientacion;
        this.utilidadUnitaria = this.calcularUtilidadUnitaria();
        this.utilidautilidadTotaldUnitaria = this.calcularUtilidadTotal();
        this.uPH = this.calcularUpH();
    }

    calcularUtilidadUnitaria() {
        // if (this.esConsumible) {
        this.utilidadUnitaria = this.precio - (this.costo / this.qtyCompra);
        //  } else {
        //     this.utilidadUnitaria = this.precio;
        //  }

        return this.utilidadUnitaria;
    }

    calcularUtilidadTotal() {
        //this.calcularUtilidadUnitaria();
        this.utilidadTotal = this.utilidadUnitaria * this.qtyVenta;

        return this.utilidadTotal;
    }

    calcularUpH() {
        //this.calcularUtilidadTotal();
        if (this.tiempo) {
            this.uPH = this.utilidadTotal / this.tiempo;
        } else {
            this.uPH = 0;
        }

        return this.uPH;
    }
}

class ObjPlaceHolder extends Objeto {
    constructor(options = { nombre: "X", codigo: "X", clase: "H", tipo: "", imagen: null, placeHolder: "", orientacion: "", color: "red", formaAoE: null, efectoTiempo: 0, efectoCosecha: 0, costo: 0, precio: 0, esConsumible: false, qtyCompra: 0, qtyVenta: 0, tiempo: 0, reduccionTiempo: 0 }) {
        super(options);
    }
}


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

class Celda {
    constructor(objeto, cosecha, conUV, conFertilizante, conAgua, conFresa, uvTiempo, uvCosecha, fertTiempo, fertCosecha, aguaTiempo, fresaTiempo, colorAdicional) {
        this.objeto = objeto;
        this.cosecha = cosecha;
        this.conUV = conUV;
        this.conFertilizante = conFertilizante;
        this.conAgua = conAgua;
        this.conFresa = conFresa;
        this.uvTiempo = uvTiempo;
        this.uvCosecha = uvCosecha;
        this.fertTiempo = fertTiempo;
        this.fertCosecha = fertCosecha;
        this.aguaTiempo = aguaTiempo;
        this.fresaTiempo = fresaTiempo;
        this.colorAdicional = colorAdicional;
        this.modTiempo = 1;
        this.modCosecha = 1;
        this.totalCosecha = this.cosecha;
        this.totalTiempo = 0;
        this.totalUtilidad = 0;
    }
}

function crearObjetoProxy(objeto) {
    return new Proxy(objeto, {
        set(target, propiedad, valor) {
            target[propiedad] = valor;
            if (["precio", "costo", "qtyCompra", "qtyVenta", "tiempo"].includes(propiedad)) {
                // Recalcular propiedades derivadas
                // (Aquí podrías llamar a métodos para actualizar utilidadUnitaria, utilidadTotal y UPH, o usar getters como en el ejemplo anterior.)
                console.log(`Se modificó ${propiedad}. Recalculando valores...`);
                // lógica de actualización o, mejor aún, si ya tienes getters, no necesitas hacer nada aquí, los getters se encargarán del recálculo cuando se acceda a las propiedades.
                objeto.calcularUtilidadUnitaria();
                objeto.calcularUtilidadTotal();
                objeto.calcularUpH();

            }
            return true;
        }
    });
}

const poolModificadores = [
    new Objeto({ nombre: "Giga Grow", codigo: "GG", clase: MODIFICADOR, tipo: "UV", imagen: null, placeHolder: "uno", orientacion: "N", color: "#FFC0CB", formaAoE: barraN, efectoTiempo: 0.8, efectoCosecha: .25, costo: 5000, precio: 0, esConsumible: false, qtyCompra: 1, qtyVenta: 0, tiempo: 0, reduccionTiempo: 0 }),
    new Objeto({ nombre: "Giga Grow", codigo: "GG", clase: MODIFICADOR, tipo: "UV", imagen: null, placeHolder: "uno", orientacion: "W", color: "#FFC0CB", formaAoE: barraW, efectoTiempo: 0.8, efectoCosecha: .25, costo: 5000, precio: 0, esConsumible: false, qtyCompra: 1, qtyVenta: 0, tiempo: 0, reduccionTiempo: 0 }),
    new Objeto({ nombre: "Giga Grow", codigo: "GG", clase: MODIFICADOR, tipo: "UV", imagen: null, placeHolder: "uno", orientacion: "S", color: "#FFC0CB", formaAoE: barraS, efectoTiempo: 0.8, efectoCosecha: .25, costo: 5000, precio: 0, esConsumible: false, qtyCompra: 1, qtyVenta: 0, tiempo: 0, reduccionTiempo: 0 }),
    new Objeto({ nombre: "Giga Grow", codigo: "GG", clase: MODIFICADOR, tipo: "UV", imagen: null, placeHolder: "uno", orientacion: "E", color: "#FFC0CB", formaAoE: barraE, efectoTiempo: 0.8, efectoCosecha: .25, costo: 5000, precio: 0, esConsumible: false, qtyCompra: 1, qtyVenta: 0, tiempo: 0, reduccionTiempo: 0 }),
    new Objeto({ nombre: "Mega Grow", codigo: "MG", clase: MODIFICADOR, tipo: "UV", imagen: null, placeHolder: null, orientacion: "N", color: "#AA336A", formaAoE: posteN, efectoTiempo: 0.8, efectoCosecha: .25, costo: 3000, precio: 0, esConsumible: false, qtyCompra: 1, qtyVenta: 0, tiempo: 0, reduccionTiempo: 0 }),
    new Objeto({ nombre: "Mega Grow", codigo: "MG", clase: MODIFICADOR, tipo: "UV", imagen: null, placeHolder: null, orientacion: "W", color: "#AA336A", formaAoE: posteW, efectoTiempo: 0.8, efectoCosecha: .25, costo: 3000, precio: 0, esConsumible: false, qtyCompra: 1, qtyVenta: 0, tiempo: 0, reduccionTiempo: 0 }),
    new Objeto({ nombre: "Mega Grow", codigo: "MG", clase: MODIFICADOR, tipo: "UV", imagen: null, placeHolder: null, orientacion: "S", color: "#AA336A", formaAoE: posteS, efectoTiempo: 0.8, efectoCosecha: .25, costo: 3000, precio: 0, esConsumible: false, qtyCompra: 1, qtyVenta: 0, tiempo: 0, reduccionTiempo: 0 }),
    new Objeto({ nombre: "Mega Grow", codigo: "MG", clase: MODIFICADOR, tipo: "UV", imagen: null, placeHolder: null, orientacion: "E", color: "#AA336A", formaAoE: posteE, efectoTiempo: 0.8, efectoCosecha: .25, costo: 3000, precio: 0, esConsumible: false, qtyCompra: 1, qtyVenta: 0, tiempo: 0, reduccionTiempo: 0 }),

    new Objeto({ nombre: "Lane Sprinkler", codigo: "LS", clase: MODIFICADOR, tipo: "Sprinklers", imagen: null, placeHolder: "dos", orientacion: "V", color: "#9F2B68", formaAoE: ladosV, efectoTiempo: 0.8, efectoCosecha: 0, costo: 8000, precio: 0, esConsumible: false, qtyCompra: 1, qtyVenta: 0, tiempo: 0, reduccionTiempo: 0 }),
    new Objeto({ nombre: "Lane Sprinkler", codigo: "LS", clase: MODIFICADOR, tipo: "Sprinklers", imagen: null, placeHolder: "dos", orientacion: "H", color: "#9F2B68", formaAoE: ladosH, efectoTiempo: 0.8, efectoCosecha: 0, costo: 8000, precio: 0, esConsumible: false, qtyCompra: 1, qtyVenta: 0, tiempo: 0, reduccionTiempo: 0 }),
    new Objeto({ nombre: "Rotary Sprinkler", codigo: "RS", clase: MODIFICADOR, tipo: "Sprinklers", imagen: null, placeHolder: "dos", orientacion: "", color: "#800020", formaAoE: dona, efectoTiempo: 0.8, efectoCosecha: 0, costo: 5000, precio: 0, esConsumible: false, qtyCompra: 1, qtyVenta: 0, tiempo: 0, reduccionTiempo: 0 }),

    new Objeto({ nombre: "Goat Fertilizer", codigo: "GF", clase: MODIFICADOR, tipo: "Fertilizer", imagen: null, placeHolder: null, orientacion: "", color: "#CD7F32", formaAoE: dona, efectoTiempo: 2 / 3, efectoCosecha: 0.5, costo: 500, precio: 0, esConsumible: true, qtyCompra: 1, qtyVenta: 1, tiempo: 24, reduccionTiempo: 0 }),
    new Objeto({ nombre: "Bull Fertilizer", codigo: "BF", clase: MODIFICADOR, tipo: "Fertilizer", imagen: null, placeHolder: "medio", orientacion: "", color: "#A52A2A", formaAoE: donaM, efectoTiempo: 2 / 3, efectoCosecha: 0.5, costo: 1500, precio: 0, esConsumible: true, qtyCompra: 1, qtyVenta: 1, tiempo: 24, reduccionTiempo: 0 }),
    new Objeto({ nombre: "Elephant Fertilizer", codigo: "EF", clase: MODIFICADOR, tipo: "Fertilizer", imagen: null, placeHolder: "grande", orientacion: "", color: "#DAA06D", formaAoE: donaG, efectoTiempo: 2 / 3, efectoCosecha: 0.5, costo: 4500, precio: 0, esConsumible: true, qtyCompra: 1, qtyVenta: 1, tiempo: 24, reduccionTiempo: 0 })

]

const poolPlantas = [
    crearObjetoProxy(new Objeto({ nombre: "Sandía", codigo: "S", clase: PLANTA, tipo: "Planta", imagen: null, placeHolder: null, orientacion: "", color: "#03a572", formaAoE: null, efectoTiempo: 0, efectoCosecha: 0, costo: 300, precio: 200, esConsumible: true, qtyCompra: 5, qtyVenta: 1, tiempo: 6, reduccionTiempo: 0 })),
    crearObjetoProxy(new Objeto({ nombre: "Calabaza", codigo: "C", clase: PLANTA, tipo: "Planta", imagen: null, placeHolder: null, orientacion: "", color: "#FF7518", formaAoE: null, efectoTiempo: 0, efectoCosecha: 0, costo: 250, precio: 100, esConsumible: true, qtyCompra: 5, qtyVenta: 1, tiempo: 2, reduccionTiempo: 0 })),

    crearObjetoProxy(new Objeto({ nombre: "Zanahoria", codigo: "Z", clase: PLANTA, tipo: "Planta", imagen: null, placeHolder: null, orientacion: "", color: "#FFC000", formaAoE: null, efectoTiempo: 0, efectoCosecha: 0, costo: 0, precio: 20, esConsumible: false, qtyCompra: 1, qtyVenta: 1, tiempo: 2, reduccionTiempo: 0 })),
    crearObjetoProxy(new Objeto({ nombre: "Papa", codigo: "P", clase: PLANTA, tipo: "Planta", imagen: null, placeHolder: null, orientacion: "", color: "#4C3228", formaAoE: null, efectoTiempo: 0, efectoCosecha: 0, costo: 0, precio: 1, esConsumible: false, qtyCompra: 1, qtyVenta: 11, tiempo: 1, reduccionTiempo: 0 })),
    crearObjetoProxy(new Objeto({ nombre: "Uva", codigo: "U", clase: PLANTA, tipo: "Planta", imagen: null, placeHolder: null, orientacion: "", color: "#4c00b0", formaAoE: null, efectoTiempo: 0, efectoCosecha: 0, costo: 0, precio: 4, esConsumible: false, qtyCompra: 1, qtyVenta: 6, tiempo: 2, reduccionTiempo: 0 })),
    crearObjetoProxy(new Objeto({ nombre: "Nabo", codigo: "N", clase: PLANTA, tipo: "Planta", imagen: null, placeHolder: null, orientacion: "", color: "#c3c8ac", formaAoE: null, efectoTiempo: 0, efectoCosecha: 0, costo: 0, precio: 1, esConsumible: false, qtyCompra: 1, qtyVenta: 22, tiempo: 2, reduccionTiempo: 0 })),

    crearObjetoProxy(new Objeto({ nombre: "Lunar", codigo: "L", clase: PLANTA, tipo: "Planta", imagen: null, placeHolder: null, orientacion: "", color: "#F0EAD6", formaAoE: null, efectoTiempo: 0, efectoCosecha: 0, costo: 0, precio: 5, esConsumible: false, qtyCompra: 1, qtyVenta: 5, tiempo: 2, reduccionTiempo: 0 })),

    crearObjetoProxy(new Objeto({ nombre: "Fresa", codigo: "F", clase: PLANTA, tipo: "Planta", imagen: null, placeHolder: null, orientacion: "", color: "#e42e67", formaAoE: dona, efectoTiempo: 0, efectoCosecha: 0, costo: 0, precio: 2, esConsumible: false, qtyCompra: 1, qtyVenta: 5, tiempo: 2, reduccionTiempo: 0.5 })),
    crearObjetoProxy(new Objeto({ nombre: "Cebolla", codigo: "O", clase: PLANTA, tipo: "Planta", imagen: null, placeHolder: null, orientacion: "", color: "#F0EA00", formaAoE: dona, efectoTiempo: 0, efectoCosecha: 0, costo: 0, precio: 3, esConsumible: false, qtyCompra: 1, qtyVenta: 6, tiempo: 3, reduccionTiempo: 0 }))

]

const placeHolderObj = new Objeto({ nombre: "X", codigo: "X", clase: "H", tipo: "", imagen: null, placeHolder: "", orientacion: "", color: "", formaAoE: null, efectoTiempo: 0, efectoCosecha: 0, costo: 0, precio: 0, esConsumible: false, qtyCompra: 0, qtyVenta: 0, tiempo: 0 })

const florObj = new Objeto({ nombre: "Flor", codigo: "R", clase: "F", tipo: "Flor", imagen: null, placeHolder: null, orientacion: "", color: "#FFEBED", formaAoE: null, efectoTiempo: 0, efectoCosecha: 0, costo: 0, precio: 0, esConsumible: false, qtyCompra: 0, qtyVenta: 0, tiempo: 0 })


const poolObjetos = poolModificadores.concat(poolPlantas);



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
        this.uPH = 0;

        if (tipoModificador == "Fertilizer") { this.uPH = -(this.costo / 24) } else { this.uPH = 0 };
    }
}

class AreaEfecto {
    constructor(forma) {
        this.forma = forma;
    }
}

class Restricciones {
    constructor(Plantable, Cero, GG, MG, LS, RS, GF, BF, EF, C, S, Z, P, U, N, F, O, L) {
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
        this.O = O;
        this.L = L;
    }
}


const geografia = [
    [true, true, true, true, true, true, true, true],
    [true, true, true, true, true, true, true, true],
    [true, true, true, true, true, true, true, true],
    [true, true, true, true, true, true, true, true],
    [true, true, true, true, true, true, true, true],
    [true, true, true, true, true, true, true, true],
    [false, false, true, true, true, true, true, true],
    [false, false, true, true, true, true, true, true],
]

const mapaGeografia = [];

//(objeto, cosecha, conUV, conFertilizante, conAgua, conFresa,7 uvTiempo, uvCosecha, fertTiempo, fertCosecha, aguaTiempo,12 fresaTiempo, colorAdicional)

for (let i = 0; i < geografia.length; i++) {
    mapaGeografia[i] = []; // Inicializar cada fila del mapa
    for (let j = 0; j < geografia[i].length; j++) {
        mapaGeografia[i][j] = geografia[i][j]
            ? new Celda(null, 0, false, false, false, false, 1, 0, 1, 0, 1, 0, "")  // Crear Celda si es true
            : null; // Asignar null si es false
    }
}


const testObj = poolModificadores[1]
mapaGeografia[0][5].objeto = poolModificadores[1]



function getPlaceHolderCells(mapaGeografia, objeto, fila, columna) {
    let celdasPlaceHolder = [];
    let celdasEnRango = true;

    const { placeHolder, orientacion } = objeto;
    //console.log(objeto.placeHolder, objeto.orientacion);

    switch (placeHolder) {
        case "uno":
            if (orientacion == "N") {
                celdasPlaceHolder.push([[fila], [columna - 1]]);
            } else if (orientacion == "S") {
                celdasPlaceHolder.push([[fila], [columna + 1]]);
            } else if (orientacion == "E") {
                celdasPlaceHolder.push([[fila + 1], [columna]]);
            } else if (orientacion == "W") {
                celdasPlaceHolder.push([[fila + 1], [columna]]);
            }

            break;
        case "dos":
            if (orientacion == "V") {
                celdasPlaceHolder.push([[fila + 1], [columna]]);
                celdasPlaceHolder.push([[fila + 2], [columna]]);
            } else if (orientacion == "H") {
                celdasPlaceHolder.push([[fila], [columna + 1]]);
                celdasPlaceHolder.push([[fila], [columna + 2]]);
            }
            break;
        case "medio":
            celdasPlaceHolder.push([[fila + 1], [columna]]);
            celdasPlaceHolder.push([[fila + 0], [columna + 1]]);
            celdasPlaceHolder.push([[fila + 1], [columna + 1]]);
            break;
        case "grande":
            celdasPlaceHolder.push([[fila + 1], [columna]]);
            celdasPlaceHolder.push([[fila + 2], [columna]]);
            celdasPlaceHolder.push([[fila + 0], [columna + 1]]);
            celdasPlaceHolder.push([[fila + 1], [columna + 1]]);
            celdasPlaceHolder.push([[fila + 2], [columna + 1]]);
            celdasPlaceHolder.push([[fila + 0], [columna + 2]]);
            celdasPlaceHolder.push([[fila + 1], [columna + 2]]);
            celdasPlaceHolder.push([[fila + 2], [columna + 2]]);
            break;
        default:
            return celdasPlaceHolder; // Manejar casos no definidos
    }

    const filasMapa = mapaGeografia.length;
    const columnasMapa = mapaGeografia[0].length;

    for (const celda of celdasPlaceHolder) {
        const fila = celda[1][0];
        const columna = celda[0][0];

        // Verificar si la fila y columna están dentro de los límites del mapa.
        // También se verifica si la celda existe (no es null) en casos donde las filas 
        // pueden tener diferente longitud como en tu ejemplo.

        if (fila < 0 || fila >= filasMapa || columna < 0 || columna >= columnasMapa || mapaGeografia[fila] === null || mapaGeografia[fila][columna] === null) {
            celdasEnRango = false; // Si alguna celda está fuera de los límites, retorna falso
        }
    }


    celdasPlaceHolder = celdasPlaceHolder.filter(celda => {
        const fila = celda[1][0];
        const columna = celda[0][0];

        // Verificar límites y existencia de la celda
        return (fila >= 0 && fila < filasMapa &&
            columna >= 0 && columna < columnasMapa &&
            mapaGeografia[fila] !== null &&
            mapaGeografia[fila][columna] !== null);
    });

    //console.log("celdasEnRango", celdasEnRango, "celdasPlaceHolder", celdasPlaceHolder);


    return { celdasEnRango, celdasPlaceHolder };
}

function celdaLibre(mapaGeografia, fila, columna) {
    if (mapaGeografia[fila][columna].objeto == null) {
        return true;
    } else {
        return false;
    }
}

function cabe(mapaGeografia, coordenadas) {
    return coordenadas.every(([filaRelativa, columnaRelativa]) => {
        const celda = mapaGeografia[filaRelativa][columnaRelativa];
        return celda instanceof Celda && celda.objeto === null;
    });
}

function llenarConPlaceHolders(mapaGeografia, coordenadas, objPlaceHolder) {
    return coordenadas.forEach(([filaRelativa, columnaRelativa]) => {
        mapaGeografia[filaRelativa][columnaRelativa].objeto = new objPlaceHolder();
    });
}


function fillAoECells(mapaGeografia, objeto, fila, columna) {
    //console.log(objeto);
    const posicionesRelativasObjetos = getPosicionesRelativasNew(fila, columna, objeto.formaAoE, mapaGeografia[0].length, mapaGeografia.length, true);
    posicionesRelativasObjetos.forEach(([filaRelativa, columnaRelativa]) => {
        const filaActual = filaRelativa;
        const columnaActual = columnaRelativa;
        switch (objeto.tipo) {
            case "UV":
                mapaGeografia[filaActual][columnaActual].uvTiempo = objeto.efectoTiempo;
                mapaGeografia[filaActual][columnaActual].uvCosecha = objeto.efectoCosecha;
                mapaGeografia[filaActual][columnaActual].conUV = true;
                break;
            case "Fertilizer":
                mapaGeografia[filaActual][columnaActual].fertTiempo = objeto.efectoTiempo;
                mapaGeografia[filaActual][columnaActual].fertCosecha = objeto.efectoCosecha;
                mapaGeografia[filaActual][columnaActual].conFertilizante = true;
                break;
            case "Sprinklers":
                mapaGeografia[filaActual][columnaActual].aguaTiempo = objeto.efectoTiempo;
                mapaGeografia[filaActual][columnaActual].conAgua = true;
                break;
            case "Planta":
                //mapaGeografia[filaActual][columnaActual].fresaTiempo = objeto.efectoTiempo;
                if (mapaGeografia[filaActual][columnaActual].objeto != null) {
                    if (mapaGeografia[filaActual][columnaActual].objeto.nombre != "Fresa" && mapaGeografia[filaActual][columnaActual].objeto.tipo != "Fertilizer") {
                        mapaGeografia[filaActual][columnaActual].fresaTiempo += objeto.reduccionTiempo;
                    }
                }
                mapaGeografia[filaActual][columnaActual].conFresa = true;
                break;
            default:
                console.warn("Tipo de modificador desconocido.");
                break;
        }
    });
}


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
function getPosicionesRelativasNew(fila, columna, forma, columnas, filas, esAE) {
    let posicionesRelativas = [];
    let filaSolido = -1;
    let columnaSolido = -1;
    let encontrado = false;

    //console.log(forma);


    // Encuentra las coordenadas de la "M" o PLANTA dentro de la forma
    if (Array.isArray(forma) && Array.isArray(forma[0])) { // Verificar si es bidimensional
        // Encuentra las coordenadas de la "M" o PLANTA dentro de la forma
        for (let i = 0; i < forma.length; i++) {
            for (let j = 0; j < forma[i].length; j++) {
                if (forma[i][j] === MODIFICADOR || forma[i][j] === PLANTA) {
                    filaSolido = i;
                    columnaSolido = j;
                    break; // Salir del bucle interno si se encuentra
                }
            }
            if (filaSolido !== -1) {
                break; // Salir del bucle externo si se encuentra
            }
        }
    } else if (Array.isArray(forma)) { // Si es unidimensional
        for (let j = 0; j < forma.length; j++) {
            if (forma[j] === MODIFICADOR || forma[j] === PLANTA) {
                columnaSolido = j;
                break; // Salir del bucle si se encuentra
            }
        }
    }

    // Si no se encuentra ni MODIFICADOR ni PLANTA, retornar un array vacío
    if (filaSolido === -1 && columnaSolido === -1) {
        console.warn("No se encontró MODIFICADOR ni PLANTA en la forma.");
        return [];
    }

    // Calcula las posiciones relativas
    for (let i = 0; i < (Array.isArray(forma[0]) ? forma.length : 1); i++) { // Iterar sobre filas o solo una "fila" si es 1D
        for (let j = 0; j < (Array.isArray(forma[0]) ? forma[i].length : forma.length); j++) { // Iterar sobre columnas o sobre el array 1D
            const valorActual = Array.isArray(forma[0]) ? forma[i][j] : forma[j];
            if (!esAE && (valorActual === PLANTA || valorActual === MODIFICADOR)) {
                let filaAbs = fila + (i - filaSolido);
                let columnaAbs = columna + (j - columnaSolido);

                if (filaAbs >= 0 && filaAbs < filas && columnaAbs >= 0 && columnaAbs < columnas) {
                    posicionesRelativas.push([filaAbs, columnaAbs]);
                } else {
                    //console.error("Error: Posición fuera del mapa:", filaAbs, columnaAbs);
                    dentroDeMapa = false;
                    return [];
                }
            } else if (esAE && valorActual === AREA_EFECTO) {
                let filaAbs = fila + (i - filaSolido);
                let columnaAbs = columna + (j - columnaSolido);

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

function getPosicionesVecinas(mapa, fila, columna) {
    const offsets = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1],
    ];

    return offsets.map(([dx, dy]) => [fila + dx, columna + dy])
        .filter(([i, j]) => i >= 0 && i < mapa.length && j >= 0 && j < mapa[0].length);
}

function getCebollasExtras(mapa, fila, columna) {

    const posicionesVecinas = getPosicionesVecinas(mapa, fila, columna);
    let papasExtra = 0;

    posicionesVecinas.forEach(([filaActual, columnaActual]) => {
        if (
            mapa[filaActual][columnaActual].objeto &&
            mapa[filaActual][columnaActual].objeto.clase === PLANTA
        ) {
            papasExtra++;
        }
    });

    return papasExtra;

}



function generarPosicionAleatoria(filas, columnas, centrar = false) {
    let fila, columna;

    if (centrar) {
        // Distribución normal para centrar la posición (con mayor probabilidad cerca del centro)
        const desviacionFila = filas / filas * 5; // Ajusta este valor para controlar la dispersión
        const desviacionColumna = columnas / columnas * 5; // Ajusta este valor para controlar la dispersión

        do {
            fila = Math.round(randomNormal(filas / 2, desviacionFila));
        } while (fila < 0 || fila >= filas);
        //} while (fila < 0 || fila >= filas || fila % 2 !== 0);


        do {
            columna = Math.round(randomNormal(columnas / 2, desviacionColumna));
        } while (columna < 0 || columna >= columnas);
        //} while (columna < 0 || columna >= columnas || columna % 2 !== 0);


    } else {
        // Distribución uniforme (como en la función original)
        // fila = Math.floor(Math.random() * Math.floor(filas / 2)) * 2;
        // columna = Math.floor(Math.random() * Math.floor(columnas / 2)) * 2;

        fila = Math.floor(Math.random() * filas);
        columna = Math.floor(Math.random() * columnas);
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
    const indiceAleatorio = Math.floor(Math.random() * poolPlantas.length);
    const tipoPlanta = poolPlantas[indiceAleatorio];

    return tipoPlanta;
}

function generarModificadorAleatorio() {
    const indiceAleatorio = Math.floor(Math.random() * poolModificadores.length);
    const tipoModificador = poolModificadores[indiceAleatorio];

    return tipoModificador;

}

function generarObjetoAleatorio() {
    const indiceAleatorio = Math.floor(Math.random() * poolObjetos.length);
    const tipoObjeto = poolObjetos[indiceAleatorio];

    return tipoObjeto;

}


// Función para crear un mapa aleatorio
function crearMapaAleatorio(filas, columnas, numPlantas, numModificadores, restricciones) {
    // Validaciones para evitar bucles infinitos
    if ((numPlantas + numModificadores) > (filas * columnas) / 1) {
        throw new Error("El número de plantas o modificadores es mayor que el espacio disponible en el mapa.");
    }

    const geografia = Array.from({ length: filas }, () => Array(columnas).fill(true));

    let mapaGeografia = [];

    for (let i = 0; i < filas; i++) {
        mapaGeografia[i] = []; // Inicializar cada fila del mapa
        for (let j = 0; j < columnas; j++) {
            mapaGeografia[i][j] = geografia[i][j]
                ? new Celda(null, 0, false, false, false, false, 1, 0, 1, 0, 1, 0, "") // Crear Celda si es true
                : null; // Asignar null si es false
        }
    }

    let limites = Object.entries(restricciones)
        .map(([elemento, cantidad]) => ({
            elemento,
            cantidad,
        }));

    limites.forEach(limite => {
        limite.colocados = 0;
    })

    ///// IMPORTANTE PARE EVITAR BUCLE INFINITO
    const limitesModificadores = (
        restricciones.GF + restricciones.BF + restricciones.EF +
        restricciones.GG + restricciones.MG +
        restricciones.LS + restricciones.RS
    );
    const limitesPlantas = (
        restricciones.C + restricciones.S +
        restricciones.Z + restricciones.P + restricciones.U + restricciones.N +
        restricciones.F + restricciones.O +
        restricciones.L
    );


    if (numPlantas > limitesPlantas) {
        numPlantas = limitesPlantas;
    } else if (numPlantas > restricciones.Plantable) {
        numPlantas = restricciones.Plantable;
    }

    let plantasColocadas = 0;
    let modificadoresColocados = 0;
    let intentos = filas * columnas * 7 * 2; // Intentos máximos para ambos

    while (
        intentos > 0 &&
        (plantasColocadas != numPlantas || modificadoresColocados != numModificadores) &&
        (plantasColocadas != limitesPlantas || modificadoresColocados != limitesModificadores)
    ) {
        /*
        console.log("intentos",intentos,"plantasColocadas",plantasColocadas,"modificadoresColocados",modificadoresColocados,"numPlantas",numPlantas,
            "numModificadores",numModificadores,"limitesPlantas",limitesPlantas,"limitesModificadores",limitesModificadores);
            */
        const colocarPlanta = Math.random() < 0.5 && plantasColocadas < numPlantas && plantasColocadas < limitesPlantas; // 85% de probabilidad si aún se pueden colocar plantas

        let objeto, limiteObjeto, indexObjeto, colocados;

        if (colocarPlanta) {
            objeto = generarPlantaAleatoria();
        } else if (modificadoresColocados < numModificadores) { // Intenta colocar un modificador si no se colocó una planta y aún se pueden colocar modificadores
            objeto = generarModificadorAleatorio();
        } else { // No se pueden colocar ni plantas ni modificadores, salta la iteracion
            //no pudo colocar ni planta y límite de modificador topado
            intentos--;
            continue;
        }

        limiteObjeto = limites.find((element) => element.elemento == objeto.codigo).cantidad;
        indexObjeto = limites.findIndex((element) => element.elemento == objeto.codigo);
        colocados = limites.find((element) => element.elemento == objeto.codigo).colocados;

        if (colocados >= limiteObjeto) {
            //console.log("supera límite");
            intentos--;
            continue;
        }

        const posicion = generarPosicionAleatoria(filas, columnas, true);
        const fila = posicion[0];
        const columna = posicion[1];

        //console.log("objeto elegido",  objeto.nombre, "posición:",fila,columna)
        if (celdaLibre(mapaGeografia, fila, columna)) {
            //console.log("celda libre", fila, columna)

            //console.log("objeto.placeHolder", objeto, objeto.placeHolder);

            if (objeto.placeHolder != null) {

                const coordenadas = getPlaceHolderCells(mapaGeografia, objeto, fila, columna);
                //console.log("objeto", objeto.nombre, "coordenadas", coordenadas);

                if (!coordenadas.celdasEnRango) {


                    //console.log("coordenadas.celdasEnRango",coordenadas.celdasEnRango);
                    continue;
                } else {
                    const celdasAOcupar = getPlaceHolderCells(mapaGeografia, objeto, fila, columna);
                    if (cabe(mapaGeografia, celdasAOcupar.celdasPlaceHolder)) {
                        //console.log("cabe", objeto.nombre);
                        llenarConPlaceHolders(mapaGeografia, coordenadas.celdasPlaceHolder, ObjPlaceHolder);
                    } else {
                        // console.log("no cabe", objeto.nombre);
                        continue;
                    }
                }
            } else {
                //console.log("sin place holder");
            }
            //console.log("objeto colocado", objeto.nombre);

            mapaGeografia[fila][columna].objeto = objeto;

            limites[indexObjeto].colocados++;
            if (colocarPlanta) {
                plantasColocadas++;
            } else {
                modificadoresColocados++;
            }
        } else {
            //console.log("celda ocupada");
        }
        intentos--;

        /*console.log(
            "condición",(plantasColocadas < numPlantas || modificadoresColocados < numModificadores) &&
            intentos > 0 &&
            plantasColocadas < limitesPlantas &&
            modificadoresColocados < limitesModificadores,"intentos",intentos,"plantasColocadas",plantasColocadas,"modificadoresColocados",modificadoresColocados,"numPlantas",numPlantas,
            "numModificadores",numModificadores,"limitesPlantas",limitesPlantas,"limitesModificadores",limitesModificadores,
        
        );*/
    }

    //console.log("intentos final", intentos);

    mapaGeografia.forEach((fila, indiceFila) => {
        fila.forEach((celda, indiceColumna) => {
            if (celda.objeto?.formaAoE) {
                //console.log("llenando AoE de:", objeto, objeto.formaAoE);
                fillAoECells(mapaGeografia, celda.objeto, indiceFila, indiceColumna);
            }
        });
    });




    // Validaciones adicionales (opcional)
    if (plantasColocadas < numPlantas) {
        //console.warn("No se pudieron colocar todas las plantas. Se colocaron " + plantasColocadas + " de " + numPlantas);
    }
    if (modificadoresColocados < numModificadores) {
        //console.warn("No se pudieron colocar todos los modificadores. Se colocaron " + modificadoresColocados + " de " + numModificadores);
    }


    const mapaCodificado = mapaGeografia.map(fila => fila.map(celda => celda.objeto?.codigoLargo ?? " "));
    const matrizAFU = mapaGeografia.map(fila => fila.map(celda => celda.conAgua && celda.conFertilizante && celda.conUV));
    const matrizAFUS = mapaGeografia.map(fila => fila.map(celda => celda.conAgua && celda.conFertilizante && celda.conUV && celda.conFresa));

    //const aoeCapa = mapaGeografia.map(fila => fila.map(celda => celda.conAgua || celda.conFertilizante || celda.conUV));



    return {
        mapaGeografia, mapaCodificado, matrizAFU, matrizAFUS
        //aoeCapa
    };
}


function obtenerObjetoPorCodigo(codigoLargo) {
    // Busca en los tipos de modificadores
    const modificador = poolModificadores.find(mod => mod.codigoLargo === codigoLargo);
    if (modificador) {
        return modificador;
    }

    // Busca en los tipos de plantas
    const planta = poolPlantas.find(pl => pl.codigoLargo === codigoLargo);
    if (planta) {
        return planta;
    }

    // Busca en los tipos de plantas
    if (codigoLargo == "X" || codigoLargo == "X") {
        return new ObjPlaceHolder();
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

    //console.log(matrizCultivos);
    return matrizCultivos;
}


function getListado(capa) {
    // Usando el método flat() con una profundidad de 1
    const listadoObjetos = capa.flat(1).filter(elemento => elemento !== null);
    return listadoObjetos;
}

// Función para calcular la cosecha
function calcularMapa(mapaGeografia) {

    for (let i = 0; i < mapaGeografia.length; i++) {
        for (let j = 0; j < mapaGeografia[i].length; j++) {
            if (mapaGeografia[i][j].objeto != null && (mapaGeografia[i][j].objeto.clase == "P" || mapaGeografia[i][j].objeto.tipo === "Fertilizer") && !(mapaGeografia[i][j].objeto instanceof ObjPlaceHolder)) {

                if (!mapaGeografia[i][j].objeto.esConsumible) {
                    mapaGeografia[i][j].modCosecha = 1 + (mapaGeografia[i][j].fertCosecha + mapaGeografia[i][j].uvCosecha);
                    mapaGeografia[i][j].modTiempo = (mapaGeografia[i][j].aguaTiempo);
                } else if (mapaGeografia[i][j].objeto.esConsumible) {
                    mapaGeografia[i][j].modTiempo = (mapaGeografia[i][j].fertTiempo) * (mapaGeografia[i][j].uvTiempo) * (mapaGeografia[i][j].aguaTiempo);
                };

                if (mapaGeografia[i][j].objeto.codigo === "O") {
                    mapaGeografia[i][j].cebollasExtra = getCebollasExtras(mapaGeografia,i,j);
                };

                mapaGeografia[i][j].adicionalPorFresa = (mapaGeografia[i][j].fresaTiempo ?? 0) / mapaGeografia[i][j].objeto.tiempo

                mapaGeografia[i][j].cosecha = mapaGeografia[i][j].objeto.qtyVenta;
                mapaGeografia[i][j].tiempo = mapaGeografia[i][j].objeto.tiempo;

                mapaGeografia[i][j].totalCosecha = mapaGeografia[i][j].modCosecha * mapaGeografia[i][j].cosecha + mapaGeografia[i][j].adicionalPorFresa + (mapaGeografia[i][j]?.cebollasExtra ?? 0);
                mapaGeografia[i][j].utilidad = mapaGeografia[i][j].totalCosecha * mapaGeografia[i][j].objeto.utilidadUnitaria;
                mapaGeografia[i][j].totalTiempo = mapaGeografia[i][j].modTiempo * mapaGeografia[i][j].tiempo;
                mapaGeografia[i][j].uPH = mapaGeografia[i][j].utilidad / mapaGeografia[i][j].totalTiempo;

            }
        }
    }

    // Calcular la cosecha total
    const cosechaTotal = mapaGeografia.flatMap(fila => fila.map(celda => celda.totalCosecha)).reduce((suma, cosecha) => suma + cosecha, 0);

    const cosechaUph = Math.round(

        mapaGeografia
            .flatMap(fila => fila.map(celda => celda.uPH))
            .filter(uPH => !isNaN(uPH))
            .reduce((suma, uPH) => suma + uPH, 0)

        * 100) / 100;


    return { mapaGeografia, cosechaTotal, cosechaUph };
}


// Dibuja el mapa
// Función para dibujar el mapa en SVG (modificada)
function dibujarMapaSVG(svg, mapa, filas, columnas) { // Recibe la capa de area de efecto

    svg.selectAll(".area-efecto").remove();

    // Actualizar las celdas existentes o crear nuevas

    const celdas = svg.selectAll(".celda")
        .data(mapa.flatMap((fila, i) => fila.map((celda, j) => ({
            fila: i,
            columna: j,
            planta: celda?.objeto?.clase === PLANTA,  // Verifica si es una planta
            modificador: celda?.objeto?.clase === MODIFICADOR, // Verifica si es un modificador
            objeto: celda?.objeto
        }))));

    let aoeModificadores = mapa.map(fila => fila.map(celda => celda.conAgua || celda.conFertilizante || celda.conUV));

    // Crea los datos para las celdas de área de efecto
    aoeModificadores = aoeModificadores.flatMap((fila, i) => fila.map((valor, j) => ({
        fila: i,
        columna: j,
        valor: valor
    })));

    // Actualizar las celdas existentes
    celdas
        .attr("x", d => d.columna * tamanoCelda)
        .attr("y", d => d.fila * tamanoCelda)
        .attr("width", tamanoCelda)  // Asegúrate de establecer el ancho y el alto
        .attr("height", tamanoCelda) // en las celdas existentes también
        .style("fill", d => {
            if (d.objeto) { // Verificar si d.objeto existe antes de acceder a sus propiedades
                if (d.planta) {
                    return d.objeto.color;
                } else if (d.modificador) {
                    return "red";
                    //return d.objeto.color;
                } else if (d.objeto instanceof ObjPlaceHolder) {
                    return "darkred";
                    //return d.objeto.color;
                } else {
                    return "black"; // O el color que quieras para otros objetos
                }
            } else {
                return "gray"; // Color para celdas vacías
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
            if (d.objeto) { // Verificar si d.objeto existe antes de acceder a sus propiedades
                if (d.planta) {
                    return d.objeto.color;
                } else if (d.modificador) {
                    return "red";
                    //return d.objeto.color;
                } else if (d.objeto instanceof ObjPlaceHolder) {
                    return "darkred";
                    //return d.objeto.color;
                } else {
                    return "black"; // O el color que quieras para otros objetos
                }
            } else {
                return "gray"; // Color para celdas vacías
            }
        });

    // Eliminar las celdas que ya no existen
    celdas.exit().remove();

    const areaEfectoCeldas = svg.selectAll(".area-efecto")
        .data(aoeModificadores.filter(d => d.valor));

    areaEfectoCeldas.enter()
        .append("rect")
        .attr("class", "area-efecto")
        .attr("x", d => d.columna * tamanoCelda)
        .attr("y", d => d.fila * tamanoCelda)
        .attr("width", tamanoCelda)
        .attr("height", tamanoCelda)
        .style("fill", "rgba(255, 25, 0, 0.25)");

    areaEfectoCeldas.exit().remove();

    // Dibujar los áreas de efecto de los modificadores (igual que antes)
    /*aoeModificadores.forEach((fila, i) => {
        fila.forEach((modificador, j) => {
            if (modificador) {
                dibujarAreaEfectoSVG(svg, aoeModificadores, tamanoCelda);
            }
        });
    });
*/

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

    console.log("mapaAleatorio", mapaAleatorio);


    // Calcular la cosechacapaPlantas, capaAreaEfecto, capaModCosecha, capaModTiempo, capaFertilizanteCosecha, capaUvCosecha, capaUvTiempo,capaFertilizanteTiempo,capaAspersor)

    const cosechaTotal = calcularMapa(mapaAleatorio.mapaGeografia);


    console.log("cosechaTotal", cosechaTotal);

    dibujarMapaSVG(svg, mapaAleatorio.mapaGeografia, filas, columnas);

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


    const modificadores = ["GG", "MG", "LS", "RS", "GF", "BF", "EF"]; // Array de modificadores

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




// Función para crear un mapa aleatorio
function crearMapaCodificado(filas, columnas, codigoMapa, restricciones = new Restricciones(999, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999)) {

    const geografia = Array.from({ length: filas }, () => Array(columnas).fill(true));

    let mapaGeografia = [];

    for (let i = 0; i < filas; i++) {
        mapaGeografia[i] = []; // Inicializar cada fila del mapa
        for (let j = 0; j < columnas; j++) {
            mapaGeografia[i][j] = geografia[i][j]
                ? new Celda(null, 0, false, false, false, false, 1, 0, 1, 0, 1, 0, "") // Crear Celda si es true
                : null; // Asignar null si es false
        }
    }

    const mapaValidado = validarRestriccionesCodificacionMapa(codigoMapa, restricciones);
    //console.log(mapaValidado);

    if (!mapaValidado.cumpleLimites) {
        codigoMapa = mapaValidado.codigoMapa;
        //console.log("no cumple restricciones", mapaValidado.codigoMapa);
        //console.log("no cumple restricciones");
    }

    const matriz = decodificarMapa(codigoMapa, filas, columnas);

    for (let fila = 0; fila < matriz.length; fila++) {
        for (let columna = 0; columna < matriz[fila].length; columna++) {
            const objeto = obtenerObjetoPorCodigo(matriz[fila][columna]);

            if (!objeto) continue;

            const celdaMapa = mapaGeografia[fila][columna];

            if (!celdaMapa.objeto) celdaMapa.objeto = objeto;

            if (celdaMapa.objeto.placeHolder) {
                const coordenadas = getPlaceHolderCells(mapaGeografia, objeto, fila, columna);

                if (!coordenadas.celdasEnRango) continue;

                if (cabe(mapaGeografia, coordenadas.celdasPlaceHolder)) {
                    llenarConPlaceHolders(mapaGeografia, coordenadas.celdasPlaceHolder, ObjPlaceHolder);
                }
            }
        }
    }

    mapaGeografia.forEach((fila, indiceFila) => {
        fila.forEach((celda, indiceColumna) => {
            if (celda.objeto?.formaAoE) {
                //console.log("llenando AoE de:", objeto, objeto.formaAoE);
                fillAoECells(mapaGeografia, celda.objeto, indiceFila, indiceColumna);
            }
        });
    });




    const mapaCodificado = mapaGeografia.map(fila => fila.map(celda => celda.objeto?.codigoLargo ?? " "));
    const matrizAFU = mapaGeografia.map(fila => fila.map(celda => celda.conAgua && celda.conFertilizante && celda.conUV));
    const matrizAFUS = mapaGeografia.map(fila => fila.map(celda => celda.conAgua && celda.conFertilizante && celda.conUV && celda.conFresa));

    //const aoeCapa = mapaGeografia.map(fila => fila.map(celda => celda.conAgua || celda.conFertilizante || celda.conUV));

    return {
        mapaGeografia, mapaCodificado, matrizAFU, matrizAFUS
        //aoeCapa
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
        row.insertCell().textContent = item.uPH;
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
        row.insertCell().textContent = item.uPH;

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
    const o = parseInt(document.getElementById("O").value);
    const l = parseInt(document.getElementById("L").value);

    return new Restricciones(plantable, cero, gg, mg, ls, rs, gf, bf, ef, c, s, z, p, u, n, f, o, l)

}

window.onload = (event) => {
    botonGenerarMapaAletorio.click();
    //botonCalcularCodificado.click();
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

    //console.log("afu", getAFU(nuevoMapa.mapaAleatorio.mapaGeografia));
    //console.log("afus", getAFUS(nuevoMapa.mapaAleatorio.mapaGeografia));

    //actualizarTablaPlantas(nuevoMapa.cosecha);
    //const listaModificadores = getListado(nuevoMapa.mapaAleatorio.capaModificadores);
    //actualizarTablaModificadores(listaModificadores);

    document.getElementById('totalCosechado').textContent = nuevoMapa.cosecha.cosechaTotal;
    document.getElementById('cosechaUph').textContent = nuevoMapa.cosecha.cosechaUph;
    document.getElementById('utilidadTotal').textContent = nuevoMapa.cosecha.totalUtilidad;
    document.getElementById('coidgoMapaAleatorio').textContent = nuevoMapa.mapaAleatorio.mapaCodificado;

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
        parseInt(form.O.value, 10),
        parseInt(form.L.value, 10),

    );

    // Plantable, Cero, GG, MG, LS, RS, GF,BF,EF, C, S, Z, P, U, N, F
    //const restricciones = new Restricciones(999, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999);
    //const restricciones = new Restricciones(999, 999, 0, 0, 0, 0, 0, 999, 999, 999, 999, 999, 999, 999);

    codigoMapa = prepararTextoCodigoMapa(codigoMapa)

    if (codigoMapa.length !== filas / 1 * columnas / 1) {
        //console.log("La longitud de la codificación no coincide con las filas y columnas del mapa");
        alert("La longitud de la codificación no coincide con las filas y columnas del mapa");
    } else {
        const mapaCodificado = crearMapaCodificado(filas, columnas, codigoMapa, restricciones);


        console.log("mapaCodificado", mapaCodificado);

        const cosechaTotal = calcularMapa(mapaCodificado.mapaGeografia);

        console.log("mapaCodificado", cosechaTotal);
        // const cosechaTotalCodificado = calcularCosechaNew(
        //     mapaGeografia
        // );

        //console.log("cosecha codificado btn: ", cosechaTotalCodificado);
        //console.log("crearMapaCodificado  btn: ", mapaCodificado);

        const resultadoDiv = document.getElementById("resultadoUPH");
        resultadoDiv.innerHTML = "UPH: " + JSON.stringify(cosechaTotal.cosechaUph);

        dibujarMapaSVG(svg2, mapaCodificado.mapaGeografia, filas, columnas);

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

    const uphValues = data.slice().reverse().map(item => item.uPH);

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
        let randPlantas = generarEnteroAleatorio(1, (filas * columnas) / 2)
        let randMods = generarEnteroAleatorio(0, (filas * columnas) / 2)
        while (randPlantas + randMods > filas * columnas) {
            randPlantas = generarEnteroAleatorio(1, filas * columnas)
            randMods = generarEnteroAleatorio(0, (filas * columnas) * 1)
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
        const cosechaTotalCodificado = calcularMapa(poblacion[index].mapaGeografia);
        //console.log(cosechaTotalCodificado.cosechaUph, cosechaTotalCodificado.mapaGeografia.map(fila => fila.map(celda => celda.objeto?.codigoLargo ?? " ")), cosechaTotalCodificado.mapaGeografia);
        evaluado.push({ uPH: cosechaTotalCodificado.cosechaUph, Mapa: poblacion[index].mapaCodificado.flat() });
    }
    return (evaluado);
}

function naturalSelection(jsonData, n) {
    const data = jsonData.sort((a, b) => b.uPH - a.uPH);
    return { uPH: data.slice(0, n).map(resultado => resultado.uPH), Mapa: data.slice(0, n).map(resultado => resultado.Mapa) };
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

        //console.log(poblacionIni);

        let i = 0;
        for (const objeto of poblacionIni) {
            poblacionMapa.push(objeto.mapaCodificado.flat());
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

        mejoresPuntuaciones.unshift({ uPH: seleccion.uPH[0], Mapa: seleccion.Mapa[0] });

        document.getElementById("seleccion").innerHTML = JSON.stringify(seleccion);

        if (mejoresPuntuaciones.length == 1) {
            mejorPuntuacionAbs = mejoresPuntuaciones[0]
        } else if (mejoresPuntuaciones[0].uPH > mejorPuntuacionAbs.uPH) {
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
            poblacionMapa.push(objeto.mapaCodificado.flat());
        }
        document.getElementById("poblacion").innerHTML = JSON.stringify(poblacionMapa);

        codigoMapa = seleccion.Mapa[0];

        const mapaCodificado = crearMapaCodificado(nf, nc, seleccion.Mapa[0]);
        const cosechaTotalCodificado = calcularMapa(mapaCodificado.mapaGeografia);

        const resultadoDiv = document.getElementById("resultadoUPH");
        resultadoDiv.innerHTML = "UPH: " + JSON.stringify(cosechaTotalCodificado.cosechaUph);

        dibujarMapaSVG(svg2, mapaCodificado.mapaGeografia, nf, nc);
    });





    const evolucionLoop = document.getElementById("evolucionLoopbtn");
    evolucionLoop.addEventListener("click", function () {

        const evolucionesLoop = parseInt(document.getElementById("evolucionesLoop").value);

        for (let index = 0; index < evolucionesLoop; index++) {
            botonGA.click();

        }
    });



}



