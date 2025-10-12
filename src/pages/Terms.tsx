import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl font-black mb-8">Terms and Conditions</h1>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Last Updated: {new Date().toLocaleDateString()}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <section>
                <h2 className="text-2xl font-bold mb-3">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground">
                  By accessing and using SquadUp ("the Service"), you accept and agree to be bound by the terms and provisions of this agreement. This is an open-source, non-commercial project provided free of charge for community use.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">2. Nature of Service</h2>
                <p className="text-muted-foreground mb-2">
                  SquadUp is a free, open-source platform that connects people for sports activities. This Service is:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Provided "as is" without any warranties</li>
                  <li>Non-commercial and ad-free</li>
                  <li>Not operated by a company or commercial entity</li>
                  <li>Community-driven and maintained</li>
                  <li>Free to use and modify under open-source principles</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">3. User Responsibilities</h2>
                <p className="text-muted-foreground mb-2">By using SquadUp, you agree to:</p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Provide accurate information during registration</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Not use the Service for any illegal or unauthorized purpose</li>
                  <li>Not harass, abuse, or harm other users</li>
                  <li>Not attempt to circumvent security measures</li>
                  <li>Respect other users and follow community guidelines</li>
                  <li>Attend games you RSVP to or cancel in advance</li>
                  <li>Be responsible for your own safety during activities</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">4. Disclaimer of Liability</h2>
                <p className="text-muted-foreground mb-2">
                  <strong>IMPORTANT:</strong> SquadUp is a coordination platform only. We do not organize, supervise, or verify any activities.
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Users meet and play at their own risk</li>
                  <li>We are not responsible for injuries, losses, or damages occurring during activities</li>
                  <li>We do not verify user identities, backgrounds, or qualifications</li>
                  <li>We are not liable for user conduct or interactions</li>
                  <li>We do not guarantee the accuracy of game information</li>
                  <li>We are not responsible for property damage or theft</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">5. No Commercial Use</h2>
                <p className="text-muted-foreground">
                  This Service is free and open-source. Users may not use SquadUp for commercial purposes, including but not limited to selling services, advertising, or monetizing game listings. The platform will remain ad-free and non-commercial.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">6. Data Collection and Bot Prevention</h2>
                <p className="text-muted-foreground">
                  We collect minimal user data solely for account creation and to filter out automated bots and potential scammers. This includes basic profile information provided during signup. See our Privacy Policy for details.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">7. Account Termination</h2>
                <p className="text-muted-foreground">
                  We reserve the right to suspend or terminate accounts that violate these terms, engage in abusive behavior, appear to be automated bots, or pose a risk to the community.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">8. No Warranty</h2>
                <p className="text-muted-foreground">
                  THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE. USE AT YOUR OWN RISK.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">9. Limitation of Liability</h2>
                <p className="text-muted-foreground">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE DEVELOPERS AND MAINTAINERS OF SQUADUP SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO PERSONAL INJURY, PROPERTY DAMAGE, OR LOSS OF DATA.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">10. Indemnification</h2>
                <p className="text-muted-foreground">
                  You agree to indemnify and hold harmless SquadUp, its developers, and contributors from any claims, damages, losses, or expenses arising from your use of the Service or violation of these terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">11. Open Source License</h2>
                <p className="text-muted-foreground">
                  SquadUp is open-source software. The source code may be freely used, modified, and distributed according to the applicable open-source license. Contributing to or forking the project does not create any commercial relationship or liability.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">12. Changes to Terms</h2>
                <p className="text-muted-foreground">
                  We may update these terms at any time. Continued use of the Service after changes constitutes acceptance of the updated terms. We encourage users to review this page periodically.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">13. Governing Law</h2>
                <p className="text-muted-foreground">
                  These terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law principles. Any disputes shall be resolved in the appropriate jurisdiction.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">14. Severability</h2>
                <p className="text-muted-foreground">
                  If any provision of these terms is found to be unenforceable, the remaining provisions will continue in full force and effect.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">15. Contact</h2>
                <p className="text-muted-foreground">
                  For questions about these terms, please contact the project maintainers through the official GitHub repository or community channels.
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Terms;
