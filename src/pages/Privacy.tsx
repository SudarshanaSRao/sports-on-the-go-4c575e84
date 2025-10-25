import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl font-black mb-8">Privacy Policy</h1>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Last Updated: {new Date().toLocaleDateString()}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <section>
                <h2 className="text-2xl font-bold mb-3">1. Introduction</h2>
                <p className="text-muted-foreground">
                  SquadUp ("we", "our", or "the Service") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information. As an open-source, non-commercial project, we collect minimal data necessary only for providing the Service and preventing abuse.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">2. Information We Collect</h2>
                <p className="text-muted-foreground mb-2">We collect only essential information:</p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li><strong>Account Information:</strong> Email address, username, name, and date of birth (provided during registration)</li>
                  <li><strong>Profile Data:</strong> Optional profile photo, bio, and sports preferences</li>
                  <li><strong>Game Location Data:</strong> Addresses of games you create (NOT your personal location)</li>
                  <li><strong>Game Participation:</strong> Games you join or attend</li>
                  <li><strong>Usage Data:</strong> Basic logs for security and bot prevention</li>
                  <li><strong>Authentication Data:</strong> Login credentials and session information</li>
                </ul>
                <p className="text-muted-foreground mt-3 font-semibold">
                  <strong>IMPORTANT:</strong> We do NOT track or store your real-time location. We do NOT store your personal home address, city, or zip code. Only public game event addresses are stored for coordination purposes.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">3. Purpose of Data Collection</h2>
                <p className="text-muted-foreground mb-2">We collect data solely for:</p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li><strong>Account Management:</strong> Creating and maintaining your account</li>
                  <li><strong>Bot Prevention:</strong> Filtering out automated bots and spam accounts</li>
                  <li><strong>Scam Prevention:</strong> Identifying and removing potential scammers</li>
                  <li><strong>Service Functionality:</strong> Enabling core features like game creation and RSVPs</li>
                  <li><strong>Safety:</strong> Maintaining a safe community environment</li>
                  <li><strong>Age Verification:</strong> Ensuring users meet minimum age requirements</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">4. How We Use Your Information</h2>
                <p className="text-muted-foreground mb-2">Your information is used to:</p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Authenticate your account and manage sessions</li>
                  <li>Display your profile to other users</li>
                  <li>Enable you to discover and participate in sports activities</li>
                  <li>Coordinate game locations (only for games you create or join)</li>
                  <li>Send important service notifications</li>
                  <li>Prevent fraudulent or abusive behavior</li>
                  <li>Maintain and improve the Service</li>
                </ul>
                <p className="text-muted-foreground mt-3">
                  We do NOT use your information for location tracking, targeted advertising, or selling to third parties.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">5. Data Sharing and Disclosure</h2>
                <p className="text-muted-foreground mb-2">
                  <strong>We do NOT sell, rent, or trade your personal information.</strong>
                </p>
                <p className="text-muted-foreground mb-2">Your data is only shared:</p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li><strong>With Other Users:</strong> Your public profile (name, photo, bio, ratings) is visible to other users</li>
                  <li><strong>For Game Coordination:</strong> Your RSVP status and participation in games you join</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect rights and safety</li>
                  <li><strong>Service Providers:</strong> With trusted infrastructure providers (e.g., authentication, database hosting) who are bound by confidentiality</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">6. Data Storage and Security</h2>
                <p className="text-muted-foreground">
                  Your data is stored securely using industry-standard practices. We implement reasonable security measures to protect against unauthorized access, alteration, or destruction of your information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">7. No Advertising or Tracking</h2>
                <p className="text-muted-foreground">
                  SquadUp is completely ad-free and non-commercial. We do not use tracking cookies, analytics for advertising purposes, or share your data with advertisers. We may use minimal analytics solely for improving Service functionality and security.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">8. Your Rights</h2>
                <p className="text-muted-foreground mb-2">You have the right to:</p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li><strong>Access:</strong> Request a copy of your personal data</li>
                  <li><strong>Correction:</strong> Update or correct your information</li>
                  <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                  <li><strong>Portability:</strong> Request your data in a portable format</li>
                  <li><strong>Withdraw Consent:</strong> Stop using the Service at any time</li>
                </ul>
                <p className="text-muted-foreground mt-2">
                  To exercise these rights, contact us through the official project channels.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">9. Data Retention</h2>
                <p className="text-muted-foreground">
                  We retain your personal data only as long as necessary to provide the Service and comply with legal obligations. When you delete your account, we will remove your personal information within a reasonable timeframe, except as required for legal, security, or legitimate operational purposes.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">10. Children's Privacy</h2>
                <p className="text-muted-foreground">
                  SquadUp is not intended for users under the age of 13. We do not knowingly collect personal information from children under 13. If we discover that we have collected information from a child under 13, we will delete it immediately.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">11. Third-Party Authentication</h2>
                <p className="text-muted-foreground">
                  If you sign up using Google or other third-party authentication services, we receive only the information you authorize and that is necessary for account creation. We do not have access to your third-party account credentials.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">12. Open Source Nature</h2>
                <p className="text-muted-foreground">
                  As an open-source project, the codebase is publicly available. However, this does NOT include access to user data, which is stored securely and privately. Only authorized maintainers have access to production data for maintenance and security purposes.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">13. International Users</h2>
                <p className="text-muted-foreground">
                  SquadUp may be accessed from anywhere in the world. By using the Service, you consent to the transfer and processing of your information in accordance with this Privacy Policy, regardless of where you are located.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">14. Changes to Privacy Policy</h2>
                <p className="text-muted-foreground">
                  We may update this Privacy Policy from time to time. We will notify users of material changes by posting the updated policy on the Service. Your continued use after changes constitutes acceptance of the updated policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">15. Contact Information</h2>
                <p className="text-muted-foreground">
                  For privacy-related questions, concerns, or requests, please contact the project maintainers through the official GitHub repository or community channels. We will respond to legitimate requests within a reasonable timeframe.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">16. Your Consent</h2>
                <p className="text-muted-foreground">
                  By using SquadUp, you consent to this Privacy Policy and agree to its terms. If you do not agree with this policy, please do not use the Service.
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
