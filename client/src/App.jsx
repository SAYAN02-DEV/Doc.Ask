// src/App.jsx
import { useEffect, useState, useCallback } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import TypewriterComponent from "./components/Typewritter";
function App() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = useCallback((container) => {
    console.log("Particles loaded:", container);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {init && (
        <Particles
          id="tsparticles"
          particlesLoaded={particlesLoaded}
          options={{
            fullScreen: {
              enable: true,
              zIndex: -1
            },
            background: {
              color: {
                value: "#000000"
              }
            },
            particles: {
              number: {
                value: 120,
                density: {
                  enable: true,
                  area: 800
                }
              },
              color: {
                value: "#ffffff"
              },
              shape: {
                type: "circle"
              },
              opacity: {
                value: 0.5
              },
              size: {
                value: { min: 1, max: 3 }
              },
              links: {
                enable: true,
                distance: 150,
                color: "#ffffff",
                opacity: 0.4,
                width: 1
              },
              move: {
                enable: true,
                speed: 3,
                direction: "none",
                outModes: {
                  default: "bounce"
                }
              }
            },
            interactivity: {
              events: {
                onHover: {
                  enable: true,
                  mode: "repulse"
                },
                onClick: {
                  enable: true,
                  mode: "push"
                },
                resize: true
              },
              modes: {
                repulse: {
                  distance: 100
                },
                push: {
                  quantity: 4
                }
              }
            },
            detectRetina: true
          }}
        />
      )}
      <TypewriterComponent/>
      <div className="flex justify-center">
        <button className="bg-white text-black px-6 py-3 mt-10 mb-50 font-mono text-xl hover:scale-95 transition duration-200">
          Get Started
        </button>
      </div>

      
    </div>
    
  );
}

export default App;
