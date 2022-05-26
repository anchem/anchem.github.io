import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: '站点主题',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        本站点以文档的形式，系统性地记录和整理了我所关注的几个领域的知识与实践，包括软件大师之路、个人成长、阿不成长树等。
      </>
    ),
  },
  {
    title: '我的项目',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        我还构建了几个项目，用于分享日常工作、生活总结的一些高效能的方法，希望能给你带来一些帮助。
      </>
    ),
  },
  {
    title: '随笔',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        你还可以通过我的随笔了解我平常的所思所想、所感所悟，在人生的旅途上不断修行。
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
