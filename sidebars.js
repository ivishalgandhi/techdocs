// @ts-check

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docs: [
    {
      type: 'category',
      label: 'Authentication',
      items: [
        'auth/auth-index',
        'auth/modern-authentication-overview',
        'auth/oidc-deep-dive',
        'auth/saml-deep-dive',
        'auth/kerberos-authentication',
        'auth/ldap-authentication',
        'auth/postgres-auth-integration',
        'auth/authentication-protocols-comparison',
        'auth/implementation-tutorial',
        'auth/oauth2-guide'
      ],
    },
    {
      type: 'category',
      label: 'Programming Languages',
      items: [
        {
          type: 'category',
          label: 'Python',
          items: [
            'programming/python/name-main-explanation',
            'programming/python/monitoring-api-changes'
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Linux',
      items: [
        'linux/services-overview',
        'linux/networking-guide'
      ],
    },

    /* other categories */
  ],
};

module.exports = sidebars;
