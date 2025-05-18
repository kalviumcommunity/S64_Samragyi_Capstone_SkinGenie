import React, { useState, useEffect, useRef } from 'react';
import '../styles/SkincareTip.css';

const skincareTipsAndFacts = [
  {
    tip: "Exfoliate 1–2 times a week to remove dead skin cells and help reveal fresher, smoother skin—but don't overdo it, as excessive exfoliation can damage the skin barrier.",
    fact: "Your skin naturally renews itself approximately every 28 days, shedding dead skin cells and forming new ones."
  },
  {
    tip: "Apply sunscreen as the final step in your morning routine, even on cloudy days and during winter months.",
    fact: "Up to 80% of UV rays can penetrate clouds and reach your skin, causing damage even on overcast days."
  },
  {
    tip: "Store your vitamin C serum in a cool, dark place to prevent oxidation and maintain its effectiveness.",
    fact: "Vitamin C is one of the most unstable skincare ingredients and can degrade when exposed to light, heat, and air."
  },
  {
    tip: "Apply products in order from thinnest to thickest consistency for maximum absorption.",
    fact: "The molecular size of skincare ingredients determines how deeply they can penetrate your skin."
  },
  {
    tip: "Wait about 30 seconds between applying each skincare product to allow proper absorption.",
    fact: "Your skin has multiple layers, and it takes time for products to penetrate through them effectively."
  },
  {
    tip: "Use a humidifier in dry environments to help maintain your skin's moisture levels.",
    fact: "The ideal humidity level for healthy skin is between 40-60%. Below 30% can lead to dryness and irritation."
  },
  {
    tip: "Cleanse your face with lukewarm water, as hot water can strip away natural oils and damage your skin barrier.",
    fact: "Your skin's protective barrier is made up of lipids, ceramides, and fatty acids that can be disrupted by high temperatures."
  },
  {
    tip: "Don't neglect your neck and décolletage when applying skincare products, as these areas show signs of aging too.",
    fact: "The skin on your neck is thinner than facial skin and has fewer oil glands, making it more prone to showing signs of aging."
  },
  {
    tip: "Change your pillowcase at least once a week to prevent bacteria buildup that can cause breakouts.",
    fact: "After just one week, your pillowcase can accumulate dead skin cells, oils, and bacteria equivalent to what's found on a public toilet seat."
  },
  {
    tip: "Patch test new products on your inner arm for 24-48 hours before applying to your face to check for reactions.",
    fact: "Up to 45% of women report having sensitive skin, and many adverse reactions can be prevented with proper patch testing."
  },
  {
    tip: "Apply eye cream with your ring finger using a gentle patting motion to avoid pulling on the delicate skin.",
    fact: "The skin around your eyes is approximately 40% thinner than the rest of your facial skin and has very few oil glands."
  },
  {
    tip: "Incorporate antioxidants like vitamin C into your morning routine to help protect against environmental damage throughout the day.",
    fact: "Free radicals from pollution and UV exposure can cause up to 80% of visible skin aging."
  },
  {
    tip: "Use retinol products at night, as they can make your skin more sensitive to sunlight.",
    fact: "Retinol works by increasing cell turnover, which naturally happens more rapidly during sleep hours."
  },
  {
    tip: "Don't mix certain active ingredients like retinol and AHAs/BHAs in the same routine as they can irritate skin.",
    fact: "The optimal pH for retinol to work is 5.5-6, while AHAs and BHAs work best at a pH of 3-4, making them potentially incompatible."
  },
  {
    tip: "Stay hydrated! Drinking enough water helps maintain skin elasticity and a healthy glow.",
    fact: "Your skin is approximately 64% water, and proper hydration is essential for maintaining its structure and function."
  }
];

const SkincareTip = () => {
  const [isCardOpen, setIsCardOpen] = useState(false);
  const [isScratched, setIsScratched] = useState(false);
  const [currentTip, setCurrentTip] = useState(null);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const [scratchPercentage, setScratchPercentage] = useState(0);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Get today's date as a string (YYYY-MM-DD)
    const today = new Date().toISOString().split('T')[0];
    
    // Use the date string to generate a consistent index for the day
    const dateSum = today.split('-').reduce((sum, num) => sum + parseInt(num), 0);
    const tipIndex = dateSum % skincareTipsAndFacts.length;
    
    setCurrentTip(skincareTipsAndFacts[tipIndex]);
  }, []);

  useEffect(() => {
    if (isCardOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Set canvas dimensions
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      
      // Fill with gradient scratch-off layer
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#8c83ff');
      gradient.addColorStop(1, '#6c63ff');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add some texture/pattern to make it look like a scratch card
      for (let i = 0; i < 5000; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        ctx.fillStyle = '#9e97ff';
        ctx.fillRect(x, y, 2, 2);
      }
      
      // Add text to instruct user
      ctx.font = 'bold 20px Arial';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.fillText('Scratch here to reveal!', canvas.width / 2, canvas.height / 2);
      
      // Add smaller hint text
      ctx.font = '14px Arial';
      ctx.fillText('Just a little scratch will do!', canvas.width / 2, canvas.height / 2 + 30);
    }
  }, [isCardOpen]);
  
  // Add cleanup effect for sparkle canvas
  useEffect(() => {
    return () => {
      const sparkleCanvas = document.querySelector('.sparkle-canvas');
      if (sparkleCanvas && sparkleCanvas.parentNode) {
        sparkleCanvas.parentNode.removeChild(sparkleCanvas);
      }
    };
  }, []);

  const handleMouseDown = (e) => {
    setIsDrawing(true);
    const { offsetX, offsetY } = getCoordinates(e);
    setLastPosition({ x: offsetX, y: offsetY });
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
    setIsDrawing(true);
    const { offsetX, offsetY } = getCoordinates(e);
    setLastPosition({ x: offsetX, y: offsetY });
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = getCoordinates(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set composite operation to reveal what's underneath
    ctx.globalCompositeOperation = 'destination-out';
    
    // Draw a line from last position to current position
    ctx.beginPath();
    ctx.lineWidth = 40;
    ctx.lineCap = 'round';
    ctx.moveTo(lastPosition.x, lastPosition.y);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
    
    setLastPosition({ x: offsetX, y: offsetY });
    
    // Calculate percentage scratched
    calculateScratchPercentage();
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    if (!isDrawing) return;
    const { offsetX, offsetY } = getCoordinates(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.lineWidth = 40;
    ctx.lineCap = 'round';
    ctx.moveTo(lastPosition.x, lastPosition.y);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
    
    setLastPosition({ x: offsetX, y: offsetY });
    
    calculateScratchPercentage();
  };

  const getCoordinates = (e) => {
    if (e.type.includes('mouse')) {
      return { offsetX: e.nativeEvent.offsetX, offsetY: e.nativeEvent.offsetY };
    } else {
      const touch = e.touches[0];
      const rect = canvasRef.current.getBoundingClientRect();
      return { 
        offsetX: touch.clientX - rect.left, 
        offsetY: touch.clientY - rect.top 
      };
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleTouchEnd = () => {
    setIsDrawing(false);
  };

  const calculateScratchPercentage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixelData = imageData.data;
    
    let transparentPixels = 0;
    let totalPixels = pixelData.length / 4;
    
    for (let i = 3; i < pixelData.length; i += 4) {
      if (pixelData[i] === 0) {
        transparentPixels++;
      }
    }
    
    const percentage = (transparentPixels / totalPixels) * 100;
    setScratchPercentage(percentage);
    
    // Reveal fully after just 10-15% scratching
    if (percentage > 12 && !isScratched) {
      // Auto-reveal the entire card
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      setIsScratched(true);
      
      // Create sparkle animation effect
      createSparkleEffect();
    }
  };
  
  const createSparkleEffect = () => {
    // Create a separate canvas for the sparkles that overlays the scratch card
    const scratchCardContainer = document.querySelector('.scratch-card');
    if (!scratchCardContainer) return;
    
    const sparkleCanvas = document.createElement('canvas');
    sparkleCanvas.className = 'sparkle-canvas';
    sparkleCanvas.width = scratchCardContainer.offsetWidth;
    sparkleCanvas.height = scratchCardContainer.offsetHeight;
    sparkleCanvas.style.position = 'absolute';
    sparkleCanvas.style.top = '0';
    sparkleCanvas.style.left = '0';
    sparkleCanvas.style.pointerEvents = 'none';
    sparkleCanvas.style.zIndex = '10';
    scratchCardContainer.appendChild(sparkleCanvas);
    
    const ctx = sparkleCanvas.getContext('2d');
    const sparkles = [];
    
    // Brighter, more visible colors
    const colors = [
      '#ff80ab', // bright pink
      '#82b1ff', // bright blue
      '#b388ff', // bright purple
      '#ffab40', // bright orange
      '#80d8ff', // bright cyan
      '#ffd740', // bright yellow
      '#ea80fc', // bright magenta
      '#64ffda'  // bright teal
    ];
    
    // Create sparkles
    for (let i = 0; i < 60; i++) {
      sparkles.push({
        x: Math.random() * sparkleCanvas.width,
        y: Math.random() * sparkleCanvas.height,
        size: 5 + Math.random() * 15, // Larger size
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: 0.2 + Math.random() * 0.8,
        opacity: 0.3, // Higher starting opacity
        maxOpacity: 0.9 + Math.random() * 0.1, // Higher max opacity
        phase: Math.random() * Math.PI * 2,
        growing: true
      });
    }
    
    // Add a colorful radial glow
    const createGlow = () => {
      // Create multiple colorful glows
      const colors = [
        { color: 'rgba(255, 128, 171, 0.4)', x: sparkleCanvas.width * 0.3, y: sparkleCanvas.height * 0.3 },
        { color: 'rgba(130, 177, 255, 0.4)', x: sparkleCanvas.width * 0.7, y: sparkleCanvas.height * 0.4 },
        { color: 'rgba(179, 136, 255, 0.4)', x: sparkleCanvas.width * 0.5, y: sparkleCanvas.height * 0.6 },
        { color: 'rgba(255, 171, 64, 0.4)', x: sparkleCanvas.width * 0.2, y: sparkleCanvas.height * 0.7 }
      ];
      
      // Draw each glow
      colors.forEach(glow => {
        const gradient = ctx.createRadialGradient(
          glow.x, glow.y, 5, 
          glow.x, glow.y, sparkleCanvas.width * 0.4
        );
        
        gradient.addColorStop(0, glow.color);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, sparkleCanvas.width, sparkleCanvas.height);
      });
      
      // Add central white glow
      const centerGradient = ctx.createRadialGradient(
        sparkleCanvas.width / 2, 
        sparkleCanvas.height / 2, 
        10, 
        sparkleCanvas.width / 2, 
        sparkleCanvas.height / 2, 
        sparkleCanvas.width / 2
      );
      
      centerGradient.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
      centerGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
      centerGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.fillStyle = centerGradient;
      ctx.fillRect(0, 0, sparkleCanvas.width, sparkleCanvas.height);
    };
    
    // Animate sparkles
    let animationId;
    let frameCount = 0;
    const maxFrames = 120; // Animation will last about 2 seconds at 60fps
    
    const animateSparkles = () => {
      ctx.clearRect(0, 0, sparkleCanvas.width, sparkleCanvas.height);
      
      // Add soft glow background for shorter duration
      if (frameCount < 60) {
        createGlow();
      }
      
      sparkles.forEach(sparkle => {
        // Add stronger glow effect
        ctx.shadowBlur = 25;
        ctx.shadowColor = sparkle.color;
        
        ctx.globalAlpha = sparkle.opacity;
        
        // Draw a star shape
        const drawStar = (x, y, size) => {
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(sparkle.phase);
          
          ctx.beginPath();
          for (let i = 0; i < 5; i++) {
            const angle = (i * Math.PI * 2) / 5;
            const innerRadius = size * 0.4;
            const outerRadius = size;
            
            // Outer point
            const outerX = Math.cos(angle) * outerRadius;
            const outerY = Math.sin(angle) * outerRadius;
            
            // Inner point
            const innerAngle = angle + Math.PI / 5;
            const innerX = Math.cos(innerAngle) * innerRadius;
            const innerY = Math.sin(innerAngle) * innerRadius;
            
            if (i === 0) {
              ctx.moveTo(outerX, outerY);
            } else {
              ctx.lineTo(outerX, outerY);
            }
            
            ctx.lineTo(innerX, innerY);
          }
          
          ctx.closePath();
          ctx.fillStyle = sparkle.color;
          ctx.fill();
          ctx.restore();
        };
        
        // Draw sparkle
        drawStar(sparkle.x, sparkle.y, sparkle.size);
        
        // Reset shadow for performance
        ctx.shadowBlur = 0;
        
        // Animate opacity (fade in/out)
        if (sparkle.growing) {
          sparkle.opacity += 0.02;
          if (sparkle.opacity >= sparkle.maxOpacity) {
            sparkle.growing = false;
          }
        } else {
          sparkle.opacity -= 0.01;
        }
        
        // Rotate the sparkle
        sparkle.phase += 0.02;
        
        // Slight movement
        sparkle.x += Math.sin(frameCount * 0.05 + sparkle.phase) * sparkle.speed;
        sparkle.y += Math.cos(frameCount * 0.05 + sparkle.phase) * sparkle.speed;
      });
      
      frameCount++;
      
      // Stop animation after a certain time
      if (frameCount >= maxFrames) {
        cancelAnimationFrame(animationId);
        scratchCardContainer.removeChild(sparkleCanvas);
        // Show the content after animation completes
        setShowContent(true);
        return;
      }
      
      animationId = requestAnimationFrame(animateSparkles);
    };
    
    animateSparkles();
  };

  const openCard = () => {
    setIsCardOpen(true);
  };

  const closeCard = () => {
    // Remove any sparkle canvas before closing
    const sparkleCanvas = document.querySelector('.sparkle-canvas');
    if (sparkleCanvas && sparkleCanvas.parentNode) {
      sparkleCanvas.parentNode.removeChild(sparkleCanvas);
    }
    
    setIsCardOpen(false);
    setIsScratched(false);
    setScratchPercentage(0);
    setShowContent(false);
  };

  if (!currentTip) return null;

  return (
    <div className="skincare-tip-wrapper">
      {!isCardOpen ? (
        <div className="skincare-tip-box" onClick={openCard}>
          <div className="tip-icon">💡</div>
          <h3>Skincare Tip of the Day</h3>
          <p>Tip of the Day</p>
        </div>
      ) : (
        <div className="scratch-card-container">
          <div className="scratch-card">
            <div className="scratch-card-content">
              {!showContent && isScratched && (
                <div className="loading-container">
                  <div className="loading-text">Almost there...</div>
                  <div className="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}
              <h3 className={showContent ? 'visible' : 'hidden'}>Today's Skincare Wisdom</h3>
              <div className={`fact-section ${showContent ? 'visible' : 'hidden'}`}>
                <h4>Skincare Fact:</h4>
                <p>{currentTip.fact}</p>
              </div>
              <div className={`tip-section ${showContent ? 'visible' : 'hidden'}`}>
                <h4>Skincare Tip:</h4>
                <p>{currentTip.tip}</p>
              </div>
            </div>
            {!isScratched && (
              <canvas
                ref={canvasRef}
                className="scratch-surface"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              />
            )}
            <div className="scratch-progress">
              {!isScratched && `${Math.round(scratchPercentage)}% scratched`}
            </div>
            <button className="close-card-btn" onClick={closeCard}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkincareTip;