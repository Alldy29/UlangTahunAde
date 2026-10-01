class Turtle {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.cx = this.canvas.width / 2;
        this.cy = this.canvas.height / 2;
        
        this.x = 0;
        this.y = 0;
        this.angle = 0;
        this.isDown = true;
        this._pencolor = "black";
        this._fillcolor = "black";
        this._pensize = 1;
        this.filling = false;
        this.fillPath = null;
        
        // Antrean untuk animasi
        this.queue = [];
    }
    
    _tX(x) { return this.cx + x; }
    _tY(y) { return this.cy - y; }

    bgcolor(color) {
        this.queue.push(() => {
            document.body.style.backgroundColor = color;
            this.canvas.style.backgroundColor = color;
        });
    }
    
    setup(w, h) {
        this.queue.push(() => {
            this.canvas.width = w;
            this.canvas.height = h;
            this.cx = w / 2;
            this.cy = h / 2;
        });
    }
    
    title(t) {
        this.queue.push(() => { document.title = t; });
    }
    
    pensize(s) {
        this.queue.push(() => { 
            this._pensize = s; 
            this.ctx.lineWidth = s; 
        });
    }
    
    speed(s) {}
    hideturtle() {}
    
    tracer(s) {}
    delay(s) {}
    
    penup() { 
        this.queue.push(() => { this.isDown = false; }); 
    }
    pendown() { 
        this.queue.push(() => { this.isDown = true; }); 
    }
    
    pencolor(c) {
        this.queue.push(() => { 
            this._pencolor = c; 
            this.ctx.strokeStyle = c; 
        });
    }
    
    fillcolor(c) {
        this.queue.push(() => { 
            this._fillcolor = c; 
            this.ctx.fillStyle = c; 
        });
    }
    
    begin_fill() {
        let sx = this.x;
        let sy = this.y;
        this.queue.push(() => {
            this.filling = true;
            this.fillPath = new Path2D();
            this.fillPath.moveTo(this._tX(sx), this._tY(sy));
        });
    }
    
    end_fill() {
        this.queue.push(() => {
            this.filling = false;
            if (this.fillPath) {
                this.ctx.fillStyle = this._fillcolor;
                this.ctx.fill(this.fillPath);
            }
            this.fillPath = null;
        });
    }
    
    goto(nx, ny) {
        let startX = this.x;
        let startY = this.y;
        this.x = nx;
        this.y = ny;
        
        let tx = this._tX(nx);
        let ty = this._tY(ny);
        
        this.queue.push(() => {
            let cx1 = this._tX(startX);
            let cy1 = this._tY(startY);
            let cx2 = tx;
            let cy2 = ty;
            
            if (this.isDown) {
                this.ctx.beginPath();
                this.ctx.moveTo(cx1, cy1);
                this.ctx.lineTo(cx2, cy2);
                this.ctx.lineCap = 'round';
                this.ctx.lineJoin = 'round';
                this.ctx.strokeStyle = this._pencolor;
                this.ctx.lineWidth = this._pensize;
                this.ctx.stroke();
            }
            if (this.filling && this.fillPath) {
                this.fillPath.lineTo(cx2, cy2);
            }
        });
    }
    
    dot(size, color) {
        let cx = this._tX(this.x);
        let cy = this._tY(this.y);
        this.queue.push(() => {
            let c = color || this._pencolor;
            this.ctx.beginPath();
            this.ctx.arc(cx, cy, size/2, 0, 2*Math.PI);
            this.ctx.fillStyle = c;
            this.ctx.fill();
        });
    }
    
    seth(angle) {
        this.angle = angle;
    }
    
    forward(dist) {
        let rad = this.angle * Math.PI / 180;
        let nx = this.x + dist * Math.cos(rad);
        let ny = this.y + dist * Math.sin(rad);
        this.goto(nx, ny);
    }
    
    left(angle) {
        this.angle += angle;
    }
    
    write(text, fontArgs) {
        let cx = this._tX(this.x);
        let cy = this._tY(this.y);
        this.queue.push(() => {
            let fontStr = `${fontArgs[2] || ''} ${fontArgs[1]}px "${fontArgs[0]}"`.trim();
            this.ctx.font = fontStr;
            this.ctx.fillStyle = this._pencolor;
            this.ctx.textAlign = 'center';
            this.ctx.fillText(text, cx, cy);
            this.ctx.textAlign = 'left'; // Reset back
        });
    }

    play() {
        let i = 0;
        let stepsPerFrame = 25; 
        
        const loop = () => {
            for (let s = 0; s < stepsPerFrame; s++) {
                if (i < this.queue.length) {
                    this.queue[i]();
                    i++;
                } else {
                    // Animasi masuk selesai, mulai animasi lilin!
                    if (window.startFlameAnimation) window.startFlameAnimation();
                    return;
                }
            }
            requestAnimationFrame(loop);
        };
        loop();
    }
}

// ========== LOGIKA DARI happy_birthday5.py ==========

function ellipse_x(width, angle_deg) {
    let angle_rad = angle_deg * Math.PI / 180;
    return width * Math.cos(angle_rad);
}

function ellipse_y(height, angle_deg) {
    let angle_rad = angle_deg * Math.PI / 180;
    return height * Math.sin(angle_rad);
}

let screen = {
    bgcolor: function(c) { 
        // Background ditangani oleh CSS agar seragam dengan ucapan.html
    },
    setup: function(w, h) { pen.setup(w, h); },
    title: function(t) { pen.title(t); },
    tracer: function(s) {},
    delay: function(s) {},
    update: function() {}
};

let color_palette = {
    "light_green": "#c5e8c8",
    "medium_green": "#a3d2a7",
    "light_yellow": "#f7e8aa",
    "cream": "#fffceb",
    "off_white": "#fffdf4",
    "brown": "#8b5a2b",
    "dark_brown": "#5e4425",
    "orange": "#ffa500",
    "golden_yellow": "#ffb732",
    "teal": "#66cccc",
    "flame_orange": "#ff6600",
    "sky_blue": "#87ceeb",
    "light_steel": "#b0c4de",
    "confetti_colors": ["#4CAF50", "#FFC107", "#2196F3", "#FF5722", "#9C27B0", "#3F51B5", "#00BCD4", "#009688"]
};

let pen = new Turtle("cakeCanvas");

screen.bgcolor("#d3dae8");
screen.setup(900, 800);
screen.title("Happy Birthday Furina");

pen.pensize(3);
pen.speed(0);
pen.hideturtle();

function draw_ellipse(t, width, height, color, fill_color, y_offset) {
    y_offset = y_offset || 0;
    t.penup();
    t.goto(width, y_offset);
    t.pendown();
    t.pencolor(color);
    t.begin_fill();
    for (let deg = 0; deg < 360; deg++) {
        let x = ellipse_x(width, deg);
        let y = ellipse_y(height, deg) + y_offset;
        t.goto(x, y);
    }
    t.fillcolor(fill_color);
    t.end_fill();
}

function draw_cake_layer(t, width, height, outline_color, fill_color, y_offset) {
    draw_ellipse(t, width, height, outline_color, fill_color, y_offset);
}

function draw_candle(t, x_pos, y_base, height) {
    t.penup();
    t.goto(x_pos + 4, y_base);
    t.pendown();
    t.pencolor(color_palette["teal"]);
    t.begin_fill();
    for (let deg = 0; deg < 360; deg++) {
        let x = ellipse_x(4, deg) + x_pos;
        let y = ellipse_y(1, deg) + y_base;
        t.goto(x, y);
    }
    t.goto(x_pos + 4, y_base + height);
    for (let deg = 0; deg < 540; deg++) {
        let x = ellipse_x(4, deg) + x_pos;
        let y = ellipse_y(1, deg) + y_base + height;
        t.goto(x, y);
    }
    t.goto(x_pos - 4, y_base);
    t.fillcolor(color_palette["teal"]);
    t.end_fill();
    
    t.pencolor("white");
    t.pensize(4);
    for (let i = 1; i <= 5; i++) {
        t.goto(x_pos + 4, y_base + 10 * i);
        t.penup();
        t.goto(x_pos - 4, y_base + 10 * i);
        t.pendown();
    }
    t.penup();
    t.goto(x_pos, y_base + height);
    t.pendown();
    t.goto(x_pos, y_base + height + 10);
    t.pensize(3);
    
    // Bagian menggambar api lilin dihapus dari sini
    // karena akan digambar secara dinamis dengan animasi setelah kue selesai
}

function add_dots(t, count, x_min, x_max, y_min, y_max, size_min, size_max) {
    let colors = color_palette["confetti_colors"];
    for (let i = 0; i < count; i++) {
        t.penup();
        let x = Math.floor(Math.random() * (x_max - x_min + 1)) + x_min;
        let y = Math.floor(Math.random() * (y_max - y_min + 1)) + y_min;
        t.goto(x, y);
        t.pendown();
        let size = Math.floor(Math.random() * (size_max - size_min + 1)) + size_min;
        let color = colors[Math.floor(Math.random() * colors.length)];
        t.dot(size, color);
    }
}

draw_cake_layer(pen, 150, 60, "white", color_palette["light_green"], 0);

pen.penup();
pen.pensize(4);
pen.goto(150, 0);
pen.pendown();
pen.begin_fill();
for (let deg = 0; deg < 180; deg++) {
    let x = ellipse_x(150, -deg);
    let y = ellipse_y(70, -deg);
    pen.goto(x, y);
}
for (let deg = 180; deg < 360; deg++) {
    let x = ellipse_x(150, deg);
    let y = ellipse_y(60, deg);
    pen.goto(x, y);
}
pen.fillcolor(color_palette["medium_green"]);
pen.end_fill();

draw_cake_layer(pen, 120, 48, "white", color_palette["light_yellow"], 0);

pen.begin_fill();
pen.pensize(4);
pen.pencolor(color_palette["light_steel"]);
for (let deg = 0; deg < 540; deg++) {
    let x = ellipse_x(120, deg);
    let y = ellipse_y(48, deg) + 70;
    pen.goto(x, y);
}
pen.goto(-120, 0);
pen.fillcolor(color_palette["light_yellow"]);
pen.end_fill();

draw_cake_layer(pen, 120, 48, color_palette["light_yellow"], color_palette["light_yellow"], 70);
draw_cake_layer(pen, 110, 44, color_palette["cream"], color_palette["cream"], 70);

pen.penup();
pen.pensize(4);
pen.goto(120, 0);
pen.pendown();
pen.begin_fill();
pen.pencolor(color_palette["sky_blue"]);
for (let deg = 0; deg < 180; deg++) {
    let x = ellipse_x(120, -deg);
    let y = ellipse_y(48, -deg) + 10;
    pen.goto(x, y);
}
pen.goto(-120, 0);
for (let deg = 180; deg < 360; deg++) {
    let x = ellipse_x(120, deg);
    let y = ellipse_y(48, deg);
    pen.goto(x, y);
}
pen.fillcolor(color_palette["sky_blue"]);
pen.end_fill();

pen.penup();
pen.pensize(4);
pen.goto(120, 70);
pen.pendown();
pen.begin_fill();
pen.pensize(4);
pen.pencolor(color_palette["light_steel"]);
for (let i = 0; i < 1800; i++) {
    let x = ellipse_x(120, 0.1 * i);
    let y = ellipse_y(-18, i) + 10;
    pen.goto(x, y);
}
pen.goto(-120, 70);
pen.pensize(1);
for (let deg = 180; deg < 360; deg++) {
    let x = ellipse_x(120, deg);
    let y = ellipse_y(48, deg) + 70;
    pen.goto(x, y);
}
pen.fillcolor(color_palette["light_steel"]);
pen.end_fill();

pen.penup();
pen.pensize(4);
pen.goto(80, 70);
pen.pendown();
pen.begin_fill();
pen.pencolor(color_palette["brown"]);
pen.goto(80, 120);
for (let deg = 0; deg < 180; deg++) {
    let x = ellipse_x(80, deg);
    let y = ellipse_y(32, deg) + 120;
    pen.goto(x, y);
}
pen.goto(-80, 70);
for (let deg = 180; deg < 360; deg++) {
    let x = ellipse_x(80, deg);
    let y = ellipse_y(32, deg) + 70;
    pen.goto(x, y);
}
pen.fillcolor(color_palette["brown"]);
pen.end_fill();

draw_cake_layer(pen, 80, 32, color_palette["dark_brown"], color_palette["dark_brown"], 120);
draw_cake_layer(pen, 70, 28, color_palette["orange"], color_palette["orange"], 120);

pen.penup();
pen.pensize(4);
pen.goto(80, 120);
pen.pendown();
pen.begin_fill();
pen.pencolor(color_palette["dark_brown"]);
for (let i = 0; i < 1800; i++) {
    let x = ellipse_x(80, 0.1 * i);
    let y = ellipse_y(-12, i) + 80;
    pen.goto(x, y);
}
pen.goto(-80, 120);
pen.pensize(1);
for (let deg = 180; deg < 360; deg++) {
    let x = ellipse_x(80, deg);
    let y = ellipse_y(32, deg) + 120;
    pen.goto(x, y);
}
pen.fillcolor(color_palette["dark_brown"]);
pen.end_fill();

let candle_positions = [
    [60, 120, 50], 
    [-60, 120, 50],
    [0, 130, 50],
    [30, 110, 50],
    [-30, 110, 50]
];

for (let pos of candle_positions) {
    draw_candle(pen, pos[0], pos[1], pos[2]);
}

let dot_regions = [
    [80, -120, 120, -25, 30, 2, 5],
    [40, -90, 90, -35, 10, 2, 5],
    [40, -80, 80, 60, 90, 2, 5],
    [30, -50, 50, 45, 70, 2, 5]
];

for (let region of dot_regions) {
    add_dots(pen, region[0], region[1], region[2], region[3], region[4], region[5], region[6]);
}

// Tulisan "Happy Birthday Sayang ❤️" tidak lagi digambar statis di sini,
// melainkan akan dianimasikan secara berulang di fungsi startFlameAnimation.

screen.update();

// Fungsi untuk menggambar api lilin yang bergerak
window.startFlameAnimation = function() {
    let ctx = pen.ctx;
    let canvas = pen.canvas;
    
    // Simpan gambar kue yang sudah jadi (tanpa teks statis)
    let savedCake = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let startTime = Date.now();
    
    function drawAnimatedFlames() {
        // Kembalikan gambar kue (tanpa api lilin)
        ctx.putImageData(savedCake, 0, 0);
        
        let time = Date.now();
        
        for (let i = 0; i < candle_positions.length; i++) {
            let pos = candle_positions[i];
            let x_pos = pos[0];
            let y_base = pos[1];
            let height = pos[2];
            
            // Hitung posisi tengah lilin (di koordinat canvas)
            let cx = pen._tX(x_pos);
            let cy = pen._tY(y_base + height + 20);
            
            // Buat ukuran berdenyut (animated)
            let offset = i * 1000;
            let flameHeight = 10 + Math.sin((time + offset) / 150) * 2;
            let flameWidth = 4 + Math.cos((time + offset) / 200) * 0.8;
            
            ctx.beginPath();
            ctx.ellipse(cx, cy, flameWidth, flameHeight, 0, 0, 2 * Math.PI);
            ctx.fillStyle = color_palette["flame_orange"];
            ctx.fill();
            ctx.strokeStyle = "#ff3300";
            ctx.lineWidth = 1.5;
            ctx.stroke();
            
            // Cahaya kecil di tengah api (kuning)
            ctx.beginPath();
            ctx.ellipse(cx, cy + 2, flameWidth * 0.5, flameHeight * 0.5, 0, 0, 2 * Math.PI);
            ctx.fillStyle = color_palette["light_yellow"];
            ctx.fill();
        }
        
        // --- ANIMASI TEKS ---
        let opacity = Math.min(1, (time - startTime) / 2000); // Fade-in selama 2 detik
        let floatY = Math.sin(time / 600) * 8; // Efek mengambang naik turun (floating)
        
        ctx.save();
        ctx.globalAlpha = opacity;
        
        // Berikan efek glow / bersinar pada teks
        ctx.shadowColor = "rgba(255, 255, 255, 0.9)";
        ctx.shadowBlur = 15;
        
        ctx.textAlign = 'center';
        ctx.fillStyle = "#713f4b"; // Warna merah marun elegan
        
        // Gambar teks "Happy Birthday"
        ctx.font = "normal 65px 'Brush Script MT', 'Lucida Handwriting', cursive";
        let text1Y = pen._tY(330) + floatY;
        ctx.fillText("Happy Birthday", pen._tX(0), text1Y);
        
        // Gambar teks "Sayang ❤️"
        ctx.font = "normal 48px 'Brush Script MT', 'Lucida Handwriting', cursive";
        let text2Y = pen._tY(260) + floatY; // Sedikit lebih jauh ke bawah dari HBD
        ctx.fillText("Sayang ❤️", pen._tX(0), text2Y);
        
        ctx.restore();
        // --------------------
        
        requestAnimationFrame(drawAnimatedFlames);
    }
    
    // Mulai loop animasi lilin
    drawAnimatedFlames();
};

// Jalankan animasinya!
pen.play();
