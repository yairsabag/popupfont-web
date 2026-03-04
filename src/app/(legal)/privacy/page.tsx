export default function PrivacyPolicy() {
  return (
    <>
      <h1>Privacy Policy</h1>
      <p className="legal-updated">Last updated: March 4, 2026</p>

      <h2>1. Introduction</h2>
      <p>
        FontDrop (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates the fontdrop.app website and the FontDrop
        desktop application (together, the &quot;Service&quot;). This Privacy Policy explains how we collect,
        use, and protect your information when you use our Service.
      </p>

      <h2>2. Information We Collect</h2>
      <h3>Account Information</h3>
      <p>
        When you create an account, we collect your email address and a password (stored securely via hashing).
        This information is necessary to manage your license and provide access to the Service.
      </p>
      <h3>License & Device Data</h3>
      <p>
        We store a unique device identifier (derived from your hardware) to enforce per-device licensing.
        We do not collect your computer name, IP address for tracking, or any other hardware details beyond
        the anonymized device ID.
      </p>
      <h3>Images You Process</h3>
      <p>
        When you use FontDrop to identify fonts, your images are sent to third-party AI services (OpenAI)
        for analysis. We do not store your images on our servers. Images are transmitted solely for the
        purpose of font recognition and are not retained after processing.
      </p>
      <h3>Usage Analytics</h3>
      <p>
        We may collect anonymous usage statistics such as feature usage frequency and error reports
        to improve the Service. This data cannot be used to identify individual users.
      </p>

      <h2>3. How We Use Your Information</h2>
      <p>We use the information we collect to:</p>
      <ul>
        <li>Provide, maintain, and improve the Service</li>
        <li>Manage your account and license</li>
        <li>Process font identification requests</li>
        <li>Send important service-related communications</li>
        <li>Prevent fraud and enforce our terms</li>
      </ul>

      <h2>4. Third-Party Services</h2>
      <p>We use the following third-party services:</p>
      <ul>
        <li><strong>Appwrite</strong> — for authentication and database (account data)</li>
        <li><strong>OpenAI</strong> — for AI-powered font recognition (image processing)</li>
        <li><strong>Lemon Squeezy</strong> — for payment processing (billing data)</li>
        <li><strong>Vercel</strong> — for website hosting</li>
      </ul>
      <p>
        Each third-party service has its own privacy policy. We encourage you to review their policies.
        We do not sell or share your personal data with third parties for marketing purposes.
      </p>

      <h2>5. Data Retention</h2>
      <p>
        We retain your account information for as long as your account is active. If you cancel your
        subscription and request account deletion, we will delete your personal data within 30 days,
        except where retention is required by law.
      </p>

      <h2>6. Data Security</h2>
      <p>
        We implement industry-standard security measures including encrypted connections (HTTPS/TLS),
        secure password hashing, and access controls to protect your data. However, no method of
        electronic transmission is 100% secure.
      </p>

      <h2>7. Your Rights</h2>
      <p>You have the right to:</p>
      <ul>
        <li>Access the personal data we hold about you</li>
        <li>Request correction of inaccurate data</li>
        <li>Request deletion of your account and data</li>
        <li>Export your data in a portable format</li>
      </ul>
      <p>To exercise any of these rights, contact us at <a href="mailto:support@fontdrop.app">support@fontdrop.app</a>.</p>

      <h2>8. Cookies</h2>
      <p>
        Our website uses essential cookies for authentication and session management. We do not use
        advertising cookies or third-party tracking cookies.
      </p>

      <h2>9. Children&apos;s Privacy</h2>
      <p>
        Our Service is not directed to children under 13. We do not knowingly collect personal
        information from children under 13. If you believe a child has provided us with personal data,
        please contact us so we can delete it.
      </p>

      <h2>10. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. We will notify you of any material changes
        by posting the new policy on this page and updating the &quot;Last updated&quot; date.
      </p>

      <h2>11. Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, please contact us at{' '}
        <a href="mailto:support@fontdrop.app">support@fontdrop.app</a>.
      </p>
    </>
  );
}
