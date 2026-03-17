import React, { useContext, useEffect, useRef, useState } from 'react'
import * as faceapi from 'face-api.js'
import { EmotionContext } from '../App'

// let {setEmotion}= useContext(EmotionContext)
const EmotionDetector = ({}) => {
    let vedioRef =  useRef()

    let canvasRef = useRef()
    
    let {emotion,setEmotion}=useContext(EmotionContext)

    let[modelsLoad,setModelLoad]=useState(false)

    useEffect(() => {
       startVedio()
       loadModels()
    }, [])

    let startVedio = ()=>{
        navigator.mediaDevices.getUserMedia({ video:true })
        .then(stream =>{
            vedioRef.current.srcObject=stream;
        })
        .catch(err=> console.error(err))
    }
    let startDetection=()=>{
        setInterval(() => {
            detectEmotion()
        }, 1000);
    }
    let loadModels = async () => {
        let MODEL_URL="/face-api.js-models"
        await faceapi.nets.tinyFaceDetector.loadFromUri(`${MODEL_URL}/tiny_face_detector`)
        await faceapi.nets.faceExpressionNet.loadFromUri(`${MODEL_URL}/face_expression`)
        console.log("models done");
        
        setModelLoad(true)

        startDetection()
    }
    let detectEmotion = async () => {
        // if (!modelsLoad){
        //     alert("Model is still loading")
        //     return
        // }
        if (!vedioRef.current|| !canvasRef.current) return
        let detection = await faceapi.detectSingleFace(vedioRef.current,new faceapi.TinyFaceDetectorOptions()).withFaceExpressions()

        let canvas = canvasRef.current

        let displaysize ={
            width: vedioRef.current.width,
            height: vedioRef.current.height
        }

        faceapi.matchDimensions(canvas,displaysize)

        let ctx = canvas.getContext("2d")

        ctx.clearRect(0,0,canvas.height,canvas.width)
        
        if (!detection){
            setEmotion("Face not detected")
            return
        }        

        let resized = faceapi.resizeResults(detection,displaysize)

    

        faceapi.draw.drawDetections(canvas,resized)
        faceapi.draw.drawFaceExpressions(canvas,resized)
        

        let expression = detection.expressions
        let maxEmotion = Object.keys(expression).reduce((a,b)=> expression[a] > expression[b]? a:b)
        setEmotion(maxEmotion)
        console.log(detection);
        
        
    }



    

  return (
    <div className="bg-gray-900 text-white flex flex-col items-center p-6">
        <h2 className="text-3xl font-bold mb-6 text-red-500">EmotionDetector 🎭</h2>
        <div className="relative">
        <video ref={vedioRef} autoPlay playsInline width="400" height="300" className="rounded-xl shadow-lg border-2 border-gray-700"></video><br />
        <canvas ref={canvasRef} style={{position:"absolute",top:0,left:0}}/>
        </div>
        {/* <button onClick={detectEmotion}>Detect the Emotion</button> */}
        <div className="mt-6 text-center">
        <h3>Your Emotion: {emotion}</h3>
        <h2 className="text-5xl mt-2">
            Emotion: {emotion === "happy" && "😄"}
            {emotion === "sad" && "😢"}
            {emotion === "angry" && "😡"}
            {emotion === "surprised" && "😲"}
            {emotion === "neutral" && "😐"}
        </h2>
        </div>
    </div>
  )
}

export default EmotionDetector