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
        if (!isActive) return;
  
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
  
    updateCarousel();
    checkSectionActive();
  
    window.addEventListener("beforeunload", function () {
      document.body.style.overflow = "auto";
    });
  });