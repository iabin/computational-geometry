import Intersections from "./Intersections.js";

window.addEventListener("load", function () {
    let canvas = $("#dinamic-canvas")[0];//Canvas dinámico
    let background = $("#static-canvas")[0];//Canvas statico
  
    let resize_fun = () => {
        let width = ($(window).innerWidth() < 768) ? $(window).innerWidth() : $(window).innerWidth() * 6 / 12;
        canvas.width = background.width = width;
        canvas.height = background.height = $(window).height() * 4 / 5;//(window.innerWidth*4)/16-10;
        $("#contenedor").width(background.width).height(background.height);
      };
      resize_fun();
    
      $(window).resize(function () {
        resize_fun();
      });
    
    let intersections = new Intersections(canvas, background);
    intersections.show_results = ((actived,crossed)=>{//Reescribo la función que escribe la salida
        $("#activos").text(actived);
        $("#cruzados").text(crossed);
    });
    intersections.new_lines();//Se crean nuevas entradas aleatorias
    intersections.run();


    $("#pause").click(function(){this.pause()}.bind(intersections));
    $("#play").click(function(){this.continue()}.bind(intersections));
    $("#reboot").click(function(){this.reboot()}.bind(intersections));
    $("#new_points").click(function(){this.new_lines()}.bind(intersections));
});

