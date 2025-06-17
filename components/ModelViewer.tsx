'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

interface ModelViewerProps {
  src: string;
  alt?: string;
  poster?: string;
  width?: string;
  height?: string;
  backgroundColor?: string;
  autoRotate?: boolean;
  cameraControls?: boolean;
  environmentImage?: string;
  exposure?: number;
  shadowIntensity?: number;
  shadowSoftness?: number;
  ar?: boolean;
  arModes?: string;
  arPlacement?: 'floor' | 'wall';
  arScale?: 'auto' | 'fixed';
  className?: string;
  style?: React.CSSProperties;
}

export default function ModelViewer({
  src,
  alt = 'A 3D model',
  poster,
  width = '100%',
  height = '400px',
  backgroundColor = 'transparent',
  autoRotate = false,
  cameraControls = true,
  environmentImage = 'neutral',
  exposure = 1,
  shadowIntensity = 0,
  shadowSoftness = 1,
  ar = false,
  arModes = 'webxr scene-viewer quick-look',
  arPlacement = 'floor',
  arScale = 'auto',
  className = '',
  style = {},
}: ModelViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [modelViewerLoaded, setModelViewerLoaded] = useState(false);
  const { resolvedTheme } = useTheme();
  
  useEffect(() => {
    // Dynamically import the model-viewer script
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
    script.onload = () => setModelViewerLoaded(true);
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current || !modelViewerLoaded) return;
    
    // The model-viewer element needs to be created after the script is loaded
    const modelViewer = document.createElement('model-viewer');
    
    // Set attributes
    modelViewer.setAttribute('src', src);
    modelViewer.setAttribute('alt', alt);
    if (poster) modelViewer.setAttribute('poster', poster);
    modelViewer.style.width = width;
    modelViewer.style.height = height;
    modelViewer.style.backgroundColor = backgroundColor;
    
    if (autoRotate) modelViewer.setAttribute('auto-rotate', '');
    if (cameraControls) modelViewer.setAttribute('camera-controls', '');
    
    modelViewer.setAttribute('environment-image', environmentImage);
    modelViewer.setAttribute('exposure', exposure.toString());
    modelViewer.setAttribute('shadow-intensity', shadowIntensity.toString());
    modelViewer.setAttribute('shadow-softness', shadowSoftness.toString());
    
    if (ar) {
      modelViewer.setAttribute('ar', '');
      modelViewer.setAttribute('ar-modes', arModes);
      modelViewer.setAttribute('ar-placement', arPlacement);
      modelViewer.setAttribute('ar-scale', arScale);
    }
    
    // Apply additional styles
    Object.entries(style).forEach(([key, value]) => {
      modelViewer.style[key as any] = value as string;
    });
    
    if (className) {
      className.split(' ').forEach(cls => {
        if (cls) modelViewer.classList.add(cls);
      });
    }
    
    // Add to DOM
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(modelViewer);
    
    // Apply dark/light theme adjustments if needed
    if (resolvedTheme === 'dark') {
      modelViewer.style.backgroundColor = '#1a1a1a';
    } else {
      modelViewer.style.backgroundColor = backgroundColor;
    }
    
  }, [src, alt, poster, width, height, backgroundColor, autoRotate, cameraControls, 
      environmentImage, exposure, shadowIntensity, shadowSoftness, ar, arModes, 
      arPlacement, arScale, className, style, modelViewerLoaded, resolvedTheme]);

  return <div ref={containerRef} />;
} 