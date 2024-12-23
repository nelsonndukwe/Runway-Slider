import { useRef, useState } from "react";
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
  const carouselRef = useRef(null);
  const rightCarousel = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const tl = gsap.timeline();
    tl.from("[data-top-items]", {
      x: 400,
      stagger: 0.4,
      duration: 1.5,
      ease: "power2.out",
    });
  }, []);

  // const handleClick = () => {
  //   const tl = gsap.timeline({ defaults: {} });
  //   tl.to("[data-image-items]", {
  //     y: -900,
  //     duration: 0.7,
  //     ease: "power3.out",
  //     stagger: 0.2,
  //   }).to("[data-top-items]", {
  //     x: 400,
  //     stagger: 0.4,
  //     duration: 0.5,
  //     ease: "power2.out",
  //   }, ">").to(overlayRef.current, {
  //     y: 0,
  //     opacity:1,
  //     autoAlpha: 1,
  //     display: "flex",
  //     duration: 0.7,
  //     ease: "power3.out",
  //   }, ">");
  // };

  const handleNavigation = (type: string) => {
    if (disableButtons) return;
    setDisableButtons(true);
    const list = carouselRef.current?.querySelector(".list");
    const items = list.querySelectorAll(".item");
    if (type === "next") {
      list.appendChild(items[0]);
      setNextAnimation("next");
      if (rightCarousel.current) {
        gsap.to(rightCarousel.current, {
          scrollTo: {
            y: rightCarousel.current.scrollTop + 350,
            autoKill: false,
          },
          ease: "power2.out",
          duration: 1.1,
        });
      }
    } else if (type === "prev") {
      list.prepend(items[items.length - 1]);
      setNextAnimation("prev");
      if (rightCarousel.current) {
        gsap.to(rightCarousel.current, {
          scrollTo: {
            y: rightCarousel.current.scrollTop - 350,
            autoKill: false,
          },
          ease: "power2.out",
          duration: 1.1,
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
              className={`list ${
                nextAnimation === "next"
                  ? "next"
                  : nextAnimation === "prev"
                  ? "prev"
                  : ""
              }`}
            >
              {allImages.map((image, index) => (
                <div
                  className="item"
                  key={index}
                  data-image-items
                  // onClick={handleClick}
                >
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
