import './App.css';
import tetris from './tetris_base_game';
import React, {useEffect, useRef, useState} from "react";

function App() {
    const canvasRef = useRef(null)
    const contextRef = useRef(null)
    const [isDrawing, setIsDrawing] = useState(false)

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = 600 * 2;
        canvas.height = 500 * 2;
        canvas.style.width = `600px`;
        canvas.style.height = `500px`;

        const context = canvas.getContext("2d")

        contextRef.current = context;

        context.scale(2,2)
        context.lineCap = "round"
        context.strokeStyle = "black"
        context.lineWidth = 5
        context.current = context;
    }, [])

    const key_gain = ({nativeEvent}) => {
        console.log("down")
        const {offsetX, offsetY} = nativeEvent;
        contextRef.current.beginPath()
        contextRef.current.moveTo(offsetX, offsetY)
        setIsDrawing(true)
    }

    const key_lose = ({nativeEvent}) => {
        console.log("up")
        contextRef.current.closePath()
        setIsDrawing(false)
    }

    const draw = ({nativeEvent}) => {
        if(!isDrawing)
            return;
        const {offsetX, offsetY} = nativeEvent;
        contextRef.current.lineTo(offsetX, offsetY)
        contextRef.current.stroke()
    }

    return (
    <div className="App">
      <div className="center-column">

          <h1>Welcome !!!!</h1>

          <div className="item-row">
            <span>Create Django Project</span>
          </div>

          <div className="item-row">
            <span>Create React app: "npx create-react-app appname"</span>
          </div>

          <div className="item-row">
            <span>Drag react app into root directory of django project</span>
          </div>

          <div className="item-row">
            <span>Configure TEMPALTES engine</span>
          </div>

          <div className="item-row">
            <span>Configure URL path</span>
          </div>

          <div className="item-row">
            <span>Configure static files</span>
          </div>

          <div className="item-row">
            <span>cd into react app and run "npm run build"</span>
          </div>

          <canvas
              onMouseDown={key_gain}
              onMouseUp={key_lose}
              onMouseMove={draw}
              ref={canvasRef}
          />

          <tetris />
        </div>
    </div>
  );
}

export default App;
