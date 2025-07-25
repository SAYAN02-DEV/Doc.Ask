// src/App.jsx
import { useEffect, useState, useCallback } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import HeroSection from "./components/HeroSection";
import ChatPage from "./components/ChatPage";
import { AuthProvider } from "./components/AuthContext";
// import Footer from "./components/Footer"; // Optional if you created one

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
    <AuthProvider>
      <div className="relative min-h-screen">
        {/* Background particles */}
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
                  value: "#f6e05e"
                },
                shape: {
                  type: "square"
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
                    enable: false,
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

        {/* Routing */}
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HeroSection />} />
              <Route path='/chat' element={<ChatPage/>}/>
              {/* Add more routes here as needed */}
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

// Layout used for all routes
function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
