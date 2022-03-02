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
        this.drawRectangle({x: 300, y: 200}, {x: 500, y: 500}, [0, 215, 210, 255], ctx);
    }

    // ctx:          canvas context
    drawSlide1(ctx) {
        this.drawCircle({x: 350, y: 350}, 150, [0, 255, 0, 255], ctx);
    }

    // ctx:          canvas context
    drawSlide2(ctx) {
        this.drawBezierCurve({x: 300, y: 200}, {x: 250, y: 350}, {x: 600, y: 250}, {x: 400, y: 500}, [255, 128, 0, 255], ctx);
    }

    // ctx:          canvas context
    drawSlide3(ctx) {
        let color = [148, 43, 226, 255]; //blueviolet
        let points = [{x: 400, y: 470}, {x: 400, y: 350}, {x: 275, y: 350}, {x: 525, y: 350}, 
            {x: 425, y: 350}, {x: 550, y: 265}];

        this.drawLine(points[0], points[1], color, ctx); // stroke 1 - verticle
        this.drawCircle({x: 338, y: 400}, 20, color, ctx); // stroke 2 - circle 1
        this.drawCircle({x: 463, y: 400}, 20, color, ctx); // stroke 3 - circle 2
        this.drawLine(points[2], points[3], color, ctx); // stroke 4 - horizontal
        this.drawBezierCurve({x: 375, y: 350}, {x: 380, y: 260}, {x: 300, y: 225}, {x: 270, y: 220}, color, ctx); // stroke 5 - left curve
        this.drawLine(points[4], {x: 425, y: 270}, color, ctx); //stroke 6.1 - right curve 1 - verticle
        this.drawBezierCurve({x: 425, y: 270}, {x: 425, y: 215}, {x: 450, y: 230}, {x: 550, y: 230}, color, ctx); //stroke 6.2 - right curve 2 - curve
        this.drawLine({x: 550, y: 230}, points[5], color, ctx); //stoke 6.3  - right curve 3 - verticle

        if(this.show_points) {
            for(let i = 0; i < points.length; i++) {
                this.showPointData(points[i], [255, 0, 0, 255], ctx);
            }
        }
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
        let newX;
        let newY;
        
        for(let i = 0; i <= sections; i++) {
            newX = center.x + (radius * Math.cos(newAngle));
            newY = center.y + (radius * Math.sin(newAngle));

            points[i] = {x: newX, y: newY};

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
        let points = [];
        let sections = 1/this.num_curve_sections;
        let i = 0;
        let newX;
        let newY;

        for(let t = 0; t <= 1.01; t+=sections) {
            newX = ((((1-t)**3)*pt0.x) + 3*((1-t)**2)*t*pt1.x + ((3*(1-t))*t**2)*pt2.x + ((t**3)*pt3.x));
            newY = ((((1-t)**3)*pt0.y) + 3*((1-t)**2)*t*pt1.y + ((3*(1-t))*t**2)*pt2.y + ((t**3)*pt3.y));

            points[i] = {x: newX, y: newY};
            i++;
        }

        for(let j = 0; j < points.length-1; j++) {
            this.drawLine(points[j], points[j+1], color, ctx);
        }

        if(this.show_points) {
            for(let j = 0; j < points.length; j++) {
                this.showPointData(points[j], [255, 0, 0, 255], ctx);
            }
                this.showPointData(pt1, [0, 0, 255, 255], ctx)
                this.showPointData(pt2, [0, 0, 255, 255], ctx)
        }
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
        this.drawLine({x: pt0.x-3, y: pt0.y+3}, {x: pt0.x-3, y: pt0.y-3}, color, ctx); // left
        this.drawLine({x: pt0.x-3, y: pt0.y-3}, {x: pt0.x+3, y: pt0.y-3}, color, ctx); // bottom
        this.drawLine({x: pt0.x+3, y: pt0.y-3}, {x: pt0.x+3, y: pt0.y+3}, color, ctx); // right
        this.drawLine({x: pt0.x+3, y: pt0.y+3}, {x: pt0.x-3, y: pt0.y+3}, color, ctx); // top
    }

    // pt0:          object ({x: __, y: __})
    // color:        array of int [R, G, B, A]
    // ctx:          canvas context
    showPointDataForBezier(pt0, color, ctx) {
        
    }
};
