
const MODIFICADOR = "M";
const PLANTA = "P";
const AREA_EFECTO = "E";
let clovers = 2;
let strangeRate = .0015

// Define el tamaño de la celda (en píxeles)
const tamanoCelda = 40;


const svg1 = d3.select("#mapa-svg");
const svg2 = d3.select("#mapa-svg-codificado");
const svg3 = d3.select("#mapa-svg-gui");
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
    [false, "M", "M", false]
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
        { nombre, clase, tipo, codigo, costo, imagen, placeHolder, numCeldas, orientacion, color, formaAoE, precio, esConsumible, efectoCosecha, efectoTiempo, qtyCompra, qtyVenta, tiempo, reduccionTiempo }
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
        this.utilidadUnitariaStrange = this.calcularUtilidadUnitariaStrange();
        this.utilidautilidadTotaldUnitaria = this.calcularUtilidadTotal();
        this.uPH = this.calcularUpH();
        this.numCeldas = numCeldas;
    }

    calcularUtilidadUnitaria() {
        this.utilidadUnitaria = this.precio - (this.costo / this.qtyCompra);
        return this.utilidadUnitaria;
    }

    calcularUtilidadUnitariaStrange() {
        this.utilidadUnitariaStrange = (5*this.precio) - (this.costo / this.qtyCompra);
        return this.utilidadUnitariaStrange;
    }

    calcularUtilidadTotal() {
        this.utilidadTotal = this.utilidadUnitaria * this.qtyVenta;

        return this.utilidadTotal;
    }

    calcularUpH() {
        if (this.tiempo) {
            this.uPH = this.utilidadTotal / this.tiempo;
        } else {
            this.uPH = 0;
        }

        return this.uPH;
    }
}



class Celda {
    constructor(objeto, cosecha, conUV, conFertilizante, conAgua, conFresa, uvTiempo, uvCosecha, fertTiempo, fertCosecha, aguaTiempo, fresaTiempo, numFresa, colorAdicional) {
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
        this.numFresa = numFresa;
        this.colorAdicional = colorAdicional;
        this.modTiempo = 1;
        this.modCosecha = 1;
        this.totalCosecha = this.cosecha;
        this.totalTiempo = 0;
        this.totalUtilidad = 0;
    }
}


//0,MGN,0,rs,0,0,s,c,z,p,u,n,l,f,c,0

//0,MGN,0,0,0,0,0,0,0,0,0,0,0,0,0,0

//LSH,0,0,rs,mgn,GGS,0,C,Z,P,U,N,L,F,c,S

const poolGGs = [
    new Objeto({ nombre: "Giga Grow", codigo: "GG", clase: MODIFICADOR, tipo: "UV", imagen: "imgs/GigaGrow.png", placeHolder: "uno", numCeldas: 2, orientacion: "N", color: "#FFC0CB", formaAoE: barraN, efectoTiempo: 0.8, efectoCosecha: .25, costo: 5000, precio: 0, esConsumible: false, qtyCompra: 1, qtyVenta: 0, tiempo: 0, reduccionTiempo: 0 }),
    new Objeto({ nombre: "Giga Grow", codigo: "GG", clase: MODIFICADOR, tipo: "UV", imagen: "imgs/GigaGrow.png", placeHolder: "uno", numCeldas: 2, orientacion: "W", color: "#FFC0CB", formaAoE: barraW, efectoTiempo: 0.8, efectoCosecha: .25, costo: 5000, precio: 0, esConsumible: false, qtyCompra: 1, qtyVenta: 0, tiempo: 0, reduccionTiempo: 0 }),
    new Objeto({ nombre: "Giga Grow", codigo: "GG", clase: MODIFICADOR, tipo: "UV", imagen: "imgs/GigaGrow.png", placeHolder: "uno", numCeldas: 2, orientacion: "S", color: "#FFC0CB", formaAoE: barraS, efectoTiempo: 0.8, efectoCosecha: .25, costo: 5000, precio: 0, esConsumible: false, qtyCompra: 1, qtyVenta: 0, tiempo: 0, reduccionTiempo: 0 }),
    new Objeto({ nombre: "Giga Grow", codigo: "GG", clase: MODIFICADOR, tipo: "UV", imagen: "imgs/GigaGrow.png", placeHolder: "uno", numCeldas: 2, orientacion: "E", color: "#FFC0CB", formaAoE: barraE, efectoTiempo: 0.8, efectoCosecha: .25, costo: 5000, precio: 0, esConsumible: false, qtyCompra: 1, qtyVenta: 0, tiempo: 0, reduccionTiempo: 0 })
]


const poolMGs = [
    new Objeto({ nombre: "Mega Grow", codigo: "MG", clase: MODIFICADOR, tipo: "UV", imagen: "imgs/MegaGrow.png", placeHolder: null, numCeldas: 1, orientacion: "N", color: "#AA336A", formaAoE: posteN, efectoTiempo: 0.8, efectoCosecha: .25, costo: 3000, precio: 0, esConsumible: false, qtyCompra: 1, qtyVenta: 0, tiempo: 0, reduccionTiempo: 0 }),
    new Objeto({ nombre: "Mega Grow", codigo: "MG", clase: MODIFICADOR, tipo: "UV", imagen: "imgs/MegaGrow.png", placeHolder: null, numCeldas: 1, orientacion: "W", color: "#AA336A", formaAoE: posteW, efectoTiempo: 0.8, efectoCosecha: .25, costo: 3000, precio: 0, esConsumible: false, qtyCompra: 1, qtyVenta: 0, tiempo: 0, reduccionTiempo: 0 }),
    new Objeto({ nombre: "Mega Grow", codigo: "MG", clase: MODIFICADOR, tipo: "UV", imagen: "imgs/MegaGrow.png", placeHolder: null, numCeldas: 1, orientacion: "S", color: "#AA336A", formaAoE: posteS, efectoTiempo: 0.8, efectoCosecha: .25, costo: 3000, precio: 0, esConsumible: false, qtyCompra: 1, qtyVenta: 0, tiempo: 0, reduccionTiempo: 0 }),
    new Objeto({ nombre: "Mega Grow", codigo: "MG", clase: MODIFICADOR, tipo: "UV", imagen: "imgs/MegaGrow.png", placeHolder: null, numCeldas: 1, orientacion: "E", color: "#AA336A", formaAoE: posteE, efectoTiempo: 0.8, efectoCosecha: .25, costo: 3000, precio: 0, esConsumible: false, qtyCompra: 1, qtyVenta: 0, tiempo: 0, reduccionTiempo: 0 }),
]


const poolLSs = [
    new Objeto({ nombre: "Lane Sprinkler", codigo: "LS", clase: MODIFICADOR, tipo: "Sprinklers", imagen: "imgs/LaneSprinkler.png", placeHolder: "dos", numCeldas: 3, orientacion: "V", color: "#9F2B68", formaAoE: ladosV, efectoTiempo: 0.8, efectoCosecha: 0, costo: 8000, precio: 0, esConsumible: false, qtyCompra: 1, qtyVenta: 0, tiempo: 0, reduccionTiempo: 0 }),
    new Objeto({ nombre: "Lane Sprinkler", codigo: "LS", clase: MODIFICADOR, tipo: "Sprinklers", imagen: "imgs/LaneSprinkler.png", placeHolder: "dos", numCeldas: 3, orientacion: "H", color: "#9F2B68", formaAoE: ladosH, efectoTiempo: 0.8, efectoCosecha: 0, costo: 8000, precio: 0, esConsumible: false, qtyCompra: 1, qtyVenta: 0, tiempo: 0, reduccionTiempo: 0 }),

]

const poolRSs = [
    new Objeto({ nombre: "Rotary Sprinkler", codigo: "RS", clase: MODIFICADOR, tipo: "Sprinklers", imagen: "imgs/Sprinkler.png", placeHolder: null, numCeldas: 1, orientacion: "", color: "#800020", formaAoE: dona, efectoTiempo: 0.8, efectoCosecha: 0, costo: 5000, precio: 0, esConsumible: false, qtyCompra: 1, qtyVenta: 0, tiempo: 0, reduccionTiempo: 0 }),

]

const poolFertilizers = [
    new Objeto({ nombre: "Goat Fertilizer", codigo: "GF", clase: MODIFICADOR, tipo: "Fertilizer", imagen: "imgs/GoatFert.png", placeHolder: null, numCeldas: 1, orientacion: "", color: "#CD7F32", formaAoE: dona, efectoTiempo: 2 / 3, efectoCosecha: 0.5, costo: 250, precio: 0, esConsumible: true, qtyCompra: 1, qtyVenta: 1, tiempo: 24, reduccionTiempo: 0 }),
    new Objeto({ nombre: "Bull Fertilizer", codigo: "BF", clase: MODIFICADOR, tipo: "Fertilizer", imagen: "imgs/BullFert.png", placeHolder: "medio", numCeldas: 4, orientacion: "", color: "#A52A2A", formaAoE: donaM, efectoTiempo: 2 / 3, efectoCosecha: 0.5, costo: 750, precio: 0, esConsumible: true, qtyCompra: 1, qtyVenta: 1, tiempo: 24, reduccionTiempo: 0 }),
    new Objeto({ nombre: "Elephant Fertilizer", codigo: "EF", clase: MODIFICADOR, tipo: "Fertilizer", imagen: "imgs/Elephantfertiliser.webp", placeHolder: "grande", numCeldas: 9, orientacion: "", color: "#DAA06D", formaAoE: donaG, efectoTiempo: 2 / 3, efectoCosecha: 0.5, costo: 2250, precio: 0, esConsumible: true, qtyCompra: 1, qtyVenta: 1, tiempo: 24, reduccionTiempo: 0 })
]

//Sé que se puede crear un pool directo con todos los elementos en lugar de concatenar, pero se requiere un pool separado por modificador rotable para obtener aleatoriamente cada rotación.
//probablemente sea mejor tener una función que los rote y así aleatoriamente elegiría una orientación, sin embargo, creo que tendría un costo computacional en lugar de memoria
const poolModificadores = poolGGs.concat(poolMGs).concat(poolLSs).concat(poolRSs).concat(poolFertilizers);


const poolPlantas = [
    new Objeto({ nombre: "Sandía", codigo: "S", clase: PLANTA, tipo: "Planta", imagen: "imgs/Watermelonseeds.webp", placeHolder: null, numCeldas: 1, orientacion: "", color: "#03a572", formaAoE: null, efectoTiempo: 0, efectoCosecha: 0, costo: 300, precio: 200, esConsumible: true, qtyCompra: 5, qtyVenta: 1, tiempo: 6, reduccionTiempo: 0 }),
    new Objeto({ nombre: "Calabaza", codigo: "C", clase: PLANTA, tipo: "Planta", imagen: "imgs/Pumpkinseeds.webp", placeHolder: null, numCeldas: 1, orientacion: "", color: "#FF7518", formaAoE: null, efectoTiempo: 0, efectoCosecha: 0, costo: 250, precio: 100, esConsumible: true, qtyCompra: 5, qtyVenta: 1, tiempo: 2, reduccionTiempo: 0 }),

    new Objeto({ nombre: "Zanahoria", codigo: "Z", clase: PLANTA, tipo: "Planta", imagen: "imgs/Carrotseeds.webp", placeHolder: null, numCeldas: 1, orientacion: "", color: "#FFC000", formaAoE: null, efectoTiempo: 0, efectoCosecha: 0, costo: 0, precio: 20, esConsumible: false, qtyCompra: 1, qtyVenta: 1, tiempo: 2, reduccionTiempo: 0 }),
    new Objeto({ nombre: "Papa", codigo: "P", clase: PLANTA, tipo: "Planta", imagen: "imgs/Potatoseeds.webp", placeHolder: null, numCeldas: 1, orientacion: "", color: "#4C3228", formaAoE: null, efectoTiempo: 0, efectoCosecha: 0, costo: 0, precio: 1, esConsumible: false, qtyCompra: 1, qtyVenta: 11, tiempo: 1, reduccionTiempo: 0 }),
    new Objeto({ nombre: "Uva", codigo: "U", clase: PLANTA, tipo: "Planta", imagen: "imgs/Grapeseeds.webp", placeHolder: null, numCeldas: 1, orientacion: "", color: "#4c00b0", formaAoE: null, efectoTiempo: 0, efectoCosecha: 0, costo: 0, precio: 4, esConsumible: false, qtyCompra: 1, qtyVenta: 6, tiempo: 2, reduccionTiempo:0  }),
    new Objeto({ nombre: "Nabo", codigo: "N", clase: PLANTA, tipo: "Planta", imagen: "imgs/Turnipseeds.webp", placeHolder: null, numCeldas: 1, orientacion: "", color: "#c3c8ac", formaAoE: null, efectoTiempo: 0, efectoCosecha: 0, costo: 0, precio: 1, esConsumible: false, qtyCompra: 1, qtyVenta: 22, tiempo: 2, reduccionTiempo: 0 }),

    new Objeto({ nombre: "Lunar", codigo: "L", clase: PLANTA, tipo: "Planta", imagen: "imgs/Gloamrootseeds.webp", placeHolder: null, numCeldas: 1, orientacion: "", color: "#F0EAD6", formaAoE: null, efectoTiempo: 0, efectoCosecha: 0, costo: 0, precio: 5, esConsumible: false, qtyCompra: 1, qtyVenta: 5, tiempo: 2, reduccionTiempo: 0 }),

    new Objeto({ nombre: "Fresa", codigo: "F", clase: PLANTA, tipo: "Planta", imagen: "imgs/Strawberryseeds.webp", placeHolder: null, numCeldas: 1, orientacion: "", color: "#e42e67", formaAoE: dona, efectoTiempo: 0, efectoCosecha: 0, costo: 0, precio: 2, esConsumible: false, qtyCompra: 1, qtyVenta: 5, tiempo: 2, reduccionTiempo: 0.5 }),
    new Objeto({ nombre: "Cebolla", codigo: "O", clase: PLANTA, tipo: "Planta", imagen: "imgs/Onionseeds.webp", placeHolder: null, numCeldas: 1, orientacion: "", color: "#F0EA00", formaAoE: dona, efectoTiempo: 0, efectoCosecha: 0, costo: 0, precio: 3, esConsumible: false, qtyCompra: 1, qtyVenta: 6, tiempo: 3, reduccionTiempo: 0 })

]

class ObjPlaceHolder extends Objeto {
    constructor(options = { nombre: "X", codigo: "X", clase: "H", tipo: "H", imagen: null, placeHolder: "", orientacion: "", color: "red", formaAoE: null, efectoTiempo: 0, efectoCosecha: 0, costo: 0, precio: 0, esConsumible: false, qtyCompra: 0, qtyVenta: 0, tiempo: 0, reduccionTiempo: 0 }) {
        super(options);
    }
}

class Flor extends Objeto {
    constructor(options = { nombre: "Flor", codigo: "R", clase: "R", tipo: "Flor", imagen: "imgs/hedge.png", placeHolder: null, numCeldas: 1, orientacion: "", color: "#FFEBED", formaAoE: null, efectoTiempo: 0, efectoCosecha: 0, costo: 0, precio: 0, esConsumible: false, qtyCompra: 0, qtyVenta: 0, tiempo: 0, reduccionTiempo: 0 }) {
        super(options);
    }
}

florObj = new Flor()

phObj = new ObjPlaceHolder()

const poolObjetos = poolModificadores.concat(poolPlantas);


class AreaEfecto {
    constructor(forma) {
        this.forma = forma;
    }
}

class Restricciones {
    constructor(Plantable, GG, MG, LS, RS, GF, BF, EF, C, S, Z, P, U, N, F, O, L) {
        this.Plantable = Plantable;
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
        this.R = 999;
    }
}


const geografia = [
    [true, true, true, true, true, true, true, true, true, true, false, false],
    [true, true, true, true, true, true, true, true, true, true, true, false],
    [true, true, true, true, true, true, true, true, true, true, true, true],
    [true, true, true, true, true, true, true, true, true, true, true, true],
    [true, true, true, true, true, true, true, true, true, true, true, true],
    [true, true, true, true, true, true, true, true, true, true, true, true],
    [true, true, true, true, true, true, true, true, true, true, true, true],
    [true, true, true, true, true, true, true, true, true, true, true, true],
    [true, true, true, true, true, true, true, true, true, true, true, true],
    [true, true, true, true, true, true, true, true, true, true, true, true],
    [false, true, true, true, true, true, true, true, true, true, true, true],
    [false, false, true, true, true, true, true, true, true, true, true, true],
]

const mapaReal = [];

//(objeto, cosecha, conUV, conFertilizante, conAgua, conFresa,7 uvTiempo, uvCosecha, fertTiempo, fertCosecha, aguaTiempo,12 fresaTiempo, colorAdicional)

for (let i = 0; i < geografia.length; i++) {
    mapaReal[i] = []; // Inicializar cada fila del mapa
    for (let j = 0; j < geografia[i].length; j++) {
        mapaReal[i][j] = geografia[i][j]
            ? new Celda(null, 0, false, false, false, false, 1, 0, 1, 0, 1, 0, 0, "")  // Crear Celda si es true
            : new Celda(phObj, 0, false, false, false, false, 1, 0, 1, 0, 1, 0, 0, ""); // Asignar null si es false
    }
}


function getPlaceHolderCells(mapaGeografia, objeto, fila, columna) {
    let celdasPlaceHolder = [];
    let celdasEnRango = true;

    const { placeHolder, orientacion } = objeto;
    //console.log(objeto.placeHolder, objeto.orientacion);

    switch (placeHolder) {
        case "uno":
            if (orientacion == "N") {
                celdasPlaceHolder.push([[fila], [columna + 1]]);
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
        mapaGeografia[filaRelativa][columnaRelativa].objeto = phObj;
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
                if (objeto.codigo == "F" && mapaGeografia[filaActual][columnaActual].objeto != null&& mapaGeografia[filaActual][columnaActual].objeto.clase === PLANTA) {
                    if (
                        mapaGeografia[filaActual][columnaActual].objeto.nombre != "Fresa" &&
                        mapaGeografia[filaActual][columnaActual].objeto.clase === PLANTA
                    ) {
                        mapaGeografia[filaActual][columnaActual].conFresa = true;
                    }
                }

                break;
            default:
                console.warn("Tipo de modificador desconocido.");
                break;
        }
    });
}

function resetAoECells(mapaGeografia) {
    for (let i = 0; i < mapaGeografia.length; i++) {
        for (let j = 0; j < mapaGeografia[i].length; j++) {
            mapaGeografia[i][j].conUV = false;
            mapaGeografia[i][j].conFertilizante = false;
            mapaGeografia[i][j].conAgua = false;
            mapaGeografia[i][j].conFresa = false;
            mapaGeografia[i][j].uvTiempo = 1;
            mapaGeografia[i][j].uvCosecha = 0;
            mapaGeografia[i][j].fertTiempo = 1;
            mapaGeografia[i][j].fertCosecha = 0;
            mapaGeografia[i][j].aguaTiempo = 1;
            mapaGeografia[i][j].fresaTiempo = 0;
            mapaGeografia[i][j].numFresa = 0;
        }
    }
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
    "R", "R", "R", "R",
    0, 0, 0, 0
]

// Función para obtener posiciones relativas del objeto o area de efecto
function getPosicionesRelativasNew(fila, columna, forma, columnas, filas, esAE) {
    let posicionesRelativas = [];
    let filaSolido = -1;
    let columnaSolido = -1;

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
        //console.log(mapa[filaActual][columnaActual].objeto);
        if (
            mapa[filaActual][columnaActual].objeto &&
            mapa[filaActual][columnaActual].objeto.clase === "R"
        ) {
            papasExtra++;
        }
    });

    return papasExtra;

}

function getFresaContiguas(mapa, fila, columna) {

    const posicionesVecinas = getPosicionesVecinas(mapa, fila, columna);
    let fresasContiguas = 0;

    posicionesVecinas.forEach(([filaActual, columnaActual]) => {
        //console.log(mapa[filaActual][columnaActual].objeto);
        if (
            mapa[filaActual][columnaActual].objeto &&
            mapa[filaActual][columnaActual].objeto.codigo === "F"
        ) {
            fresasContiguas++;
        }
    });
    return fresasContiguas;

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



function crearPoolObjetos(limites, poolGGs, poolMGs, poolLSs) {
    let pool = [];

    //const modificador = poolObjetos.find(mod => mod.codigoLargo === codigoLargo);

    const limitesFiltrados = limites.filter(limite => limite.elemento !== "Cero" && limite.elemento !== "Plantable");

    for (const limite of limitesFiltrados) {
        let cantidadAAgregar = limite.cantidad;
        for (let i = 0; i < cantidadAAgregar; i++) {
            if (limite.elemento == "GG") {
                pool.push(poolGGs[Math.floor(Math.random() * poolGGs.length)]);
            } else if (limite.elemento == "MG") {
                pool.push(poolMGs[Math.floor(Math.random() * poolMGs.length)]);
            } else if (limite.elemento == "LS") {
                pool.push(poolLSs[Math.floor(Math.random() * poolLSs.length)]);
            } else if (limite.elemento == "R") {
                continue;
            } else if (limite.elemento == "O") {
                pool.push(getObjetoPorCodigo("O"));
                for (let flores = 0; flores < 8; flores++) {
                    pool.push(florObj);
                }
            } else {
                pool.push(getObjetoPorCodigo(limite.elemento));
            }

        }
    }
    return pool;
}


// Función para crear un mapa aleatorio
function crearMapaAleatorio(filas, columnas, numPlantas, numModificadores, restricciones, usarGeografia) {
    // Validaciones para evitar bucles infinitos
    if ((numPlantas + numModificadores) > (filas * columnas) / 1) {
        throw new Error("El número de plantas o modificadores es mayor que el espacio disponible en el mapa.");
    }

    //const geografia = Array.from({ length: filas }, () => Array(columnas).fill(true));


    let mapaGeografia = [];

    if (usarGeografia === false) {

        for (let i = 0; i < filas; i++) {
            mapaGeografia[i] = []; // Inicializar cada fila del mapa
            for (let j = 0; j < columnas; j++) {
                mapaGeografia[i][j] = new Celda(null, 0, false, false, false, false, 1, 0, 1, 0, 1, 0, 0, "");
            }
        }
    } else {
        for (let i = 0; i < geografia.length; i++) {
            mapaGeografia[i] = []; // Inicializar cada fila del mapa
            for (let j = 0; j < geografia[i].length; j++) {
                mapaGeografia[i][j] = geografia[i][j]
                    ? new Celda(null, 0, false, false, false, false, 1, 0, 1, 0, 1, 0, 0, "")  // Crear Celda si es true
                    : new Celda(phObj, 0, false, false, false, false, 1, 0, 1, 0, 1, 0, 0, ""); // Asignar null si es false
            }
        }

        filas = mapaGeografia.length;
        columnas = mapaGeografia[0].length;

    }


    let celdasUsadas = 0;



    let limites = Object.entries(restricciones)
        .map(([elemento, cantidad]) => ({
            elemento,
            cantidad,
        }));

    limites.forEach(limite => {
        limite.colocados = 0;
    })

    //console.log(limites);
    let poolObjetosMapa = crearPoolObjetos(limites, poolGGs, poolMGs, poolLSs);

    //console.log(poolObjetosMapa);

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
    let floresColocadas = 0;
    let intentosOriginal = filas * columnas * 7;
    let intentos = filas * columnas * 7; // Intentos máximos para ambos

    while (
        intentos > 0 &&
        (plantasColocadas != numPlantas || modificadoresColocados != numModificadores) &&
        (plantasColocadas != limitesPlantas || modificadoresColocados != limitesModificadores)
        && (plantasColocadas + modificadoresColocados + floresColocadas) != (filas * columnas)
    ) {

        let randomIndex = Math.floor(Math.random() * poolObjetosMapa.length);
        let objeto = poolObjetosMapa[randomIndex];

        //console.log("intentando colocar: ", objeto.nombre);

        //console.log(poolObjetosMapa);
        //console.log(objeto);
        //console.log(objeto, objeto.codigo);



        limiteObjeto = limites.find((element) => element.elemento == objeto.codigo).cantidad;

        indexObjeto = limites.findIndex((element) => element.elemento == objeto.codigo);
        colocados = limites.find((element) => element.elemento == objeto.codigo).colocados;

        if (colocados >= limiteObjeto) {
            //console.log("supera límite elemento");
            poolObjetosMapa.splice(randomIndex, 1);
            intentos--;
            continue;
        } else if (objeto.clase == PLANTA && plantasColocadas >= numPlantas) {
            //console.log("supera límite plantas");
            poolObjetosMapa.splice(randomIndex, 1);
            intentos--;
            continue;
        } else if (objeto.clase == MODIFICADOR && modificadoresColocados >= numModificadores) {

            //console.log("supera límite modificadores");
            poolObjetosMapa.splice(randomIndex, 1);
            intentos--;
            continue;
        } else if ((objeto.numCeldas + celdasUsadas) > (filas * columnas)) {
            //console.log("espacios a usar exceden disponible",objeto.numCeldas , filas*columnas);
            //poolObjetosMapa.splice(randomIndex, 1);
            intentos--;
            continue;
        } else if (objeto.clase == "R" && (limites.find((element) => element.elemento == "O").colocados) == 0) {
            //console.log("sin cebollas no se puede colocar flores",limites.find((element) => element.elemento == "O").colocados);
            //poolObjetosMapa.splice(randomIndex, 1);
            intentos--;
            continue;
        }

        const posicion = generarPosicionAleatoria(filas, columnas, true);
        const fila = posicion[0];
        const columna = posicion[1];

        //console.log("intentando colocar: ", objeto, "en: ", posicion);

        //console.log("objeto elegido",  objeto.nombre, "posición:",fila,columna)
        if (celdaLibre(mapaGeografia, fila, columna)) {
            //console.log("objeto.placeHolder", objeto, objeto.placeHolder);

            if (objeto.placeHolder != null) {

                const coordenadas = getPlaceHolderCells(mapaGeografia, objeto, fila, columna);
                //console.log("objeto", objeto.nombre, "coordenadas", coordenadas);

                if (!coordenadas.celdasEnRango) {


                    //console.log("coordenadas.celdasEnRango",coordenadas.celdasEnRango);
                    continue;
                } else {
                    //const celdasAOcupar = getPlaceHolderCells(mapaGeografia, objeto, fila, columna);
                    if (cabe(mapaGeografia, coordenadas.celdasPlaceHolder)) {
                        //console.log("cabe", objeto.nombre);
                        llenarConPlaceHolders(mapaGeografia, coordenadas.celdasPlaceHolder, ObjPlaceHolder);
                    } else {
                        //console.log("no cabe", objeto.nombre);

                        continue;
                    }
                }
            } else {
                //console.log("sin place holder");
            }
            //console.log("objeto colocado", objeto.nombre);

            poolObjetosMapa.splice(randomIndex, 1);

            mapaGeografia[fila][columna].objeto = objeto;

            celdasUsadas += objeto.numCeldas;

            //console.log("celdasUsadas", celdasUsadas);

            if (celdasUsadas >= filas * columnas) {
                //console.log("máximo celdas usadas, forzando salida intentos = 0");
                break;
            }

            limites[indexObjeto].colocados++;
            if (objeto.clase == PLANTA) {
                plantasColocadas++;
            } if (objeto.clase == MODIFICADOR) {
                modificadoresColocados++;
            } if (objeto.clase == "R") {
                floresColocadas++;
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

    //console.log(poolObjetosMapa);

    //console.log("intentos final", intentosOriginal-intentos, intentosOriginal, ((intentos)/intentosOriginal));

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


function mcm(arr) {
    // Función para calcular el MCD de dos números
    const mcd = (a, b) => {
        while (b) {
            [a, b] = [b, a % b];
        }
        return a;
    };

    // Calcula el MCM de un array de números
    const mcmArray = (arr) => {
        let result = arr[0];
        for (let i = 1; i < arr.length; i++) {
            result = (result * arr[i]) / mcd(result, arr[i]);
        }
        return result;
    };

    // Manejo de errores para entradas inválidas
    if (!Array.isArray(arr) || arr.length === 0) {
        return "Entrada inválida: Debe ser un array no vacío de números.";
    }


    // Multiplicar por 100, truncar y calcular MCM
    const arrInt = arr.map(num => Math.trunc(num * 100));

    if (arrInt.some(num => num <= 0)) {
        return "Entrada inválida: El array debe contener solo números positivos después de la multiplicación por 100.";
    }

    const resultadoInt = mcmArray(arrInt);

    // Dividir el resultado por 100
    return resultadoInt / 100;
}

function mcd(arr) {
    // Función para calcular el MCD de dos números
    const mcdDosNumeros = (a, b) => {
        while (b) {
            [a, b] = [b, a % b];
        }
        return a;
    };

    // Calcula el MCD de un array de números
    const mcdArray = (arr) => {
        let result = arr[0];
        for (let i = 1; i < arr.length; i++) {
            result = mcdDosNumeros(result, arr[i]);
        }
        return result;
    };

    // Manejo de errores para entradas inválidas
    if (!Array.isArray(arr) || arr.length === 0) {
        return "Entrada inválida: Debe ser un array no vacío de números.";
    }


    // Multiplicar por 100, truncar y calcular MCD
    const arrInt = arr.map(num => Math.trunc(num * 100));

    if (arrInt.some(num => num <= 0)) {
        return "Entrada inválida: El array debe contener solo números positivos después de la multiplicación por 100.";
    }


    const resultadoInt = mcdArray(arrInt);

    // Dividir el resultado por 100 (opcional, dependiendo de si quieres el MCD en la escala original)
    return resultadoInt / 100;
}


function getObjetoPorCodigo(codigoLargo) {
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
        return phObj;
    }

    if (codigoLargo == "r" || codigoLargo == "R") {
        return florObj;
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


function getListado(mapa) {
    const resultados = [];
    id = 1;

    mapa.forEach((fila, indiceFila) => {
        fila.forEach((celda, indiceColumna) => {
            if (celda.objeto && celda.objeto.tipo !== "Flor" && celda.objeto.tipo !== "H") {
                resultados.push({
                    id: id++,
                    celda: `(${indiceFila}, ${indiceColumna})`,
                    objeto: celda.objeto.nombre,
                    clase: celda.objeto.clase,
                    totalTiempo: celda.totalTiempo || 0, // Usamos totalTiempo si existe, si no, el tiempo del objeto, o 0 si ninguno existe.
                    tiempoCosecha: celda.tiempoCosecha || 0, // Usamos totalTiempo si existe, si no, el tiempo del objeto, o 0 si ninguno existe.
                    utilidad: celda.utilidad || 0, // Usamos totalTiempo si existe, si no, el tiempo del objeto, o 0 si ninguno existe.
                    utilidadStrange:celda.evExtra||0,
                    uPH: celda.uPH || 0, //Similar para UPH
                    uPHS: celda.uPHStrange || 0, //Similar para UPH
                    codigo: celda.objeto.codigoLargo
                });
            }
        });
    });

    //console.table(resultados);
    return resultados;
}

function getTiempoBucle(listado) {

    return listado
        .filter(item => item.clase === PLANTA)
        .map(item => item.tiempoCosecha);

};

// Resumen por objeto

function getResumen(listado) {
    const resumen = {};

    listado.forEach(resultado => {
        if (!resumen[resultado.objeto]) {
            resumen[resultado.objeto] = {
                conteo: 0,
                utilidad: 0,
                uPH: 0, // Inicializa la suma de UPH
                uPHS: 0 // Inicializa la suma de UPHs
            };
        }
        resumen[resultado.objeto].conteo++;
        resumen[resultado.objeto].utilidad += resultado.utilidad; // Suma los UPH
        resumen[resultado.objeto].uPH += resultado.uPH; // Suma los UPH
        resumen[resultado.objeto].uPHS += resultado.uPHS; // Suma los UPH

    });

    // Convertir el objeto resumen en un array para console.table
    const resumenArray = [];
    for (const objeto in resumen) {
        resumenArray.push({
            objeto: objeto,
            conteo: resumen[objeto].conteo,
            utilidad: resumen[objeto].utilidad,
            uPH: resumen[objeto].uPH
        });
    }



    //console.table(resumenArray);
    return resumenArray;
}

// Función para calcular la cosecha
function calcularMapa_O(mapaGeografia) {

    let numPlantas = 0;

    for (let i = 0; i < mapaGeografia.length; i++) {
        for (let j = 0; j < mapaGeografia[i].length; j++) {
            const celda = mapaGeografia[i][j];
            if (celda.objeto?.tipo === "Flor") {
                numPlantas++;
            }

            // Si es planta o fertilizante, inicializar cosecha y tiempo
            if (celda.objeto && (celda.objeto.tipo === "Planta" || celda.objeto.tipo === "Fertilizer")) {
                celda.cosecha = celda.objeto.qtyVenta;
                celda.tiempo = celda.objeto.tiempo;
            }
            
        }
    }

    let cosechaTotal = 0;
    let cosechaUph = 0;
    let cosechaUphS = 0;
    let listaTiempos = [];


    for (let i = 0; i < mapaGeografia.length; i++) {
        for (let j = 0; j < mapaGeografia[i].length; j++) {

            const celda = mapaGeografia[i][j];


            //Si es un objeto y es una planta o fertilizante realiza el cálculo para UPH
            if (celda.objeto != null && (celda.objeto.tipo === "Planta" || celda.objeto.tipo === "Fertilizer")) {

                //Tal vez se pueda hacer un switch "Consumible,noConsumible,Fertilizer", sin embargo, debo modificar el objeto
                //if (!celda.objeto.esConsumible && celda.objeto.tipo != "Fertilizer") {
                if (!celda.objeto.esConsumible && celda.objeto.clase != MODIFICADOR) {
                    celda.modCosecha = 1 + (celda.fertCosecha + celda.uvCosecha);
                    celda.modTiempo = (celda.aguaTiempo);

                    //Se calcula cuántas cebollas extras se generarán (solo para objetos no consumibles)
                    if (celda.objeto.codigo === "O" || celda.objeto.codigo === "o") {
                        celda.cebollasExtra = getCebollasExtras(mapaGeografia, i, j);
                        celda.cebollasExtraStrange = numPlantas-celda.cebollasExtra;
                    };
               // } else if (celda.objeto.esConsumible && celda.objeto.tipo != "Fertilizer") {
                } else if (celda.objeto.esConsumible) {
                    celda.modTiempo = (celda.fertTiempo) * (celda.uvTiempo) * (celda.aguaTiempo);
                    const numFresas = getFresaContiguas(mapaGeografia, i, j);
                    
                    if( (2*celda.objeto.tiempo) >= celda.numFresa ){
                        celda.numFresa = numFresas ;
                    }else{
                        celda.numFresa =  celda.objeto.tiempo*2;
                    }
                }

                //Si es fertilizante no debe ser afectado por modificadores de tiempo o cosecha
                if (celda.objeto.tipo === "Fertilizer") {
                    celda.totalTiempo = parseFloat(celda.tiempo.toFixed(2));
                    celda.totalCosecha = celda.cosecha;

                } else {

                    //Se calcula cuantas fresas hay contiguas, no importa si es o no Consumible
                    if (celda.objeto.codigo != "F") {
                        celda.numFresa = getFresaContiguas(mapaGeografia, i, j);
                    }

                    celda.totalTiempo = parseFloat((celda.modTiempo * celda.tiempo).toFixed(2));
                    celda.totalCosecha = celda.modCosecha * celda.cosecha + (celda?.cebollasExtra ?? 0);
                    celda.totalCosechaStrange = celda.modCosecha * (celda.cosecha + (celda?.cebollasExtra ?? 0)+ (celda?.cebollasExtraStrange ?? 0));
                };

                if(celda.clase === PLANTA){
                    celda.tiempoCosecha = parseFloat(getTiempoTrasFresa(celda.numFresa, celda.totalTiempo).toFixed(2));
                }

                celda.cosechaPorHora = (1 + (1 / 2 * celda.numFresa * .5)) / celda.totalTiempo;
                celda.utilidad = celda.totalCosecha * celda.objeto.utilidadUnitaria;
                celda.utilidadStrange = celda.totalCosechaStrange * celda.objeto.utilidadUnitariaStrange;
                celda.evExtra = parseFloat(( (celda.utilidadStrange-celda.utilidad)*strangeRate) .toFixed(2));


                celda.uPH = parseFloat((celda.utilidad * celda.cosechaPorHora).toFixed(2));
                celda.uPHStrange = parseFloat((celda.evExtra * celda.cosechaPorHora).toFixed(2));

                //console.log(i,j,"|",celda.objeto.codigo, celda.cosechaPorHora, celda.cosechaPorHora, "utilidad", celda.utilidad, "uPH", celda.uPH);

            }
        }
    }

    // Calcular la cosecha total
    cosechaTotal = mapaGeografia.flatMap(fila => fila.map(celda => celda.totalCosecha)).reduce((suma, cosecha) => suma + cosecha, 0);

    cosechaUph = Math.round(
        mapaGeografia
            .flatMap(fila => fila.map(celda => (celda.uPH)))
            .filter(uPH => !isNaN(uPH))
            .reduce((suma, uPH) => suma + uPH, 0)
        * 100) / 100;

    cosechaUphS = Math.round(
                mapaGeografia
                    .flatMap(fila => fila.map(celda => (celda.uPHStrange)))
                    .filter(uPHS => !isNaN(uPHS))
                    .reduce((suma, uPHS) => suma + uPHS, 0)
                * 100) / 100;


    listaTiempos = mapaGeografia.flatMap(fila => fila.map(celda => celda?.totalTiempo));


    return { mapaGeografia, cosechaTotal, cosechaUph, cosechaUphS, listaTiempos };
}

function calcularMapa(mapaGeografia) {
    let numPlantas = 0;

    // Primer loop: contar plantas y pre-calcular algunas propiedades
    for (let i = 0; i < mapaGeografia.length; i++) {
        for (let j = 0; j < mapaGeografia[i].length; j++) {
            const celda = mapaGeografia[i][j];

            if (celda.objeto?.tipo === "Flor") {
                numPlantas++;
            }

            // Si es planta o fertilizante, inicializar cosecha y tiempo
            if (celda.objeto && (celda.objeto.tipo === "Planta" || celda.objeto.tipo === "Fertilizer")) {
                celda.cosecha = celda.objeto.qtyVenta;
                celda.tiempo = celda.objeto.tiempo;
            }
        }
    }


    let cosechaTotal = 0;
    let cosechaUph = 0;
    let cosechaUphS = 0;
    const listaTiempos = [];

    // Segundo loop: Calcular el resto de propiedades
    for (let i = 0; i < mapaGeografia.length; i++) {
        for (let j = 0; j < mapaGeografia[i].length; j++) {
            const celda = mapaGeografia[i][j];

            if (celda.objeto && (celda.objeto.tipo === "Planta" || celda.objeto.tipo === "Fertilizer")) {

                if (celda.objeto.tipo === "Fertilizer") {
                    celda.totalTiempo = parseFloat(celda.tiempo.toFixed(2));
                    celda.totalCosecha = celda.cosecha;
                } else {
                    const esConsumible = celda.objeto.esConsumible;
                    const esModificador = celda.objeto.clase === MODIFICADOR;

                    if (!esConsumible && !esModificador) {
                        celda.modCosecha = 1 + celda.fertCosecha + celda.uvCosecha;
                        celda.modTiempo = celda.aguaTiempo;

                        if (celda.objeto.codigo === "O" || celda.objeto.codigo === "o") {
                            celda.cebollasExtra = getCebollasExtras(mapaGeografia, i, j);
                            celda.cebollasExtraStrange = numPlantas - celda.cebollasExtra;
                        }
                    } else if (esConsumible && !esModificador) {
                        celda.modTiempo = celda.fertTiempo * celda.uvTiempo * celda.aguaTiempo;
                    }

                    if (celda.objeto.codigo !== "F") {
                        const numFresas = getFresaContiguas(mapaGeografia, i, j);

                        if(celda.conFresa ){
                            if(celda.objeto.esConsumible){
                                if( (celda.objeto.tiempo*2) >= numFresas ){
                                    celda.numFresa = numFresas;
                                }else {
                                    celda.numFresa = celda.objeto.tiempo*2;
                                }
                            }else{
                                celda.numFresa = numFresas;
                            }
                        }
                        //celda.numFresa = getFresaContiguas(mapaGeografia, i, j);
                    }

                    celda.totalTiempo = parseFloat((celda.modTiempo * celda.tiempo).toFixed(2));
                    celda.totalCosecha = celda.modCosecha * celda.cosecha + (celda.cebollasExtra ?? 0);
                    celda.totalCosechaStrange = celda.modCosecha * (celda.cosecha + (celda.cebollasExtra ?? 0) + (celda.cebollasExtraStrange ?? 0));

                    if(celda.objeto.clase === PLANTA){
                        celda.tiempoCosecha = parseFloat(getTiempoTrasFresa(celda.numFresa, celda.totalTiempo).toFixed(2));
                    }else{
                        celda.tiempoCosecha = null;
                    }


                    celda.cosechaPorHora = (1 + (0.5 * celda.numFresa * 0.5)) / celda.totalTiempo; // Simplificado 1/2 * .5
                    celda.utilidad = celda.totalCosecha * celda.objeto.utilidadUnitaria;
                    celda.utilidadStrange = celda.totalCosechaStrange * celda.objeto.utilidadUnitariaStrange;
                    celda.evExtra = parseFloat(((celda.utilidadStrange - celda.utilidad) * strangeRate).toFixed(2)); // strangeRate debe estar definido en algún lugar
                    celda.uPH = parseFloat((celda.utilidad * celda.cosechaPorHora).toFixed(2));
                    celda.uPHStrange = parseFloat((celda.evExtra * celda.cosechaPorHora).toFixed(2));

                }


                cosechaTotal += celda.totalCosecha;
                cosechaUph += celda.uPH || 0;  // Acumular directamente en el loop
                cosechaUphS += celda.uPHStrange || 0;
                listaTiempos.push(celda.totalTiempo);
            }
        }
    }

    return {
        mapaGeografia,
        cosechaTotal,
        cosechaUph: Math.round(cosechaUph * 100) / 100,  // Redondear al final
        cosechaUphS: Math.round(cosechaUphS * 100) / 100,
        listaTiempos
    };
}



function getStrange(x) {
    // Manejar el caso donde x es cero o negativo, ya que log2 no está definido para estos valores.
    if (x < 1) {
      return 0.0015; // O puedes devolver otro valor como 0, o lanzar un error, dependiendo de tu necesidad.
    }
    return parseFloat((0.0015 + 0.0015 * Math.log2(x+1)).toFixed(6));

  }

function getTiempoTrasFresa(numFresas, tiempoCultivo) {
    const residuo = (numFresas) % (tiempoCultivo * 2);

    if (residuo === 0) {
        return parseFloat(tiempoCultivo);
    } else {
        return parseFloat(tiempoCultivo - (residuo / 2));
    }
}





// Dibuja el mapa


// Función para dibujar el mapa en SVG (modificada)

function dibujarMapaSVG(svg, mapa, filas, columnas) { // Recibe la capa de area de efecto

    // Función clave para identificar elementos de forma única
    function keyFunction(d) {
        return d.fila + "," + d.columna;
    }

    //svg.selectAll(".area-efecto").remove();

    const datosCeldas = mapa.flatMap((fila, i) => fila.map((celda, j) => ({
        fila: i,
        columna: j,
        celda: celda
    })));


    // Agrupa todos los elementos visuales dentro de un grupo 'g' por celda
    let celdasSVG = svg.selectAll("g.celda").data(datosCeldas, keyFunction);
    let celdasEnter = celdasSVG.enter().append("g").attr("class", "celda");

    

    // 1. Rectángulos de fondo (siempre presentes)
    celdasEnter.append("rect")
        .attr("class", "celda-fondo")  // Nueva clase
        .attr("width", tamanoCelda)
        .attr("height", tamanoCelda)
        .style("fill", "SlateGrey"); // Color de fondo por defecto

    // 2. Imágenes (solo si hay objeto)
    celdasEnter.append("image")
        .attr("class", "celda-imagen")
        .attr("width", tamanoCelda)
        .attr("height", tamanoCelda);


    // 3. Rectángulos de Efecto (Agua, Fertilizante, UV, etc.)
    celdasEnter.append("rect")
        .attr("class", "celda-conAgua")
        .attr("width", tamanoCelda / 5)
        .attr("height", tamanoCelda / 5);

    celdasEnter.append("rect")
        .attr("class", "celda-conFertilizante")
        .attr("width", tamanoCelda / 5)
        .attr("height", tamanoCelda / 5);

    celdasEnter.append("rect")
        .attr("class", "celda-conUV")
        .attr("width", tamanoCelda / 5)
        .attr("height", tamanoCelda / 5);

        celdasEnter.append("rect")
        .attr("class", "celda-conFresa")
        .attr("width", tamanoCelda / 5)
        .attr("height", tamanoCelda / 5);

        celdasEnter.append("text")
        .attr("class", "celda-numFresa")
        .attr("width", tamanoCelda / 5)
        .attr("height", tamanoCelda / 5);
        

    celdasEnter.append("rect")
        .attr("class", "celda-conAFU")
        .attr("width", tamanoCelda)
        .attr("height", tamanoCelda)


    celdasEnter.append("rect")
        .attr("class", "celda-conAFUS")
        .attr("width", tamanoCelda)
        .attr("height", tamanoCelda)

    // 4. Áreas de Efecto

    celdasEnter.append("rect")
        .attr("class", "area-efecto")
        .attr("width", tamanoCelda)
        .attr("height", tamanoCelda);


    // Merge (actualizar elementos existentes)
    let celdasMerge = celdasEnter.merge(celdasSVG);

    celdasMerge.attr("transform", d => `translate(${d.columna * tamanoCelda},${d.fila * tamanoCelda})`);


    celdasMerge.select(".celda-fondo")
        .style("fill", d => {
            if (d.celda?.objeto) {
                if (d.celda.objeto.clase === PLANTA) return d.celda.objeto.color;
                if (d.celda.objeto.clase === MODIFICADOR) return "rgba(222, 222, 222, 0.99)";
                if (d.celda.objeto instanceof ObjPlaceHolder) return "rgba(230, 230, 230, 0.99)";
                if (d.celda.objeto instanceof Flor) return "SlateGrey";
                return "black";

            } else {
                return "SlateGrey";
            }
        })
        .style("stroke", "rgb(150, 150, 150)")
        .style("stroke-width", "1px");

    celdasMerge.select(".celda-imagen")
        .attr("xlink:href", d => d.celda?.objeto?.imagen || null) // Ocultar si no hay imagen
        .style("display", d => d.celda?.objeto?.imagen ? null : "none"); // Ocultar si no hay imagen

    celdasMerge.select(".celda-conUV")
        .attr("x", tamanoCelda * 3 / 6)
        .attr("y", tamanoCelda * 3.75 / 6)
        .style("fill", d => d.celda?.conUV ? "rgba(255, 0, 251, 0.99)" : "none");

    celdasMerge.select(".celda-conFertilizante")
        .attr("x", tamanoCelda * 2 / 6)
        .attr("y", tamanoCelda * 3.75 / 6)
        .style("fill", d => d.celda?.conFertilizante ? "rgba(88, 57, 39, 0.99)" : "none");

    celdasMerge.select(".celda-conAgua")
        .attr("x", tamanoCelda * 1 / 6)
        .attr("y", tamanoCelda * 3.75 / 6)
        .style("fill", d => d.celda?.conAgua ? "rgba(0, 255, 255, 0.99)" : "none");

        celdasMerge.select(".celda-conFresa")
        .attr("x", tamanoCelda * 4 / 6)
        .attr("y", tamanoCelda * 3.75 / 6)
        .style("fill", d => d.celda?.conFresa ? "rgba(175, 0, 0, 0.99)" : "none");

        
        celdasMerge.select(".celda-numFresa")
        .attr("x", tamanoCelda * 4 / 6+ tamanoCelda / 10)
        .attr("y", tamanoCelda * 3.75 / 6+ tamanoCelda / 10)
        .text(d => d.celda?.numFresa ? d.celda?.numFresa : "")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "central")
        .style("fill", "white")
        .style("font-size", "10px");




    celdasMerge.select(".area-efecto")
        .style("display", d => (d.celda?.conAgua || d.celda?.conFertilizante || d.celda?.conUV || d.celda.conFresa) ? null : "none")
        .style("fill", "rgba(255, 25, 0, 0.05)");

    celdasMerge.select(".celda-conAFUS")
        //.attr("xlink:href", d => d.celda?.objeto?.imagen || null) // Ocultar si no hay imagen
        .style("display", d => (d.celda?.conAgua && d.celda?.conFertilizante && d.celda?.conUV) && !d.celda.conFresa ? null : "none")
        .style("stroke", "rgba(255, 255, 0, 0.99)")
        .style("stroke-width", "10px")
        .style("fill", "none");

    celdasMerge.select(".celda-conAFU")
        //.attr("xlink:href", d => d.celda?.objeto?.imagen || null) // Ocultar si no hay imagen
        .style("display", d => (d.celda?.conAgua && d.celda?.conFertilizante && d.celda?.conUV) ? null : "none")
        .style("stroke", "rgba(127, 255, 0, 0.99)")
        .style("stroke-width", "7px")
        .style("fill", "none");

    celdasMerge.exit().remove();


    // Calcular el centro del SVG
    const centroX = columnas * tamanoCelda / 2;
    const centroY = filas * tamanoCelda / 2;

    svg
        .attr("width", columnas * tamanoCelda)
        .attr("height", filas * tamanoCelda)
    //.attr("transform", `rotate(45, ${columnas * tamanoCelda / 2}, ${filas * tamanoCelda / 2})`);
}

/*

function dibujarMapaSVG_M(svg, mapa, filas, columnas) {

    function keyFunction(d) {
        return d.fila + "," + d.columna;
    }


    const datosCeldas = mapa.flatMap((fila, i) => fila.map((celda, j) => ({ fila: i, columna: j, celda: celda })));

    //let celdasSVG = svg.selectAll("g.celda").data(datosCeldas, d => d.fila + "," + d.columna);
    let celdasSVG = svg.selectAll("g.celda").data(datosCeldas, keyFunction);

    let celdasEnter = celdasSVG.enter().append("g").attr("class", "celda");

    crearCeldaSVG(celdasEnter); // Llama a la función para crear elementos

    let celdasMerge = celdasEnter.merge(celdasSVG);

    actualizarCeldaSVG(celdasMerge); // Llama a la función para actualizar

    celdasSVG.exit().remove();

    // Ajustar tamaño del SVG
    svg.attr("width", columnas * tamanoCelda).attr("height", filas * tamanoCelda);

    // Calcular el centro del SVG
    const centroX = columnas * tamanoCelda / 2;
    const centroY = filas * tamanoCelda / 2;

    svg
        .attr("width", columnas * tamanoCelda)
        .attr("height", filas * tamanoCelda)
    //.attr("transform", `rotate(45, ${columnas * tamanoCelda / 2}, ${filas * tamanoCelda / 2})`);

}

function crearCeldaSVG(celdaEnter) {
    // 1. Rectángulos de fondo
    celdaEnter.append("rect")
        .attr("class", "celda-fondo")
        .attr("width", tamanoCelda)
        .attr("height", tamanoCelda)
        .style("fill", "SlateGrey")
        .style("stroke", "rgb(150, 150, 150)")
        .style("stroke-width", "1px");

    // 2. Imágenes
    celdaEnter.append("image")
        .attr("class", "celda-imagen")
        .attr("width", tamanoCelda)
        .attr("height", tamanoCelda);

    // 3. Rectángulos de Efecto
    ["conAgua", "conFertilizante", "conUV", "conFresa"].forEach(efecto => {
        celdaEnter.append("rect")
            .attr("class", `celda-${efecto}`)
            .attr("width", tamanoCelda / 5)
            .attr("height", tamanoCelda / 5);
    });

    // Rectángulos especiales de AFU y AFUS
    ["conAFU", "conAFUS"].forEach(afu => {
        celdaEnter.append("rect")
            .attr("class", `celda-${afu}`)
            .attr("width", tamanoCelda)
            .attr("height", tamanoCelda);
    });


    // 4. Áreas de Efecto
    celdaEnter.append("rect")
        .attr("class", "area-efecto")
        .attr("width", tamanoCelda)
        .attr("height", tamanoCelda);
}
*/

function actualizarCeldaSVG(celdasMerge) {
    celdasMerge.attr("transform", d => `translate(${d.columna * tamanoCelda},${d.fila * tamanoCelda})`);

    celdasMerge.select(".celda-fondo")
        .style("fill", d => {
            // Lógica de color de fondo simplificada (mantén la tuya si es más compleja)
            if (d.celda?.objeto) {
                if (d.celda.objeto.clase === PLANTA) return d.celda.objeto.color;
                if (d.celda.objeto.clase === MODIFICADOR) return "rgba(222, 222, 222, 0.99)";
                if (d.celda.objeto instanceof ObjPlaceHolder) return "rgba(230, 230, 230, 0.99)";
                if (d.celda.objeto instanceof Flor) return "SlateGrey";
                return "black";  // Caso por defecto si el objeto no coincide con las condiciones anteriores
            } else {
                return "SlateGrey";
            }
        });


    celdasMerge.select(".celda-imagen")
        .attr("xlink:href", d => d.celda?.objeto?.imagen || null)
        .style("display", d => d.celda?.objeto?.imagen ? null : "none");

    ["conAgua", "conFertilizante", "conUV", "conFresa"].forEach(efecto => {
        const color = { conAgua: "rgba(0, 255, 255, 0.99)", conFertilizante: "rgba(88, 57, 39, 0.99)", conUV: "rgba(255, 0, 251, 0.99)", conFresa: "rgba(175, 0, 0, 0.99)" }[efecto];
        celdasMerge.select(`.celda-${efecto}`)
            .attr("x", tamanoCelda * ({ "conAgua": 1, "conFertilizante": 2, "conUV": 3, "conFresa": 4 }[efecto]) / 6) // Posición dinámica
            .attr("y", tamanoCelda * 3.75 / 6)
            .style("fill", d => d.celda?.[efecto] ? color : "none");
    });


    celdasMerge.select(".area-efecto")
        .style("display", d => (d.celda?.conAgua || d.celda?.conFertilizante || d.celda?.conUV || d.celda.conFresa) ? null : "none")
        .style("fill", "rgba(255, 25, 0, 0.05)");

    celdasMerge.select(".celda-conAFUS")
        //.attr("xlink:href", d => d.celda?.objeto?.imagen || null) // Ocultar si no hay imagen
        .style("display", d => (d.celda?.conAgua && d.celda?.conFertilizante && d.celda?.conUV) && !d.celda.conFresa ? null : "none")
        .style("stroke", "rgba(255, 255, 0, 0.99)")
        .style("stroke-width", "10px")
        .style("fill", "none");

    celdasMerge.select(".celda-conAFU")
        //.attr("xlink:href", d => d.celda?.objeto?.imagen || null) // Ocultar si no hay imagen
        .style("display", d => (d.celda?.conAgua && d.celda?.conFertilizante && d.celda?.conUV) ? null : "none")
        .style("stroke", "rgba(127, 255, 0, 0.99)")
        .style("stroke-width", "7px")
        .style("fill", "none");


    celdasMerge.exit().remove();


}

/*

function handleClick(event, d) {  // Función separada para manejar el click
    const fila = d.fila;
    const columna = d.columna;
    const codigoSeleccionado = codigoObjeto.value.toUpperCase();


    if (codigoSeleccionado == "ELIMINAR") {
        deleteElement(mapaGeografia, fila, columna);
    } else {
        const selectedElement = getObjetoPorCodigo(codigoSeleccionado);
        placeElement(mapaGeografia, fila, columna, selectedElement);
    }

    // ... (resto de tu lógica para actualizar el mapa y otros datos) ...

    dibujarMapaSVG(svg3, mapaGeografia, filas, columnas); // Redibujar el mapa


}
*/


function actualizarTablaDetalle(listado, elementoDiv) {
    const listadoPlantas = document.getElementById(elementoDiv);
    listadoPlantas.innerHTML = ""; // Limpiar la tabla

    // Agregar la fila de encabezados
    const encabezados = listadoPlantas.insertRow();
    encabezados.insertCell().textContent = "ID";
    encabezados.insertCell().textContent = "Ubicación";
    encabezados.insertCell().textContent = "Objeto";
    encabezados.insertCell().textContent = "Tiempo";
    encabezados.insertCell().textContent = "TiempoCosecha";
    encabezados.insertCell().textContent = "Utilidad";
    encabezados.insertCell().textContent = "Utilidad Strange";
    encabezados.insertCell().textContent = "UPH";
    encabezados.insertCell().textContent = "UPH S";
    encabezados.insertCell().textContent = "Codigo";

    // Calcular la suma de cada columna
    let cuentaId = 0;
    let sumaUPH = 0;
    let sumaUPHS = 0;
    let sumaUtilidad = 0;
    let sumaUtilidadS = 0;
    let mcdVal = mcd(getTiempoBucle(listado));

    listado.forEach(elemento => {
        cuentaId++;
        sumaUtilidad += parseFloat(elemento.utilidad);
        sumaUtilidadS += parseFloat(elemento.utilidadStrange);
        sumaUPH += parseFloat(elemento.uPH);
        sumaUPHS += parseFloat(elemento.uPHS);
    });

    listado.forEach(elemento => {
        // Crea un nuevo elemento <li> para cada producto
        const fila = listadoPlantas.insertRow();

        // Crea una celda para cada propiedad del producto
        fila.insertCell().textContent = elemento.id;
        fila.insertCell().textContent = elemento.celda;
        fila.insertCell().textContent = elemento.objeto;
        fila.insertCell().textContent = elemento.totalTiempo;
        fila.insertCell().textContent = elemento.tiempoCosecha;
        fila.insertCell().textContent = elemento.utilidad;
        fila.insertCell().textContent = elemento.utilidadStrange;
        fila.insertCell().textContent = elemento.uPH;
        fila.insertCell().textContent = elemento.uPHS;
        fila.insertCell().textContent = elemento.codigo;
    });

    // Agregar la fila de suma
    const sumaFila = listadoPlantas.insertRow();
    sumaFila.insertCell().textContent = "Total";
    sumaFila.insertCell();
    sumaFila.insertCell().textContent = cuentaId;
    sumaFila.insertCell();
    sumaFila.insertCell().textContent = "MCD: " + mcdVal + "(" + mcdVal * 60 + " min)";
    sumaFila.insertCell().textContent = sumaUtilidad;
    sumaFila.insertCell().textContent = Math.round(sumaUtilidadS*100) / 100;
    sumaFila.insertCell().textContent = Math.round(sumaUPH * 100) / 100;
    sumaFila.insertCell().textContent = Math.round(sumaUPHS * 100) / 100;
    sumaFila.insertCell();

}


function actualizarTablaResumen(cosechaTotal, elementoDiv) {
    const listadoPlantas = document.getElementById(elementoDiv);
    listadoPlantas.innerHTML = ""; // Limpiar la tabla

    // Agregar la fila de encabezados
    const encabezados = listadoPlantas.insertRow();
    encabezados.insertCell().textContent = "ID";
    encabezados.insertCell().textContent = "Objeto";
    encabezados.insertCell().textContent = "Qty";
    encabezados.insertCell().textContent = "Utilidad";
    encabezados.insertCell().textContent = "UPH";
    encabezados.insertCell().textContent = "UPH S";

    // Calcular la suma de cada columna
    let cuentaId = 0;
    let sumaQty = 0;
    let sumaUtilidad = 0;
    let sumaUPH = 0;
    let sumaUPHS = 0;

    cosechaTotal.forEach(elemento => {
        cuentaId++;
        sumaQty += parseFloat(elemento.conteo);
        sumaUtilidad += parseFloat(elemento.utilidad);
        sumaUPH += parseFloat(elemento.uPH);
        sumaUPHS += parseFloat(elemento.uPHS);
    });

    cosechaTotal.forEach(elemento => {
        // Crea un nuevo elemento <li> para cada producto
        const fila = listadoPlantas.insertRow();

        // Crea una celda para cada propiedad del producto
        fila.insertCell().textContent = elemento.id;
        fila.insertCell().textContent = elemento.objeto;
        fila.insertCell().textContent = elemento.conteo;
        fila.insertCell().textContent = elemento.utilidad;
        fila.insertCell().textContent = Math.round(elemento.uPH * 100) / 100;
        fila.insertCell().textContent = Math.round(elemento.uPHS * 100) / 100;
    });

    // Agregar la fila de suma
    const sumaFila = listadoPlantas.insertRow();
    sumaFila.insertCell().textContent = "Total";
    sumaFila.insertCell().textContent = cuentaId;
    sumaFila.insertCell().textContent = sumaQty;
    sumaFila.insertCell().textContent = Math.round(sumaUtilidad * 100) / 100;
    sumaFila.insertCell().textContent = Math.round(sumaUPH * 100) / 100;
    sumaFila.insertCell().textContent = Math.round(sumaUPHS * 100) / 100;

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


function generarMapaAleatorioCalcularYDibujar(filas = 5, columnas = 5, plantas = 1, modificadores = 1, restricciones, tipoMapa, svg) {

    // Generar el mapa aleatorio
    const mapaAleatorio = crearMapaAleatorio(filas, columnas, plantas, modificadores, restricciones, tipoMapa);
    //console.log("Mapa Aleatorio", mapaAleatorio);


    // Calcular la cosechacapaPlantas, capaAreaEfecto, capaModCosecha, capaModTiempo, capaFertilizanteCosecha, capaUvCosecha, capaUvTiempo,capaFertilizanteTiempo,capaAspersor)
    const cosechaTotal = calcularMapa(mapaAleatorio.mapaGeografia);
    //console.log("Mapa Aleatorio CosechaTotal", cosechaTotal);


    dibujarMapaSVG(svg, mapaAleatorio.mapaGeografia, mapaAleatorio.mapaGeografia.length, mapaAleatorio.mapaGeografia[0].length);

    const listado = getListado(cosechaTotal.mapaGeografia);
    const listadoResumen = getResumen(listado)

    actualizarTablaDetalle(listado, "listado-detalle");
    actualizarTablaResumen(listadoResumen, "listado-resumen");

    return { mapaAleatorio: mapaAleatorio, cosecha: cosechaTotal };
}

function validarRestriccionesCodificacionMapa(codigoMapa, restricciones) {

    if (!(restricciones instanceof Restricciones)) {
        console.error("Error: 'restricciones' debe ser una instancia de la clase Restricciones.");
        return false; // O lanzar una excepción, según tu manejo de errores
    }
    
    let mapaOriginal = [...codigoMapa];
    const frecuencias = {};

    // 1. Contar la frecuencia de cada elemento
    codigoMapa = codigoMapa.map(item =>
        typeof item === 'string' && item.length === 3 ? item.slice(0, 2) : item
    );

    let i = 0;
    for (const elemento of codigoMapa) {
        if (String(elemento) !== "r") {
        const clave = elemento === 0 ? "0" : elemento;
        frecuencias[clave] = (frecuencias[clave] || 0) + 1;
        }
    }

    const codigosModificadores = [...new Set(poolModificadores.map(modificador => modificador.codigo))]; // Array de modificadores
    const codigosPlantas = poolPlantas.map(planta => planta.codigo);


    const totalPlantas = Object.entries(frecuencias)
        .filter(([clave, _]) => codigosPlantas.includes(clave))
        .reduce((acc, [_, valor]) => acc + valor, 0);

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
            //console.log("elementos superan límite", indices.length);
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
                codigoMapa[indices[indiceRelativo]] = "R";
                //console.log(indiceRelativo, "sustityendo por plantas");
            }
            //console.log("coidgo sano", codigoMapa, "sustituciones", indicesASustituir);

        }
    }

    let cumpleLimitePlantable = true;


    if ((totalPlantas) <= restricciones.Plantable) {
        cumpleLimitePlantable = true;
    } else {
        //console.log("excedente", totalPlantas-restricciones.Plantable);

        cumpleLimitePlantable = false;
        let plantableAceptable = false;

        for (let index = 0; index < (totalPlantas - restricciones.Plantable); index++) {

            while (plantableAceptable == false) {
                const indiceAleatorio = Math.floor(Math.random() * codigoMapa.length);

                if (codigosPlantas.includes(codigoMapa[indiceAleatorio])) {
                    codigoMapa[indiceAleatorio] = "R";
                    plantableAceptable = true;
                }

            }
        }
    }

    codigoMapa = prepararTextoCodigoMapa(codigoMapa.toString());
    mapaOriginal = prepararTextoCodigoMapa(mapaOriginal.toString());
    
    

    // Verificar si la suma de frecuencias (sin ceros) es menor o igual a Plantable

    const cumpleLimites = cumpleLimitesIndividuales && cumpleLimitePlantable;

    if (!cumpleLimites) {
        //console.log(cumpleLimites, codigoMapa, mapaOriginal);
    }


    return {
        cumpleLimites,
        codigoMapa,
        mapaOriginal,

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
        }else if(elemento=="BF"){
            const fbpos1 = i+1;
            const fbpos2 = i+columnas;
            const fbpos3 = i+1+columnas;

            if (
                fbpos1 >= longitud ||
                fbpos2 >= longitud ||
                fbpos3 >= longitud ||
                codigoMapa[fbpos1] != "X" ||
                codigoMapa[fbpos2] != "X" ||
                codigoMapa[fbpos3] != "X"
            ) return false;

        }else if(elemento=="EF"){
            const fepos1 = i+1;
            const fepos2 = i+2;
            const fepos3 = i+0+columnas;
            const fepos4 = i+1+columnas;
            const fepos5 = i+2+columnas;
            const fepos6 = i+0+columnas+columnas;
            const fepos7 = i+1+columnas+columnas;
            const fepos8 = i+2+columnas+columnas;

            if (
                fepos1 >= longitud ||
                fepos2 >= longitud ||
                fepos3 >= longitud ||
                fepos4 >= longitud ||
                fepos5 >= longitud ||
                fepos6 >= longitud ||
                fepos7 >= longitud ||
                fepos8 >= longitud ||
                codigoMapa[fepos1] != "X" ||
                codigoMapa[fepos2] != "X" ||
                codigoMapa[fepos3] != "X" ||
                codigoMapa[fepos4] != "X" ||
                codigoMapa[fepos5] != "X" ||
                codigoMapa[fepos6] != "X" ||
                codigoMapa[fepos7] != "X" ||
                codigoMapa[fepos8] != "X" 
            ) return false;

        }


    }

    // Si todas las validaciones pasan, retornar true
    return true;
}




// Función para crear un mapa aleatorio
function crearMapaCodificado(filas, columnas, codigoMapa, restricciones = new Restricciones(999, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999,999)) {

    const geografia = Array.from({ length: filas }, () => Array(columnas).fill(true));

    let mapaGeografia = [];

    for (let i = 0; i < filas; i++) {
        mapaGeografia[i] = []; // Inicializar cada fila del mapa
        for (let j = 0; j < columnas; j++) {
            mapaGeografia[i][j] = geografia[i][j]
                ? new Celda(null, 0, false, false, false, false, 1, 0, 1, 0, 1, 0, 0, "") // Crear Celda si es true
                : null; // Asignar null si es false
        }
    }


    const mapaValidado = validarRestriccionesCodificacionMapa(codigoMapa, restricciones);

    if (!mapaValidado.cumpleLimites) {
        codigoMapa = mapaValidado.codigoMapa;
    }else{
        codigoMapa = mapaValidado.mapaOriginal;
    }

    const matriz = decodificarMapa(codigoMapa, filas, columnas);

    for (let fila = 0; fila < matriz.length; fila++) {
        for (let columna = 0; columna < matriz[fila].length; columna++) {
            const objeto = getObjetoPorCodigo(matriz[fila][columna]);

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

    //console.log(mapaGeografia, mapaCodificado);
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


function mostrarPoblacionEnTextBoxes(poblacion, elemento) {
    const contenedor = document.getElementById(elemento);
    contenedor.innerHTML = ""; // Limpiar el contenedor

    poblacion.forEach(individuo => {
        const preElement = document.createElement("pre");
        preElement.classList.add(elemento + "-pre"); // Agregar la clase
        preElement.textContent = individuo.join(","); // Usar textContent para <pre>
        contenedor.appendChild(preElement);
        // contenedor.appendChild(document.createElement("br"));
    });
}

function prepararTextoCodigoMapa(textBox) {
    return textBox.replace(/\s/g, '').split(',')
       /* .map(elemento =>
            typeof elemento === 'string' ? elemento.replace(/"/g, '').toUpperCase() : elemento
        );
*/
        .map(elemento => {
            let processedElement = typeof elemento === 'string' ? elemento.replace(/"/g, '') : elemento;
            // Reemplazar cadenas vacías con "R"
            if (processedElement === "") {
              return "R";
            } else {
              return processedElement.toUpperCase();
            }
        });
}


function obtenerRestricciones() {
    const plantable = parseInt(document.getElementById("Plantable").value);//
    const gg = parseInt(document.getElementById("GG").value);//
    const mg = parseInt(document.getElementById("MG").value);//
    const ls = parseInt(document.getElementById("LS").value);//
    const rs = parseInt(document.getElementById("RS").value);//
    const gf = parseInt(document.getElementById("GF").value);//
    const bf = parseInt(document.getElementById("BF").value);//
    const ef = parseInt(document.getElementById("EF").value);//
    const c = parseInt(document.getElementById("C").value);//
    const s = parseInt(document.getElementById("S").value);//
    const z = parseInt(document.getElementById("Z").value);//
    const p = parseInt(document.getElementById("P").value);//
    const u = parseInt(document.getElementById("U").value);//
    const n = parseInt(document.getElementById("N").value);//
    const f = parseInt(document.getElementById("F").value);//
    const o = parseInt(document.getElementById("O").value);//
    const l = parseInt(document.getElementById("L").value);//

    return new Restricciones(plantable, gg, mg, ls, rs, gf, bf, ef, c, s, z, p, u, n, f, o, l)

}

window.onload = (event) => {
    botonGenerarMapaAletorio.click();
    //botonCalcularCodificado.click();
};


const usarGeografiaRadio = document.getElementById('usarGeografia');


if (usarGeografiaRadio.checked) {
    //console.log("Valor seleccionado: Real");
    usarGeografia = true;
} else {
    const usarTeorico = document.getElementById('usarTeorico');
    if (usarTeorico.checked) {
       //console.log("Valor seleccionado: Teorico");
        usarGeografia = false;
    } else {
       //console.log("No hay ninguna opción seleccionada.");
    }
}


// Agregar el evento click al botón
const botonGenerarMapaAletorio = document.getElementById("boton-generar");

botonGenerarMapaAletorio.addEventListener("click", function () {

    let filas = parseInt(document.getElementById("filas").value);
    let columnas = parseInt(document.getElementById("columnas").value);
    let tipoMapa = true;

    const usarGeografiaRadio = document.getElementById('usarGeografia');


    if (usarGeografiaRadio.checked) {
        tipoMapa = true;
    } else {
        const usarTeorico = document.getElementById('usarTeorico');
        if (usarTeorico.checked) {
            tipoMapa = false;
        } else {
            //console.log("No hay ninguna opción seleccionada.");
        }
    }


    const restricciones = obtenerRestricciones();

    const nuevoMapa = generarMapaAleatorioCalcularYDibujar(
        filas,
        columnas,
        parseInt(document.getElementById("plantas").value),
        parseInt(document.getElementById("modificadores").value),
        restricciones,
        tipoMapa,
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
    const restricciones = obtenerRestricciones();

    codigoMapa = prepararTextoCodigoMapa(codigoMapa)

    if (codigoMapa.length !== filas / 1 * columnas / 1) {
        //console.log("La longitud de la codificación no coincide con las filas y columnas del mapa");
        alert("La longitud de la codificación no coincide con las filas y columnas del mapa");
    } else {
        const mapaCodificado = crearMapaCodificado(filas, columnas, codigoMapa, restricciones);

        const cosechaTotal = calcularMapa(mapaCodificado.mapaGeografia);

        // const cosechaTotalCodificado = calcularCosechaNew(
        //     mapaGeografia
        // );

        //console.log("cosecha codificado btn: ", cosechaTotalCodificado);

        const resultadoDiv = document.getElementById("resultadoUPH");
        resultadoDiv.innerHTML = "UPH: " + JSON.stringify(cosechaTotal.cosechaUph);

        dibujarMapaSVG(svg2, mapaCodificado.mapaGeografia, filas, columnas);

        const listado = getListado(cosechaTotal.mapaGeografia);
        const listadoResumen = getResumen(listado)

        actualizarTablaDetalle(listado, "listado-detalle-decodificador");
        actualizarTablaResumen(listadoResumen, "listado-resumen-decodificador");

    }


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
                fill: false,
                pointRadius: 0
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
        let resultado = crearMapaAleatorio(filas, columnas, randPlantas, randMods, restricciones, false);
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
        //evaluado.push({ uPH: cosechaTotalCodificado.cosechaUph, Mapa: poblacion[index].mapaCodificado.flat() });
        evaluado.push({ uPH: cosechaTotalCodificado.cosechaUph+cosechaTotalCodificado.cosechaUphS, Mapa: poblacion[index].mapaCodificado.flat() });
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

            //const maxIntentos = 20;
            const maxIntentos = population.length / 2;
            let childrenFound = false; // Bandera para indicar si se encontraron hijos válidos

            for (let intentos = 0; intentos < maxIntentos; intentos++) {
                const children = crossover(population[i], population[i + 1]);
                let child1 = mutacion(children[0], mutacionProb);
                let child2 = mutacion(children[1], mutacionProb);

                const child1Validation = validarRestriccionesCodificacionMapa(child1, restricciones);
                const child2Validation = validarRestriccionesCodificacionMapa(child2, restricciones);

                //prepararTextoCodigoMapa

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
                    if (
                        validarCodigoMapa(filas, columnas, repairedChild1) && 
                        validarCodigoMapa(filas, columnas, repairedChild2) &&
                        validarRestriccionesCodificacionMapa(repairedChild1, restricciones).cumpleLimites &&
                        validarRestriccionesCodificacionMapa(repairedChild2, restricciones).cumpleLimites
                    ) {
                        newPopulation.push(repairedChild1);
                        newPopulation.push(repairedChild2);
                        childrenFound = true;
                    }
                }
            }

            if (!childrenFound) { // Si no se encontraron hijos, añade los padres.
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

        mostrarPoblacionEnTextBoxes(poblacionMapa, "poblacion");

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
        nPoblacion = parseInt(document.getElementById("nPoblacion").value);

        coRate = parseInt(document.getElementById("coRate").value) / 100;
        mutacionProb = parseInt(document.getElementById("mutacionProb").value) / 100;

        if (poblacionIni.length == 0) {
            poblacionIni = crearPoblacion(nf, nc, nPoblacion, restricciones);
        }

        let evaluado = evaluar(poblacionIni);
        
        seleccion = naturalSelection(evaluado, tamSeleccion);

        mejoresPuntuaciones.unshift({ uPH: seleccion.uPH[0], Mapa: seleccion.Mapa[0] });

        document.getElementById("seleccion").innerHTML = JSON.stringify(seleccion);


        if (mejoresPuntuaciones.length == 1) {
            mejorPuntuacionAbs = mejoresPuntuaciones[0];
        } else if (mejoresPuntuaciones[0].uPH > mejorPuntuacionAbs.uPH) {
            mejorPuntuacionAbs = mejoresPuntuaciones[0]
        }


        const mapaString = mejorPuntuacionAbs.Mapa.map(item => `${item}`).join(",");


        document.getElementById("mejorUPH").innerHTML = `<pre>uPH:${mejorPuntuacionAbs.uPH}</pre>`;
        document.getElementById("mejorPuntuacionAbs").innerHTML = `<pre>"${mapaString}"</pre>`;
        
        poblacionIni = performCrossover(seleccion.Mapa, coRate, mutacionProb, restricciones);
        poblacionIni = offspring(nf, nc, poblacionIni, restricciones);

        document.getElementById("poblacion").innerHTML = "";


        mostrarPoblacionEnTextBoxes(seleccion.Mapa, "poblacion");


        codigoMapa = seleccion.Mapa[0];

        const mapaCodificado = crearMapaCodificado(nf, nc, seleccion.Mapa[0], restricciones);
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
        updateFitPlot(mejoresPuntuaciones);
    });



}

function placeElement(mapa, fila, columna, objeto) {
    if (celdaLibre(mapa, fila, columna)) {
        if (objeto.placeHolder != null) {
            const coordenadas = getPlaceHolderCells(mapa, objeto, fila, columna);
            if (!coordenadas.celdasEnRango) {
            } else {
                if (cabe(mapa, coordenadas.celdasPlaceHolder)) {
                    llenarConPlaceHolders(mapa, coordenadas.celdasPlaceHolder, ObjPlaceHolder);

                    mapa[fila][columna].objeto = objeto;

                    //console.log(mapa,calcularMapa(mapa));
                } else {
                }
            }
        } else {
            mapa[fila][columna].objeto = objeto;
            //console.log(mapa,calcularMapa(mapa));
        }

    } else {
        //console.log("celda ocupada");
    }

    mapa.forEach((fila, indiceFila) => {
        fila.forEach((celda, indiceColumna) => {
            if (celda.objeto?.formaAoE) {
                //console.log("llenando AoE de:", objeto, objeto.formaAoE);
                fillAoECells(mapa, celda.objeto, indiceFila, indiceColumna);

            };
        });
    });
}

function deleteElement(mapa, fila, columna) {

    let objeto = null;

    if (celdaLibre(mapa, fila, columna)) {

    } else {
        objeto = mapa[fila][columna].objeto

        mapa[fila][columna] = new Celda(null, 0, false, false, false, false, 1, 0, 1, 0, 1, 0, 0, "");
        resetAoECells(mapa);
    }


    mapa.forEach((filaMapa, indiceFila) => {
        filaMapa.forEach((celda, indiceColumna) => {
            if (celda.objeto?.formaAoE) {
                //console.log("llenando AoE de:", celda, objeto?.formaAoE);
                fillAoECells(mapa, celda.objeto, indiceFila, indiceColumna);

            };
        });
    });

}


function crearMapaGUI(filas, columnas) {
    let mapaGeografia = [];
    for (let i = 0; i < filas; i++) {
        mapaGeografia[i] = []; // Inicializar cada fila del mapa
        for (let j = 0; j < columnas; j++) {
            mapaGeografia[i][j] = new Celda(null, 0, false, false, false, false, 1, 0, 1, 0, 1, 0, 0, "")
        }
    }
    return mapaGeografia;
};


function actualizarMapaGUI() {
    let filas = parseInt(document.getElementById('largoMapaGUI').value, 10); // Parsear a entero
    let columnas = parseInt(document.getElementById('anchoMapaGUI').value, 10); // Parsear a entero

    if (isNaN(filas) || filas <= 0 || isNaN(columnas) || columnas <= 0) {
        // Manejar entradas inválidas, por ejemplo, mostrar un mensaje de error
        console.error("Filas y columnas deben ser números positivos");
        return;
    }

    let mapaGeografia = crearMapaGUI(filas, columnas);
    dibujarMapaSVG(svg3, mapaGeografia, filas, columnas);

    // ... (resto del código dentro del evento click de celdasSVG, adaptado)
    let celdasSVG = svg3.selectAll("g.celda");

    celdasSVG.on("click", function (event, d) {

        
        d3.event.preventDefault();


        let fila = Math.floor(d / columnas); // Calcula la fila
        let columna = d % columnas;          // Calcula la columna
        const codigoSeleccionado = codigoObjeto.value.toUpperCase();


            if (codigoSeleccionado === "ELIMINAR") {  // Mantén la opción de eliminar por texto
                deleteElement(mapaGeografia, fila, columna);
            } else {
                const selectedElement = getObjetoPorCodigo(codigoSeleccionado);
                placeElement(mapaGeografia, fila, columna, selectedElement);
            }


        const mapaCalculado = calcularMapa(mapaGeografia);

        console.log("mapaCalculadoGUI", mapaCalculado);

        dibujarMapaSVG(svg3, mapaGeografia, filas, columnas); // Redibujar el mapa después del cambio

        const resultadoDivGUI = document.getElementById("resultadoUPHGUI");
        resultadoDivGUI.innerHTML = "UPH: " + JSON.stringify(mapaCalculado.cosechaUph);


        const listado = getListado(mapaCalculado.mapaGeografia);
        const listadoResumen = getResumen(listado)

        actualizarTablaDetalle(listado, "listado-detalle-GUI");
        actualizarTablaResumen(listadoResumen, "listado-resumen-GUI");

        const mapaCodificado = mapaGeografia.map(fila => fila.map(celda => celda.objeto?.codigoLargo ?? " ")).flat();

        let chunkedArray = [];

        for (let i = 0; i < mapaCodificado.length; i += Math.floor(columnas)) {
            chunkedArray.push(mapaCodificado.slice(i, i + Math.floor(columnas)));
        }

        const mapaString = chunkedArray
            .map(chunk => chunk.map(item => `${item}`).join(", "))
            .join("<br>");

        const codigoGUI = document.getElementById("codigoGUI");
        codigoGUI.innerHTML = JSON.stringify(mapaCodificado);

        document.getElementById("codigoMapaGUI").innerHTML = `<pre>${mapaString}</pre>`;
    });
}

document.getElementById('largoMapaGUI').addEventListener("input", actualizarMapaGUI);
document.getElementById('anchoMapaGUI').addEventListener("input", actualizarMapaGUI);

document.getElementById('trebol4').addEventListener("input", function(event) {
    strangeRate = getStrange(parseInt(event.target.value));
  });



document.addEventListener('DOMContentLoaded', () => {
   // const codigoObjeto = document.getElementById('codigoObjeto');
    actualizarMapaGUI();

});




function crearBotonObjeto(objeto) {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.id = objeto.codigoLargo; // Usamos codigoLargo si existe, sino codigo
    boton.className = 'objeto-button';
    boton.style.backgroundColor = objeto.color;

    const img = document.createElement('img');
    img.src = objeto.imagen;
    img.alt = objeto.nombre;
    img.style.width = '30px';
    img.style.height = '30px';
    boton.appendChild(img);

    // Agregar indicador de orientación si existe
    if (objeto.orientacion && objeto.orientacion !== "") {
        const orientacionSpan = document.createElement('span');
        orientacionSpan.textContent = objeto.orientacion;
        orientacionSpan.className = 'orientacion'; // Clase para estilizar la orientación
        boton.appendChild(orientacionSpan);

        // Agregar un tooltip con la formaAoE si existe y el objeto tiene orientación
          if (objeto.formaAoE) {
              //boton.title = generarTooltipAoE(objeto.formaAoE);
          }
    }
    // Evento click para cada botón (ejemplo)
    boton.addEventListener('click', () => {
        //console.log(`Has clicado en ${planta.codigo}`);
        document.getElementById('codigoObjeto').value = objeto.codigoLargo;
        const codigoObjeto = objeto.codigo;

        // Aquí puedes agregar la lógica que quieras al clickar el botón
        // Por ejemplo, mostrar información de la planta en un modal, 
        // añadirla a un carrito de compras, etc.
    });

    return boton;
}

function crearBotonEliminar() {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.id = 'ELIMINAR'; // Usamos codigoLargo si existe, sino codigo
    boton.className = 'objeto-button';
    boton.style.backgroundColor = 'BLACK';

    const img = document.createElement('img');
    img.src = "./imgs/Semillas.png";
    img.alt = 'ELIMINAR';
    img.style.width = '30px';
    img.style.height = '30px';
    boton.appendChild(img);

    // Evento click para cada botón (ejemplo)
    boton.addEventListener('click', () => {
        //console.log(`Has clicado en ${planta.codigo}`);
        document.getElementById('codigoObjeto').value = 'ELIMINAR';
        const codigoObjeto = 'ELIMINAR';

    });

    return boton;
}

function generarTooltipAoE(formaAoE) {
    return formaAoE.map(fila => fila.map(celda => celda ? celda : " ").join("")).join("\n");
}


const contenedorBotones = document.getElementById('contenedor-botones'); 

if (contenedorBotones) {
  // Generar los botones y agregarlos al contenedor

  poolObjetos.forEach(objeto => {
    const boton = crearBotonObjeto(objeto);
    contenedorBotones.appendChild(boton);
});

contenedorBotones.appendChild(crearBotonEliminar());

} else {
  console.error("No se encontró el elemento con ID 'contenedor-botones'");
}

