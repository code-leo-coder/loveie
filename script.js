let highestZ = 1;

class Paper {
  holdingPaper = false;
  startX = 0;
  startY = 0;
  moveX = 0;
  moveY = 0;
  prevX = 0;
  prevY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  // Unified init function for both touch and mouse
  init(paper) {
    // Determine whether the device supports touch events
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Add the event listeners based on device type
    if (isTouchDevice) {
      this.addTouchEvents(paper);
    } else {
      this.addMouseEvents(paper);
    }
  }

  // Function for handling touch events (mobile)
  addTouchEvents(paper) {
    paper.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if (!this.rotating) {
        this.moveX = e.touches[0].clientX;
        this.moveY = e.touches[0].clientY;

        this.velX = this.moveX - this.prevX;
        this.velY = this.moveY - this.prevY;
      }

      const dirX = e.touches[0].clientX - this.startX;
      const dirY = e.touches[0].clientY - this.startY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;

      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = (180 * angle) / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;

      if (this.rotating) {
        this.rotation = degrees;
      }

      if (this.holdingPaper) {
        if (!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        this.prevX = this.moveX;
        this.prevY = this.moveY;

        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    });

    paper.addEventListener('touchstart', (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;

      paper.style.zIndex = highestZ;
      highestZ += 1;

      this.startX = e.touches[0].clientX;
      this.startY = e.touches[0].clientY;
      this.prevX = this.startX;
      this.prevY = this.startY;
    });

    paper.addEventListener('touchend', () => {
      this.holdingPaper = false;
      this.rotating = false;
    });

    // For two-finger rotation on touch devices
    paper.addEventListener('gesturestart', (e) => {
      e.preventDefault();
      this.rotating = true;
    });

    paper.addEventListener('gestureend', () => {
      this.rotating = false;
    });
  }

  // Function for handling mouse events (desktop)
  addMouseEvents(paper) {
    document.addEventListener('mousemove', (e) => {
      if (!this.rotating) {
        this.moveX = e.clientX;
        this.moveY = e.clientY;

        this.velX = this.moveX - this.prevX;
        this.velY = this.moveY - this.prevY;
      }

      const dirX = e.clientX - this.startX;
      const dirY = e.clientY - this.startY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;

      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = (180 * angle) / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;

      if (this.rotating) {
        this.rotation = degrees;
      }

      if (this.holdingPaper) {
        if (!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        this.prevX = this.moveX;
        this.prevY = this.moveY;

        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    });

    paper.addEventListener('mousedown', (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;

      paper.style.zIndex = highestZ;
      highestZ += 1;

      if (e.button === 0) {
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.prevX = this.startX;
        this.prevY = this.startY;
      }
      if (e.button === 2) {
        this.rotating = true;
      }
    });

    window.addEventListener('mouseup', () => {
      this.holdingPaper = false;
      this.rotating = false;
    });
  }
}

// Apply the unified functionality to all papers
const papers = Array.from(document.querySelectorAll('.paper'));
papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});
