export default class Voronoi {
    constructor(canvas, canvas_background) {
        this.background = canvas_background;//Canvas 1 con el fondo estático
        this.canvas = canvas;//canvas dinámico
        this.points = [];//lineas es la entrada del algoritmo
        this.position = 0;//donde empieza la linea de barrido
        this.delta = 1;//Cantidad que avanza la linea cada iteración
        this.colors = {};
        this.playing = true;
    }


    //Pausa la simulación
    pause() {
        this.playing = false;
    }
    //Continua la ejecución
    continue() {
        if (this.playing) return;
        this.playing = true;
        this.run();
    }

    //Reinicia la ejecución con las mismas lineas
    reboot() {
        this.clean(this.background);//Limpio todo
        this.set_points(this.original);//Pongo las lineas originales en una copia llamada original 
        this.draw_points();//Dibujo las lineas 
        this.delta = 1;
        this.position = 0;//donde empieza la linea de barrido
        this.continue();//Llama a continuar
    }

    new_random_points() {//Pone lineas random 
        this.set_random_points();
        this.reboot();//Y reinicia la simulación
    }


    set_random_points() {
        let lista = [];
        for (let index = 0; index < 16; index++) {
            let width = Math.random() * (this.canvas.width - 50) + 20;
            let height = Math.random() * (this.canvas.height - 50) + 20;
            let line = new Object();
            line.x = width;
            line.y = height;
            lista.push(line);
        }

        this.set_points(lista);
    }

    /**Dada una lista de puntos los ordena y los agrega al objeto */
    set_points(points) {
        this.points = points;
        this.points.sort((point1, point2) => {//Ordena las lineas según su punto más a la izquierda
            return ((point1.x < point2.x) ? -1 : 1);//Pregunto si el mínimo es el x del
            //punto 1, si es así, va primero regreso -1, si no, entonces el mínimo pertenece a la punto 2 y regreso 1
        });//Ordeno según el eje X

        this.points.forEach(element => {
            this.colors[element] = this.stringToColour(JSON.stringify(element));
        });
        this.original = [...this.points];
    }

    /**
     * Dibuja los puntos
     */
    draw_points() {
        this.points.forEach(element => {
            draw_circle(this.background, element.x, element.y, 5);
        });
    }






    /**
     * Esta función se llama en cada actualización
     * Va actualizando la posición
     * dibuja la linea de barrido
     * actualiza las lineas activas
     * actualiza las lineas que se desactivan
     */
    render() {
        this.clean(this.canvas);//Limpia el canvas dinámico donde se dibuja la linea de barrido
        this.draw_points();
        var height = this.canvas.height;
        //Dibuja la linea de barrido
        draw_line(this.canvas, this.position, 0, this.position, height, "red", 3);
        this.coloring_axis();
        //console.log(this.points);
        this.position += this.delta;//Aumenta el valor del recorrido con esa constante
        if (this.position > this.canvas.width)
            this.playing = false;
    }

    coloring_axis() {
        for (let index = 0; index < this.canvas.height; index += 1) {
            let closest = this.find_closest({ x: this.position, y: index }).point;
            //console.log(closest);
            var color = this.stringToColour(JSON.stringify(closest));
            //draw_circle(this.background, closest.x, closest.y, 3,color);
            draw_rect(this.background, this.position, index, 4, 2, color);
        }
    }

    stringToColour(str) {
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        var colour = '#';
        for (var i = 0; i < 3; i++) {
            var value = (hash >> (i * 8)) & 0xFF;
            colour += ('00' + value.toString(16)).substr(-2);
        }
        return colour;
    }

    find_closest(point) {


        var copia = this.points.map(function (a) {

            var f = point.x - a.x;
            var b = point.y - a.y;
            var c = Math.sqrt(f * f + b * b);

            return { point: a, distance: c }
        })

        const min = copia.reduce((prev, current) => (prev.distance < current.distance) ? prev : current)

        return min;
    }




    /**
     * Función que empieza a ejecutar el algoritmo
     */
    run() {
        this.render();
        //Si la linea de barrido ya tocó el final del canvas, se detiene
        //si no, vuelve a llamar a la misma función en el siguiente cuadro de animación
        if (this.playing)
            //Esta instrucción me sacó canas verdes
            //el bind pone el atributo dado, como el this, del contexto de la función 
            window.requestAnimationFrame(this.run.bind(this));
    }


    /**función que limpia un canvas dado */
    clean(canvas) {
        let context = canvas.getContext('2d');
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }




}