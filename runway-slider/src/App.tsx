import { useEffect, useRef, useState } from "react";
import { allImages, topImages } from "./images";
import "./index.css";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollToPlugin);
gsap.registerPlugin(useGSAP);

function App() {
  const [showDetail, setShowDetail] = useState(false);
  const [nextAnimation, setNextAnimation] = useState("idle");
  const [disableButtons, setDisableButtons] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const rightCarousel = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const target = 0;
  let current = 0;
  const ease = 0.075;

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.from("[data-top-items]", {
      x: 400,
      stagger: 0.4,
      duration: 1.5,
      ease: "back.out",
    }, "")
  }, []);

  let maxScroll: number;

  if (listRef.current) {
    maxScroll = listRef.current.offsetWidth - 1024;
  }

  function lerp(start: number, end: number, factor: number) {
    return start + (end - start) * factor;
  }

  function updateScaleAndPosition() {
    if (listRef.current) {
      const childrenDivs = Array.from(
        listRef.current.children
      ) as HTMLElement[];

      childrenDivs.forEach((slide) => {
        const rect = slide.getBoundingClientRect();
        const centerPosition = (rect.left + rect.right) / 2;
        const distanceFromCenter = centerPosition -  1024 / 2;

        let scale, offsetX;
        if (distanceFromCenter > 0) {
          scale = Math.min(2, 1 + distanceFromCenter /  1024);
          offsetX = (scale - 1) * 300;
        } else {
          scale = Math.max(0.8, 1 - Math.abs(distanceFromCenter) /  1024);
          offsetX = 0;
        }

        gsap.to(slide, {
          scale: scale,
          x: offsetX,
          ease: "back.out",
          duration: 1.5,
        });
      });
    }
  }

  function update() {
    current = lerp(current, target, ease);
    gsap.to(listRef.current, {
      x: -current,
      ease: "back.out",
      duration: 1.5,
    });
    updateScaleAndPosition();
    requestAnimationFrame(update);
  }

  window.addEventListener("resize", () => {
    if (listRef.current) {
      maxScroll = listRef.current.offsetWidth - 1024;
    }
  });

  useEffect(() => {
    update();
  }, []);

  const handleNavigation = (type: string) => {
    if (disableButtons) return;
    setDisableButtons(true);
    if (type === "next") {
      if (listRef.current) {
        gsap.to(listRef.current, {
          scrollTo: {
            x: listRef.current.scrollLeft + 150,
            autoKill: false,
          },
          ease: "back.out",
          duration: 1.6,
        });
      }

      setNextAnimation("next");
      if (rightCarousel.current) {
        gsap.to(rightCarousel.current, {
          scrollTo: {
            y: rightCarousel.current.scrollTop + 350,
            autoKill: false,
          },
          ease: "back.out",
          duration: 1.6,
        });
      }
    } else if (type === "prev") {
      if (listRef.current) {
        gsap.to(listRef.current, {
          scrollTo: {
            x: listRef.current.scrollLeft - 150,
            autoKill: false,
          },
          ease: "back.out",
          duration: 1.6,
        });
      }
      setNextAnimation("prev");
      if (rightCarousel.current) {
        gsap.to(rightCarousel.current, {
          scrollTo: {
            y: rightCarousel.current.scrollTop - 350,
            autoKill: false,
          },
          ease: "back.out",
          duration: 1.6,
        });
      }
    }

    setTimeout(() => {
      setDisableButtons(false);
    }, 300);
  };

  return (
    <>
      <div>
        <header>
          <div className="logo">Nelson Ndukwe</div>
          <nav>
            <a href="#home">Home</a>
            <a href="#info">Info</a>
            <a href="#contact">Contact</a>
          </nav>
        </header>

        <div className="container">
          <div
            className={`carousel ${
              nextAnimation === "next"
                ? "next"
                : nextAnimation === "prev"
                ? "prev"
                : ""
            }`}
            ref={carouselRef}
          >
            <div
              className={`list  ${
                nextAnimation === "next"
                  ? "next"
                  : nextAnimation === "prev"
                  ? "prev"
                  : ""
              }`}
              ref={listRef}
            >
              {allImages.map((image, index) => (
                <div className="item" key={index} data-image-items>
                  <img src={image} alt={`image-${index}`} />
                </div>
              ))}
            </div>

            <div className="arrows">
              <button
                id="prev"
                disabled={disableButtons}
                onClick={() => handleNavigation("prev")}
              >
                {"<"}
              </button>
              <button
                id="next"
                disabled={disableButtons}
                onClick={() => handleNavigation("next")}
              >
                {">"}
              </button>
              <button
                id="back"
                onClick={() => setShowDetail(false)}
                style={{ display: showDetail ? "block" : "none" }}
              >
                See All &#8599;
              </button>
            </div>
          </div>
          <div ref={rightCarousel} className="top-container">
            <div className="top-item-container">
              {topImages.map((image, index) => (
                <div className="top-item" key={index} data-top-items>
                  <img src={image} alt={`image-${index}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div
        ref={overlayRef}
        className="overlay"
        style={{
          background: "red",
          inset: 0,
          opacity: 0,
          display: "none",
          position: "absolute",
          transform: "translateY(100%)",
        }}
      >
        <div className="">Hello</div>
      </div>
    </>
  );
}

export default App;
