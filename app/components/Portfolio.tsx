"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { Arrow } from "./Arrow";
import { CodeSnippet } from "./CodeSnippet";
import { HeroBackdrop } from "./HeroBackdrop";
import { HeroTitle } from "./HeroTitle";
import { HolographicTiltCard } from "./HolographicTiltCard";
import { MobileNav } from "./MobileNav";
import { PointerFx } from "./PointerFx";
import { ProjectLab } from "./project-lab/ProjectLab";
import { copy, languageSwitch, type Lang } from "../copy";
import { projectCatalog } from "../projectCatalog";
import { archiveTracks, codeStudies, renderingRepo } from "../renderingCatalog";
import { rememberLang, useLanguageRouting } from "../useLang";

const archiveTrackLinks = ["#visual-vfx", "#rendering-code", "#learning-archive"];

const projectHighlightAccents = [
  { name: "skill", color: "#7c6cff" },
  { name: "shield", color: "#63e6ff" },
  { name: "beam", color: "#4ca6ff" },
  { name: "fire", color: "#ff7b9d" },
] as const;

export function Portfolio({ lang }: { lang: Lang }) {
  const text = copy[lang];
  const switcher = languageSwitch[lang];
  useLanguageRouting(lang);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const labProjects = text.projects.map((project, index) => ({
    ...projectCatalog[index],
    title: project.title,
    description: project.description,
    tags: project.tags,
    logic: project.logic,
    promise: text.highlights[index].promise,
    metric: text.highlights[index].metric,
    metricLabel: text.highlights[index].metricLabel,
    accentName: projectHighlightAccents[index].name,
    accentColor: projectHighlightAccents[index].color,
  }));

  const activateProject = (index: number) => {
    setActiveProjectIndex(index);
    requestAnimationFrame(() => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      document.getElementById("project-lab")?.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
      });
    });
  };

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement;

    const onPointerMove = (event: PointerEvent) => {
      if (reduceMotion) return;
      root.style.setProperty("--mx", `${(event.clientX / window.innerWidth - 0.5) * 2}`);
      root.style.setProperty("--my", `${(event.clientY / window.innerHeight - 0.5) * 2}`);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      },
      { threshold: 0.12 },
    );

    document.querySelectorAll<HTMLElement>("[data-reveal], [data-section-reveal]").forEach((element, index) => {
      element.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 70}ms`);
      observer.observe(element);
    });
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return (
    <main className="site">
      <a className="skip-link" href="#profile">{text.skipToContent}</a>
      {/* Driven entirely by `animation-timeline: scroll()`; hidden where that
          is unsupported, so it needs no JS and no fallback. */}
      <div className="scroll-progress" aria-hidden="true" />
      <PointerFx />
      <nav className="topbar" aria-label={text.navAria}>
        <div className="nav-center">
          <a href="#profile">{text.nav[0]}</a>
          <a href="#work">{text.nav[1]}</a>
          <details className="archive-menu">
            <summary>{text.archiveMenu} <span aria-hidden="true">⌄</span></summary>
            <div className="archive-mega">
              <div className="archive-mega-intro">
                <small>{text.archive.meta}</small>
                <strong>{text.archive.title}</strong>
                <p>{text.archive.body}</p>
                <a href="#learning-archive">{text.archive.link}</a>
              </div>
              <div className="archive-mega-column">
                <small>{text.archive.activeLabel}</small>
                {text.archive.active.map(([label, meta], index) => (
                  <a href={archiveTrackLinks[index]} key={label}>
                    <span>0{index + 1}</span><strong>{label}</strong><b>{meta}</b>
                  </a>
                ))}
              </div>
              <div className="archive-mega-column archive-mega-future">
                <small>{text.archive.nextLabel}</small>
                {text.archive.next.map(([label, meta], index) => (
                  <div key={label}><span>0{index + 4}</span><strong>{label}</strong><b>{meta}</b></div>
                ))}
              </div>
            </div>
          </details>
          <a href="#contact">{text.nav[2]}</a>
          {/* A real link, not a button: the other language now lives at its own
              URL, so this is what lets a crawler reach it. */}
          <a
            className="lang-switch"
            href={switcher.href}
            hrefLang={switcher.to}
            onClick={() => rememberLang(switcher.to)}
            aria-label={switcher.aria}
          >
            {switcher.label}
          </a>
        </div>
      </nav>

      <section className="hero" id="top">
        <div className="sky-scene" aria-hidden="true">
          <div className="sky-aurora sky-aurora-one" />
          <div className="sky-aurora sky-aurora-two" />
          <div className="star-field" />
          <HeroBackdrop />
          <div className="stellar-cloud stellar-cloud-one" />
          <div className="stellar-cloud stellar-cloud-two" />
          <div className="horizon-grid" />
        </div>

        <div className="hero-content shell">
          <div className="availability">
            <span className="pulse" />
            {text.available}
          </div>

          <div className="hero-title-wrap">
            <p className="hero-index">{text.heroIndex}</p>
            <HeroTitle text="SMARTRICK" />
            <div className="hero-role-row">
              <span>{text.role}</span>
              <span className="role-line" />
              <span>{text.heroDiscipline}</span>
            </div>
          </div>

          <div className="hero-bottom">
            <div className="hero-copy">
              <p>{text.intro}</p>
              <small>{text.introNote}</small>
            </div>
            <a className="primary-cta" href="#work" data-magnetic>
              <span>{text.viewWork}</span>
              <b aria-hidden="true"><Arrow direction="down-right" /></b>
            </a>
          </div>
        </div>

      </section>

      <section className="focus-strip" aria-label={text.focusLabel}>
        <div className="focus-track">
          <span className="focus-label">{text.focusLabel}</span>
          {text.focus.map((item, index) => (
            <div className="focus-item" key={item}>
              <b>0{index + 1}</b>
              <span>{item}</span>
              <i>✦</i>
            </div>
          ))}
        </div>
      </section>

      <section className="profile section shell" id="profile">
        <div className="section-heading" data-reveal>
          <p>{text.profileEyebrow}</p>
          <span>{text.sectionLabels.about}</span>
        </div>
        <div className="profile-grid">
          <figure className="profile-portrait portrait-photo" data-reveal>
            <img
              src="/profile/smartrick-portrait.jpg"
              alt={text.portraitAlt}
              width={800}
              height={1422}
              decoding="async"
              fetchPriority="low"
              loading="lazy"
            />
            <figcaption>
              <span>SMARTRICK / 2026</span>
              <small>{text.portraitRole}</small>
            </figcaption>
          </figure>
          <div className="profile-copy" data-reveal>
            <h2>{text.profileTitle}</h2>
            <p>{text.profileBody}</p>
            <div className="profile-status">
              <div>
                <small>{text.statusTitle}</small>
                <p>{text.statusBody}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="skill-matrix" data-reveal>
          {text.focus.map((item, index) => (
            <div className="skill-row" key={item}>
              <span>0{index + 1}</span>
              <strong>{item}</strong>
              <div className="skill-line"><i style={{ width: `${42 + index * 11}%` }} /></div>
              <small>{text.statusLabels[index % 3]}</small>
            </div>
          ))}
        </div>
      </section>

      <section className="work section" id="work">
        <div className="shell">
          <div className="section-heading section-heading-light" data-reveal>
            <p>{text.workEyebrow}</p>
            <span>{text.sectionLabels.work}</span>
          </div>
          <div className="work-intro" data-reveal>
            <h2>{text.workTitle}</h2>
            <p>{text.workBody}</p>
          </div>
          <section className="project-highlights" aria-labelledby="project-highlights-title" data-reveal>
            <header className="highlights-heading">
              <div>
                <p>{text.highlightsEyebrow}</p>
                <h3 id="project-highlights-title">{text.highlightsTitle}</h3>
              </div>
              <span>{text.highlightsHint}</span>
            </header>
            <div className="highlight-scroll">
              {text.projects.map((project, index) => {
                const assets = projectCatalog[index];
                const highlight = text.highlights[index];
                const accent = projectHighlightAccents[index];
                return (
                  <HolographicTiltCard
                    href="#project-lab"
                    accent={accent.color}
                    accentName={accent.name}
                    key={assets.id}
                    onClick={(event) => {
                      event.preventDefault();
                      activateProject(index);
                    }}
                  >
                    <img
                      src={assets.gallery[0]?.src}
                      srcSet={assets.gallery[0]?.srcSet}
                      sizes="(max-width: 680px) 92vw, 340px"
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="highlight-shade" aria-hidden="true" />
                    <div className="highlight-topline">
                      <span>0{index + 1}</span>
                      <span>{highlight.cardTag}</span>
                    </div>
                    <div className="highlight-copy">
                      <p>{project.title}</p>
                      <h4>{highlight.promise}</h4>
                    </div>
                    <div className="highlight-proof">
                      <strong>{highlight.metric}</strong>
                      <span>{highlight.metricLabel}</span>
                    </div>
                    <b aria-hidden="true"><Arrow direction="down-right" /></b>
                  </HolographicTiltCard>
                );
              })}
            </div>
          </section>
          <nav className="work-track-nav" aria-label={text.workTrackNavAria} data-reveal>
            <a href="#visual-vfx">
              <span>01</span>
              <strong>{text.workTracks[0]}</strong>
              <small>{text.trackNavMeta[0]}</small>
            </a>
            <a href="#rendering-code">
              <span>02</span>
              <strong>{text.workTracks[1]}</strong>
              <small>{text.trackNavMeta[1]}</small>
            </a>
          </nav>
          <div className="track-heading" id="visual-vfx" data-reveal>
            <p>{text.trackHeading}</p>
            <div>
              <h3>{text.visualTrack}</h3>
              <span>{text.visualTrackBody}</span>
            </div>
          </div>
          <ProjectLab
            lang={lang}
            projects={labProjects}
            activeProjectIndex={activeProjectIndex}
            onProjectChange={setActiveProjectIndex}
          />

          <section className="rendering-lab" id="rendering-code" data-section-reveal>
            <div className="section-divider" aria-hidden="true" />
            <header className="rendering-lab-header" data-reveal>
              <div>
                <p>{text.codeTrackLabel} / {text.codeEyebrow}</p>
                <h2>{text.codeTitle}</h2>
              </div>
              <div>
                <p>{text.codeBody}</p>
                <span>{text.codeLearningNote}</span>
                <a href={renderingRepo} target="_blank" rel="noreferrer">
                  {text.viewRepo} <Arrow direction="up-right" />
                </a>
              </div>
            </header>

            <div className="code-study-list">
              {codeStudies.map((study, index) => (
                <article
                  className="code-study"
                  id={study.id}
                  key={study.id}
                  style={{ "--i": index } as CSSProperties}
                  data-section-reveal
                >
                  <div className="section-divider" aria-hidden="true" />
                  <header className="code-study-header" data-reveal>
                    <span>0{index + 1}</span>
                    <div>
                      <p>{study.category[lang]}</p>
                      <h3>{study.title[lang]}</h3>
                    </div>
                    <p>{study.description[lang]}</p>
                  </header>

                  {study.comparison ? (
                    <figure className="code-comparison" data-reveal>
                      <div className="comparison-frame">
                        <img src={study.comparison.before.src} alt={study.comparison.before.alt[lang]} loading="lazy" decoding="async" />
                        <span>{study.comparison.before.label[lang]}</span>
                      </div>
                      <div className="comparison-frame">
                        <img src={study.comparison.after.src} alt={study.comparison.after.alt[lang]} loading="lazy" decoding="async" />
                        <span>{study.comparison.after.label[lang]}</span>
                      </div>
                      <figcaption>
                        <p>{study.mediaNote[lang]}</p>
                      </figcaption>
                    </figure>
                  ) : (
                    <figure className="code-media" data-reveal>
                      <img src={study.media.src} alt={study.media.alt[lang]} loading="lazy" decoding="async" />
                      <figcaption>
                        <p>{study.mediaNote[lang]}</p>
                      </figcaption>
                    </figure>
                  )}

                  {/* Four studies at ~1400px each made this section half the
                      page. The result image and the headline stay visible;
                      the implementation is one click away and still in the
                      DOM, so it is scannable and still indexed. */}
                  <details className="code-study-fold">
                    <summary>
                      <span>{text.showImplementation}</span>
                      <b aria-hidden="true">+</b>
                    </summary>
                  <div className="code-study-details">
                    <section className="code-flow" data-reveal>
                      <div className="code-block-label">
                        <span>{text.flowLabel}</span>
                      </div>
                      <ol>
                        {study.flow.map((step, stepIndex) => (
                          <li key={stepIndex}>
                            <span>{String(stepIndex + 1).padStart(2, "0")}</span>
                            <p>{step[lang]}</p>
                          </li>
                        ))}
                      </ol>
                    </section>

                    <section className="code-snippet" data-reveal>
                      <div className="code-block-label">
                        <span>{text.snippetLabel}</span>
                      </div>
                      <pre><CodeSnippet source={study.snippet} /></pre>
                    </section>

                    <section className="code-sources" data-reveal>
                      <div className="code-block-label">
                        <span>{text.viewCode}</span>
                      </div>
                      <div className="source-links">
                        {study.files.map((file) => (
                          <a href={file.url} target="_blank" rel="noreferrer" key={file.url}>
                            <span>{file.kind}</span>
                            <strong>{file.name}</strong>
                            <b><Arrow direction="up-right" /></b>
                          </a>
                        ))}
                      </div>
                    </section>
                  </div>

                  <div className="project-tags code-tags" data-reveal>
                    {study.tags.map((tag) => <span key={tag}>{tag}</span>)}
                  </div>
                  </details>
                </article>
              ))}
            </div>

            <section className="learning-archive" id="learning-archive" data-reveal data-section-reveal>
              <div className="section-divider" aria-hidden="true" />
              <header>
                <p>{text.archiveEyebrow}</p>
                <h3>{text.archiveTitle}</h3>
                <span>{text.archiveBody}</span>
              </header>
              <div className="archive-tracks">
                {archiveTracks.map((track, index) => (
                  <details key={index} open={index === 0}>
                    <summary>
                      <span>0{index + 1}</span>
                      <div>
                        <strong>{track.title[lang]}</strong>
                        <small>{track.subtitle[lang]}</small>
                      </div>
                      <b aria-hidden="true">+</b>
                    </summary>
                    <div className="archive-chapters">
                      {track.chapters.map((chapter) => (
                        <a href={chapter.url} target="_blank" rel="noreferrer" key={chapter.url}>
                          <div>
                            <strong>{chapter.name[lang]}</strong>
                            <p>{chapter.topics[lang]}</p>
                          </div>
                          <span>{text.openChapter} <Arrow direction="up-right" /></span>
                        </a>
                      ))}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          </section>
        </div>
      </section>

      <section className="contact section" id="contact">
        <div className="contact-glow" aria-hidden="true" />
        <div className="shell">
          <div className="section-heading section-heading-light" data-reveal>
            <p>{text.contactEyebrow}</p>
            <span>{text.sectionLabels.contact}</span>
          </div>
          <div className="contact-content" data-reveal>
            <p>{text.contactBody}</p>
            <h2>{text.contactTitle}</h2>
          </div>
          <div className="contact-links" data-reveal>
            <a href="mailto:ke4773613@gmail.com">
              <small>{text.contactCards[0][0]}</small>
              <strong>{text.contactCards[0][1]}</strong>
              <span>{text.contactCards[0][2]}</span>
              <b><Arrow direction="up-right" /></b>
            </a>
            <a href="https://github.com/smartrick125" target="_blank" rel="noreferrer">
              <small>{text.contactCards[1][0]}</small>
              <strong>{text.contactCards[1][1]}</strong>
              <span>{text.contactCards[1][2]}</span>
              <b><Arrow direction="up-right" /></b>
            </a>
            <span className="social-placeholder">
              <small>{text.contactCards[2][0]}</small>
              <strong>{text.contactCards[2][1]}</strong>
              <span>{text.contactCards[2][2]}</span>
              <b>—</b>
            </span>
            <span>
              <small>{text.contactCards[3][0]}</small>
              <strong>{text.contactCards[3][1]}</strong>
              <span>{text.contactCards[3][2]}</span>
              <b>—</b>
            </span>
          </div>
        </div>
      </section>

      <MobileNav lang={lang} />

      <footer className="footer shell">
        <span>© 2026 SMARTRICK</span>
        <span>{text.footer}</span>
        <span>{text.stage}</span>
        <a href="#top">{text.backToTop} <Arrow direction="up" /></a>
      </footer>
    </main>
  );
}
