'use client';

import { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';

export default function BartenderGame() {
  const gameContainerRef = useRef(null);
  const appRef = useRef(null);
  const spriteRef = useRef(null);
  const keysRef = useRef({});

  useEffect(() => {
    // Check if container exists and we haven't already initialized
    if (!gameContainerRef.current || appRef.current) return;

    // Initialize PixiJS application
    const app = new PIXI.Application({
      width: 800,
      height: 600,
      backgroundColor: 0x2d2d2d,
      antialias: true,
      resizeTo: gameContainerRef.current, // Auto-resize to container
    });
    
    // Store references
    appRef.current = app;
    gameContainerRef.current.appendChild(app.view);

    // Load sprite texture
    const spriteSheet = PIXI.BaseTexture.from('/bartender.png');
    const textures = [];
    const frameWidth = 32;
    const frameHeight = 32;
    const frameCount = 4;

    // Create textures for each frame
    for (let i = 0; i < frameCount; i++) {
      textures.push(
        new PIXI.Texture(spriteSheet, new PIXI.Rectangle(
          i * frameWidth, 
          0, 
          frameWidth, 
          frameHeight
        ))
      );
    }

    // Create animated sprite
    const bartender = new PIXI.AnimatedSprite(textures);
    bartender.animationSpeed = 0.1;
    bartender.position.set(400, 300);
    bartender.anchor.set(0.5);
    bartender.scale.set(2);
    app.stage.addChild(bartender);
    spriteRef.current = bartender;

    // Keyboard controls
    const handleKeyDown = (e) => {
      keysRef.current[e.key] = true;
      if (!bartender.playing) bartender.play();
    };

    const handleKeyUp = (e) => {
      keysRef.current[e.key] = false;
      if (!Object.values(keysRef.current).some(Boolean)) {
        bartender.stop();
        bartender.gotoAndStop(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Animation loop
    const speed = 5;
    app.ticker.add(() => {
      const keys = keysRef.current;
      if (keys['ArrowLeft'] || keys['a']) {
        bartender.x -= speed;
        bartender.scale.x = -2;
      }
      if (keys['ArrowRight'] || keys['d']) {
        bartender.x += speed;
        bartender.scale.x = 2;
      }
      if (keys['ArrowUp'] || keys['w']) {
        bartender.y -= speed;
      }
      if (keys['ArrowDown'] || keys['s']) {
        bartender.y += speed;
      }

      // Keep within bounds
      bartender.x = Math.max(bartender.width/2, Math.min(app.screen.width - bartender.width/2, bartender.x));
      bartender.y = Math.max(bartender.height/2, Math.min(app.screen.height - bartender.height/2, bartender.y));
    });

    return () => {
      // Cleanup
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      app.destroy(true, true);
      appRef.current = null;
    };
  }, []);

  return <div ref={gameContainerRef} style={{ width: '100%', height: '100%' }} />;
}