import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { finalize, fromEvent, switchMap, takeUntil, tap } from 'rxjs';
import { ShapeData } from '../models';
import { start } from 'repl';

@Component({
  selector: 'app-whiteboard-page',
  templateUrl: './whiteboard-page.component.html',
  styleUrls: ['./whiteboard-page.component.css']
})
export class WhiteboardPageComponent implements OnInit
{
	@ViewChild('canvas', { static: true }) canvas : ElementRef<HTMLCanvasElement>;
	
	ctx: CanvasRenderingContext2D;

	startPoint: any;
	endPoint: any;

	currentThickness: any;

	getMax(x1, x2)
	{
		if(x1 > x2)
			return x1;

		return x2;
	}

	getMin(x1, x2)
	{
		if(x1 < x2)
			return x1;

		return x2;
	}

	isPointInAreaRect(point, maxPoint, lowPoint)
	{
		if(point.x >= lowPoint.x && point.y >= lowPoint.y)
		{
			if(point.x <= maxPoint.x && point.y <= maxPoint.y)
			{
				return true;
			}
		}

		return false;
	}

	isPointInAreaCircle(point, centerPoint, radius)
	{
		if(((point.x - centerPoint.x) * (point.x - centerPoint.x)) + ((point.y - centerPoint.y) * (point.y - centerPoint.y)) <= (radius * radius))
			return true;

		return false;
	}

	ngAfterViewInit()
	{
		this.colorPicker = document.getElementById("color-picker") as HTMLInputElement;
		var canvas2 = document.getElementById('whiteboard-canvas') as HTMLCanvasElement;

		canvas2.width = window.innerWidth;
		canvas2.height = window.innerHeight;

		var brushPoints: any[] = [];

		this.ctx = canvas2.getContext('2d');
		const mouseDownStream = fromEvent(canvas2, 'mousedown');
		const mouseMoveStream = fromEvent(canvas2, 'mousemove');
		const mouseUpStream = fromEvent(window, 'mouseup');
		mouseDownStream.pipe(
			tap((event: MouseEvent) => {

				if(this.currentTool === "BRUSH")
				{
					this.startPoint = { x: event.offsetX, y: event.offsetY };

					brushPoints = [];
					brushPoints.push(this.startPoint);
				}
				else if(this.currentTool === "SQUARE")
				{
					this.startPoint = { x: event.offsetX, y: event.offsetY };
				}
				else if(this.currentTool === "CIRCLE")
				{
					this.startPoint = { x: event.offsetX, y: event.offsetY };
				}
				else if(this.currentTool === "TEXT")
				{
					this.endPoint = { x: event.offsetX, y: event.offsetY };
				}
				else if(this.currentTool === "ERASER")
				{
					this.startPoint = { x: event.offsetX, y: event.offsetY };

					brushPoints = [];
					brushPoints.push(this.startPoint);
				}
				//console.log("started path");
			}),
				
			switchMap(() => mouseMoveStream.pipe(
				tap((event: MouseEvent) => {
					if(this.currentTool === "BRUSH")
					{
						this.endPoint = { x: event.offsetX, y: event.offsetY };

						brushPoints.push(this.endPoint);
					}
					else if(this.currentTool === "SQUARE")
					{
						this.endPoint = { x: event.offsetX, y: event.offsetY };
					}
					else if(this.currentTool === "CIRCLE")
					{
						this.endPoint = { x: event.offsetX, y: event.offsetY };
					}
					else if(this.currentTool === "TEXT")
					{
						this.endPoint = { x: event.offsetX, y: event.offsetY };
					}
					else if(this.currentTool === "ERASER")
					{
						this.endPoint = { x: event.offsetX, y: event.offsetY };

						brushPoints.push(this.endPoint);

						for(var i = 0; i < this.shapes.length; i++)
						{
							if(this.shapes[i].shapeType !== "BRUSH")
							{
								var isPointInArea = false;
								
								if(this.shapes[i].shapeType === "SQUARE")
								{
									var lowX = this.getMin(this.shapes[i].points[0].x, this.shapes[i].points[1].x);
									var highX = this.getMax(this.shapes[i].points[0].x, this.shapes[i].points[1].x);
									var lowY = this.getMin(this.shapes[i].points[0].y, this.shapes[i].points[1].y);
									var highY = this.getMax(this.shapes[i].points[0].y, this.shapes[i].points[1].y);

									isPointInArea = this.isPointInAreaRect({x: event.offsetX, y: event.offsetY}, {x: highX, y: highY}, {x: lowX, y: lowY});
								}

								else if(this.shapes[i].shapeType === "CIRCLE")
								{
									var lowX = this.getMin(this.shapes[i].points[0].x, this.shapes[i].points[1].x);
									var highX = this.getMax(this.shapes[i].points[0].x, this.shapes[i].points[1].x);
									var lowY = this.getMin(this.shapes[i].points[0].y, this.shapes[i].points[1].y);
									var highY = this.getMax(this.shapes[i].points[0].y, this.shapes[i].points[1].y);

									var centerX = (lowX + highX) / 2;
									var centerY = (lowY + highY) / 2;

									var a = highX - lowX;
									var b = highY - lowY;

									var distance = Math.sqrt( a*a + b*b );
								
									isPointInArea = this.isPointInAreaCircle({x: event.offsetX, y: event.offsetY}, {x: centerX, y: centerY}, distance / 2);
								}

								else if(this.shapes[i].shapeType === "TEXT")
								{
									var oldFont = this.ctx.font;

									var thisThickness: any = this.shapes[i].thickness;
									
									this.ctx.font = (parseInt(thisThickness, 10) + 16).toString() + "px Arial";
									//console.log(this.ctx.font);

									var shapeMetrics = this.ctx.measureText(this.shapes[i].text);

									this.ctx.font = oldFont;
									//console.log(shapeMetrics);

									var txtPoint = this.shapes[i].points[0];
									let actualHeight = shapeMetrics.actualBoundingBoxAscent + shapeMetrics.actualBoundingBoxDescent;

									var firstPoint = { x: txtPoint.x - 5 + shapeMetrics.width, y: txtPoint.y - 3 };
									var secondPoint = { x: txtPoint.x - 5, y: txtPoint.y + actualHeight - 3 };

									var lowX = this.getMin(firstPoint.x, secondPoint.x);
									var highX = this.getMax(firstPoint.x, secondPoint.x);
									var lowY = this.getMin(firstPoint.y, secondPoint.y);
									var highY = this.getMax(firstPoint.y, secondPoint.y);

									isPointInArea = this.isPointInAreaRect({x: event.offsetX, y: event.offsetY},{x: highX, y: highY}, {x: lowX, y: lowY});
								}

								if(isPointInArea)
								{
									this.shapes.splice(i, 1);
									break;
								}
							}
							else
							{
								for(var j = 0; j < this.shapes[i].points.length; j++)
								{
									var linePoint = this.shapes[i].points[j];
									
									var isPointInArea = this.isPointInAreaCircle({x: event.offsetX, y: event.offsetY}, linePoint, this.shapes[i].thickness / 2);

									if(isPointInArea)
									{
										this.shapes.splice(i, 1);
										break;
									}
								}
							}
						}
					}
				}),
				takeUntil(mouseUpStream),
				finalize(() => {

					if(this.endPoint === null)
					{
						this.startPoint = null;
						return;
					}

					if(this.currentTool === "BRUSH")
					{
						this.addShape("BRUSH", brushPoints, this.currentSelectedColor, this.currentThickness);
					}
					else if(this.currentTool === "SQUARE")
					{
						var points: any[] = [];

						points.push(this.startPoint);
						points.push(this.endPoint);

						console.log("first: ", this.startPoint);
						console.log("second: ", this.endPoint);

						this.addShape("SQUARE", points, this.currentSelectedColor, this.currentThickness);
					}
					else if(this.currentTool === "CIRCLE")
					{
						var points: any[] = [];

						points.push(this.startPoint);
						points.push(this.endPoint);

						this.addShape("CIRCLE", points, this.currentSelectedColor, this.currentThickness);
					}
					else if(this.currentTool === "TEXT")
					{
						this.addInput(this.endPoint.x, this.endPoint.y + 105);
					}
					else if(this.currentTool === "ERASER")
					{
						//this.addShape("BRUSH", brushPoints, 'white', this.currentThickness);
					}

					this.startPoint = null;
					this.endPoint = null;
				})
			))
		).subscribe();

		this.setColorPickerBackgroundColor('#777777');
	}

	hasInput = false;

	addInput(x, y) {

		var input = document.createElement('input');
	
		input.type = 'text';
		input.style.position = 'fixed';
		input.style.left = (x - 4) + 'px';
		input.style.top = (y - 4) + 'px';
		input.id = 'temporary-text-input';
		input.style.fontSize = (parseInt(this.currentThickness, 10) + 16).toString() + "px";
	
		input.onkeydown = (e) => {

			var keyCode = e.keyCode;

			if (keyCode === 13) 
			{
				var tempTextInput = document.getElementById('temporary-text-input') as HTMLInputElement;

				var canvas2 = document.getElementById('whiteboard-canvas') as HTMLCanvasElement;

				this.ctx = canvas2.getContext('2d');

				//console.log(tempTextInput.value);

				//console.log(parseInt(tempTextInput.style.top, 10));

				//console.log(this.ctx);

				this.drawTextWithAdding(tempTextInput.value, parseInt(tempTextInput.style.left, 10) + 10, parseInt(tempTextInput.style.top, 10) - 100);
				document.body.removeChild(tempTextInput);
				this.hasInput = false;
			}
		};
	
		document.body.appendChild(input);
	
		input.focus();
	
		this.hasInput = true;
	}

	drawTextWithAdding = async function(txt, x, y)
	{
		//console.log("entered drawText function");

		this.ctx.textBaseline = 'top';
		this.ctx.textAlign = 'left';
		this.ctx.font = (parseInt(this.currentThickness, 10) + 16).toString() + "px Arial";
		this.ctx.color = this.currentSelectedColor;

		this.ctx.fillText(txt, x, y);

		var shapeData = new ShapeData()
		{
			var points: any[] = [];

			var point = { x: x, y: y};

			points.push(point);

			shapeData.shapeType = "TEXT";
			shapeData.color = this.currentSelectedColor;
			shapeData.points = points;
			shapeData.thickness = this.currentThickness;
			shapeData.text = txt;

			this.shapes.push(shapeData);
		}
	}

	drawTextWithoutAdding = async function(txt, x, y, thickness, color)
	{
		//console.log("entered drawText function");

		this.ctx.textBaseline = 'top';
		this.ctx.textAlign = 'left';
		this.ctx.font = (parseInt(thickness, 10) + 16).toString() + "px Arial";
		this.ctx.color = color;

		this.ctx.fillText(txt, x, y);
	}

	color: any;
	showColorPicker: boolean;
	colorPicker: HTMLInputElement;
	currentSelectedColor: any;
	currentTool: any;
	shapes: ShapeData[];

	drawBrush(ctx: CanvasRenderingContext2D, points, color, thickness)
	{
		ctx.beginPath();
		ctx.strokeStyle = color;
		ctx.lineWidth = thickness;
		ctx.lineJoin = 'round';
		ctx.moveTo(points[0].x, points[0].y);
		
		for(var i = 1; i < points.length; i++)
		{
			ctx.lineTo(points[i].x, points[i].y);
			ctx.stroke();
		}

		ctx.closePath();
	}

	drawSquare(ctx, startPoint, endPoint, color, thickness)
	{
		ctx.beginPath();
		ctx.strokeStyle = color;
		ctx.lineWidth = thickness;
		ctx.lineJoin = 'round';

		var lowestPointX, lowestPointY;
		var highestPointX, highestPointY;

		if(startPoint.x < endPoint.x)
		{
			lowestPointX = startPoint.x;
			highestPointX = endPoint.x;
		}
		else
		{
			lowestPointX = endPoint.x;
			highestPointX = startPoint.x;
		}

		if(startPoint.y < endPoint.y)
		{
			lowestPointY = startPoint.y;
			highestPointY = endPoint.y;
		}
		else 
		{
			lowestPointY = endPoint.y;
			highestPointY = startPoint.y;
		}

		ctx.rect(lowestPointX, lowestPointY, highestPointX-lowestPointX, highestPointY-lowestPointY);
		ctx.stroke();
		ctx.closePath();
	}

	drawCircle(ctx, startPoint, endPoint, color, thickness)
	{
		ctx.beginPath();
		ctx.strokeStyle = color;
		ctx.lineWidth = thickness;
		ctx.lineJoin = 'round';

		var lowestPointX, lowestPointY;
		var highestPointX, highestPointY;

		if(startPoint.x < endPoint.x)
		{
			lowestPointX = startPoint.x;
			highestPointX = endPoint.x;
		}
		else
		{
			lowestPointX = endPoint.x;
			highestPointX = startPoint.x;
		}

		if(startPoint.y < endPoint.y)
		{
			lowestPointY = startPoint.y;
			highestPointY = endPoint.y;
		}
		else 
		{
			lowestPointY = endPoint.y;
			highestPointY = startPoint.y;
		}

		var centerX = (lowestPointX + highestPointX) / 2;
		var centerY = (lowestPointY + highestPointY) / 2;

		var a = highestPointX - lowestPointX;
		var b = highestPointY - lowestPointY;

		var distance = Math.sqrt( a*a + b*b );

		ctx.arc(centerX, centerY, distance / 2, 0, 2 * Math.PI);
		ctx.stroke();
		ctx.closePath();

		//console.log("Drew circle");
	}

	ngOnInit()
	{
		this.shapes = [];

		this.currentThickness = 2;
		this.currentTool = "BRUSH";

		setInterval(() => {
			this.drawAllShapes();
		}, 500);
	}	

	addShape(shapeType, points, color, thickness)
	{
		var shapeData = new ShapeData();

		shapeData.shapeType = shapeType;
		shapeData.color = color;
		shapeData.thickness = thickness;
		shapeData.points = points;

		this.shapes.push(shapeData);

		//console.log(this.shapes);
	}

	drawAllShapes()
	{
		var canvas2 = document.getElementById('whiteboard-canvas') as HTMLCanvasElement;

		this.ctx.clearRect(0, 0, canvas2.width, canvas2.height);

		for(var i = 0; i < this.shapes.length; i++)
		{
			if(this.shapes[i].shapeType === "SQUARE")
			{
				var startPoint = this.shapes[i].points[0];
				var endPoint = this.shapes[i].points[1];

				this.drawSquare(this.ctx, startPoint, endPoint, this.shapes[i].color, this.shapes[i].thickness);
			}
			else if(this.shapes[i].shapeType === "CIRCLE")
			{
				var startPoint = this.shapes[i].points[0];
				var endPoint = this.shapes[i].points[1];

				this.drawCircle(this.ctx, startPoint, endPoint, this.shapes[i].color, this.shapes[i].thickness);
			}
			else if(this.shapes[i].shapeType === "BRUSH")
			{
				this.drawBrush(this.ctx, this.shapes[i].points, this.shapes[i].color, this.shapes[i].thickness);
			}
			else if(this.shapes[i].shapeType === "TEXT")
			{
				this.drawTextWithoutAdding(this.shapes[i].text, this.shapes[i].points[0].x, this.shapes[i].points[0].y, this.shapes[i].thickness, this.shapes[i].color);
			}
		}
	}

	setColorPickerBackgroundColor(color)
	{
		var colorPickerBackground = document.getElementById("colorPickerBackground") as HTMLElement;

		colorPickerBackground.style.color = color;
		this.currentSelectedColor = color;

		var colorPicker = document.getElementById("color-picker") as HTMLInputElement;

		colorPicker.value = color;

		//alert('setting colorPicker.value to ' + color);
		//alert('colorPicker.value is ' + colorPicker.value);
	}

	userClickedCanvas()
	{
		var colorPicker = document.getElementById("color-picker") as HTMLInputElement;

		//alert(colorPicker.value);

		this.setColorPickerBackgroundColor(colorPicker.value);
	}

	userClickedOpenColorPicker()
	{
		var colorPicker = document.getElementById("color-picker") as HTMLInputElement;

		colorPicker.click();
	}

	userClickedPaintbrushTool()
	{
		this.UnmarkSelectedTool();

		var paintBrushContainer = document.getElementsByClassName("toolbar-tool")[1];

		paintBrushContainer.classList.add("selected-tool");

		this.currentTool = "BRUSH";
	}

	userClickedSquareTool()
	{
		this.UnmarkSelectedTool();

		var squareContainer = document.getElementsByClassName("toolbar-tool")[2];

		squareContainer.classList.add("selected-tool");

		this.currentTool = "SQUARE";
	}

	userClickedCircleTool()
	{
		this.UnmarkSelectedTool();

		var circleContainer = document.getElementsByClassName("toolbar-tool")[3];

		circleContainer.classList.add("selected-tool");

		this.currentTool = "CIRCLE";
	}

	UnmarkSelectedTool()
	{
		var paintBrushContainer = document.getElementsByClassName("toolbar-tool")[1];
		var squareContainer = document.getElementsByClassName("toolbar-tool")[2];
		var circleContainer = document.getElementsByClassName("toolbar-tool")[3];
		var textContainer = document.getElementsByClassName("toolbar-tool")[4];
		var eraserContainer = document.getElementsByClassName("toolbar-tool")[5];

		paintBrushContainer.classList.remove("selected-tool");
		squareContainer.classList.remove("selected-tool");
		circleContainer.classList.remove("selected-tool");
		textContainer.classList.remove("selected-tool");
		eraserContainer.classList.remove("selected-tool");
	}

	onThicknessChanged(inputSlider: HTMLInputElement)
	{
		this.currentThickness = inputSlider.value;
	}

	userClickedTextTool()
	{
		this.UnmarkSelectedTool();

		var textContainer = document.getElementsByClassName("toolbar-tool")[4];

		textContainer.classList.add("selected-tool");

		this.currentTool = "TEXT";
	}

	userClickedEraserTool()
	{
		this.UnmarkSelectedTool();

		var eraserContainer = document.getElementsByClassName("toolbar-tool")[5];

		eraserContainer.classList.add("selected-tool");

		this.currentTool = "ERASER";
	}
}
