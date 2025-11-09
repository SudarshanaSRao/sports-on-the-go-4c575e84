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
              <CardTitle>Last Updated: January 15, 2025</CardTitle>
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
                <h2 className="text-2xl font-bold mb-3">8. Your Rights and Data Control</h2>
                <p className="text-muted-foreground mb-3 font-semibold">
                  <strong>You have complete control over your data.</strong> We believe that your data belongs to you, and you have the right to manage it as you see fit.
                </p>
                <p className="text-muted-foreground mb-2">You have the right to:</p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li><strong>Access:</strong> View and request a copy of all your personal data at any time</li>
                  <li><strong>Correction:</strong> Update or correct your information through your account settings</li>
                  <li><strong>Portability:</strong> Request your data in a portable format for transfer to another service</li>
                  <li><strong>Withdraw Consent:</strong> Stop using the Service at any time without penalty</li>
                </ul>
                
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Right to Delete Your Account and Data</h3>
                  <p className="text-muted-foreground mb-2">
                    <strong>You can permanently delete your account and all associated data at any time.</strong> This is a fundamental right we provide to all users. When you delete your account:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-3">
                    <li>Your profile and account information will be permanently removed</li>
                    <li>All games you've hosted will be deleted</li>
                    <li>All your RSVPs and game participations will be removed</li>
                    <li>All your friendships and connections will be deleted</li>
                    <li>All reviews you've given or received will be permanently removed</li>
                    <li>All your posts, comments, and votes will be deleted</li>
                    <li>Your communities and memberships will be removed</li>
                    <li>Your sports preferences and settings will be deleted</li>
                    <li>All other data associated with your account will be permanently erased</li>
                  </ul>
                  <p className="text-muted-foreground mb-2">
                    <strong>How to delete your account:</strong>
                  </p>
                  <ol className="list-decimal pl-6 text-muted-foreground space-y-1">
                    <li>Log into your account</li>
                    <li>Navigate to Settings from the user menu</li>
                    <li>Scroll to the "Danger Zone" section</li>
                    <li>Click "Delete Account" and follow the confirmation steps</li>
                  </ol>
                  <p className="text-muted-foreground mt-3 font-semibold">
                    <strong>Important:</strong> Account deletion is permanent and cannot be undone. Once deleted, your data cannot be recovered. We recommend downloading any data you wish to keep before deleting your account.
                  </p>
                </div>
                
                <p className="text-muted-foreground mt-3">
                  For other data-related requests or questions, contact us through the official project channels.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">9. Data Retention</h2>
                <p className="text-muted-foreground mb-3">
                  We retain your personal data only as long as necessary to provide the Service and comply with legal obligations. <strong>You have full control over your data retention</strong> and can delete your account at any time through the Settings page.
                </p>
                <p className="text-muted-foreground mb-3">
                  When you delete your account, all your personal information and associated data are permanently removed from our systems immediately. This includes your profile, games, RSVPs, friendships, reviews, posts, comments, and all other data linked to your account.
                </p>
                <p className="text-muted-foreground">
                  In rare cases, certain aggregated or anonymized data may be retained for statistical purposes or to comply with legal obligations, but this data cannot be traced back to you individually.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">10. Children's Privacy</h2>
                <p className="text-muted-foreground">
                  SquadUp is not intended for users under the age of 13. We do not knowingly collect personal information from children under 13. If we discover that we have collected information from a child under 13, we will delete it immediately.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">11. Data Security Limitations and Disclaimers</h2>
                <p className="text-muted-foreground mb-2 font-semibold">
                  While we implement reasonable security measures to protect your data, YOU ACKNOWLEDGE AND AGREE THAT:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>No system is perfectly secure or immune from cyber attacks</li>
                  <li>Data breaches, hacking, or unauthorized access may occur despite our efforts</li>
                  <li>We cannot guarantee that your data will never be compromised</li>
                  <li>Internet transmission is inherently insecure and subject to interception</li>
                </ul>
                <p className="text-muted-foreground mt-3 font-semibold">
                  IN THE EVENT OF A DATA BREACH, the operator's liability shall be limited as specified in the Terms of Service (maximum $100 USD total liability). You use the Service at your own risk and acknowledge that data security cannot be absolutely guaranteed.
                </p>
                <p className="text-muted-foreground mt-3 mb-2">
                  The operator shall not be liable for:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Unauthorized access to your data by third parties</li>
                  <li>Data loss due to technical failures, cyber attacks, or force majeure events</li>
                  <li>Identity theft or fraud resulting from data breaches</li>
                  <li>Any damages, losses, or expenses arising from compromised data security</li>
                </ul>
                <p className="text-muted-foreground mt-3">
                  You are responsible for maintaining strong passwords and account security practices.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">12. Third-Party Authentication</h2>
                <p className="text-muted-foreground">
                  If you sign up using Google or other third-party authentication services, we receive only the information you authorize and that is necessary for account creation. We do not have access to your third-party account credentials.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">13. International Users and California Jurisdiction</h2>
                
                <h3 className="text-xl font-semibold mb-2 mt-4">13.1 INTERNATIONAL ACCESS</h3>
                <p className="text-muted-foreground">
                  SquadUp may be accessed from anywhere in the world. By using the Service, you consent to the transfer, storage, and processing of your information in the United States, specifically within systems that may be governed by California law.
                </p>

                <h3 className="text-xl font-semibold mb-2 mt-4">13.2 CALIFORNIA JURISDICTION</h3>
                <p className="text-muted-foreground">
                  This Privacy Policy and all data practices are governed by the laws of the <strong>State of California, United States of America</strong>. Any disputes regarding privacy or data practices shall be resolved in accordance with California law and the jurisdiction provisions specified in the Terms of Service.
                </p>

                <h3 className="text-xl font-semibold mb-2 mt-4">13.3 CALIFORNIA PRIVACY RIGHTS</h3>
                <p className="text-muted-foreground mb-2">
                  California residents have specific rights under the California Consumer Privacy Act (CCPA), including:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Right to know what personal information is collected</li>
                  <li>Right to request deletion of personal information</li>
                  <li>Right to opt-out of sale of personal information (Note: We do NOT sell your data)</li>
                  <li>Right to non-discrimination for exercising CCPA rights</li>
                </ul>
                <p className="text-muted-foreground mt-3">
                  To exercise these rights, use the account deletion feature in Settings or contact us through official channels.
                </p>

                <h3 className="text-xl font-semibold mb-2 mt-4">13.4 NO SALE OF DATA</h3>
                <p className="text-muted-foreground">
                  <strong>We do NOT sell, rent, trade, or otherwise transfer your personal information to third parties for monetary consideration.</strong> California residents: You do NOT need to opt-out of data sales because we do not engage in such practices.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">14. Open Source Nature</h2>
                <p className="text-muted-foreground">
                  As an open-source project, the codebase is publicly available. However, this does NOT include access to user data, which is stored securely and privately. Only authorized maintainers have access to production data for maintenance and security purposes.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">15. Changes to Privacy Policy</h2>
                <p className="text-muted-foreground">
                  We may update this Privacy Policy from time to time. We will notify users of material changes by posting the updated policy on the Service. Your continued use after changes constitutes acceptance of the updated policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">16. Contact Information</h2>
                <p className="text-muted-foreground">
                  For privacy-related questions, concerns, or requests, please contact the project maintainers through the official GitHub repository or community channels. We will respond to legitimate requests within a reasonable timeframe.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">17. Limitation of Liability for Privacy Matters</h2>
                <p className="text-muted-foreground mb-3 font-semibold">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, the operator's total liability for any privacy-related claims, data breaches, or unauthorized access to your information <strong>SHALL NOT EXCEED ONE HUNDRED DOLLARS ($100.00 USD)</strong>, regardless of the nature of the claim or damages incurred.
                </p>
                <p className="text-muted-foreground mb-2">
                  This limitation applies to:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Data breaches or security incidents</li>
                  <li>Unauthorized access or disclosure of your information</li>
                  <li>Misuse of your data by third parties</li>
                  <li>Identity theft or fraud arising from your use of the Service</li>
                  <li>Any other privacy-related claims or damages</li>
                </ul>
                <p className="text-muted-foreground mt-3">
                  By using this Service, you acknowledge that this free, volunteer-run project cannot provide the same level of data security as commercial enterprises with dedicated security teams, and you accept the inherent risks involved.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">18. Your Consent</h2>
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
