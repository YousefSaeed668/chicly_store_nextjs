"use client";
import Image from "next/image";
import { useState } from "react";

const Gallery = ({ productMedia }: { productMedia: string[] }) => {
  const [mainImage, setMainImage] = useState(productMedia[0]);
  return (
    <div className="flex flex-col gap-3 max-w-[500px]">
      <Image
        src={mainImage}
        width={384}
        height={384}
        alt="product "
        className="w-96 h-96 rounded-lg shadow-xl object-cover"
      />
      <div className="flex gap-2 overflow-auto tailwind-scrollbar-hide">
        {productMedia.map((image, index) => (
          <Image
            key={index}
            src={image}
            width={80}
            height={80}
            alt="product"
            onClick={() => setMainImage(image)}
            className={`w-20 h-20 rounded-lg cursor-pointer object-cover transition-all  ${
              mainImage === image ? "border-2 border-black" : ""
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Gallery;
