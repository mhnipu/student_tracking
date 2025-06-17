'use client';

import ModelViewer from '@/components/ModelViewer';
import { useState } from 'react';

export default function ModelViewerPage() {
  const [modelSrc, setModelSrc] = useState<string>('https://modelviewer.dev/shared-assets/models/Astronaut.glb');
  const modelOptions = [
    { name: 'Astronaut', src: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb' },
    { name: 'Sphere', src: 'https://modelviewer.dev/shared-assets/models/reflective-sphere.glb' },
    { name: 'Horse', src: 'https://modelviewer.dev/shared-assets/models/Horse.glb' },
    { name: 'Damaged Helmet', src: 'https://modelviewer.dev/shared-assets/models/DamagedHelmet.glb' }
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">3D Model Viewer</h1>
      
      <div className="mb-6">
        <label className="block mb-2 font-medium">Select a Model:</label>
        <div className="flex flex-wrap gap-2">
          {modelOptions.map((model) => (
            <button
              key={model.name}
              onClick={() => setModelSrc(model.src)}
              className={`px-4 py-2 rounded ${
                modelSrc === model.src 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
              }`}
            >
              {model.name}
            </button>
          ))}
        </div>
      </div>
      
      <div className="border rounded-lg overflow-hidden shadow-lg">
        <ModelViewer
          src={modelSrc}
          alt="3D Model"
          height="500px"
          width="100%"
          autoRotate={true}
          cameraControls={true}
          environmentImage="neutral"
          exposure={1}
          shadowIntensity={0.5}
          ar={true}
        />
      </div>
      
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">How to Use</h2>
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
          <pre className="text-sm">
{`import ModelViewer from '@/components/ModelViewer';

// Basic usage
<ModelViewer 
  src="path/to/your/model.glb" 
  alt="3D Model" 
/>

// With additional options
<ModelViewer
  src="path/to/your/model.glb"
  alt="3D Model"
  height="500px"
  width="100%"
  autoRotate={true}
  cameraControls={true}
  environmentImage="neutral"
  exposure={1}
  shadowIntensity={0.5}
  ar={true}
/>`}
          </pre>
        </div>
      </div>
    </div>
  );
} 