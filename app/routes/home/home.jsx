import gamestackTexture2Large from '~/assets/gamestack-list-large.jpg';
import gamestackTexture2Placeholder from '~/assets/gamestack-list-placeholder.jpg';
import gamestackTexture2 from '~/assets/gamestack-list.jpg';
import gamestackTextureLarge from '~/assets/gamestack-login-large.jpg';
import gamestackTexturePlaceholder from '~/assets/gamestack-login-placeholder.jpg';
import gamestackTexture from '~/assets/gamestack-login.jpg';
import sliceTextureLarge from '~/assets/slice-app-large.jpg';
import sliceTexturePlaceholder from '~/assets/slice-app-placeholder.jpg';
import sliceTexture from '~/assets/slice-app.jpg';
import sprTextureLarge from '~/assets/spr-lesson-builder-dark-large.jpg';
import sprTexturePlaceholder from '~/assets/spr-lesson-builder-dark-placeholder.jpg';
import sprTexture from '~/assets/spr-lesson-builder-dark.jpg';
import { Footer } from '~/components/footer';
import { baseMeta } from '~/utils/meta';
import { Intro } from './intro';
import { Profile } from './profile';
import { ProjectSummary } from './project-summary';
import { useEffect, useRef, useState } from 'react';
import styles from './home.module.css';

// Prefetch draco decoder wasm
export const links = () => {
  return [
    {
      rel: 'prefetch',
      href: '/draco/draco_wasm_wrapper.js',
      as: 'script',
      type: 'text/javascript',
      importance: 'low',
    },
    {
      rel: 'prefetch',
      href: '/draco/draco_decoder.wasm',
      as: 'fetch',
      type: 'application/wasm',
      importance: 'low',
    },
  ];
};

export const meta = () => [
  { title: 'Mahdeen (Sameer) Khan | Data Scientist & Educator' },
  { name: 'description', content: 'Portfolio of Mahdeen Khan, an AI-driven financial analyst and EdTech researcher.' },
  { property: 'og:image', content: 'https://sameer-analytics.pages.dev/assets/social-image.png' },
  { property: 'twitter:image', content: 'https://sameer-analytics.pages.dev/assets/social-image.png' },
];

export const Home = () => {
  const [visibleSections, setVisibleSections] = useState([]);
  const [scrollIndicatorHidden, setScrollIndicatorHidden] = useState(false);
  const intro = useRef();
  const projectOne = useRef();
  const projectTwo = useRef();
  const projectThree = useRef();
  const educationRef = useRef();
  const details = useRef();

  useEffect(() => {
    const sections = [intro, projectOne, projectTwo, projectThree, educationRef, details];

    const sectionObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const section = entry.target;
            observer.unobserve(section);
            if (visibleSections.includes(section)) return;
            setVisibleSections(prevSections => [...prevSections, section]);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
    );

    const indicatorObserver = new IntersectionObserver(
      ([entry]) => {
        setScrollIndicatorHidden(!entry.isIntersecting);
      },
      { rootMargin: '-100% 0px 0px 0px' }
    );

    sections.forEach(section => {
      sectionObserver.observe(section.current);
    });

    indicatorObserver.observe(intro.current);

    return () => {
      sectionObserver.disconnect();
      indicatorObserver.disconnect();
    };
  }, [visibleSections]);

  return (
    <div className={styles.home}>
      <Intro
        id="intro"
        sectionRef={intro}
        scrollIndicatorHidden={scrollIndicatorHidden}
      />

      {/* Education Section */}
      <section id="education" ref={educationRef} className={`${styles.education} ${visibleSections.includes(educationRef.current) ? styles.visible : ''}`}>
        <h2>Education</h2>
        <div className={styles.educationItem}>
          <h3>Dartmouth College (M.Eng. in Computer Engineering) - Accepted</h3>
          <p>Focused on AI, data science, and system optimization.</p>
        </div>
        <div className={styles.educationItem}>
          <h3>Colby College (B.A. in Computer Science)</h3>
          <p>Graduated with a 3.92 Major GPA. Specialized in artificial intelligence and computational data analysis.</p>
        </div>
        <div className={styles.educationItem}>
          <h3>University of Oxford (Visiting Student Program)</h3>
          <p>Studied advanced AI models and ethical considerations in machine learning.</p>
        </div>
      </section>

      {/* Projects */}
      <ProjectSummary
        id="project-1"
        sectionRef={projectOne}
        visible={visibleSections.includes(projectOne.current)}
        index={1}
        title="Financial Analytics & Data Science"
        description="Using both machine learning and finance knowledge to optimize investment strategies and financial decision-making."
        buttonText="View Project"
        buttonLink="https://www.linkedin.com/in/mahdeen-sameer-khan-892739232/"
        model={{
          type: 'laptop',
          alt: 'AI-driven financial analytics dashboard',
          textures: [
            {
              srcSet: `${sprTexture} 1280w, ${sprTextureLarge} 2560w`,
              placeholder: sprTexturePlaceholder,
            },
          ],
        }}
      />

      <ProjectSummary
        id="project-2"
        alternate
        sectionRef={projectTwo}
        visible={visibleSections.includes(projectTwo.current)}
        index={2}
        title="Building Inclusive EdTech Platforms"
        description="Developing accessible learning solutions to bridge educational gaps for all students."
        buttonText="View Project"
        buttonLink="https://www.linkedin.com/in/mahdeen-sameer-khan-892739232/"
        model={{
          type: 'phone',
          alt: 'EdTech accessibility dashboard',
          textures: [
            {
              srcSet: `${gamestackTexture} 375w, ${gamestackTextureLarge} 750w`,
              placeholder: gamestackTexturePlaceholder,
            },
            {
              srcSet: `${gamestackTexture2} 375w, ${gamestackTexture2Large} 750w`,
              placeholder: gamestackTexture2Placeholder,
            },
          ],
        }}
      />

      <ProjectSummary
        id="project-3"
        sectionRef={projectThree}
        visible={visibleSections.includes(projectThree.current)}
        index={3}
        title="AI Research & Policy in Education"
        description="Exploring ethical AI applications in education and policymaking for better learning outcomes."
        buttonText="View Project"
        buttonLink="https://www.linkedin.com/in/mahdeen-sameer-khan-892739232/"
        model={{
          type: 'laptop',
          alt: 'AI research tools visualization',
          textures: [
            {
              srcSet: `${sliceTexture} 800w, ${sliceTextureLarge} 1920w`,
              placeholder: sliceTexturePlaceholder,
            },
          ],
        }}
      />

      <Profile
        sectionRef={details}
        visible={visibleSections.includes(details.current)}
        id="details"
      />
      <Footer />
    </div>
  );
};
