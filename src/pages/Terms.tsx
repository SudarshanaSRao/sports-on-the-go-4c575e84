import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { getLatestVersionInfo, formatVersionDate } from "@/constants/termsVersion";

const Terms = () => {
  const latestVersion = getLatestVersionInfo();
  const lastUpdatedDate = formatVersionDate(latestVersion.date);

  return (
    <div className="min-h-screen min-h-screen-mobile bg-background">
      <Navbar />

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl font-black mb-8">Terms and Conditions</h1>

          <Alert className="mb-6 border-destructive bg-destructive/10">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <AlertDescription className="text-sm font-semibold text-destructive ml-2">
              IMPORTANT LEGAL NOTICE: By using SquadUp, you agree to binding arbitration, waive your right to sue in
              court, waive your right to a jury trial, and acknowledge significant liability limitations ($100 maximum).
              Please read these Terms carefully before using the Service.
            </AlertDescription>
          </Alert>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Last Updated: {lastUpdatedDate}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <section>
                <h2 className="text-2xl font-bold mb-3">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground">
                  By accessing and using SquadUp ("the Service"), you accept and agree to be bound by the terms and
                  provisions of this agreement. This is an open-source, non-commercial project provided free of charge
                  for community use. IF YOU DO NOT AGREE TO THESE TERMS, DO NOT USE THE SERVICE.
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
                <h2 className="text-2xl font-bold mb-3">2.1 Individual Operation and Personal Project</h2>
                <p className="text-muted-foreground mb-3">
                  SquadUp is developed, maintained, and operated by an individual as a personal, non-commercial hobby
                  project.{" "}
                  <strong>
                    This is NOT a registered business entity, corporation, LLC, or formal organization of any kind.
                  </strong>
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
                <h2 className="text-2xl font-bold mb-3">2.2 Minimum Age Requirement</h2>
                <Alert className="mb-4 border-destructive bg-destructive/10">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  <AlertDescription className="text-sm font-bold text-destructive ml-2">
                    CRITICAL: YOU MUST BE AT LEAST 18 YEARS OLD TO USE SQUADUP
                  </AlertDescription>
                </Alert>
                <p className="text-muted-foreground mb-2 font-semibold">
                  SquadUp is intended solely for users who are 18 years of age or older. By using this Service, you
                  represent and warrant that:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>You are at least 18 years old</li>
                  <li>You have the legal capacity to enter into these Terms</li>
                  <li>You will not allow persons under 18 to use your account</li>
                  <li>
                    You understand that providing false age information is grounds for immediate account termination
                  </li>
                </ul>
                <p className="text-muted-foreground mt-3">
                  <strong>Age Verification:</strong> We reserve the right to request proof of age at any time. Failure
                  to provide verification or discovery that you are under 18 will result in immediate account
                  termination without notice.
                </p>
                <p className="text-muted-foreground mt-3">
                  <strong>Parental Responsibility:</strong> Parents and guardians are solely responsible for supervising
                  minors' internet use. If a minor accesses SquadUp, the parent/guardian accepts full liability for any
                  consequences arising from such unauthorized use.
                </p>
                <p className="text-muted-foreground mt-3 font-semibold">
                  IF YOU ARE UNDER 18 YEARS OLD, YOU MUST NOT USE THIS SERVICE UNDER ANY CIRCUMSTANCES.
                </p>
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
                <h2 className="text-2xl font-bold mb-3">3.1 Prohibited Content and User Conduct</h2>

                <h3 className="text-xl font-semibold mb-2 mt-4">3.1.1 PROHIBITED CONTENT</h3>
                <p className="text-muted-foreground mb-2 font-semibold">
                  To maintain a safe, respectful, and inclusive community, the following types of content are STRICTLY
                  PROHIBITED on SquadUp:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>
                    <strong>Profanity and Vulgar Language:</strong> Excessive use of profanity, obscene language, or
                    vulgar expressions in any public-facing content including posts, comments, game descriptions,
                    community discussions, usernames, or profile information
                  </li>
                  <li>
                    <strong>Hate Speech and Discrimination:</strong> Content that promotes hatred, violence, or
                    discrimination based on race, ethnicity, national origin, religion, gender, sexual orientation,
                    disability, age, or any other protected characteristic
                  </li>
                  <li>
                    <strong>Harassment and Bullying:</strong> Targeted harassment, bullying, intimidation, threats, or
                    sustained unwanted contact directed at any user
                  </li>
                  <li>
                    <strong>Sexual Content:</strong> Sexually explicit content, pornography, sexual solicitation, or
                    unwanted sexual advances
                  </li>
                  <li>
                    <strong>Violence and Threats:</strong> Content promoting or glorifying violence, threats of
                    violence, or graphic violent imagery
                  </li>
                  <li>
                    <strong>Illegal Activities:</strong> Content promoting or facilitating illegal activities, drug use,
                    or criminal behavior
                  </li>
                  <li>
                    <strong>Spam and Misinformation:</strong> Spam, scams, phishing attempts, deliberate misinformation,
                    or deceptive content
                  </li>
                  <li>
                    <strong>Personal Information:</strong> Sharing private or personal information about others without
                    their consent (doxxing)
                  </li>
                  <li>
                    <strong>Impersonation:</strong> Impersonating other users, public figures, or organizations
                  </li>
                </ul>

                <h3 className="text-xl font-semibold mb-2 mt-4">3.1.2 CONTENT MODERATION</h3>
                <p className="text-muted-foreground mb-2">
                  SquadUp employs automated content moderation tools and community reporting to identify and remove
                  prohibited content. However, you acknowledge that:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Content moderation is not perfect and may not catch all violations immediately</li>
                  <li>
                    The operator is not liable for user-generated content or delayed removal of prohibited content
                  </li>
                  <li>Users are responsible for their own exposure to potentially offensive content</li>
                  <li>Reporting inappropriate content does not guarantee immediate action or removal</li>
                  <li>The operator reserves the right to remove any content at its sole discretion</li>
                </ul>

                <h3 className="text-xl font-semibold mb-2 mt-4">3.1.3 ENFORCEMENT AND CONSEQUENCES</h3>
                <p className="text-muted-foreground mb-2">
                  Violations of these content policies may result in the following actions, at the operator's sole
                  discretion:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>
                    <strong>Content Removal:</strong> Immediate removal of prohibited content without notice
                  </li>
                  <li>
                    <strong>Warnings:</strong> Formal warnings for first-time or minor violations
                  </li>
                  <li>
                    <strong>Temporary Suspension:</strong> Temporary account suspension (1-30 days) for repeated or
                    serious violations
                  </li>
                  <li>
                    <strong>Permanent Ban:</strong> Permanent account termination for severe or repeated violations
                  </li>
                  <li>
                    <strong>No Appeals:</strong> The operator is not obligated to provide appeals or explanations for
                    enforcement actions
                  </li>
                </ul>
                <p className="text-muted-foreground mt-3 font-semibold">
                  You acknowledge that content moderation decisions are made in good faith but may occasionally be
                  incorrect. THE OPERATOR SHALL NOT BE LIABLE for any consequences of content removal, account
                  suspension, or termination, including loss of data, connections, or access to the Service.
                </p>

                <h3 className="text-xl font-semibold mb-2 mt-4">3.1.4 USER RESPONSIBILITY</h3>
                <p className="text-muted-foreground mb-2 font-semibold">
                  BY USING THIS SERVICE, YOU ACKNOWLEDGE AND ACCEPT THAT:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>You may encounter offensive, inappropriate, or prohibited content created by other users</li>
                  <li>The operator cannot guarantee a completely safe or offense-free environment</li>
                  <li>Content moderation is a best-effort service, not a guarantee</li>
                  <li>You use the Service at your own risk and must exercise your own judgment</li>
                  <li>
                    You are responsible for protecting yourself from offensive content (e.g., by blocking users, leaving
                    communities, or discontinuing use)
                  </li>
                  <li>
                    The operator is not liable for emotional distress, harm, or damages resulting from exposure to
                    user-generated content
                  </li>
                </ul>
                <p className="text-muted-foreground mt-3">
                  If you find this level of moderation insufficient for your needs, we recommend not using the Service.
                  Your continued use of the Service constitutes acceptance of these limitations.
                </p>

                <h3 className="text-xl font-semibold mb-2 mt-4">3.1.5 REPORTING VIOLATIONS</h3>
                <p className="text-muted-foreground">
                  Users may report prohibited content through the in-app reporting system. While we review reports, we
                  do not guarantee response times, specific actions, or outcomes. Abuse of the reporting system may
                  result in account suspension.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">3.2 User Representations and Warranties</h2>
                <p className="text-muted-foreground mb-2">
                  By using SquadUp, you represent, warrant, and covenant that:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>
                    <strong>Accuracy:</strong> All information you provide is accurate, current, and complete
                  </li>
                  <li>
                    <strong>Ownership:</strong> You own or have the necessary rights, licenses, and permissions to all
                    content you post
                  </li>
                  <li>
                    <strong>Legal Compliance:</strong> Your use of the Service complies with all applicable local,
                    state, national, and international laws and regulations
                  </li>
                  <li>
                    <strong>No Unauthorized Access:</strong> You will not attempt to gain unauthorized access to any
                    portion of the Service, other users' accounts, or any systems or networks connected to the Service
                  </li>
                  <li>
                    <strong>No Interference:</strong> You will not interfere with or disrupt the Service or servers or
                    networks connected to the Service
                  </li>
                  <li>
                    <strong>Authentic Identity:</strong> You will not impersonate any person or entity or misrepresent
                    your affiliation with any person or entity
                  </li>
                  <li>
                    <strong>Legal Age:</strong> You are at least 18 years old and have the legal capacity to enter into
                    these Terms
                  </li>
                </ul>
                <p className="text-muted-foreground mt-3 font-semibold">
                  You acknowledge that any breach of these representations and warranties may result in immediate
                  termination of your account and potential legal action.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">
                  4. Assumption of Risk, Disclaimer of Liability, and Release of Claims
                </h2>

                <h3 className="text-xl font-semibold mb-2 mt-4">4.1 ASSUMPTION OF RISK</h3>
                <p className="text-muted-foreground mb-2 font-semibold">
                  YOU UNDERSTAND AND EXPRESSLY ACKNOWLEDGE that participating in sports and physical activities
                  coordinated through SquadUp involves INHERENT AND SIGNIFICANT RISKS including but not limited to:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>
                    <strong>Serious physical injury, permanent disability, paralysis, or DEATH</strong>
                  </li>
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
                  BY USING THIS SERVICE, YOU EXPRESSLY AND VOLUNTARILY ASSUME ALL SUCH RISKS AND DANGERS. You
                  acknowledge that the operator cannot and does not guarantee your safety.
                </p>

                <h3 className="text-xl font-semibold mb-2 mt-4">4.2 RELEASE OF ALL CLAIMS</h3>
                <p className="text-muted-foreground mb-2 font-semibold">
                  BY USING SQUADUP, YOU KNOWINGLY AND VOLUNTARILY WAIVE, RELEASE, and FOREVER DISCHARGE the operator,
                  developers, contributors, maintainers, and any affiliated parties from ANY AND ALL claims, demands,
                  causes of action, damages, losses, expenses, or liabilities of any kind, whether known or unknown,
                  arising from or related to:
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
                  YOU EXPRESSLY WAIVE ANY RIGHT TO SUE OR BRING LEGAL ACTION against the operator for any reason related
                  to this Service or activities coordinated through it.
                </p>

                <h3 className="text-xl font-semibold mb-2 mt-4">4.3 DISCLAIMER OF LIABILITY</h3>
                <p className="text-muted-foreground mb-2">
                  <strong>IMPORTANT:</strong> SquadUp is a coordination platform only. We do not organize, supervise,
                  verify, or endorse any activities, users, or venues.
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>
                    The operator does NOT verify user identities, backgrounds, qualifications, or criminal records
                  </li>
                  <li>The operator is NOT responsible for user conduct, disputes, or interactions</li>
                  <li>The operator does NOT inspect, approve, or guarantee the safety of any venues</li>
                  <li>The operator does NOT provide any supervision, referees, or safety personnel</li>
                  <li>The operator does NOT guarantee the accuracy or reliability of game information</li>
                  <li>The operator is NOT liable for any injuries, losses, damages, or deaths</li>
                  <li>
                    <strong>Users meet and play ENTIRELY at their own risk with no operator involvement</strong>
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">5. No Commercial Use</h2>
                <p className="text-muted-foreground">
                  This Service is free and open-source. Users may not use SquadUp for commercial purposes, including but
                  not limited to selling services, advertising, or monetizing game listings. The platform will remain
                  ad-free and non-commercial.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">6. Data Collection and Bot Prevention</h2>
                <p className="text-muted-foreground">
                  We collect basic user data necessary for Service functionality, including email, location data for
                  finding nearby games, and activity history. We implement CAPTCHA and rate limiting to prevent
                  automated abuse. By using the Service, you consent to data collection as outlined in our Privacy
                  Policy. We do not sell your data to third parties.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">6.1 Data Retention and Deletion</h2>
                <p className="text-muted-foreground mb-2">
                  <strong>What Gets Deleted:</strong>
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Your profile information and personal data</li>
                  <li>Your game participation history and RSVPs</li>
                  <li>Your posted content, comments, and interactions</li>
                  <li>Your account credentials and authentication data</li>
                </ul>
                <p className="text-muted-foreground mt-3">
                  <strong>Right to Request Deletion:</strong> You may request immediate data deletion at any time by
                  contacting us through the channels specified in Section 21. We will comply with your request within 30
                  days, subject to legal obligations.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">7. Account Termination</h2>
                <p className="text-muted-foreground">
                  We reserve the right to suspend or terminate accounts that violate these terms, engage in abusive
                  behavior, appear to be automated bots, or pose a risk to the community.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">8. No Warranty</h2>
                <p className="text-muted-foreground">
                  THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED. WE DO NOT WARRANT
                  THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE. USE AT YOUR OWN RISK.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">9. Limitation of Liability and Maximum Damage Cap</h2>
                <p className="text-muted-foreground mb-3 font-semibold">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE OPERATOR, DEVELOPERS, AND MAINTAINERS OF SQUADUP SHALL NOT
                  BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING
                  BUT NOT LIMITED TO:
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
                  <strong>
                    IN NO EVENT SHALL THE TOTAL LIABILITY OF THE OPERATOR FOR ANY CLAIMS RELATED TO THIS SERVICE EXCEED
                    ONE HUNDRED DOLLARS ($100.00 USD), REGARDLESS OF THE THEORY OF LIABILITY
                  </strong>{" "}
                  (contract, tort, negligence, strict liability, or otherwise).
                </p>
                <p className="text-muted-foreground mt-3">
                  Given that this Service is provided entirely free of charge as a non-commercial hobby project, you
                  acknowledge and agree that any damages exceeding this amount would constitute unjust enrichment and
                  that this limitation is fair and reasonable.
                </p>
                <p className="text-muted-foreground mt-3 font-semibold">
                  IF YOU DO NOT AGREE TO THIS LIMITATION, DO NOT USE THE SERVICE.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">10. Indemnification</h2>
                <p className="text-muted-foreground">
                  You agree to indemnify and hold harmless SquadUp, its developers, and contributors from any claims,
                  damages, losses, or expenses arising from your use of the Service or violation of these terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">11. Open Source License</h2>
                <p className="text-muted-foreground">
                  SquadUp's source code is available under an open-source license. While you may view, fork, and modify
                  the code according to the license terms, you may not use the SquadUp name, branding, or hold the
                  operator liable for any issues arising from your modifications or deployments.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">11.1 Intellectual Property and User Content</h2>

                <h3 className="text-xl font-semibold mb-2 mt-4">11.1.1 Your Content Ownership</h3>
                <p className="text-muted-foreground mb-2">
                  You retain all ownership rights to content you create, upload, post, or share on SquadUp ("Your
                  Content"). This includes but is not limited to:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Posts, comments, and community discussions</li>
                  <li>Game descriptions and event details</li>
                  <li>Profile information, photos, and biographical content</li>
                  <li>Reviews and ratings you provide</li>
                </ul>

                <h3 className="text-xl font-semibold mb-2 mt-4">11.1.2 License Grant to SquadUp</h3>
                <p className="text-muted-foreground mb-2">
                  By posting Your Content on SquadUp, you grant us a non-exclusive, worldwide, royalty-free, perpetual,
                  irrevocable, and fully sublicensable license to:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Use, reproduce, modify, adapt, and publish Your Content</li>
                  <li>Display, perform, and distribute Your Content on and through the Service</li>
                  <li>Create derivative works from Your Content for Service improvement</li>
                  <li>Store Your Content in our backup and archival systems</li>
                </ul>
                <p className="text-muted-foreground mt-2">
                  This license is necessary for us to operate the Service and make Your Content available to other users
                  as intended. The license continues even after you delete Your Content or terminate your account, to
                  the extent Your Content has been shared with or viewed by other users.
                </p>

                <h3 className="text-xl font-semibold mb-2 mt-4">11.1.3 Your Warranty Regarding Content</h3>
                <p className="text-muted-foreground mb-2 font-semibold">You represent and warrant that:</p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>You own or have the necessary rights, licenses, and permissions to grant the above license</li>
                  <li>
                    Your Content does not infringe any third party's intellectual property rights, privacy rights, or
                    other proprietary rights
                  </li>
                  <li>Your Content complies with these Terms and all applicable laws</li>
                  <li>
                    You have obtained all necessary consents from individuals depicted in photos or content you upload
                  </li>
                </ul>

                <h3 className="text-xl font-semibold mb-2 mt-4">11.1.4 Our Right to Remove Content</h3>
                <p className="text-muted-foreground">
                  We reserve the right to remove, modify, or refuse to display any of Your Content at any time, for any
                  reason, without prior notice. We are not obligated to store, maintain, or provide you with copies of
                  Your Content. You are solely responsible for backing up Your Content.
                </p>

                <h3 className="text-xl font-semibold mb-2 mt-4">11.1.5 Third-Party Content and Trademarks</h3>
                <p className="text-muted-foreground">
                  SquadUp and its associated logos, designs, and branding are the property of the operator. All other
                  trademarks, service marks, and trade names mentioned on the Service are the property of their
                  respective owners. You may not use our trademarks or branding without express written permission.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">11.2 DMCA Copyright Compliance</h2>
                <p className="text-muted-foreground mb-2">
                  SquadUp respects the intellectual property rights of others and expects users to do the same. In
                  accordance with the Digital Millennium Copyright Act (DMCA), we will respond to valid notices of
                  copyright infringement.
                </p>

                <h3 className="text-xl font-semibold mb-2 mt-4">
                  11.2.1 Copyright Concerns and Content Removal Requests
                </h3>
                <p className="text-muted-foreground mb-2">
                  If you believe that content on SquadUp may infringe your copyright, you can notify us by sending a
                  written request that includes the following information so we can review the matter:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>A description of the copyrighted work you believe has been used without authorization</li>
                  <li>
                    A description or link (e.g., URL, username, post ID) that helps us locate the content in question
                  </li>
                  <li>
                    Your contact information (email is sufficient, but you may provide additional details if you wish)
                  </li>
                  <li>A brief statement explaining why you believe the use of the material may be unauthorized</li>
                  <li>
                    A statement that you have a good faith belief that the use is not authorized by the copyright owner,
                    its agent, or the law
                  </li>
                  <li>
                    A statement that the information in the notice is accurate and, under penalty of perjury, that you
                    are authorized to act on behalf of the copyright owner
                  </li>
                </ul>

                <p className="text-muted-foreground mb-2">
                  Upon receiving a request, we will review it promptly and take appropriate action, which may include
                  removing or disabling access to the reported content. We may also contact the user who posted the
                  material for clarification. This process is intended to help resolve copyright concerns in good faith
                  and does not require you to act as a DMCA agent or make legal declarations under penalty of perjury.
                </p>

                <h3 className="text-xl font-semibold mb-2 mt-4">11.2.2 Counter-Notice Procedure</h3>
                <p className="text-muted-foreground mb-2">
                  If you believe your content was removed in error, you may file a counter-notice with our DMCA agent
                  that includes:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Your physical or electronic signature</li>
                  <li>Identification of the removed material and its prior location</li>
                  <li>
                    A statement under penalty of perjury that you have a good faith belief the material was removed due
                    to mistake or misidentification
                  </li>
                  <li>Your name, address, and phone number</li>
                  <li>
                    A statement that you consent to the jurisdiction of the federal district court for your judicial
                    district (or the jurisdiction where the operator is located)
                  </li>
                  <li>
                    A statement that you will accept service of process from the person who filed the original DMCA
                    notice
                  </li>
                </ul>

                <h3 className="text-xl font-semibold mb-2 mt-4">11.2.3 Repeat Infringer Policy</h3>
                <p className="text-muted-foreground mb-2">
                  SquadUp has a policy of terminating, in appropriate circumstances, the accounts of users who are
                  repeat copyright infringers. Users who receive multiple valid DMCA takedown notices may have their
                  accounts permanently terminated without further warning.
                </p>

                <h3 className="text-xl font-semibold mb-2 mt-4">11.2.4 No Liability for User Content</h3>
                <p className="text-muted-foreground">
                  We act as a service provider under the DMCA safe harbor provisions. We are not liable for copyright
                  infringement by our users, provided we comply with DMCA procedures. Filing a false or fraudulent DMCA
                  notice or counter-notice may result in legal liability, including damages and attorney's fees.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">12. AI-Powered Features and Chatbot</h2>
                
                <h3 className="text-xl font-semibold mb-2 mt-4">12.1 AI ASSISTANT DESCRIPTION</h3>
                <p className="text-muted-foreground mb-2">
                  SquadUp includes an AI-powered chatbot assistant ("Sporty") designed to help users navigate the 
                  platform and answer questions about sports activities. Sporty is an artificial intelligence system, 
                  NOT a human being.
                </p>

                <h3 className="text-xl font-semibold mb-2 mt-4">12.2 AI-GENERATED CONTENT DISCLAIMER</h3>
                <p className="text-muted-foreground mb-2 font-semibold">
                  YOU ACKNOWLEDGE AND AGREE THAT:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>AI responses are generated automatically using third-party AI models</li>
                  <li>AI responses may be <strong>inaccurate, incomplete, outdated, or inappropriate</strong></li>
                  <li>AI responses do NOT constitute professional advice of any kind</li>
                  <li>The AI may occasionally produce incorrect or misleading information</li>
                  <li>You should <strong>NOT rely on AI-generated responses</strong> for safety decisions, medical advice, legal guidance, or any critical decision-making</li>
                  <li>You are responsible for independently verifying any information provided by the AI</li>
                </ul>

                <h3 className="text-xl font-semibold mb-2 mt-4">12.3 THIRD-PARTY AI SERVICES</h3>
                <p className="text-muted-foreground mb-2">
                  AI features are powered by third-party AI service providers (such as Google and OpenAI). By using 
                  these features, you acknowledge that:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Your chat messages may be processed by external AI services</li>
                  <li>Third-party AI providers have their own terms of service and privacy policies</li>
                  <li>We do not control how third-party AI providers process or store your data</li>
                </ul>

                <h3 className="text-xl font-semibold mb-2 mt-4">12.4 NO LIABILITY FOR AI CONTENT</h3>
                <p className="text-muted-foreground mb-2 font-semibold">
                  THE OPERATOR IS NOT LIABLE FOR:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Any actions you take based on AI-generated responses</li>
                  <li>Any inaccuracies, errors, or omissions in AI responses</li>
                  <li>Any harm, damages, or losses arising from AI interactions</li>
                  <li>Any decisions made in reliance on AI-generated information</li>
                  <li>The availability, reliability, or performance of AI features</li>
                </ul>

                <h3 className="text-xl font-semibold mb-2 mt-4">12.5 PROHIBITED AI CONDUCT</h3>
                <p className="text-muted-foreground mb-2">
                  When using AI features, you agree NOT to:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Attempt to manipulate, "jailbreak," or bypass AI safety measures</li>
                  <li>Use AI features to generate harmful, inappropriate, or prohibited content</li>
                  <li>Submit malicious prompts designed to produce dangerous or illegal outputs</li>
                  <li>Abuse or overload AI features in a way that degrades service for other users</li>
                </ul>

                <h3 className="text-xl font-semibold mb-2 mt-4">12.6 AI SERVICE LIMITATIONS</h3>
                <p className="text-muted-foreground">
                  AI features may be unavailable, rate-limited, or discontinued at any time without notice. 
                  We reserve the right to modify, suspend, or terminate AI features at our sole discretion. 
                  The operator has no obligation to provide AI features or maintain their availability.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">13. Changes to Terms</h2>
                <p className="text-muted-foreground">
                  We may update these terms at any time. Continued use of the Service after changes constitutes
                  acceptance of the updated terms. We encourage users to review this page periodically.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">13. Choice of Law and Jurisdiction</h2>

                <h3 className="text-xl font-semibold mb-2 mt-4">13.1 CHOICE OF LAW</h3>
                <p className="text-muted-foreground">
                  These Terms shall be governed by and construed in accordance with the laws of the{" "}
                  <strong>State of California, United States of America</strong>, without regard to its conflict of law
                  principles. This choice of law applies regardless of the location of the operator or users.
                </p>

                <h3 className="text-xl font-semibold mb-2 mt-4">13.2 EXCLUSIVE VENUE</h3>
                <p className="text-muted-foreground mb-2 font-semibold">
                  YOU AGREE that any dispute, claim, or controversy arising out of or relating to these Terms or your
                  use of the Service shall be brought EXCLUSIVELY in the state or federal courts located in{" "}
                  <strong>Santa Clara County, California</strong>, regardless of where the parties reside.
                </p>
                <p className="text-muted-foreground">
                  YOU HEREBY IRREVOCABLY CONSENT to the personal jurisdiction of such courts and WAIVE any objection to
                  venue in such courts, including but not limited to any claim that such forum is inconvenient.
                </p>

                <h3 className="text-xl font-semibold mb-2 mt-4">13.3 WAIVER OF UNKNOWN CLAIMS</h3>
                <p className="text-muted-foreground">
                  You hereby waive any rights similar to California Civil Code Section 1542, which states:{" "}
                  <em>
                    "A general release does not extend to claims that the creditor or releasing party does not know or
                    suspect to exist in his or her favor at the time of executing the release and that, if known by him
                    or her, would have materially affected his or her settlement with the debtor or released party."
                  </em>{" "}
                  You acknowledge that you may later discover facts or incur damages currently unknown, and you waive
                  any right to seek additional compensation for such unknown claims.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">14. Severability and Interpretation</h2>
                <p className="text-muted-foreground mb-3">
                  If any provision of these Terms is found to be invalid, illegal, or unenforceable by a court of
                  competent jurisdiction, such provision shall be modified to the minimum extent necessary to make it
                  valid and enforceable while preserving the intent of maximum liability protection for the operator.
                </p>
                <p className="text-muted-foreground mb-3">
                  If a provision cannot be modified to be enforceable, it shall be severed, and all other provisions
                  shall remain in full force and effect. The invalidity of any provision shall not affect the validity
                  or enforceability of any other provision.
                </p>
                <p className="text-muted-foreground">
                  In interpreting these Terms, no presumption shall operate in favor of or against either party. These
                  Terms shall be construed to provide the maximum protection from liability permitted by law.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">15. Contact</h2>
                <p className="text-muted-foreground">
                  For questions about these terms, please contact the project maintainers through the official GitHub
                  repository.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">
                  16. Dispute Resolution, Arbitration, and Class Action Waiver
                </h2>

                <h3 className="text-xl font-semibold mb-2 mt-4">16.1 MANDATORY BINDING ARBITRATION</h3>
                <p className="text-muted-foreground mb-2 font-semibold">
                  READ THIS SECTION CAREFULLY. IT AFFECTS YOUR LEGAL RIGHTS.
                </p>
                <p className="text-muted-foreground mb-3">
                  YOU AGREE that any dispute, claim, or controversy arising out of or relating to these Terms or your
                  use of the Service (except as provided in Section 16.5){" "}
                  <strong>SHALL BE RESOLVED EXCLUSIVELY THROUGH BINDING INDIVIDUAL ARBITRATION, NOT IN COURT</strong>.
                  You waive your right to a trial by jury.
                </p>

                <h3 className="text-xl font-semibold mb-2 mt-4">16.2 ARBITRATION PROCEDURES</h3>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>
                    The arbitration shall be administered by JAMS (Judicial Arbitration and Mediation Services) under
                    its Streamlined Arbitration Rules and Procedures
                  </li>
                  <li>
                    The arbitration shall take place in <strong>Santa Clara County, California</strong>
                  </li>
                  <li>The arbitration shall be conducted in English</li>
                  <li>Each party shall bear their own costs and attorney's fees (subject to Section 17)</li>
                  <li>The arbitrator's decision shall be final and binding</li>
                  <li>Judgment on the arbitration award may be entered in any court having jurisdiction</li>
                </ul>

                <h3 className="text-xl font-semibold mb-2 mt-4">16.3 CLASS ACTION WAIVER</h3>
                <p className="text-muted-foreground mb-2 font-semibold">
                  YOU AGREE TO BRING CLAIMS AGAINST THE OPERATOR ONLY IN YOUR INDIVIDUAL CAPACITY and not as a plaintiff
                  or class member in any purported class, representative, or collective proceeding.
                </p>
                <p className="text-muted-foreground">
                  YOU WAIVE ANY RIGHT TO PARTICIPATE IN A CLASS ACTION LAWSUIT OR CLASS-WIDE ARBITRATION against the
                  operator.
                </p>

                <h3 className="text-xl font-semibold mb-2 mt-4">16.4 WAIVER OF JURY TRIAL</h3>
                <p className="text-muted-foreground font-semibold">
                  YOU HEREBY WAIVE YOUR RIGHT TO A TRIAL BY JURY for any disputes related to this Service.
                </p>

                <h3 className="text-xl font-semibold mb-2 mt-4">16.5 EXCEPTIONS</h3>
                <p className="text-muted-foreground">
                  Either party may seek injunctive or other equitable relief in court to protect intellectual property
                  rights or confidential information without first engaging in arbitration.
                </p>

                <h3 className="text-xl font-semibold mb-2 mt-4">16.6 OPT-OUT</h3>
                <p className="text-muted-foreground">
                  You may opt out of this arbitration agreement by sending written notice to the operator within 30 days
                  of first using the Service. If you opt out, all other terms still apply, but disputes will be resolved
                  in the courts specified in Section 13.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">17. Attorney's Fees and Prevailing Party</h2>
                <p className="text-muted-foreground mb-3">
                  In any legal action, arbitration, or other proceeding brought to enforce or interpret these Terms, the
                  prevailing party shall be entitled to recover all reasonable attorney's fees, costs, and expenses from
                  the non-prevailing party. This includes but is not limited to costs of investigation, litigation,
                  arbitration fees, expert witness fees, and appeal costs.
                </p>
                <p className="text-muted-foreground">
                  If you bring a claim against the operator that is found to be frivolous, without merit, or brought in
                  bad faith, you agree to reimburse the operator for all costs incurred in defending against such claim.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">18. Force Majeure</h2>
                <p className="text-muted-foreground mb-2">
                  The operator shall not be liable for any failure or delay in performance of the Service due to
                  circumstances beyond reasonable control, including but not limited to:
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
                  In such events, the operator's obligations shall be suspended for the duration of the force majeure
                  event, and you waive any claims for damages arising from such delays or failures.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">19. Third-Party Venues, Services, and Equipment</h2>
                <p className="text-muted-foreground mb-2">
                  SquadUp is a platform that connects users for sports activities. We DO NOT own, operate, inspect,
                  supervise, or have any control over:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Sports venues, fields, courts, gyms, or facilities where games take place</li>
                  <li>Equipment used during games (balls, nets, protective gear, etc.)</li>
                  <li>The conduct, qualifications, or safety practices of game hosts or participants</li>
                  <li>Transportation to or from game locations</li>
                  <li>Any third-party services or products you may use in connection with SquadUp</li>
                </ul>
                <p className="text-muted-foreground mb-2 mt-3 font-semibold">
                  YOU ASSUME ALL RISKS associated with third-party venues, services, and equipment. The operator has no
                  responsibility or liability for:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Safety, condition, or suitability of venues or equipment</li>
                  <li>Rules, policies, or restrictions imposed by third-party venue operators</li>
                  <li>Injuries or damages caused by defective equipment or unsafe facilities</li>
                  <li>Compliance with local ordinances, permits, or regulations for using public or private spaces</li>
                  <li>Access restrictions, closures, or changes to third-party venues</li>
                </ul>
                <p className="text-muted-foreground mt-3">
                  It is YOUR responsibility to verify the suitability, safety, and legality of any venue or equipment
                  before participating in any game organized through SquadUp.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">19.1 Publicity Rights and User Images</h2>
                <p className="text-muted-foreground mb-2 font-semibold">
                  By uploading photos, videos, or other media containing images of yourself or others, you represent and
                  warrant that:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>You have obtained express consent from all identifiable individuals depicted in the media</li>
                  <li>You have the right to grant SquadUp the license specified in Section 11.5.2</li>
                  <li>
                    The use of such images does not violate any person's privacy, publicity, or other personal rights
                  </li>
                  <li>
                    No individual depicted is a minor under 18 years of age, or if they are, you have obtained
                    verifiable parental/guardian consent
                  </li>
                </ul>
                <p className="text-muted-foreground mb-2 mt-3">
                  <strong>Unauthorized Use of Likeness:</strong> SquadUp is not responsible for unauthorized use of your
                  image or likeness by other users. If someone uploads media containing your image without your consent,
                  you may request removal by contacting us through the channels in Section 21.
                </p>
                <p className="text-muted-foreground mt-3">
                  <strong>Removal Requests:</strong> To request removal of media containing your likeness, provide: (1)
                  identification of the specific content, (2) proof of your identity, and (3) an explanation of why the
                  content should be removed. We will review requests at our sole discretion but are not obligated to
                  remove content.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">19.2 Third-Party Links and External Services</h2>
                <p className="text-muted-foreground mb-2">
                  SquadUp may contain links to third-party websites, services, or integrations (e.g., mapping services,
                  social media, payment processors). These links are provided for your convenience only.
                </p>
                <p className="text-muted-foreground mb-2 font-semibold">
                  WE DO NOT ENDORSE, CONTROL, OR ASSUME RESPONSIBILITY FOR:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>The content, privacy policies, or practices of any third-party websites or services</li>
                  <li>Any products, services, or information offered by third parties</li>
                  <li>The accuracy, legality, or appropriateness of third-party content</li>
                  <li>Any damages or losses arising from your use of third-party services</li>
                </ul>
                <p className="text-muted-foreground mt-3">
                  Your interactions with third-party services are solely between you and the third party. You should
                  review the terms and privacy policies of any third-party services you access through SquadUp.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">20. Volunteer Protection and Immunity</h2>
                <p className="text-muted-foreground mb-2">
                  To the extent permitted by law, including but not limited to the California Volunteer Protection Act
                  and similar statutes, the operator and contributors to SquadUp are entitled to immunity from liability
                  as volunteers providing services without compensation to a non-profit community project.
                </p>
                <p className="text-muted-foreground">You acknowledge that:</p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>The operator provides this Service on a volunteer basis without pay</li>
                  <li>The Service is offered as a community benefit without profit motive</li>
                  <li>Any actions taken by the operator are in good faith</li>
                  <li>You will not hold volunteers liable for ordinary negligence in providing this free Service</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">21. Notice and Contact Information</h2>
                <p className="text-muted-foreground mb-2">
                  For questions, notices, or concerns regarding these Terms or the Service, please contact us through:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>
                    GitHub Issues:{" "}
                    <a
                      href="https://github.com/SudarshanaSRao/sports-on-the-go-4c575e84"
                      className="text-primary hover:underline"
                    >
                      github.com/SudarshanaSRao/sports-on-the-go-4c575e84
                    </a>
                  </li>
                </ul>
                <h3 className="text-xl font-semibold mb-2 mt-4">Age Verification and Account Issues</h3>
                <p className="text-muted-foreground mb-2">
                  For age verification inquiries, account termination appeals, or serious policy violations, use the
                  contact methods above and mark your message as "URGENT: [Issue Type]".
                </p>

                <p className="text-muted-foreground mt-4">
                  As this is a volunteer-operated project, response times may vary. We will make reasonable efforts to
                  respond to inquiries but do not guarantee specific response timeframes. DMCA notices and urgent legal
                  matters will be prioritized.
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
