import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import './Globe3D.css';

// Earth component with temperature data visualization
const Earth = ({ data, year, colorScale = 'temperature' }) => {
  const earthRef = useRef();
  const cloudsRef = useRef();
  
  // Load textures
  const [earthTexture, normalMap, specularMap, cloudsTexture] = useTexture([
    '/textures/earth_daymap.jpg',
    '/textures/earth_normal_map.jpg',
    '/textures/earth_specular_map.jpg',
    '/textures/earth_clouds.jpg'
  ]);
  
  // Create data texture for temperature visualization
  const [dataTexture, setDataTexture] = useState(null);
  
  useEffect(() => {
    if (!data) return;
    
    // Create a data texture based on the climate data
    const width = 360;
    const height = 180;
    const size = width * height;
    const dataArray = new Uint8Array(size * 3);
    
    // Fill with base color (blue for cold)
    for (let i = 0; i < size; i++) {
      dataArray[i * 3] = 0;      // R
      dataArray[i * 3 + 1] = 0;  // G
      dataArray[i * 3 + 2] = 64; // B
    }
    
    // Apply temperature data
    // In a real implementation, this would map actual lat/long data points
    // For this example, we'll create a simple pattern
    for (let lat = 0; lat < height; lat++) {
      for (let lon = 0; lon < width; lon++) {
        const index = (lat * width + lon) * 3;
        
        // Simulate temperature gradient from equator (hot) to poles (cold)
        const latTemp = Math.abs(lat - height / 2) / (height / 2); // 0 at equator, 1 at poles
        const randomFactor = Math.random() * 0.2 - 0.1; // Add some randomness
        
        // Temperature value between 0 and 1 (0 = cold, 1 = hot)
        let tempValue = 1 - latTemp + randomFactor;
        tempValue = Math.max(0, Math.min(1, tempValue));
        
        if (colorScale === 'temperature') {
          // Blue (cold) to Red (hot)
          dataArray[index] = Math.floor(tempValue * 255);       // R increases with temp
          dataArray[index + 1] = 0;                             // G
          dataArray[index + 2] = Math.floor((1 - tempValue) * 255); // B decreases with temp
        } else {
          // Green (low) to Red (high)
          dataArray[index] = Math.floor(tempValue * 255);       // R increases with temp
          dataArray[index + 1] = Math.floor((1 - tempValue) * 255); // G decreases with temp
          dataArray[index + 2] = 0;                             // B
        }
      }
    }
    
    const texture = new THREE.DataTexture(dataArray, width, height, THREE.RGBFormat);
    texture.needsUpdate = true;
    setDataTexture(texture);
    
  }, [data, colorScale]);
  
  // Rotate the earth slowly
  useFrame(({ clock }) => {
    if (earthRef.current) {
      earthRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
    
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y = clock.getElapsedTime() * 0.07;
    }
  });
  
  return (
    <>
      {/* Earth sphere */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhongMaterial 
          map={earthTexture} 
          normalMap={normalMap}
          specularMap={specularMap}
          shininess={5}
        />
      </mesh>
      
      {/* Data visualization layer */}
      {dataTexture && (
        <mesh>
          <sphereGeometry args={[1.01, 64, 64]} />
          <meshBasicMaterial 
            map={dataTexture} 
            transparent={true} 
            opacity={0.7} 
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}
      
      {/* Cloud layer */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[1.02, 64, 64]} />
        <meshPhongMaterial 
          map={cloudsTexture} 
          transparent={true} 
          opacity={0.3}
          depthWrite={false}
        />
      </mesh>
    </>
  );
};

// Main Globe component
const Globe3D = ({ 
  data, 
  year = 2023, 
  colorScale = 'temperature',
  width = '100%',
  height = 500
}) => {
  return (
    <div className="globe-container" style={{ width, height }}>
      <Canvas camera={{ position: [0, 0, 2.5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Earth data={data} year={year} colorScale={colorScale} />
        <OrbitControls 
          enableZoom={true} 
          enablePan={false} 
          minDistance={1.5} 
          maxDistance={5}
          autoRotate={false}
          autoRotateSpeed={0.5}
        />
      </Canvas>
      
      <div className="globe-overlay">
        <div className="year-display">{year}</div>
        <div className="globe-legend">
          <div className="legend-title">{colorScale === 'temperature' ? 'Temperature' : 'Climate Variable'}</div>
          <div className="legend-gradient" style={{ 
            background: colorScale === 'temperature' 
              ? 'linear-gradient(to right, #0000ff, #ff0000)' 
              : 'linear-gradient(to right, #00ff00, #ff0000)' 
          }}></div>
          <div className="legend-labels">
            <span>{colorScale === 'temperature' ? 'Cold' : 'Low'}</span>
            <span>{colorScale === 'temperature' ? 'Hot' : 'High'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Globe3D;
