const delay = ms => new Promise(res => setTimeout(res, ms));
export default class Convex_hull {

    constructor(canvas, canvas_background) {
        this.background = canvas_background;
        this.canvas = canvas;
        this.points = [];
        this.convex_hull_lines = [];
        this.playing = true;
        this.show = ()=>{};
    }



    //Pausa la simulación
    pause() {
        this.playing = false;
    }
    //Continua la ejecución
    continue() {
  
        this.playing = true;
    }

    //Reinicia la ejecución con las mismas lineas
    reboot() {
        this.convex_hull_lines = [];
        this.playing = true;
        this.clean(this.background);//Limpio todo
        this.clean(this.canvas);
        this.set_points(this.original);//Pongo las lineas originales en una copia llamada original 
        this.draw_points();//Dibujo las lineas 
        this.main_loop();
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


    async main_loop() {
        let first = this.points.shift();
        let last = this.points.pop();
        let segregation = lower_upper_points(first, last, this.points);
        let upper_points = segregation.upper;
        let lower_points = segregation.lower;
        await this.convex_hull_recursive(first, last, upper_points, "superior");
        await this.convex_hull_recursive(first, last, lower_points, "inferior");
        this.clean(this.canvas);
        this.show();
        //console.log(this.convex_hull_lines);
    }



    /**Regresa el cierre convexo, superior o inferior
     * relativo a la recta dada, y sin incluir a los puntos dados
     */
    async convex_hull_recursive(point1, point2, points, orientation) {
        await until(_ => this.playing == true);
        draw_line(this.canvas, point1.x, point1.y, point2.x, point2.y);
        await delay(700);
        if (points.length == 0) {
            //this.clean(this.canvas);
            this.convex_hull_lines.push({ a: point1, b: point2 });
            draw_line(this.background, point1.x, point1.y, point2.x, point2.y, "red", 3);
            return;
        }

        let farest = points.pop();
        let left_set = lower_upper_points(point1, farest, points);
        let right_set = lower_upper_points(farest, point2, points);

        if (orientation == "superior") {
            left_set = left_set.upper;
            right_set = right_set.upper;
        } else if (orientation == "inferior") {
            left_set = left_set.lower;
            right_set = right_set.lower;
        }

        
        await this.convex_hull_recursive(point1, farest, left_set, orientation);
        await this.convex_hull_recursive(farest, point2, right_set, orientation);
    }

   

    set_points(points) {
        this.points = points;
        this.points.sort((point1, point2) => { return (point1.x < point2.x ? -1 : 1); });//Ordeno según el eje X
        this.points.forEach((element, index) => {
            element.name = index;

            //write_text(this.background, index, element.x, element.y);
            draw_circle(this.background, element.x, element.y, 3);
        });
        this.original = [...this.points];
    }

    draw_points(){
        this.points.forEach((element) => {
            draw_circle(this.background, element.x, element.y, 3);
        });
    }

    /**función que limpia un canvas dado */
    clean(canvas) {
        let context = canvas.getContext('2d');
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}



function lower_upper_points(point1, point2, points) {
    if (points.length == 0) return { upper: [], lower: [] };
    let a = point1.y - point2.y;
    let b = point2.x - point1.x;
    let c = point1.x * point2.y - point2.x * point1.y;
    let new_points_upper = [];
    let new_points_lower = [];

    for (let index = 0; index < points.length; index++) {
        const element = points[index];
        let k = Math.abs(a * element.x + b * element.y + c)
        let div = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2))
        element.distance = k / div;
        var condition = (a * element.x + b * element.y + c) > 0;
        if (condition) new_points_upper.push(element);
        else new_points_lower.push(element);
    }
    new_points_lower.sort((point1, point2) => { return (point1.distance < point2.distance ? -1 : 1); });
    new_points_upper.sort((point1, point2) => { return (point1.distance < point2.distance ? -1 : 1); });
    return { upper: new_points_upper, lower: new_points_lower };
}

function until(conditionFunction) {

    const poll = resolve => {
      if(conditionFunction()) resolve();
      else setTimeout(_ => poll(resolve), 200);
    }
  
    return new Promise(poll);
  }


