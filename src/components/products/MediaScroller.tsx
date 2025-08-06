import React from "react";
import { baseImageUrl } from "../../utils/production";

interface MediaScrollerProps {
  media?: (File | string)[];
  name: string;
  className?: string;
  width: number;
  height: number;
  bg: string
}

const MediaScroller: React.FC<MediaScrollerProps> = ({ media, name, className, width, height, bg }) => {
  if (!media || media.length === 0) {
    media = ["/media/products/food.jpg"];
  }

  return (
    <div
      id={`carousel-${name.replace(" ", "-")}`}
      className={`carousel slide ${className} pt-3`}
      data-bs-ride="carousel"
      style={{ width, height }}
    >
      {media && media.length > 1 && (
        <>
          <button
            className="carousel-control-prev"
            style={{height:35}}
            type="button"
            data-bs-target={`#carousel-${name.replace(" ", "-")}`}
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon bg-primary-light rounded-3 py-2" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            style={{height:35}}
            type="button"
            data-bs-target={`#carousel-${name.replace(" ", "-")}`}
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon bg-primary-light rounded-3 py-2" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </>
      )}

      <div className="carousel-inner" style={{ width, height }}>
        {media?.map((file, index) => {
          if (typeof file !== "string") return null;

          const fileUrl = baseImageUrl + file;
          const isVideo = file.toLowerCase().endsWith(".mp4") || file.toLowerCase().endsWith(".webm");

          return (
            <div key={index} className={`carousel-item bg-${bg}  ${index === 0 ? "active" : ""}`} style={{ width, height }}>
              <div
                className={`d-flex align-items-center justify-content-center w-100 h-100 bg-${bg}`}
                style={{ width, height, overflow: "hidden" }}
              >
                {isVideo ? (
                  <video
                    className="media-fit rounded-3"
                    controls
                  >
                    <source src={fileUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    className="media-fit rounded-3"
                    src={fileUrl}
                    alt={`${name} media ${index + 1}`}
                    loading="lazy"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default MediaScroller;
