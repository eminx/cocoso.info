import React from "react";
import Reveal from "./Reveal";
import { getHSL, withAlpha } from "../config/palette";

function StorySection({
  id,
  index,
  title,
  tags,
  content,
  image,
  logo,
  logoDark,
  link,
  linkLabel,
  sliderImage,
  bgPosition,
  accent,
}) {
  return (
    <section id={id} className="story-section">
      <div
        className={`story-bg${bgPosition === "top" ? " story-bg--top" : ""}`}
        style={{
          ...(sliderImage
            ? { backgroundImage: `url(${sliderImage})` }
            : {
                background: `linear-gradient(155deg, ${accent.base}, ${accent.soft})`,
              }),
          "--accent": accent.base,
          "--accent-soft": accent.soft,
          "--accent-deep": accent.deep,
        }}
      />
      <div className="story-card-wrap">
        <Reveal className="story-card" style={{ "--accent": accent.base }}>
          <div
            className="story-index"
            style={{ "--accent-transparent": withAlpha(accent.base, "b3") }}
          >
            {String(index + 1).padStart(2, "0")}
          </div>
          <h2 className="story-title">{title}</h2>

          {tags && Array.isArray(tags) && tags.length > 0 && (
            <div className="tag-row">
              {tags.map((tag, tagIndex) => (
                <span
                  className="tag-chip"
                  key={tag}
                  style={{ background: getHSL(tags.length, tagIndex) }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {image && <img className="story-image" src={image} alt={title} />}

          {logo && (
            <div
              className={`story-logo-frame${logoDark ? " story-logo-frame--dark" : ""}`}
            >
              <img className="story-logo" src={logo} alt={title} />
            </div>
          )}

          {content && Array.isArray(content) && content.length > 0 && (
            <p className="story-text" key={content[0].substring(0, 24)}>
              {content[0]}
            </p>
          )}

          {link && (
            <a
              className="btn-thick story-link"
              href={link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {linkLabel}
            </a>
          )}
        </Reveal>
      </div>
    </section>
  );
}

export default StorySection;
