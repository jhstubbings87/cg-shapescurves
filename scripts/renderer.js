class Renderer {
    // canvas:              object ({id: __, width: __, height: __})
    // num_curve_sections:  int
    constructor(canvas, num_curve_sections, show_points_flag) {
        this.canvas = document.getElementById(canvas.id);
        this.canvas.width = canvas.width;
        this.canvas.height = canvas.height;
        this.ctx = this.canvas.getContext('2d');
        this.slide_idx = 0;
        this.num_curve_sections = num_curve_sections;
        this.show_points = show_points_flag;
    }

    // n:  int
    setNumCurveSections(n) {
        this.num_curve_sections = n;
        this.drawSlide(this.slide_idx);
    }

    // flag:  bool
    showPoints(flag) {
        this.show_points = flag;
        this.drawSlide(this.slide_idx);
    }
    
    // slide_idx:  int
    drawSlide(slide_idx) {
        this.slide_idx = slide_idx;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        switch (this.slide_idx) {
            case 0:
                this.drawSlide0(this.ctx);
                break;
            case 1:
                this.drawSlide1(this.ctx);
                break;
            case 2:
                this.drawSlide2(this.ctx);
                break;
            case 3:
                this.drawSlide3(this.ctx);
                break;
        }
    }

    // ctx:          canvas context
    drawSlide0(ctx) {
        this.drawRectangle({x: 200, y: 200}, {x: 500, y: 500}, [0, 0, 255, 255], ctx);
    }

    // ctx:          canvas context
    drawSlide1(ctx) {
        this.drawCircle({x: 350, y: 350}, 150, [0, 255, 0, 255], ctx);
    }

    // ctx:          canvas context
    drawSlide2(ctx) {

    }

    // ctx:          canvas context
    drawSlide3(ctx) {

    }

    // left_bottom:  object ({x: __, y: __})
    // right_top:    object ({x: __, y: __})
    // color:        array of int [R, G, B, A]
    // ctx:          canvas context
    drawRectangle(left_bottom, right_top, color, ctx) {
        let left_top = {x: left_bottom.x, y: right_top.y};
        let right_bottom = {x: right_top.x,  y: left_bottom.y};

        this.drawLine(left_bottom, left_top, color, ctx);
        this.drawLine(left_top, right_top, color, ctx);
        this.drawLine(right_top, right_bottom, color, ctx);
        this.drawLine(right_bottom, left_bottom, color, ctx);

        if(this.show_points) {
            this.showPointData(left_bottom, [255, 0, 0, 255], ctx);
            this.showPointData(left_top, [255, 0, 0, 255], ctx);
            this.showPointData(right_top, [255, 0, 0, 255], ctx);
            this.showPointData(right_bottom, [255, 0, 0, 255], ctx);
        }
    }

    // center:       object ({x: __, y: __})
    // radius:       int
    // color:        array of int [R, G, B, A]
    // ctx:          canvas context
    drawCircle(center, radius, color, ctx) {
        let sections = this.num_curve_sections;
        let angle = (2*Math.PI) / sections;
        let newAngle = 0;
        let points = [];
        let X;
        let Y;
        
        for(let i = 0; i <= sections; i++) {
            X = center.x + (radius * Math.cos(newAngle));
            Y = center.y + (radius * Math.sin(newAngle));

            points[i] = {x: X, y: Y};

            newAngle = newAngle + angle;
        }

        for(let i = 0; i < points.length-1; i++) {
            this.drawLine(points[i], points[i+1], color, ctx);
        }

        if(this.show_points) {
            for(let i = 0; i < points.length-1; i++) {
                this.showPointData(points[i], [255, 0, 0, 255], ctx);
            }
        }
    }

    // pt0:          object ({x: __, y: __})
    // pt1:          object ({x: __, y: __})
    // pt2:          object ({x: __, y: __})
    // pt3:          object ({x: __, y: __})
    // color:        array of int [R, G, B, A]
    // ctx:          canvas context
    drawBezierCurve(pt0, pt1, pt2, pt3, color, ctx) {
        /*
        let sections = ctx.num_curve_sections;
        let x;
        let y;

        for(let i = 0; i < sections; i++) {
            x = ((((1-t)**3)*pt0.x) + 3*((1-t)**2)*t*pt1.x + ((3*(1-t))*t**2)*pt2.x + ((t**3)*pt3.x));
            y = ((((1-t)**3)*pt0.y) + 3*((1-t)**2)*t*pt1.y + ((3*(1-t))*t**2)*pt2.y + ((t**3)*pt3.y));
        }

        if(this.showPoints) {
        }
        */
    }

    // pt0:          object ({x: __, y: __})
    // pt1:          object ({x: __, y: __})
    // color:        array of int [R, G, B, A]
    // ctx:          canvas context
    drawLine(pt0, pt1, color, ctx)
    {
        ctx.strokeStyle = 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + (color[3]/255.0) + ')';
        ctx.beginPath();
        ctx.moveTo(pt0.x, pt0.y);
        ctx.lineTo(pt1.x, pt1.y);
        ctx.stroke();
    }

    // pt0:          object ({x: __, y: __})
    // color:        array of int [R, G, B, A]
    // ctx:          canvas context
    showPointData(pt0, color, ctx) {
        this.drawLine({x: pt0.x-5, y: pt0.y+5}, {x: pt0.x-5, y: pt0.y-5}, color, ctx); // left
        this.drawLine({x: pt0.x-5, y: pt0.y-5}, {x: pt0.x+5, y: pt0.y-5}, color, ctx); // bottom
        this.drawLine({x: pt0.x+5, y: pt0.y-5}, {x: pt0.x+5, y: pt0.y+5}, color, ctx); // right
        this.drawLine({x: pt0.x+5, y: pt0.y+5}, {x: pt0.x-5, y: pt0.y+5}, color, ctx); // top
    }
};
