'use client';

import { useEffect, useRef } from 'react';
import Phaser from 'phaser';

export default function BartenderGame() {
  const gameRef = useRef(null);

  useEffect(() => {
    class MainScene extends Phaser.Scene {
      preload() {
        // Load the bartender spritesheet (4 frames for animation)
        this.load.spritesheet('bartender', '/bartender.png', {
          frameWidth: 12,
          frameHeight: 32,
          endFrame: 3
        });
      }

      create() {
        // Create the player sprite
        this.player = this.physics.add.sprite(200, 150, 'bartender');
        this.player.setCollideWorldBounds(true);
        
        // Create animations
        this.anims.create({
          key: 'walk-down',
          frames: this.anims.generateFrameNumbers('bartender', { start: 0, end: 3 }),
          frameRate: 10,
          repeat: -1
        });

        // Set up keyboard controls
        this.cursors = this.input.keyboard.createCursorKeys();

        // Add some text instructions
        this.add.text(10, 10, 'Use arrow keys to move the bartender', {
          fontSize: '16px',
          fill: '#ffffff'
        });
      }

      update() {
        const speed = 150;
        this.player.setVelocity(0);

        // Movement controls
        if (this.cursors.left.isDown) {
          this.player.setVelocityX(-speed);
          this.player.anims.play('walk-down', true);
          this.player.setFlipX(true);
        }
        else if (this.cursors.right.isDown) {
          this.player.setVelocityX(speed);
          this.player.anims.play('walk-down', true);
          this.player.setFlipX(false);
        }
        else if (this.cursors.up.isDown) {
          this.player.setVelocityY(-speed);
          this.player.anims.play('walk-down', true);
        }
        else if (this.cursors.down.isDown) {
          this.player.setVelocityY(speed);
          this.player.anims.play('walk-down', true);
        }
        else {
          this.player.anims.stop();
          this.player.setTexture('bartender', 0); // Reset to first frame when idle
        }
      }
    }

    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      backgroundColor: '#2d2d2d',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false
        }
      },
      scene: MainScene,
      parent: 'game-container',
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      }
    };

    if (!gameRef.current) {
      gameRef.current = new Phaser.Game(config);
    }

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return <div id="game-container" style={{ width: '100%', height: '100%' }} />;
}