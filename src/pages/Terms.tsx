import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen min-h-screen-mobile bg-background">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl font-black mb-8">Terms and Conditions</h1>
          
          <Alert className="mb-6 border-destructive bg-destructive/10">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <AlertDescription className="text-sm font-semibold text-destructive ml-2">
              IMPORTANT LEGAL NOTICE: By using SquadUp, you agree to binding arbitration, waive your right to sue in court, waive your right to a jury trial, and acknowledge significant liability limitations ($100 maximum). Please read these Terms carefully before using the Service.
            </AlertDescription>
          </Alert>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Last Updated: January 15, 2025</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <section>
                <h2 className="text-2xl font-bold mb-3">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground">
                  By accessing and using SquadUp ("the Service"), you accept and agree to be bound by the terms and provisions of this agreement. This is an open-source, non-commercial project provided free of charge for community use. IF YOU DO NOT AGREE TO THESE TERMS, DO NOT USE THE SERVICE.
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
                <h2 className="text-2xl font-bold mb-3">2.5 Individual Operation and Personal Project</h2>
                <p className="text-muted-foreground mb-3">
                  SquadUp is developed, maintained, and operated by an individual as a personal, non-commercial hobby project. <strong>This is NOT a registered business entity, corporation, LLC, or formal organization of any kind.</strong>
                </p>
                <p className="text-muted-foreground mb-2 font-semibold">
                  BY USING THIS SERVICE, YOU EXPRESSLY ACKNOWLEDGE AND AGREE THAT:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>There is NO company, business entity, or formal organization behind SquadUp</li>
                  <li>The operator is an individual acting in their personal capacity</li>
                  <li>This is a hobby project provided free of charge to the community</li>
                  <li>No commercial relationship exists between you and the operator</li>
                  <li>You are using a free, volunteer-run service</li>
                  <li>The operator provides this Service on a voluntary basis without compensation</li>
                  <li>The operator owes no duty of care beyond what is explicitly stated in these Terms</li>
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
                <h2 className="text-2xl font-bold mb-3">4. Assumption of Risk, Disclaimer of Liability, and Release of Claims</h2>
                
                <h3 className="text-xl font-semibold mb-2 mt-4">4.1 ASSUMPTION OF RISK</h3>
                <p className="text-muted-foreground mb-2 font-semibold">
                  YOU UNDERSTAND AND EXPRESSLY ACKNOWLEDGE that participating in sports and physical activities coordinated through SquadUp involves INHERENT AND SIGNIFICANT RISKS including but not limited to:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li><strong>Serious physical injury, permanent disability, paralysis, or DEATH</strong></li>
                  <li>Concussions, broken bones, sprains, and other sports injuries</li>
                  <li>Property damage, theft, or loss of personal belongings</li>
                  <li>Contact with dangerous, unvetted, or unqualified individuals</li>
                  <li>Inadequate safety measures, equipment failures, or unsafe venues</li>
                  <li>Medical emergencies without immediate medical assistance available</li>
                  <li>Adverse weather conditions and outdoor hazards</li>
                  <li>Lack of insurance coverage for injuries sustained</li>
                  <li>Travel to and from game locations</li>
                </ul>
                <p className="text-muted-foreground mt-3 font-semibold">
                  BY USING THIS SERVICE, YOU EXPRESSLY AND VOLUNTARILY ASSUME ALL SUCH RISKS AND DANGERS. You acknowledge that the operator cannot and does not guarantee your safety.
                </p>

                <h3 className="text-xl font-semibold mb-2 mt-4">4.2 RELEASE OF ALL CLAIMS</h3>
                <p className="text-muted-foreground mb-2 font-semibold">
                  BY USING SQUADUP, YOU KNOWINGLY AND VOLUNTARILY WAIVE, RELEASE, and FOREVER DISCHARGE the operator, developers, contributors, maintainers, and any affiliated parties from ANY AND ALL claims, demands, causes of action, damages, losses, expenses, or liabilities of any kind, whether known or unknown, arising from or related to:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Your use of the Service or participation in any activities coordinated through it</li>
                  <li>Any interactions, disputes, or altercations with other users</li>
                  <li>Personal injury, death, property damage, emotional distress, or economic losses</li>
                  <li>The actions, omissions, negligence, or misconduct of the operator or other users</li>
                  <li>The accuracy, quality, or reliability of information on the Service</li>
                  <li>Any venue conditions, equipment failures, or third-party services</li>
                </ul>
                <p className="text-muted-foreground mt-3 font-semibold">
                  YOU EXPRESSLY WAIVE ANY RIGHT TO SUE OR BRING LEGAL ACTION against the operator for any reason related to this Service or activities coordinated through it.
                </p>

                <h3 className="text-xl font-semibold mb-2 mt-4">4.3 DISCLAIMER OF LIABILITY</h3>
                <p className="text-muted-foreground mb-2">
                  <strong>IMPORTANT:</strong> SquadUp is a coordination platform only. We do not organize, supervise, verify, or endorse any activities, users, or venues.
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>The operator does NOT verify user identities, backgrounds, qualifications, or criminal records</li>
                  <li>The operator is NOT responsible for user conduct, disputes, or interactions</li>
                  <li>The operator does NOT inspect, approve, or guarantee the safety of any venues</li>
                  <li>The operator does NOT provide any supervision, referees, or safety personnel</li>
                  <li>The operator does NOT guarantee the accuracy or reliability of game information</li>
                  <li>The operator is NOT liable for any injuries, losses, damages, or deaths</li>
                  <li><strong>Users meet and play ENTIRELY at their own risk with no operator involvement</strong></li>
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
                <h2 className="text-2xl font-bold mb-3">9. Limitation of Liability and Maximum Damage Cap</h2>
                <p className="text-muted-foreground mb-3 font-semibold">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE OPERATOR, DEVELOPERS, AND MAINTAINERS OF SQUADUP SHALL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Personal injury, disability, death, or medical expenses</li>
                  <li>Property damage, theft, or loss</li>
                  <li>Lost profits, lost data, or business interruption</li>
                  <li>Emotional distress or pain and suffering</li>
                  <li>Attorney's fees or litigation costs</li>
                  <li>Any other damages whatsoever</li>
                </ul>
                <p className="text-muted-foreground mt-3 font-semibold">
                  <strong>IN NO EVENT SHALL THE TOTAL LIABILITY OF THE OPERATOR FOR ANY CLAIMS RELATED TO THIS SERVICE EXCEED ONE HUNDRED DOLLARS ($100.00 USD), REGARDLESS OF THE THEORY OF LIABILITY</strong> (contract, tort, negligence, strict liability, or otherwise).
                </p>
                <p className="text-muted-foreground mt-3">
                  Given that this Service is provided entirely free of charge as a non-commercial hobby project, you acknowledge and agree that any damages exceeding this amount would constitute unjust enrichment and that this limitation is fair and reasonable.
                </p>
                <p className="text-muted-foreground mt-3 font-semibold">
                  IF YOU DO NOT AGREE TO THIS LIMITATION, DO NOT USE THE SERVICE.
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
                <h2 className="text-2xl font-bold mb-3">13. Choice of Law and Jurisdiction</h2>
                
                <h3 className="text-xl font-semibold mb-2 mt-4">13.1 CHOICE OF LAW</h3>
                <p className="text-muted-foreground">
                  These Terms shall be governed by and construed in accordance with the laws of the <strong>State of California, United States of America</strong>, without regard to its conflict of law principles. This choice of law applies regardless of the location of the operator or users.
                </p>

                <h3 className="text-xl font-semibold mb-2 mt-4">13.2 EXCLUSIVE VENUE</h3>
                <p className="text-muted-foreground mb-2 font-semibold">
                  YOU AGREE that any dispute, claim, or controversy arising out of or relating to these Terms or your use of the Service shall be brought EXCLUSIVELY in the state or federal courts located in <strong>Santa Clara County, California</strong>, regardless of where the parties reside.
                </p>
                <p className="text-muted-foreground">
                  YOU HEREBY IRREVOCABLY CONSENT to the personal jurisdiction of such courts and WAIVE any objection to venue in such courts, including but not limited to any claim that such forum is inconvenient.
                </p>

                <h3 className="text-xl font-semibold mb-2 mt-4">13.3 WAIVER OF UNKNOWN CLAIMS</h3>
                <p className="text-muted-foreground">
                  You hereby waive any rights similar to California Civil Code Section 1542, which states: <em>"A general release does not extend to claims that the creditor or releasing party does not know or suspect to exist in his or her favor at the time of executing the release and that, if known by him or her, would have materially affected his or her settlement with the debtor or released party."</em> You acknowledge that you may later discover facts or incur damages currently unknown, and you waive any right to seek additional compensation for such unknown claims.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">14. Severability and Interpretation</h2>
                <p className="text-muted-foreground mb-3">
                  If any provision of these Terms is found to be invalid, illegal, or unenforceable by a court of competent jurisdiction, such provision shall be modified to the minimum extent necessary to make it valid and enforceable while preserving the intent of maximum liability protection for the operator.
                </p>
                <p className="text-muted-foreground mb-3">
                  If a provision cannot be modified to be enforceable, it shall be severed, and all other provisions shall remain in full force and effect. The invalidity of any provision shall not affect the validity or enforceability of any other provision.
                </p>
                <p className="text-muted-foreground">
                  In interpreting these Terms, no presumption shall operate in favor of or against either party. These Terms shall be construed to provide the maximum protection from liability permitted by law.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">15. Contact</h2>
                <p className="text-muted-foreground">
                  For questions about these terms, please contact the project maintainers through the official GitHub repository or community channels.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">16. Dispute Resolution, Arbitration, and Class Action Waiver</h2>
                
                <h3 className="text-xl font-semibold mb-2 mt-4">16.1 MANDATORY BINDING ARBITRATION</h3>
                <p className="text-muted-foreground mb-2 font-semibold">
                  READ THIS SECTION CAREFULLY. IT AFFECTS YOUR LEGAL RIGHTS.
                </p>
                <p className="text-muted-foreground mb-3">
                  YOU AGREE that any dispute, claim, or controversy arising out of or relating to these Terms or your use of the Service (except as provided in Section 16.5) <strong>SHALL BE RESOLVED EXCLUSIVELY THROUGH BINDING INDIVIDUAL ARBITRATION, NOT IN COURT</strong>. You waive your right to a trial by jury.
                </p>

                <h3 className="text-xl font-semibold mb-2 mt-4">16.2 ARBITRATION PROCEDURES</h3>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>The arbitration shall be administered by JAMS (Judicial Arbitration and Mediation Services) under its Streamlined Arbitration Rules and Procedures</li>
                  <li>The arbitration shall take place in <strong>Santa Clara County, California</strong></li>
                  <li>The arbitration shall be conducted in English</li>
                  <li>Each party shall bear their own costs and attorney's fees (subject to Section 17)</li>
                  <li>The arbitrator's decision shall be final and binding</li>
                  <li>Judgment on the arbitration award may be entered in any court having jurisdiction</li>
                </ul>

                <h3 className="text-xl font-semibold mb-2 mt-4">16.3 CLASS ACTION WAIVER</h3>
                <p className="text-muted-foreground mb-2 font-semibold">
                  YOU AGREE TO BRING CLAIMS AGAINST THE OPERATOR ONLY IN YOUR INDIVIDUAL CAPACITY and not as a plaintiff or class member in any purported class, representative, or collective proceeding.
                </p>
                <p className="text-muted-foreground">
                  YOU WAIVE ANY RIGHT TO PARTICIPATE IN A CLASS ACTION LAWSUIT OR CLASS-WIDE ARBITRATION against the operator.
                </p>

                <h3 className="text-xl font-semibold mb-2 mt-4">16.4 WAIVER OF JURY TRIAL</h3>
                <p className="text-muted-foreground font-semibold">
                  YOU HEREBY WAIVE YOUR RIGHT TO A TRIAL BY JURY for any disputes related to this Service.
                </p>

                <h3 className="text-xl font-semibold mb-2 mt-4">16.5 EXCEPTIONS</h3>
                <p className="text-muted-foreground">
                  Either party may seek injunctive or other equitable relief in court to protect intellectual property rights or confidential information without first engaging in arbitration.
                </p>

                <h3 className="text-xl font-semibold mb-2 mt-4">16.6 OPT-OUT</h3>
                <p className="text-muted-foreground">
                  You may opt out of this arbitration agreement by sending written notice to the operator within 30 days of first using the Service. If you opt out, all other terms still apply, but disputes will be resolved in the courts specified in Section 13.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">17. Attorney's Fees and Prevailing Party</h2>
                <p className="text-muted-foreground mb-3">
                  In any legal action, arbitration, or other proceeding brought to enforce or interpret these Terms, the prevailing party shall be entitled to recover all reasonable attorney's fees, costs, and expenses from the non-prevailing party. This includes but is not limited to costs of investigation, litigation, arbitration fees, expert witness fees, and appeal costs.
                </p>
                <p className="text-muted-foreground">
                  If you bring a claim against the operator that is found to be frivolous, without merit, or brought in bad faith, you agree to reimburse the operator for all costs incurred in defending against such claim.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">18. Force Majeure</h2>
                <p className="text-muted-foreground mb-2">
                  The operator shall not be liable for any failure or delay in performance of the Service due to circumstances beyond reasonable control, including but not limited to:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Acts of God, natural disasters, earthquakes, floods, or fires</li>
                  <li>War, terrorism, civil unrest, or acts of government</li>
                  <li>Internet outages, server failures, or cyber attacks</li>
                  <li>Power failures, telecommunications failures, or infrastructure damage</li>
                  <li>Pandemics, epidemics, or public health emergencies</li>
                  <li>Any other event beyond the operator's reasonable control</li>
                </ul>
                <p className="text-muted-foreground mt-3">
                  In such events, the operator's obligations shall be suspended for the duration of the force majeure event, and you waive any claims for damages arising from such delays or failures.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">19. Third-Party Venues, Services, and Equipment</h2>
                
                <h3 className="text-xl font-semibold mb-2 mt-4">19.1 NO CONTROL OR RESPONSIBILITY</h3>
                <p className="text-muted-foreground mb-2">
                  SquadUp does not own, operate, inspect, maintain, approve, or have any control over:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Any venues, facilities, parks, gyms, or locations where games take place</li>
                  <li>Any equipment, sports gear, or materials used during activities</li>
                  <li>Any third-party services, websites, or platforms linked from the Service</li>
                  <li>Any transportation services users may use to travel to games</li>
                </ul>

                <h3 className="text-xl font-semibold mb-2 mt-4">19.2 DISCLAIMER</h3>
                <p className="text-muted-foreground mb-2">
                  The operator makes no representations or warranties regarding the safety, condition, suitability, legality, or quality of any third-party venues, services, or equipment. <strong>Users are SOLELY RESPONSIBLE</strong> for assessing and ensuring:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Venue safety and suitability for intended activities</li>
                  <li>Equipment quality and proper functioning</li>
                  <li>Compliance with local laws, regulations, and venue rules</li>
                  <li>Obtaining necessary permissions, permits, or insurance</li>
                  <li>Availability of emergency services and medical facilities</li>
                </ul>
                <p className="text-muted-foreground mt-3 font-semibold">
                  THE OPERATOR SHALL NOT BE LIABLE for any injuries, damages, or losses arising from third-party venues, services, or equipment.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">20. Volunteer Protection and Immunity</h2>
                <p className="text-muted-foreground mb-2">
                  To the extent permitted by law, including but not limited to the California Volunteer Protection Act and similar statutes, the operator and contributors to SquadUp are entitled to immunity from liability as volunteers providing services without compensation to a non-profit community project.
                </p>
                <p className="text-muted-foreground">
                  You acknowledge that:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>The operator provides this Service on a volunteer basis without pay</li>
                  <li>The Service is offered as a community benefit without profit motive</li>
                  <li>Any actions taken by the operator are in good faith</li>
                  <li>You will not hold volunteers liable for ordinary negligence in providing this free Service</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">21. Notice and Contact Information</h2>
                <p className="text-muted-foreground mb-3">
                  For questions, concerns, or legal notices regarding these Terms, please contact the project maintainers through the official GitHub repository or community channels.
                </p>
                <p className="text-muted-foreground mb-3">
                  Any legal notices must be sent in writing to the official project contact address. Notices sent via other methods may not be considered legally effective.
                </p>
                <p className="text-muted-foreground">
                  By continuing to use the Service after receiving notice of changes to these Terms, you agree to the updated Terms.
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
