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
  link,
  linkLabel,
  sliderImage,
  accent,
}) {
  return (
    <section id={id} className="story-section">
      <div
        className="story-bg"
        style={{
          backgroundImage: sliderImage ? `url(${sliderImage})` : undefined,
          background: sliderImage
            ? undefined
            : `linear-gradient(155deg, ${accent.base}, ${accent.soft})`,
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

          {tags?.length > 0 && (
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
            <div className="story-logo-frame">
              <img className="story-logo" src={logo} alt={title} />
            </div>
          )}

          {content?.map((p) => (
            <p className="story-text" key={p.substring(0, 24)}>
              {p}
            </p>
          ))}

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
