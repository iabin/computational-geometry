
    function draw_line(canvas, x1, y1, x2, y2, color = 'black',width=1) {
        var ctx = canvas.getContext("2d");
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    function draw_circle(canvas, x, y, r, color = 'black') {
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = color; // Red color
        ctx.beginPath(); //Start path
        ctx.arc(x, y, r, 0, Math.PI * 2, true); // Draw a point using the arc function of the canvas with a point structure.
        ctx.fill(); // Close the path and fill.
    }

    function draw_rect(canvas, x, y, w, h, color = 'black') {
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = color; // Red color
        ctx.fillRect(x,y,w,h);
  
    }


    function write_text(canvas, text, x, y) {
        let ctx = canvas.getContext('2d');
        ctx.font = "30px Arial";
        ctx.textBaseline = 'bottom';
        ctx.fillText(text, x, y);
    }