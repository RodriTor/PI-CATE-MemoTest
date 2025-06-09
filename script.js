const tablero = document.getElementById('tablero-juego');
const mensaje = document.getElementById('mensaje');
const puntosJ1 = document.getElementById('puntos-jugador1');
const puntosJ2 = document.getElementById('puntos-jugador2');
const pokemonesJ1 = document.getElementById('pokemones-jugador1');
const pokemonesJ2 = document.getElementById('pokemones-jugador2');

let cartas = [];
let primera = null;
let segunda = null;
let turno = 1;
let puntos1 = 0;
let puntos2 = 0;
let parejas = 0;

function obtenerPokemon(id, callback) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)
        .then(res => res.json())
        .then(data => {
            callback({
                nombre: data.name,
                imagen: data.sprites.front_default
            });
        });
}

function cargarPokemones() {
    let pokemones = [];
    let cargados = 0;
    for (let i = 0; i < 10; i++) {
        let id = Math.floor(Math.random() * 151) + 1;
        obtenerPokemon(id, function(pokemon) {
            pokemones.push(pokemon);
            cargados++;
            if (cargados === 10) {
                iniciarJuego(pokemones);
            }
        });
    }
}

function iniciarJuego(pokemones) {
    mensaje.textContent = '¡Turno del Jugador 1!';
    let todos = pokemones.concat(pokemones);
    todos.sort(() => 0.5 - Math.random());

    todos.forEach(poke => {
        let div = document.createElement('div');
        div.className = 'tarjeta';
        div.dataset.nombre = poke.nombre;
        div.dataset.imagen = poke.imagen;
        div.textContent = '?';
        div.onclick = voltear;
        tablero.appendChild(div);
        cartas.push(div);
    });
}

function voltear() {
    if (this.classList.contains('volteada') || primera && segunda) 
        return;

    this.classList.add('volteada');
    this.innerHTML = `<img src="${this.dataset.imagen}" alt="${this.dataset.nombre}">`;

    if (!primera) {
        primera = this;
    } else {
        segunda = this;
        setTimeout(verificar, 800);
    }
}

function verificar() {
    if (primera.dataset.nombre === segunda.dataset.nombre) {
        primera.onclick = null;
        segunda.onclick = null;
        primera.classList.add('encontrada');
        segunda.classList.add('encontrada');

        if (turno === 1) {
            puntos1++;
            puntosJ1.textContent = puntos1;
            pokemonesJ1.innerHTML += `<span>${primera.dataset.nombre}</span> `;
        } else {
            puntos2++;
            puntosJ2.textContent = puntos2;
            pokemonesJ2.innerHTML += `<span>${primera.dataset.nombre}</span> `;
        }

        parejas++;
        if (parejas === 10) {
            terminar();
        }
    } else {
        primera.classList.remove('volteada');
        segunda.classList.remove('volteada');
        primera.textContent = '?';
        segunda.textContent = '?';
        turno = turno === 1 ? 2 : 1;
        mensaje.textContent = 'Turno del Jugador ' + turno + '!';
    }

    primera = null;
    segunda = null;
}

function terminar() {
    if (puntos1 > puntos2) {
        mensaje.textContent = 'Gano el Jugador 1!';
    } else if (puntos2 > puntos1) {
        mensaje.textContent = 'Gano el Jugador 2!';
    } else {
        mensaje.textContent = 'Empate!';
    }
}

cargarPokemones();
