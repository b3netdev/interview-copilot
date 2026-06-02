document.addEventListener("DOMContentLoaded", function () {
    const section = document.getElementById("mobile3dCarousel");
    const activePhoneImage = document.getElementById("activePhoneImage");
    const carouselTitle = document.getElementById("carouselTitle");
  
    const sideSlides = [
      document.querySelector(".side-slide-1 img"),
      document.querySelector(".side-slide-2 img"),
      document.querySelector(".side-slide-3 img"),
      document.querySelector(".side-slide-4 img"),
    ];
  
    const slides = [
      {
        img: "/images/mobile-apps-1.png",
        title: "Mock Interview",
      },
      {
        img: "/images/mobile-apps-2.png",
        title: "View Answers",
      },
      {
        img: "/images/mobile-apps-3.png",
        title: "AI Interview Copilot",
      },
      {
        img: "/images/mobile-apps-4.png",
        title: "Skills",
      },
      {
        img: "/images/mobile-apps-5.png",
        title: "Profile",
      },
      {
        img: "/images/mobile-apps-6.png",
        title: "Question Practice",
      },
      {
        img: "/images/mobile-apps-7.png",
        title: "Performance Result",
      },
      {
        img: "/images/mobile-apps-8.png",
        title: "Interview Preparation",
      },
    ];
  
    let currentIndex = 2;
    let isActive = false;
    let isLocked = false;
    let lastScrollY = window.scrollY;
    let isMobile = window.innerWidth <= 1024; // Check if mobile or tablet
    
    // Touch swipe variables
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;
  
    function getIndex(index) {
      if (index < 0) return slides.length - 1;
      if (index >= slides.length) return 0;
      return index;
    }
  
    function updateCarousel() {
      activePhoneImage.src = slides[currentIndex].img;
      carouselTitle.textContent = slides[currentIndex].title;
  
      sideSlides[0].src = slides[getIndex(currentIndex - 2)].img;
      sideSlides[1].src = slides[getIndex(currentIndex - 1)].img;
      sideSlides[2].src = slides[getIndex(currentIndex + 1)].img;
      sideSlides[3].src = slides[getIndex(currentIndex + 2)].img;
    }
  
    function checkSectionActive() {
      // Skip scroll-lock on mobile/tablet devices
      if (isMobile) {
        isActive = false;
        document.body.style.overflow = "auto";
        return;
      }
      
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
  
      const shouldBeActive =
        rect.top <= 80 && rect.bottom >= viewportHeight - 80;
  
      isActive = shouldBeActive;
  
      if (isActive) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
  
      lastScrollY = window.scrollY;
    }
  
    function releaseScroll(direction) {
      document.body.style.overflow = "auto";
      isActive = false;
  
      window.scrollBy({
        top: direction === "down" ? window.innerHeight : -window.innerHeight,
        behavior: "smooth",
      });
    }
  
    function nextSlide() {
      if (currentIndex < slides.length - 1) {
        currentIndex++;
        updateCarousel();
      } else {
        releaseScroll("down");
      }
    }
  
    function prevSlide() {
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      } else {
        releaseScroll("up");
      }
    }
  
    window.addEventListener("scroll", function () {
      checkSectionActive();
    });
  
    window.addEventListener(
      "wheel",
      function (e) {
        // Disable wheel scroll behavior on mobile/tablet
        if (isMobile || !isActive) return;
  
        e.preventDefault();
  
        if (isLocked) return;
  
        isLocked = true;
  
        if (e.deltaY > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
  
        setTimeout(function () {
          isLocked = false;
        }, 650);
      },
      { passive: false }
    );
  
    // Touch swipe handling for mobile/tablet
    function handleTouchStart(e) {
      if (!isMobile) return;
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }
  
    function handleTouchEnd(e) {
      if (!isMobile) return;
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      handleSwipe();
    }
  
    function handleSwipe() {
      const swipeThreshold = 50;
      const horizontalDiff = touchEndX - touchStartX;
      const verticalDiff = Math.abs(touchEndY - touchStartY);
      
      // Only process horizontal swipes (ignore vertical scrolling)
      if (verticalDiff > 100) return;
      
      if (Math.abs(horizontalDiff) > swipeThreshold) {
        if (horizontalDiff > 0) {
          // Swipe right - go to previous slide
          if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
          }
        } else {
          // Swipe left - go to next slide
          if (currentIndex < slides.length - 1) {
            currentIndex++;
            updateCarousel();
          }
        }
      }
    }
  
    // Add touch event listeners to carousel section
    if (section) {
      section.addEventListener('touchstart', handleTouchStart, false);
      section.addEventListener('touchend', handleTouchEnd, false);
    }
  
    // Handle window resize
    window.addEventListener("resize", function() {
      const wasMobile = isMobile;
      isMobile = window.innerWidth <= 1024;
      
      if (wasMobile !== isMobile) {
        if (isMobile) {
          document.body.style.overflow = "auto";
          isActive = false;
        }
      }
    });
  
    updateCarousel();
    checkSectionActive();
  
    window.addEventListener("beforeunload", function () {
      document.body.style.overflow = "auto";
    });
  });