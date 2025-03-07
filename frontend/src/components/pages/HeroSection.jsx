import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const images = [
  { src: "/images/men shop.jpg", link: "/products/men", text: "Men's Collection" },
  { src: "/images/kids shop.jpg", link: "/products/kids", text: "Kids' Fashion" },
  { src: "/images/women shop.jpg", link: "/products/women", text: "Women's Wear" },
  { src: "/images/cycle shop.jpg", link: "/products/sports", text: "Cycle Accessories" },
];

export default function HeroSection() {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000); // Auto-slide every 4 seconds

    return () => clearInterval(interval);
  }, [index]);

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleTouch = (e) => {
    if (e.touches[0].clientX > window.innerWidth / 2) nextSlide();
    else prevSlide();
  };

  return (
    <section className="relative w-full h-[600px] overflow-hidden bg-gray-900 flex items-center justify-center">
      {/* Image Slider with motion.div */}
      <div className="relative w-full h-full">
        <AnimatePresence>
          <motion.div
            key={index}
            className="absolute w-full h-full"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "-100%" }}
            transition={{ duration: 0.8 }}
            onClick={() => navigate(images[index].link)}
            onTouchStart={handleTouch}
          >
            {/* Image */}
            <img
              src={images[index].src}
              alt="Product"
              className="w-full h-full object-cover cursor-pointer"
            />
            
            {/* Overlay with text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/50 backdrop-blur-sm">
              <h2 className="text-4xl font-bold mb-4">{images[index].text}</h2>
              <button
                onClick={() => navigate(images[index].link)}
                className="bg-green-600 hover:bg-green-500 transition px-6 py-2 rounded-full text-lg font-semibold"
              >
                Shop Now
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <button
        className="absolute left-4 bg-black/60 text-white p-3 rounded-full hover:bg-black/80 transition"
        onClick={prevSlide}
      >
        ◀
      </button>
      <button
        className="absolute right-4 bg-black/60 text-white p-3 rounded-full hover:bg-black/80 transition"
        onClick={nextSlide}
      >
        ▶
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 flex space-x-2">
        {images.map((_, i) => (
          <button
            key={i}
            className={`w-4 h-4 rounded-full transition ${
              i === index ? "bg-green-500 scale-110" : "bg-gray-500"
            }`}
            onClick={() => setIndex(i)}
          ></button>
        ))}
      </div>
    </section>
  );
}
