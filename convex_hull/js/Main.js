import Convex_hull from "./Convex_hull.js";

window.addEventListener("load", async function () {
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


    let convex_hull = new Convex_hull(canvas, background);
    convex_hull.set_random_points();

    $("#pause").click(function () { this.pause() }.bind(convex_hull));
    $("#play").click(function () { this.continue() }.bind(convex_hull));
    (convex_hull.hide = () => {
        $("#reboot").hide();
        $("#new_points").hide();
    })();
    $("#reboot").click(function () { this.reboot(); this.hide(); }.bind(convex_hull));
    $("#new_points").click(function () { this.new_random_points(); this.hide(); }.bind(convex_hull));
    convex_hull.show = () => {
        $("#reboot").show();
        $("#new_points").show();
    }
    await convex_hull.main_loop();

});
