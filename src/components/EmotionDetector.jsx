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

       let intravel

       loadModels().then(()=>{
        intravel=setInterval(detectEmotion,1000)
       })
       return() => clearInterval(intravel)
    }, [])

    let startVedio = ()=>{
        navigator.mediaDevices.getUserMedia({ video:true })
        .then(stream =>{
            vedioRef.current.srcObject=stream;
            vedioRef.current.onloadedmetadata=()=>{
                vedioRef.current.play()
            }
        })
        .catch(err=> console.error(err))
    }

    let loadModels = async () => {
        const MODEL_URL = "/face-api.js-models";
        await faceapi.nets.tinyFaceDetector.loadFromUri(`${MODEL_URL}/tiny_face_detector`);
        await faceapi.nets.faceExpressionNet.loadFromUri(`${MODEL_URL}/face_expression`);
        console.log("models done");
        
        setModelLoad(true)

        // startDetection()
    }

    


    let detectEmotion = async () => {
  
        if (!vedioRef.current|| !canvasRef.current) return
        let detection = await faceapi.detectSingleFace(vedioRef.current,new faceapi.TinyFaceDetectorOptions()).withFaceExpressions()

        let canvas = canvasRef.current

        let video = vedioRef.current
        if(video.videoWidth === 0 || video.videoWidth === 0 || video.readyState !==4) return
        if (!video) return
        let displaysize ={
            width: video.videoWidth,
            height: video.videoHeight
        }

        faceapi.matchDimensions(canvas,displaysize)

        let ctx = canvas.getContext("2d")

        ctx.clearRect(0,0,canvas.width,canvas.height)


        
        if (!detection){
            setEmotion("Detecting......")
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
        <video ref={vedioRef} autoPlay playsInline className="w-full max-w-md h-auto rounded-xl shadow-lg border-2 border-gray-700"></video><br />
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