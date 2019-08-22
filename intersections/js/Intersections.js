export default class Intersections {
    constructor(canvas, canvas_background) {
        this.background = canvas_background;//Canvas 1 con el fondo estático
        this.canvas = canvas;//canvas dinámico
        this.lines = [];//lineas es la entrada del algoritmo
        this.position = 0;//donde empieza la linea de barrido
        this.delta = 1.5;//Cantidad que avanza la linea cada iteración
        this.active_list = [];//Lineas que están tocando la linea de barrido
        this.intersections = [];//Lista de intersecciones
        this.playing = true;
    }

    /**
     * Dibuja las lineas, tienen que haber sido puestas antes
     */
    draw_background() {
        //Recorro el arreglo de lineas
        this.lines.forEach((element, index) => {
            //Encuentro el punto más a la izquierda 
            let min = element.a.x < element.b.x ? element.a : element.b;
            element.name = index;//nombro a la linea
            draw_line(this.background, element.a.x, element.a.y, element.b.x, element.b.y);
            //La dibujo, sobre el canvas estático
            write_text(this.background, index, min.x, min.y);
            //escribo su nombre en el canvas
        });
    }


    /** Asigna las lineas a la clase
     * y las ordena para ser usadas en el algoritmo*/
    set_lines(list_of_lines) {
        this.lines = list_of_lines;
        this.lines.sort((line1, line2) => {//Ordena las lineas según su punto más a la izquierda
            let min1 = (line1.a.x < line2.a.x) ? line1.a.x : line2.a.x;//Encuentro el minimo entre los puntos a 
            let min2 = (line1.b.x < line2.b.x) ? line1.b.x : line2.b.x;//El mínimo entre los puntos b
            let min = (min1 < min2) ? min1 : min2;//Encuentro el mínimo de mínimos
            return ((min === line1.a.x) || (min === line1.b.x) ? -1 : 1);//Pregunto si el mínimo es el x de la
            //Linea 1, si es así, va primero regreso -1, si no, entonces el mínimo pertenece a la linea 2 y regreso 1
           
        });//Ordeno según el eje X
        this.original = [...this.lines];//Creo una copia de las lineas
    }

  

    /**
     * Borra las lineas que ya dejó atrás el barrido
     * y las repinta de negro
     */
    delete_unactive() {
        //Itero sobre la lista de activos 
        this.active_list = this.active_list.filter((element) => {
            //Si ambos puntos en su eje x, son menores a la posición del barrido
            //entonces lo elimino de la lista y lo repinto de negro
            if ((element.a.x < this.position) && element.b.x < this.position) {
                //Repinta de negro la linea
                draw_line(this.background, element.a.x, element.a.y, element.b.x, element.b.y);
                //Se elimina
                return false;
            }
            //Se queda
            return true;
        });
    }

    /**Crea 16 lineas random y las asigna */
   set_random_lines() {
        let lista = [];
        let lineas = [];
        for (let index = 0; index < 16; index++) {
            let width = Math.random() * (this.canvas.width - 50) + 20;
            let height = Math.random() * (this.canvas.height - 50) + 20;
            let line = new Object();
            line.x = width;
            line.y = height;
            lista.push(line);
        }
        for (let index = 1; index < lista.length; index += 2) {
            let linea = new Object();
            linea.a = lista[index - 1];
            linea.b = lista[index];
            lineas.push(linea);
        }
        this.set_lines(lineas);
    }

    //Pausa la simulación
    pause(){
        this.playing = false;
    }
    //Continua la ejecución
    continue(){
        if(this.playing)return;
        this.playing = true;
        this.run();
    }
    //Reinicia la ejecución con las mismas lineas
    reboot(){
        this.clean(this.background);//Limpio todo
        this.set_lines(this.original);//Pongo las lineas originales en una copia llamada original 
        this.draw_background();//Dibujo las lineas 
        this.delta = 1.5;
        this.position = 0;//donde empieza la linea de barrido
        this.active_list = [];//Lineas que están tocando la linea de barrido
        this.intersections = [];//Lista de intersecciones
        this.continue();//Llama a continuar
    }

    new_lines(){//Pone lineas random 
        this.set_random_lines();
        this.reboot();//Y reinicia la simulación
    }

    /**
     * Actualiza la lista de lineas que están siendo tocadas por la linea de barrido
     */
    active_line() {
        if (this.lines.length == 0) return;//Si la lista es vacia regreso
        let first = this.lines[0];//Obtengo el primer elemento, es el que está más a la izquierda,
        //Porque la lista está ordenada

        //Si ya pasé el punto más a la izquierda de el siguente 
        //punto en la cola, entonces lo meto a la lista de lineas activas
        if (first.a.x <= this.position || first.b.x <= this.position) {
            this.lines.shift();//Hago pop de la cola porque ya pasé ese punto, ahora estoy listo para el siguente punto
            this.active_list.forEach((element) => {//For each sobre las lineas activas
                let x1 = first.a.x;/**Lo siguente parece mucho código, pero es simple */
                let x2 = first.b.x;//Calculo mi intersección con cada linea que esté activa, 
                let y1 = first.a.y;//Si el determinante es 0 entonces son lineas paralelas
                let y2 = first.b.y;
                let x3 = element.a.x;
                let x4 = element.b.x;
                let y3 = element.a.y;
                let y4 = element.b.y;//Todo este desmán de variables lo hice para no confundirme 
                let x_dividenddo = (x2 * y1 - x1 * y2) * (x4 - x3) - (x4 * y3 - x3 * y4) * (x2 - x1);
                let divisor = (x2 - x1) * (y4 - y3) - (x4 - x3) * (y2 - y1);
                let y_dividenddo = (x2 * y1 - x1 * y2) * (y4 - y3) - (x4 * y3 - x3 * y4) * (y2 - y1);
                //Si el determinante es distinto de 0, podemos encontrar una intersección
                if (divisor != 0) {
                    let x = x_dividenddo / divisor;//Saco las coordenadas de la intersección
                    let y = y_dividenddo / divisor;

                    //Si es menor a todos los puntos en x del punto a, entonces no está 
                    //Si es mayor a todos los puntos en x del punto a, entonces no está
                    //Si es menor a todos los puntos en y del punto a, entonces no está 
                    //Si es mayor a todos los puntos en y del punto a, entonces no está

                    //Lo mismo para el punto b, por eso son 2 ifs
                    if (!((x < x1 && x < x2) || (x > x1 && x > x2) || (y < y1 && y < y2) || (y > y1 && y > y2)))
                        if (!((x < x3 && x < x4) || (x > x3 && x > x4) || (y < y3 && y < y4) || (y > y3 && y > y4))) {
                            draw_circle(this.background, x, y, 3);//Dibujo el punto de la inteseccion
                            let intersection = new Object();//Creo un objeto vacío 
                            intersection.x = x;
                            intersection.y = y;
                            this.intersections.push(intersection);//Lo agrego a la lista de intersecciones 
                        }

                }
            });
            this.active_list.push(first);//Me meto a la lista de activos 
            draw_line(this.background, first.a.x, first.a.y, first.b.x, first.b.y, 'red');//La nueva linea activa ahora es roja
            this.active_line();//Vuelvo a llamar a la función, por si en el salto, me faltó meter a
            //la siguente linea o por si tienen el mismo eje x, pero si no, entonces, como la siguente linea es mayor
            //no hace falta revisarla
        }
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
        var height = this.canvas.height;
        //Dibuja la linea de barrido
        draw_line(this.canvas, this.position, 0, this.position, height,null,3);
        //Borra las lineas que ya pasaron de la lista de activas y las redibuja de negro
        this.delete_unactive();
        //Activa las lineas que algún punto ya fue barrido
        this.active_line();

        this.upgrade_boards();//Actualiza la puntuación

        this.position += this.delta;//Aumenta el valor del recorrido con esa constante
        if (this.position > this.canvas.width)
            this.playing = false;
    }


    /**
     * Función que empieza a ejecutar el algoritmo
     */
    async run() {
        this.render();
        //Si la linea de barrido ya tocó el final del canvas, se detiene
        //si no, vuelve a llamar a la misma función en el siguiente cuadro de animación
        if (this.playing)
            //Esta instrucción me sacó canas verdes
            //el bind pone el atributo dado, como el this, del contexto de la función 
            window.requestAnimationFrame(this.run.bind(this));
    }

    /**función que limpia un canvas dado 
     *@param {HTMLElement} canvas
    */
    clean(canvas) {
        let context = canvas.getContext('2d');
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     *Actualiza los tableros
     */
    upgrade_boards(){
        let actived_strings = "Lineas activas: {";
        for (let index = 0; index < this.active_list.length; index++) {
            const element = this.active_list[index];
            actived_strings = actived_strings + " "+element.name+",";
        }
        this.show_results(actived_strings+"}","Puntos cruzados: "+this.intersections.length);
    }

    /**
     * Función que recibe el strings de activos y de cruzados y hace algo
     * es reescribible
     * @param {string} actived 
     * @param {string} crossed 
     */
    show_results(actived,crossed){
        console.log(actived);
        console.log(crossed);
    }


}