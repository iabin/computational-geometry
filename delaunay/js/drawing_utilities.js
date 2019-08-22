function draw_line(canvas, x1, y1, x2, y2, color = 'black', width = 1) {
    var ctx = canvas.getContext("2d");
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function draw_triangulation(canvas,triangles,vertices){
    for (let i = triangles.length; i;) {
        --i;let a = {x:vertices[triangles[i]][0], y:vertices[triangles[i]][1]};
        --i;let b = {x:vertices[triangles[i]][0], y:vertices[triangles[i]][1]};
        --i;let c = {x:vertices[triangles[i]][0], y:vertices[triangles[i]][1]};
        draw_line(canvas,a.x,a.y,b.x,b.y);
        draw_line(canvas,b.x,b.y,c.x,c.y);
        draw_line(canvas,c.x,c.y,a.x,a.y);
    }

}

function draw_circle(canvas, x, y, r, color = 'black') {
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = color; // Red color
    ctx.beginPath(); //Start path
    ctx.arc(x, y, r, 0, Math.PI * 2, true); // Draw a point using the arc function of the canvas with a point structure.
    ctx.fill(); // Close the path and fill.
}

function write_text(canvas, text, x, y) {
    let ctx = canvas.getContext('2d');
    ctx.font = "30px Arial";
    ctx.textBaseline = 'bottom';
    ctx.fillText(text, x, y);
}
function draw_rect(canvas, x, y, w, h, color = 'black') {
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = color; // Red color
    ctx.fillRect(x,y,w,h);

}