import Voronoi from "./Voronoi.js";

window.addEventListener("load", function () {
  let canvas = $("#dinamic-canvas")[0];//Canvas dinámico
  let background = $("#static-canvas")[0];//Canvas statico


  let resize_fun = () => {
    let width = ($(window).innerWidth() < 768) ? $(window).innerWidth() : $(window).innerWidth() * 6 / 12;
    width = width;
    canvas.width = background.width = width;
    canvas.height = background.height = $(window).height() * 4 / 5;//(window.innerWidth*4)/16-10;
    $("#contenedor").width(background.width).height(background.height);
  };
  resize_fun();

  $(window).resize(function () {
    resize_fun();
  });

  let voronoi = new Voronoi(canvas, background);
  voronoi.set_random_points();
  voronoi.run();


  $("#pause").click(function () { this.pause() }.bind(voronoi));
  $("#play").click(function () { this.continue() }.bind(voronoi));
  $("#reboot").click(function () { this.reboot() }.bind(voronoi));
  $("#new_points").click(function () { this.new_random_points() }.bind(voronoi));
});

