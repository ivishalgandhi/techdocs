import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs">
            Browse Documentation
          </Link>
        </div>
      </div>
    </header>
  );
}

function TopicCategory({title, description, id, children}) {
  return (
    <section id={id} className="margin-top--xl margin-bottom--lg">
      <div className="container">
        <div className="row">
          <div className="col col--12">
            <Heading as="h2" className="margin-bottom--md">
              {title}
            </Heading>
            <p className="margin-bottom--lg">{description}</p>
          </div>
        </div>
        <div className="row">
          {children}
        </div>
      </div>
    </section>
  );
}

function TopicGrid({topics}) {
  return (
    <div className="topic-grid">
      {topics.map((topic, index) => (
        <TopicCard 
          key={index}
          title={topic.title}
          description={topic.description}
          to={topic.to}
          comingSoon={topic.comingSoon}
        />
      ))}
    </div>
  );
}

function TopicCard({title, description, to, comingSoon}) {
  return (
    <div className="topic-card" style={comingSoon ? {opacity: '0.7'} : {}}>
      <div className="topic-card__header">
        <h3>
          {title}
          {comingSoon && <span className="badge badge--secondary margin-left--sm">Coming Soon</span>}
        </h3>
      </div>
      <div className="topic-card__body">
        <p>{description}</p>
      </div>
      {!comingSoon && (
        <div className="topic-card__footer">
          <Link className="button button--primary button--sm" to={to}>Learn More</Link>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  const authTopics = [
    {
      title: 'OpenID Connect (OIDC)',
      description: 'Learn about the modern authentication layer built on top of OAuth 2.0.',
      to: '/docs/auth/oidc-deep-dive',
    },
    {
      title: 'SAML',
      description: 'Explore the XML-based open standard for exchanging authentication data.',
      to: '/docs/auth/saml-deep-dive',
    },
    {
      title: 'Kerberos',
      description: 'Network authentication protocol for secure identity verification.',
      to: '/docs/auth/kerberos-authentication',
    },
    {
      title: 'LDAP Authentication',
      description: 'Directory service protocol for authentication and user management.',
      to: '/docs/auth/ldap-authentication',
    },
    {
      title: 'Implementation Guide',
      description: 'Step-by-step instructions for implementing authentication.',
      to: '/docs/auth/implementation-tutorial',
    },
    {
      title: 'Protocol Comparison',
      description: 'Compare authentication protocols for your use case.',
      to: '/docs/auth/authentication-protocols-comparison',
    },
  ];

  const databaseTopics = [
    {
      title: 'SQL Fundamentals',
      description: 'Core concepts of relational databases and SQL.',
      comingSoon: true,
    },
    {
      title: 'PostgreSQL',
      description: 'Advanced PostgreSQL features and optimization.',
      comingSoon: true,
    },
    {
      title: 'NoSQL Databases',
      description: 'Document, key-value, and graph database solutions.',
      comingSoon: true,
    },
    {
      title: 'Database Design',
      description: 'Best practices for schema design and normalization.',
      comingSoon: true,
    },
  ];

  const cloudTopics = [
    {
      title: 'AWS',
      description: 'Amazon Web Services guides and implementation patterns.',
      comingSoon: true,
    },
    {
      title: 'Azure',
      description: 'Microsoft Azure services and architecture best practices.',
      comingSoon: true,
    },
    {
      title: 'Google Cloud',
      description: 'GCP platform tutorials and solution architecture.',
      comingSoon: true,
    },
    {
      title: 'Kubernetes',
      description: 'Container orchestration and management.',
      comingSoon: true,
    },
  ];

  const devopsTopics = [
    {
      title: 'CI/CD Pipelines',
      description: 'Continuous integration and delivery workflows.',
      comingSoon: true,
    },
    {
      title: 'Infrastructure as Code',
      description: 'Terraform, CloudFormation, and other IaC tools.',
      comingSoon: true,
    },
  ];

  return (
    <Layout
      title={siteConfig.title}
      description="Comprehensive technical documentation resource covering authentication, databases, cloud technologies and more">
      <HomepageHeader />
      
      <main>
        <div className="container margin-top--xl margin-bottom--lg">
          <div className="row">
            <div className="col col--8 col--offset-2">
              <Heading as="h2" className="margin-bottom--md text--center">
                Welcome to My Technical Learning Log
              </Heading>
              <p className="margin-bottom--lg">
                This is my daily technical learning log that I've open-sourced and shared with the world. 
                Here, I document various technical concepts, tools, and best practices I've learned along my journey.
                Feel free to explore the documentation, contribute, or use it for your own learning!
              </p>
            </div>
          </div>
        </div>
        
        <TopicCategory
          title="Authentication & Identity"
          description="Explore modern authentication protocols and identity management solutions."
          id="auth"
        >
          <div className="col col--12">
            <TopicGrid topics={authTopics} />
          </div>
        </TopicCategory>
      </main>
    </Layout>
  );
}
