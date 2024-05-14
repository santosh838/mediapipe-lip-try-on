// import React, { useEffect, useRef, useState } from "react";
// import Webcam from "react-webcam";
// import bannerImg from '../src/asset/lip-banner.jpg';
// import nextIcon from '../src/asset/next.png';
// import prevIcon from '../src/asset/before.png';
// import { FaceMesh } from "@mediapipe/face_mesh";
// import * as cam from "@mediapipe/camera_utils";
// import './App.css'

// const inputResolution = {
//   width: 440,
//   height: 440,
// };

// const videoConstraints = {
//   width: inputResolution.width,
//   height: inputResolution.height,
// };

// const lipMeshIndices = [
//   61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 306, 292, 308, 415, 310, 311, 312, 13, 82, 81, 80, 191, 78, 62, 76, 61, 291, 306, 292, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95, 78, 62, 76, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291
// ];

// const colors = [
//   "rgb(236, 80, 113)", "rgb(215, 94, 111)", "rgb(127, 57, 53)", "rgb(200, 103, 96)", "rgb(167, 89, 75)", "rgb(206, 134, 124)", "rgb(211, 118, 126)", "rgb(160, 50, 50)"
//   , "rgb(200, 123, 133)", "rgb(190, 84, 110)", "rgb(154, 49, 70)", "rgb(204, 124, 121)", "rgb(179, 46, 52)", "rgb(167, 30, 38)", "rgb(195, 33, 32)"
//   , "rgb(234, 19, 11)", "rgb(131, 55, 80)", "rgb(190, 85, 114)", "rgb(128, 21, 27)", "rgb(133, 54, 57)", "rgb(189, 81, 96)", "rgb(154, 84, 110)", "rgb(190, 114, 128)", "rgb(228, 58, 73)", "rgb(221, 57, 59)", "rgb(220, 29, 31)",
//   "rgb(219, 152, 141)", "rgb(178, 114, 112)"
// ];

// const titles = ["Red", "blue", "yellow", "brown", "yellow"];

// function App() {
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [clickedIndex, setClickedIndex] = useState(-1);
//   const [activeColor, setActiveColor] = useState(colors[0].match(/\d+/g).map(Number).reverse());
//   const [isCameraOn, setIsCameraOn] = useState(true);

//   const toggleCamera = () => {
//     setIsCameraOn(prevState => !prevState);
//   };

//   const handleClick = (index) => {
//     setActiveIndex(index);
//     setClickedIndex(index);
//     const rgbArray = colors[index].match(/\d+/g).map(Number).reverse();
//     setActiveColor(rgbArray);
//   };

//   const handleNext = (event) => {
//     event.preventDefault();
//     setActiveIndex((prevIndex) => (prevIndex === colors.length - 1 ? 0 : prevIndex + 1));
//   };

//   const handlePrev = (event) => {
//     event.preventDefault();
//     setActiveIndex((prevIndex) => (prevIndex === 0 ? colors.length - 1 : prevIndex - 1));
//   };


//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const videoElement = videoRef.current?.video; // Check for null or undefined
//     if (!canvas || !videoElement) return;

//     try {
//       const ctx = canvas.getContext("2d");
//       ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

//       const faceMesh = new FaceMesh({
//         locateFile: (file) => {
//           return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
//         },
//       });

//       faceMesh.setOptions({
//         maxNumFaces: 2,
//         minDetectionConfidence: 0.5,
//         minTrackingConfidence: 0.5,
//       });

//       faceMesh.onResults(onResults);

//       const camera = new cam.Camera(videoElement, {
//         onFrame: async () => {
//           await faceMesh.send({ image: videoElement });
//         },
//         width: inputResolution.width,
//         height: inputResolution.height,
//       });
//       camera.start();

//       return () => {
//         camera.stop();
//       };
//     } catch (error) {
//       console.error("Error initializing FaceMesh or Camera:", error);
//     }
//   }, [activeColor]);

//   function onResults(results) {
//     const canvas = canvasRef.current;
//     if (!canvas || !results?.multiFaceLandmarks) return; // Check for null or undefined

//     const videoWidth = videoRef.current?.video.videoWidth; // Check for null or undefined
//     const videoHeight = videoRef.current?.video.videoHeight; // Check for null or undefined

//     // Set canvas width
//     canvas.width = videoWidth;
//     canvas.height = videoHeight;

//     const canvasCtx = canvas.getContext("2d");
//     canvasCtx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

//     canvasCtx.save();
//     canvasCtx.drawImage(
//       results.image,
//       0,
//       0,
//       canvas.width,
//       canvas.height
//     );
//     if (results.multiFaceLandmarks) {
//       for (const landmarks of results.multiFaceLandmarks) {
//         const lipPoints = [];
//         for (const index of lipMeshIndices) {
//           lipPoints.push({
//             x: landmarks[index].x * videoWidth,
//             y: landmarks[index].y * videoHeight,
//           });
//         }
//         drawPolygon(canvasCtx, lipPoints, activeColor, 0.4); // Fill with 50% opacity
//       }
//     }
//     canvasCtx.restore();
//   }


//   function drawPolygon(ctx, points, color, fillOpacity = 1) {
//     ctx.beginPath();
//     ctx.moveTo(points[0].x, points[0].y);
//     for (let i = 1; i < points.length; i++) {
//       ctx.lineTo(points[i].x, points[i].y);
//     }
//     ctx.closePath();
//     ctx.fillStyle = `rgba(${color[2]}, ${color[1]}, ${color[0]}, ${fillOpacity})`;
//     ctx.fill();

//     const gradient = ctx.createLinearGradient(points[0].x, points[0].y, points[6].x, points[6].y);
//     gradient.addColorStop(0, "rgba(255, 255, 255, 0)");
//     gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.2)");
//     gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
//     ctx.fillStyle = gradient;
//     ctx.fill();
//   }


//   return (
//     <>
//       <div className="grid place-items-center h-screen">
//         <div className="webcam-container">
//           {isCameraOn ? (
//             <div className="video-canvas-container">
//               <Webcam
//                 width={inputResolution.width}
//                 height={inputResolution.height}
//                 style={{ position: "absolute", borderRadius: "20px" }}
//                 videoConstraints={videoConstraints}
//                 ref={videoRef}
//               />
//               <canvas
//                 ref={canvasRef}
//                 width={inputResolution.width}
//                 height={inputResolution.height}
//                 style={{ position: "absolute", borderRadius: "20px" }}
//               />
//             </div>
//           ) : (
//             <div className="banner-sec">
//               <img src={bannerImg} alt="banner" />
//             </div>
//           )}
//           <div className="button-container">
//             <button onClick={toggleCamera}>
//               {isCameraOn ? "Turn Camera Off" : "Turn Camera On"}
//             </button>
//           </div>
//         </div>

//         {isCameraOn && (
//           <div>
//             <section className="navigation-div">
//               <span className="prevBtn" onClick={handlePrev}><img src={prevIcon} alt="previous" /></span>
//               <div className="navigation">
//                 <ul>
//                   {colors.map((color, index) => (
//                     <li
//                       key={index}
//                       className={`list ${index === activeIndex ? "active" : ""} ${index === clickedIndex ? "clicked" : ""}`}
//                       data-color={color}
//                       onClick={() => handleClick(index)}
//                     >
//                       <a href="#">
//                         <span className={`title  ${index === activeIndex ? "active" : ""}`}>{titles[index]}</span>
//                       </a>
//                       <div className={`indicator ${index === activeIndex ? "active" : ""}`} style={{ backgroundColor: `${color}` }}></div>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//               <span className="nextBtn" onClick={handleNext}><img src={nextIcon} alt="next" /></span>
//             </section>
//           </div>
//         )}

//       </div>

//     </>
//   );
// }

// export default App;



import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import bannerImg from '../src/asset/lip-banner.jpg';
import nextIcon from '../src/asset/next.png';
import prevIcon from '../src/asset/before.png';
import { FaceMesh } from "@mediapipe/face_mesh";
import * as cam from "@mediapipe/camera_utils";
import './App.css'

const inputResolution = {
  width: 440,
  height: 440,
};

const videoConstraints = {
  width: inputResolution.width,
  height: inputResolution.height,
};

const lipMeshIndices = [
  61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 306, 292, 308, 415, 310, 311, 312, 13, 82, 81, 80, 191, 78, 62, 76, 61, 291, 306, 292, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95, 78, 62, 76, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291
];

const colors = [
  "rgb(236, 80, 113)", "rgb(215, 94, 111)", "rgb(127, 57, 53)", "rgb(200, 103, 96)", "rgb(167, 89, 75)", "rgb(206, 134, 124)", "rgb(211, 118, 126)", "rgb(160, 50, 50)"
  , "rgb(200, 123, 133)", "rgb(190, 84, 110)", "rgb(154, 49, 70)", "rgb(204, 124, 121)", "rgb(179, 46, 52)", "rgb(167, 30, 38)", "rgb(195, 33, 32)"
  , "rgb(234, 19, 11)", "rgb(131, 55, 80)", "rgb(190, 85, 114)", "rgb(128, 21, 27)", "rgb(133, 54, 57)", "rgb(189, 81, 96)", "rgb(154, 84, 110)", "rgb(190, 114, 128)", "rgb(228, 58, 73)", "rgb(221, 57, 59)", "rgb(220, 29, 31)",
  "rgb(219, 152, 141)", "rgb(178, 114, 112)"
];

const titles = ["Red", "blue", "yellow", "brown", "yellow"];

function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [clickedIndex, setClickedIndex] = useState(-1);
  const [activeColor, setActiveColor] = useState(colors[0].match(/\d+/g).map(Number).reverse());
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [faceMesh, setFaceMesh] = useState(null);

  const toggleCamera = () => {
    setIsCameraOn(prevState => !prevState);
  };

  const handleClick = (index) => {
    setActiveIndex(index);
    setClickedIndex(index);
    const rgbArray = colors[index].match(/\d+/g).map(Number).reverse();
    setActiveColor(rgbArray);
    setupFaceMesh(rgbArray); // Update FaceMesh with new color
  };

  const handleNext = (event) => {
    event.preventDefault();
    setActiveIndex((prevIndex) => (prevIndex === colors.length - 1 ? 0 : prevIndex + 1));
  };

  const handlePrev = (event) => {
    event.preventDefault();
    setActiveIndex((prevIndex) => (prevIndex === 0 ? colors.length - 1 : prevIndex - 1));
  };

  const setupFaceMesh = (color) => {
    const videoElement = videoRef.current?.video;
    if (!videoElement) return;

    const newFaceMesh = new FaceMesh({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
      },
    });

    newFaceMesh.setOptions({
      maxNumFaces: 2,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    newFaceMesh.onResults(onResults);

    const camera = new cam.Camera(videoElement, {
      onFrame: async () => {
        await newFaceMesh.send({ image: videoElement });
      },
      width: inputResolution.width,
      height: inputResolution.height,
    });
    camera.start();

    setFaceMesh(newFaceMesh);
  };

  function onResults(results) {
    const canvas = canvasRef.current;
    if (!canvas || !results?.multiFaceLandmarks) return; // Check for null or undefined

    const videoWidth = videoRef.current?.video.videoWidth; // Check for null or undefined
    const videoHeight = videoRef.current?.video.videoHeight; // Check for null or undefined

    // Set canvas width
    canvas.width = videoWidth;
    canvas.height = videoHeight;

    const canvasCtx = canvas.getContext("2d");
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    canvasCtx.save();
    canvasCtx.drawImage(
      results.image,
      0,
      0,
      canvas.width,
      canvas.height
    );
    if (results.multiFaceLandmarks) {
      for (const landmarks of results.multiFaceLandmarks) {
        const lipPoints = [];
        for (const index of lipMeshIndices) {
          lipPoints.push({
            x: landmarks[index].x * videoWidth,
            y: landmarks[index].y * videoHeight,
          });
        }

        // Fill lips with the active color
        canvasCtx.beginPath();
        canvasCtx.moveTo(lipPoints[0].x, lipPoints[0].y);
        for (let i = 1; i < lipPoints.length; i++) {
          canvasCtx.lineTo(lipPoints[i].x, lipPoints[i].y);
        }
        canvasCtx.closePath();
        canvasCtx.fillStyle = `rgba(${activeColor[2]}, ${activeColor[1]}, ${activeColor[0]}, 0.4)`;
        canvasCtx.fill();

        // Add shining effect with a subtle gradient overlay
        const gradient = canvasCtx.createLinearGradient(lipPoints[0].x, lipPoints[0].y, lipPoints[6].x, lipPoints[6].y);
        gradient.addColorStop(0, "rgba(255, 255, 255, 0)");
        gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.2)");
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

        canvasCtx.fillStyle = gradient;
        canvasCtx.fill();
      }
    }
    canvasCtx.restore();
  }

  return (
    <>
      <div className="grid place-items-center h-screen">
        <div className="webcam-container">
          {isCameraOn ? (
            <div className="video-canvas-container">
              <Webcam
                width={inputResolution.width}
                height={inputResolution.height}
                style={{ position: "absolute", borderRadius: "20px" }}
                videoConstraints={videoConstraints}
                onUserMedia={() => setupFaceMesh(activeColor)}
                ref={videoRef}
              />
              <canvas
                ref={canvasRef}
                width={inputResolution.width}
                height={inputResolution.height}
                style={{ position: "absolute", borderRadius: "20px" }}
              />
            </div>
          ) : (
            <div className="banner-sec">
              <img src={bannerImg} alt="banner" />
            </div>
          )}
          <div className="button-container">
            <button onClick={toggleCamera}>
              {isCameraOn ? "Turn Camera Off" : "Turn Camera On"}
            </button>
          </div>
        </div>

        {isCameraOn && (
          <div>
            <section className="navigation-div">
              <span className="prevBtn" onClick={handlePrev}><img src={prevIcon} alt="previous" /></span>
              <div className="navigation">
                <ul>
                  {colors.map((color, index) => (
                    <li
                      key={index}
                      className={`list ${index === activeIndex ? "active" : ""} ${index === clickedIndex ? "clicked" : ""}`}
                      data-color={color}
                      onClick={() => handleClick(index)}
                    >
                      <a href="#">
                        <span className={`title  ${index === activeIndex ? "active" : ""}`}>{titles[index]}</span>
                      </a>
                      <div className={`indicator ${index === activeIndex ? "active" : ""}`} style={{ backgroundColor: `${color}` }}></div>
                    </li>
                  ))}
                </ul>
              </div>
              <span className="nextBtn" onClick={handleNext}><img src={nextIcon} alt="next" /></span>
            </section>
          </div>
        )}

      </div>

    </>
  );
}

export default App;
