import React from 'react';
import clsx from 'clsx';
import styles from './RobotSpecs.module.css';

const RobotSpecList = [
  {
    title: 'Humanoid Robot A',
    imageUrl: 'img/robot-placeholder.png', // will need to add actual image
    specs: [
      {name: 'Height', value: '1.5m'},
      {name: 'Weight', value: '50kg'},
      {name: 'DOF', value: '24'},
      {name: 'Battery Life', value: '4 hours'},
    ],
  },
  {
    title: 'Humanoid Robot B',
    imageUrl: 'img/robot-placeholder2.png', // will need to add actual image
    specs: [
      {name: 'Height', value: '1.7m'},
      {name: 'Weight', value: '70kg'},
      {name: 'DOF', value: '32'},
      {name: 'Battery Life', value: '6 hours'},
    ],
  },
];

function RobotSpec({imageUrl, title, specs}) {
  return (
    <div className={clsx('col col--6')}>
      <div className="text--center">
        <div className={styles.robotSpecImage}>
          {imageUrl ? (
            <img src={imageUrl} alt={title} className={styles.robotSpecImg} />
          ) : (
            <div className={styles.robotSpecPlaceholder}>[Robot Image]</div>
          )}
        </div>
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <ul className={styles.robotSpecList}>
          {specs.map((spec, index) => (
            <li key={index}>
              <strong>{spec.name}:</strong> {spec.value}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function RobotSpecs() {
  return (
    <section className={styles.robotSpecs}>
      <div className="container">
        <div className="row">
          {RobotSpecList.map((props, idx) => (
            <RobotSpec key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}