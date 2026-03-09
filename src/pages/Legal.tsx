import { useLocation } from 'react-router-dom';

function TermsAndConditions() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Terms and Conditions</h1>
      <div className="prose prose-lg space-y-6 text-gray-700">
        <section>
          <h2 className="text-2xl font-bold text-gray-900">1. Introduction</h2>
          <p>Welcome to EventHub ("we," "us," "our," or "Company"). These Terms and Conditions govern your access to and use of the EventHub website and application (the "Service").</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900">2. Use License</h2>
          <p>Permission is granted to temporarily download one copy of the materials (information or software) on EventHub for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
          <ul className="list-disc ml-6 space-y-2">
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose or for any public display</li>
            <li>Attempt to decompile or reverse engineer any software contained on EventHub</li>
            <li>Remove any copyright or other proprietary notations from the materials</li>
            <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900">3. Disclaimer</h2>
          <p>The materials on EventHub are provided on an 'as is' basis. EventHub makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900">4. Limitations</h2>
          <p>In no event shall EventHub or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on EventHub, even if EventHub or an authorized representative has been notified orally or in writing of the possibility of such damage.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900">5. Accuracy of Materials</h2>
          <p>The materials appearing on EventHub could include technical, typographical, or photographic errors. EventHub does not warrant that any of the materials on its website are accurate, complete, or current.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900">6. Links</h2>
          <p>EventHub has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by EventHub of the site. Use of any such linked website is at the user's own risk.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900">7. Modifications</h2>
          <p>EventHub may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900">8. Governing Law</h2>
          <p>These terms and conditions are governed by and construed in accordance with the laws of your jurisdiction, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.</p>
        </section>
      </div>
    </div>
  );
}

function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Privacy Policy</h1>
      <div className="prose prose-lg space-y-6 text-gray-700">
        <section>
          <h2 className="text-2xl font-bold text-gray-900">1. Introduction</h2>
          <p>EventHub ("we," "us," "our," or "Company") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and application (the "Service").</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900">2. Information We Collect</h2>
          <p>We collect information from you when you register on our website, create an account, register for events, or interact with our Service. Information we collect includes:</p>
          <ul className="list-disc ml-6 space-y-2">
            <li>Name and email address</li>
            <li>Profile information and avatar</li>
            <li>Event registration and attendance data</li>
            <li>User-generated content such as comments and reviews</li>
            <li>Device information and usage analytics</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900">3. Use of Your Information</h2>
          <p>EventHub uses the information we collect in the following ways:</p>
          <ul className="list-disc ml-6 space-y-2">
            <li>To personalize your experience and to deliver the content and product offerings relevant to your interests</li>
            <li>To improve our Service and better understand user needs</li>
            <li>To send periodic emails regarding your account or event registrations</li>
            <li>To facilitate event registration and management</li>
            <li>To enforce our Terms and Conditions and other agreements</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900">4. Protection of Your Information</h2>
          <p>We implement a variety of security measures to maintain the safety of your personal information. Your personal information is contained behind secured networks and is only accessible by a limited number of persons who have special access rights to such systems.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900">5. Disclosure of Your Information</h2>
          <p>We may disclose your information when required by law or in the good-faith belief that such action is necessary to conform to an applicable law, regulation, court order, or comply with legal process.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900">6. Third-Party Services</h2>
          <p>Our Service may contain links to third-party websites and services that are not operated by EventHub. This Privacy Policy does not apply to third-party websites, and we are not responsible for their privacy practices.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900">7. Your Rights</h2>
          <p>You have the right to access, correct, or delete your personal information. To exercise these rights, please contact us at privacy@eventhub.com.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900">8. Changes to This Privacy Policy</h2>
          <p>We may update this Privacy Policy from time to time to reflect changes in our practices and applicable laws. We will notify you of any material changes by posting the updated policy on our website.</p>
        </section>
      </div>
    </div>
  );
}

function CookiePolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Cookie Policy</h1>
      <div className="prose prose-lg space-y-6 text-gray-700">
        <section>
          <h2 className="text-2xl font-bold text-gray-900">1. What Are Cookies</h2>
          <p>Cookies are small files stored on your device when you visit our website. They help us provide a better user experience by remembering your preferences and improving site functionality.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900">2. Types of Cookies We Use</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li><strong>Essential Cookies:</strong> These are necessary for basic site functionality and cannot be disabled.</li>
            <li><strong>Analytics Cookies:</strong> These help us understand how users interact with our website to improve performance.</li>
            <li><strong>Preference Cookies:</strong> These remember your choices and preferences to personalize your experience.</li>
            <li><strong>Marketing Cookies:</strong> These track your activity to deliver targeted advertisements.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900">3. Managing Your Cookie Preferences</h2>
          <p>You can control cookie preferences through your browser settings. Most browsers allow you to refuse cookies or alert you when cookies are being sent. Please note that disabling cookies may affect your ability to use certain features of our website.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900">4. Third-Party Cookies</h2>
          <p>We may allow third-party service providers to place cookies on your device for analytics and advertising purposes. These third parties have their own privacy policies governing their use of cookies.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900">5. Contact Us</h2>
          <p>If you have questions about our Cookie Policy, please contact us at privacy@eventhub.com.</p>
        </section>
      </div>
    </div>
  );
}

function CommunityGuidelines() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Community Guidelines</h1>
      <div className="prose prose-lg space-y-6 text-gray-700">
        <section>
          <h2 className="text-2xl font-bold text-gray-900">1. Our Community Values</h2>
          <p>EventHub is built on the principle of creating a safe, inclusive, and respectful community for all students and campus organizations. We are committed to fostering an environment where everyone feels welcome and valued.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900">2. Expected Behavior</h2>
          <p>Members of our community are expected to:</p>
          <ul className="list-disc ml-6 space-y-2">
            <li>Treat all members with respect and dignity</li>
            <li>Be inclusive and welcoming to people of all backgrounds</li>
            <li>Use appropriate language and avoid offensive content</li>
            <li>Respect intellectual property and give proper credit</li>
            <li>Participate constructively in discussions</li>
            <li>Report violations of these guidelines to our moderation team</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900">3. Prohibited Behavior</h2>
          <p>The following behaviors are strictly prohibited on EventHub:</p>
          <ul className="list-disc ml-6 space-y-2">
            <li>Harassment, bullying, or discrimination of any kind</li>
            <li>Hate speech or offensive language targeting protected characteristics</li>
            <li>Sexual harassment or inappropriate content</li>
            <li>Spam, self-promotion, or commercial solicitation</li>
            <li>Sharing of private information without consent</li>
            <li>Spreading misinformation or false claims</li>
            <li>Illegal activities or content</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900">4. Consequences of Violations</h2>
          <p>We take violations of these guidelines seriously. Consequences may include:</p>
          <ul className="list-disc ml-6 space-y-2">
            <li>Warning or temporary suspension of account privileges</li>
            <li>Removal of inappropriate content</li>
            <li>Permanent account suspension or ban</li>
            <li>Reporting to appropriate authorities if illegal activity is involved</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900">5. Reporting Violations</h2>
          <p>If you witness a violation of these guidelines, please report it to our moderation team immediately. You can report violations by using the report feature on individual posts or by contacting moderation@eventhub.com with details of the violation.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900">6. Appeals</h2>
          <p>If you believe an action taken against your account was unjustified, you may appeal by contacting appeals@eventhub.com with a detailed explanation of your appeal.</p>
        </section>
      </div>
    </div>
  );
}

export default function Legal() {
  const location = useLocation();
  const path = location.pathname;

  if (path.includes('terms')) {
    return (
      <div className="bg-white min-h-screen">
        <TermsAndConditions />
      </div>
    );
  } else if (path.includes('privacy')) {
    return (
      <div className="bg-white min-h-screen">
        <PrivacyPolicy />
      </div>
    );
  } else if (path.includes('cookies')) {
    return (
      <div className="bg-white min-h-screen">
        <CookiePolicy />
      </div>
    );
  } else if (path.includes('guidelines')) {
    return (
      <div className="bg-white min-h-screen">
        <CommunityGuidelines />
      </div>
    );
  }

  return null;
}
