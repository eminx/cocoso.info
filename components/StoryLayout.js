import React from "react";
import Link from "next/link";

import TopNav from "./TopNav";
import StorySection from "./StorySection";
import Reveal from "./Reveal";
import Footer from "./Footer";
import { getAccent, getHSL } from "../config/palette";

function buildNavGroups(sections, groupLabels) {
  const groups = [];
  sections.forEach((s, absoluteIndex) => {
    let group = groups.find((g) => g.key === s.group);
    if (!group) {
      group = { key: s.group, label: groupLabels?.[s.group] || s.group, items: [] };
      groups.push(group);
    }
    group.items.push({ ...s, absoluteIndex });
  });
  return groups;
}

function StoryLayout({
  sections,
  heroTitle,
  heroLead,
  heroTags,
  heroCta,
  heroCtaSecondary,
  pageTitle,
  pageLead,
  groupLabels,
  afterSections,
}) {
  const hasGroups = sections.some((s) => s.group);
  const navGroups = hasGroups ? buildNavGroups(sections, groupLabels) : null;

  return (
    <>
      <TopNav />

      {heroTitle ? (
        <div className="hero">
          <div className="hero-blobs" />
          <div className="hero-inner">
            <img className="hero-logo" src="/cocoso-logo.png" alt="Cocoso" />
            <h1 className="hero-title">{heroTitle}</h1>
            {heroLead?.map((p) => (
              <p className="hero-lead" key={p.substring(0, 24)}>
                {p}
              </p>
            ))}
            {heroTags?.length > 0 && (
              <div className="tag-row">
                {heroTags.map((tag, tagIndex) => (
                  <span
                    className="tag-chip"
                    key={tag}
                    style={{ background: getHSL(heroTags.length, tagIndex) }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            {(heroCta || heroCtaSecondary) && (
              <div className="cta-row">
                {heroCta && (
                  <Link href={heroCta.href}>
                    <a className="btn-thick">{heroCta.label}</a>
                  </Link>
                )}
                {heroCtaSecondary && (
                  <Link href={heroCtaSecondary.href}>
                    <a className="btn-outline">{heroCtaSecondary.label}</a>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="features-header-band">
          <div className="features-header-blobs" />
          <div className="features-header-inner">
            <h1 className="hero-title" style={{ fontSize: "clamp(24px, 4vw, 34px)" }}>
              {pageTitle}
            </h1>
            {pageLead && <p className="hero-lead">{pageLead}</p>}
          </div>
        </div>
      )}

      {sections.length > 1 && (
        <Reveal className="quick-nav reveal-fade">
          {hasGroups
            ? navGroups.map((group) => (
                <div className="quick-nav-group" key={group.key}>
                  <p className="quick-nav-group-label">{group.label}</p>
                  <div className="quick-nav-row">
                    {group.items.map((s) => {
                      const accent = getAccent(s.absoluteIndex);
                      return (
                        <a
                          className="quick-nav-chip"
                          key={s.title}
                          href={`#${s.title}`}
                          style={{
                            background: accent.soft,
                            "--chip-accent": accent.base,
                          }}
                        >
                          {s.title}
                        </a>
                      );
                    })}
                  </div>
                </div>
              ))
            : sections.map((s, index) => {
                const accent = getAccent(index);
                return (
                  <a
                    className="quick-nav-chip"
                    key={s.title}
                    href={`#${s.title}`}
                    style={{ background: accent.soft, "--chip-accent": accent.base }}
                  >
                    {s.title}
                  </a>
                );
              })}
        </Reveal>
      )}

      {sections.map((s, index) => {
        const showDivider = hasGroups && s.group !== sections[index - 1]?.group;
        return (
          <React.Fragment key={s.title}>
            {showDivider && (
              <Reveal className="section-group-divider reveal-fade">
                <h3 className="section-group-divider-title">
                  {groupLabels?.[s.group] || s.group}
                </h3>
              </Reveal>
            )}
            <StorySection
              id={s.title}
              index={index}
              title={s.title}
              tags={s.tags}
              content={s.content}
              image={s.image}
              logo={s.logo}
              logoDark={s.logoDark}
              link={s.link}
              linkLabel={s.linkLabel}
              sliderImage={s.sliderImage}
              bgPosition={s.bgPosition}
              accent={getAccent(index)}
            />
          </React.Fragment>
        );
      })}

      {afterSections}

      <Footer />
    </>
  );
}

export default StoryLayout;
