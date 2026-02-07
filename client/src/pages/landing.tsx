import { Link } from "wouter";

const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/fZu14p2zwdRi7OZajE67S02";
const STRIPE_COHORT_LINK = "https://buy.stripe.com/aFa5kF8XU28A2uF63o67S03";
const STRIPE_MEMBERSHIP_LINK = "https://buy.stripe.com/bJeeVf1vscNe8T38bw67S04";

export default function Landing() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-[#0b0f14] text-[#e8eef7]" style={{
      background: `radial-gradient(1200px 900px at 20% 0%, rgba(123,215,255,.10), transparent 55%),
                   radial-gradient(900px 800px at 90% 10%, rgba(198,255,154,.08), transparent 55%),
                   #0b0f14`
    }}>
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-[rgba(11,15,20,.70)] border-b border-[rgba(32,48,68,.65)]">
        <div className="max-w-[1050px] mx-auto px-5 py-3.5 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5 font-bold tracking-wide">
            <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-[#7bd7ff] to-[#c6ff9a] shadow-[0_0_22px_rgba(123,215,255,.35)]" aria-hidden="true"></span>
            <span>Awakened Miracles</span>
          </div>
          <nav className="flex flex-wrap gap-3.5 text-sm text-[#b6c2d3]" aria-label="Site navigation">
            <a href="#program" className="hover:text-[#e8eef7] transition-colors">Program</a>
            <a href="#founders" className="hover:text-[#e8eef7] transition-colors">Founders</a>
            <a href="#modules" className="hover:text-[#e8eef7] transition-colors">Modules</a>
            <a href="#ethics" className="hover:text-[#e8eef7] transition-colors">Ethics</a>
            <a href="#pricing" className="hover:text-[#e8eef7] transition-colors">Pricing</a>
            <a href="#cohort" className="hover:text-[#e8eef7] transition-colors">Founding Cohort</a>
            <a href="#disclaimer" className="hover:text-[#e8eef7] transition-colors">Disclaimer</a>
            <Link href="/student-login" className="text-[#7bd7ff] hover:underline">Student Login</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-[1050px] mx-auto px-5 py-7 pb-20">
        {/* HERO */}
        <section className="grid lg:grid-cols-[1.3fr_.9fr] gap-4 mt-4" id="program">
          <div className="bg-gradient-to-b from-[rgba(18,28,40,.95)] to-[rgba(15,22,32,.95)] border border-[rgba(32,48,68,.8)] shadow-[0_8px_30px_rgba(0,0,0,.35)] rounded-[18px] p-5">
            <div className="text-xs tracking-[.12em] uppercase text-[#b6c2d3]">Flagship Training Program</div>
            <h1 className="text-3xl lg:text-4xl font-bold mt-2 mb-2.5 leading-tight">Applied Spiritual Counseling Practitioner Program</h1>
            <p className="text-[#b6c2d3] mb-4">
              Train as a grounded, ethical spiritual counselor—using structured tools you can actually apply.
              This comprehensive training is designed for spiritually conscious individuals who feel called to support others
              through illness, trauma, grief, and spiritual awakening in a responsible, professional way.
            </p>

            <div className="flex flex-wrap gap-2.5 mt-3.5" aria-label="Program highlights">
              {["12-week structure", "Ethics + boundaries", "Trauma-informed orientation", "Practical frameworks", "Certificate of completion"].map((pill) => (
                <span key={pill} className="text-xs py-1.5 px-2.5 rounded-full border border-[rgba(32,48,68,.9)] bg-[rgba(11,15,20,.35)] text-[#b6c2d3]">{pill}</span>
              ))}
            </div>

            <div className="flex flex-wrap gap-2.5 mt-4">
              <a href="#pricing" className="inline-flex items-center justify-center py-2.5 px-3.5 rounded-xl border border-[rgba(123,215,255,.55)] bg-gradient-to-br from-[rgba(123,215,255,.18)] to-[rgba(198,255,154,.10)] text-[#e8eef7] font-semibold text-sm hover:from-[rgba(123,215,255,.24)] hover:to-[rgba(198,255,154,.16)] transition-all" data-testid="view-enrollment">View Enrollment Options</a>
              <a href="mailto:info@awakenedmiracles.life?subject=Applied%20Spiritual%20Counseling%20Program%20-%20Question" className="inline-flex items-center justify-center py-2.5 px-3.5 rounded-xl border border-[rgba(32,48,68,.9)] bg-[rgba(11,15,20,.45)] text-[#e8eef7] font-semibold text-sm hover:bg-[rgba(18,28,40,.65)] transition-all" data-testid="ask-question">Ask a Question</a>
              <a href="#cohort" className="inline-flex items-center justify-center py-2.5 px-3.5 rounded-xl border border-[rgba(255,212,138,.55)] bg-[rgba(255,212,138,.08)] text-[#e8eef7] font-semibold text-sm hover:bg-[rgba(255,212,138,.12)] transition-all" data-testid="founding-cohort">Founding Cohort Details</a>
            </div>

            <div className="h-px bg-[rgba(32,48,68,.8)] my-4"></div>

            <div className="grid md:grid-cols-2 gap-3.5">
              <div>
                <h2 className="text-xl font-bold mb-2.5">This Program Is For You If</h2>
                <ul className="list-disc pl-4 text-[#b6c2d3] space-y-1.5">
                  <li>You feel called to support others spiritually, but you want structure—not guesswork.</li>
                  <li>You want ethical guidance, boundaries, and professional standards.</li>
                  <li>You have lived experience (illness, trauma, awakening) and want to translate it into responsible service.</li>
                  <li>You want practical counseling tools—clear language, session structure, and stabilization techniques.</li>
                  <li>You want to begin practicing with confidence (paid or unpaid), within an appropriate scope.</li>
                </ul>
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2.5">This Program Is Not</h2>
                <ul className="list-disc pl-4 text-[#b6c2d3] space-y-1.5">
                  <li>A replacement for licensed therapy or medical treatment.</li>
                  <li>A course that encourages unchecked intuition without discernment and safety practices.</li>
                  <li>A purely mystical exploration without professional application.</li>
                  <li>A guarantee of specific outcomes for clients (ethical practice emphasizes responsible process and appropriate referral).</li>
                </ul>
              </div>
            </div>

            <div className="border border-[rgba(123,215,255,.35)] bg-[rgba(123,215,255,.06)] rounded-2xl p-4 mt-4">
              <strong className="text-[#e8eef7]">Outcome-focused promise:</strong>
              <span className="text-[#b6c2d3] ml-1">
                By completion, you will be able to hold safe, grounded spiritual counseling sessions; apply ethical boundaries;
                support clients navigating illness, grief, trauma, and awakening; and communicate clearly while staying within a responsible scope of practice.
              </span>
            </div>
          </div>

          <aside className="bg-gradient-to-b from-[rgba(18,28,40,.95)] to-[rgba(15,22,32,.95)] border border-[rgba(32,48,68,.8)] shadow-[0_8px_30px_rgba(0,0,0,.35)] rounded-[18px] p-5">
            <h2 className="text-xl font-bold mb-2.5">What You Will Be Able to Do</h2>
            <ul className="list-disc pl-4 text-[#b6c2d3] space-y-1.5">
              <li>Conduct grounded, client-centered spiritual counseling sessions.</li>
              <li>Use structured frameworks instead of relying solely on intuition.</li>
              <li>Recognize when a client needs referral to licensed professionals.</li>
              <li>Support people through grief, illness, trauma responses, and awakening dynamics.</li>
              <li>Practice with ethical boundaries, clarity, and stability.</li>
            </ul>

            <div className="h-px bg-[rgba(32,48,68,.8)] my-4"></div>

            <h2 className="text-xl font-bold mb-2.5">Format</h2>
            <p className="text-[#b6c2d3] text-sm"><span className="inline-block text-xs py-1 px-2 rounded-full border border-[rgba(32,48,68,.85)] bg-[rgba(11,15,20,.25)] mr-2 mb-2">Duration</span> 12 weeks</p>
            <p className="text-[#b6c2d3] text-sm"><span className="inline-block text-xs py-1 px-2 rounded-full border border-[rgba(32,48,68,.85)] bg-[rgba(11,15,20,.25)] mr-2 mb-2">Delivery</span> Pre-recorded core lessons + weekly guided support (cohort tier)</p>
            <p className="text-[#b6c2d3] text-sm"><span className="inline-block text-xs py-1 px-2 rounded-full border border-[rgba(32,48,68,.85)] bg-[rgba(11,15,20,.25)] mr-2 mb-2">Certificate</span> Certificate of Completion (Foundational Practitioner Training)</p>

            <div className="text-sm text-[#b6c2d3] border-l-[3px] border-[rgba(123,215,255,.55)] pl-2.5 mt-4">
              Tip: If you are building toward professional practice, the guided cohort is recommended for accountability, structure,
              and feedback.
            </div>
          </aside>
        </section>

        {/* FOUNDERS */}
        <section className="mt-4 bg-gradient-to-b from-[rgba(18,28,40,.95)] to-[rgba(15,22,32,.95)] border border-[rgba(32,48,68,.8)] shadow-[0_8px_30px_rgba(0,0,0,.35)] rounded-[18px] p-5" id="founders">
          <h2 className="text-xl font-bold mb-2.5">Meet the Founders</h2>
          <p className="text-[#b6c2d3]">
            The Awakened Miracles program was created by two pioneering spiritual counselors with over <strong className="text-[#e8eef7]">60 years of combined experience</strong> in the field.
          </p>

          <div className="grid md:grid-cols-2 gap-3.5 mt-4">
            <div className="border border-[rgba(123,215,255,.35)] bg-[rgba(123,215,255,.06)] rounded-2xl p-4">
              <h3 className="text-lg font-bold mb-2">Katherine Kenedi</h3>
              <p className="text-[#b6c2d3]">
                Co-Founder and author of the "Awakened Miracles Program, Your Course From Source" video training course. 
                Katherine brings decades of experience in spiritual counseling and has dedicated her life to helping others 
                navigate their spiritual awakening with grounded, ethical practices.
              </p>
            </div>

            <div className="border border-[rgba(198,255,154,.35)] bg-[rgba(198,255,154,.06)] rounded-2xl p-4">
              <h3 className="text-lg font-bold mb-2">Rochelle "Shelley" Stockwell-Nicholas</h3>
              <p className="text-[#b6c2d3]">
                Co-Founder and co-author of "Shelley and Kathi's Spiritual Counselor Secrets." 
                Shelley's profound wisdom and extensive experience in spiritual counseling have been instrumental 
                in shaping the ethical foundations and practical frameworks that define this program.
              </p>
            </div>
          </div>

          <div className="text-sm text-[#b6c2d3] border-l-[3px] border-[rgba(123,215,255,.55)] pl-2.5 mt-4">
            Together, Katherine and Shelley created a comprehensive training program that combines their decades of expertise, 
            ensuring students receive time-tested wisdom and professional-grade spiritual counseling education.
          </div>
        </section>

        {/* MODULES */}
        <section className="mt-4 bg-gradient-to-b from-[rgba(18,28,40,.95)] to-[rgba(15,22,32,.95)] border border-[rgba(32,48,68,.8)] shadow-[0_8px_30px_rgba(0,0,0,.35)] rounded-[18px] p-5" id="modules">
          <h2 className="text-xl font-bold mb-2.5">Program Modules (Professional Training)</h2>
          <p className="text-[#b6c2d3]">
            These modules are designed to translate spiritual depth into professional competence, ethical practice, and responsible application.
          </p>

          <div className="h-px bg-[rgba(32,48,68,.8)] my-4"></div>

          {[
            { title: "Module 1: Psychic Professionalism – How to Give a Great Reading", desc: "This foundational module establishes professional standards for intuitive and spiritual counseling work. Students learn how to deliver clear, ethical, and grounded readings while maintaining appropriate boundaries and client safety.", outcomes: "Conduct responsible readings; maintain ethical/energetic boundaries; communicate insights without causing harm." },
            { title: "Module 2: Consciousness and YOU", desc: "Develop practitioner self-awareness by exploring states of consciousness and the role of the counselor as observer rather than authority. Learn how beliefs, emotional states, and unconscious material influence sessions.", outcomes: "Increased self-regulation; reduced projection; stronger presence and professional grounding." },
            { title: "Module 3: Channeling (Discernment & Responsible Application)", desc: "Channeling is approached through discernment, ethics, and accountability. This module teaches how to evaluate intuitive information, communicate responsibly, and recognize when channeling is appropriate.", outcomes: "Ethical use of intuitive info; discernment between insight and imagination; safe communication practices." },
            { title: "Module 4: Shamanism (Symbolic Healing Frameworks)", desc: "Explore shamanic principles as symbolic frameworks rather than role adoption. Learn how to responsibly apply concepts without cultural misuse, spiritual inflation, or mythologizing.", outcomes: "Ethical use of symbolic models; clear boundaries around spiritual roles; practical application." },
            { title: "Module 5: Soul Encounters (Grief, Loss, and Spiritual Experience)", desc: "Learn how to support individuals reporting spiritual experiences around grief, loss, or perceived contact. Focus is placed on emotional containment, meaning-making, and psychological safety.", outcomes: "Support grief-related phenomena safely; hold space without reinforcing delusion; facilitate integration." },
            { title: "Module 6: Counseling Stabilization & Safety Tools (Heads Up Tools)", desc: "Practical tools for grounding, stabilization, and emotional regulation during sessions. Learn how to respond when clients become overwhelmed, dysregulated, or dissociated.", outcomes: "De-escalation methods; session stabilization strategies; increased client safety and trust." },
            { title: "Module 7: Dream Play (Therapeutic Dream Integration)", desc: "Work with dreams as symbolic material rather than predictive authority. Learn client-led exploration methods, how to avoid suggestibility, and how to support integration.", outcomes: "Facilitate safe dream exploration; avoid projection/suggestion; use dreams as integration tools." },
            { title: "Module 8: Meditation and Prayer (Grounded Spiritual Practices)", desc: "Learn non-dogmatic meditation and prayer practices that support nervous system regulation, clarity, and grounding. Students learn how to guide stabilizing practices.", outcomes: "Guide safe grounding practices; support regulation; avoid bypassing and destabilizing approaches." },
            { title: "Module 9: Mental Telepathy (Intuitive Empathy & Boundaries)", desc: "\"Telepathy\" is reframed as intuitive empathy and heightened perception—handled with ethical boundaries. Learn how to avoid mind-reading assumptions and communicate with precision.", outcomes: "Distinguish intuition from projection; maintain ethical communication boundaries; reduce overreach." },
            { title: "Module 10: Time Travel (Symbolic Timeline & Trauma-Informed Work)", desc: "Time-based experiences are approached as symbolic narrative processes. Learn to work with memory and personal timelines responsibly—without false-memory creation.", outcomes: "Support timeline exploration safely; avoid false-memory risk; facilitate trauma-informed integration." },
            { title: "Module 11: Out of Body Journeys (Altered States & Integration)", desc: "Learn to support clients reporting altered-state experiences while prioritizing grounding and reintegration. This module emphasizes recognizing dissociation indicators.", outcomes: "Identify dissociation vs spiritual experience; support reintegration; apply appropriate referral decisions." },
            { title: "Module 12: Integration & Readiness to Practice", desc: "The capstone module focuses on integration, ethical readiness, and professional self-assessment. Students review case studies, clarify scope of practice, and develop a grounded framework.", outcomes: "Assess readiness; clarify ethical scope/limits; receive Certificate of Completion." }
          ].map((module, index) => (
            <article key={index} className="mt-4">
              <h3 className="text-lg font-bold mb-2">{module.title}</h3>
              <p className="text-[#b6c2d3]">{module.desc}</p>
              <p className="text-sm mt-2"><strong>Key outcomes:</strong> {module.outcomes}</p>
            </article>
          ))}
        </section>

        {/* ETHOS & ETHICS */}
        <section className="mt-4 bg-gradient-to-b from-[rgba(18,28,40,.95)] to-[rgba(15,22,32,.95)] border border-[rgba(32,48,68,.8)] shadow-[0_8px_30px_rgba(0,0,0,.35)] rounded-[18px] p-5" id="ethics">
          <h2 className="text-xl font-bold mb-2.5">Program Ethos & Ethics</h2>
          <p className="text-[#b6c2d3]">
            Awakened Miracles is committed to responsible spiritual counseling education. This program prioritizes client safety, ethical boundaries, and professional integrity.
          </p>

          <div className="grid md:grid-cols-2 gap-3.5 mt-4">
            <div className="border border-[rgba(123,215,255,.35)] bg-[rgba(123,215,255,.06)] rounded-2xl p-4">
              <h3 className="text-lg font-bold mb-2">Ethical Standards</h3>
              <ul className="list-disc pl-4 text-[#b6c2d3] space-y-1.5">
                <li>Client welfare and psychological safety come first.</li>
                <li>Clear boundaries and informed consent are required.</li>
                <li>Students learn how to avoid projection, suggestion, and dependency dynamics.</li>
                <li>We teach discernment: knowing when to slow down, stabilize, or refer out.</li>
              </ul>
            </div>

            <div className="border border-[rgba(255,212,138,.45)] bg-[rgba(255,212,138,.06)] rounded-2xl p-4">
              <h3 className="text-lg font-bold mb-2">Responsible Scope</h3>
              <ul className="list-disc pl-4 text-[#b6c2d3] space-y-1.5">
                <li>Spiritual counseling is not a substitute for therapy or medical care.</li>
                <li>We do not diagnose, treat, or cure medical or mental health conditions.</li>
                <li>We emphasize collaboration and referral to licensed professionals when appropriate.</li>
                <li>We teach grounded application, not sensationalism.</li>
              </ul>
            </div>
          </div>

          <div className="text-sm text-[#b6c2d3] border-l-[3px] border-[rgba(123,215,255,.55)] pl-2.5 mt-4">
            This ethos protects students, clients, and the long-term credibility of your practice.
          </div>
        </section>

        {/* PRICING */}
        <section className="mt-4 bg-gradient-to-b from-[rgba(18,28,40,.95)] to-[rgba(15,22,32,.95)] border border-[rgba(32,48,68,.8)] shadow-[0_8px_30px_rgba(0,0,0,.35)] rounded-[18px] p-5" id="pricing">
          <h2 className="text-xl font-bold mb-2.5">Enrollment Options</h2>
          <p className="text-[#b6c2d3]">
            Choose the level of support that fits your goals. The guided cohort is recommended for students who want structure, accountability, and guided integration.
          </p>

          <div className="grid lg:grid-cols-3 gap-3.5 mt-4">
            <div className="bg-[rgba(11,15,20,.35)] border border-[rgba(32,48,68,.8)] rounded-2xl p-4">
              <div className="flex justify-between items-baseline gap-2.5 mb-2.5">
                <div className="font-bold">Self-Paced Program</div>
                <div className="font-extrabold text-xl">$597</div>
              </div>
              <ul className="list-disc pl-4 text-[#b6c2d3] space-y-1.5 mb-4">
                <li>Full program access</li>
                <li>All modules + tools</li>
                <li>Certificate of Completion</li>
                <li>Best for independent learners</li>
              </ul>
              <a href={STRIPE_PAYMENT_LINK} className="inline-flex w-full items-center justify-center py-2.5 px-3.5 rounded-xl border border-[rgba(123,215,255,.55)] bg-gradient-to-br from-[rgba(123,215,255,.18)] to-[rgba(198,255,154,.10)] text-[#e8eef7] font-semibold text-sm hover:from-[rgba(123,215,255,.24)] hover:to-[rgba(198,255,154,.16)] transition-all" data-testid="enroll-self-paced">Enroll (Self-Paced)</a>
            </div>

            <div className="bg-[rgba(11,15,20,.35)] border border-[rgba(32,48,68,.8)] rounded-2xl p-4">
              <div className="flex justify-between items-baseline gap-2.5 mb-2.5">
                <div className="font-bold">Guided Cohort (Recommended)</div>
                <div className="font-extrabold text-xl">$1,497</div>
              </div>
              <ul className="list-disc pl-4 text-[#b6c2d3] space-y-1.5 mb-4">
                <li>Everything in Self-Paced</li>
                <li>Weekly guided support (live or recorded)</li>
                <li>Community accountability</li>
                <li>Structured progression</li>
              </ul>
              <a href={STRIPE_COHORT_LINK} className="inline-flex w-full items-center justify-center py-2.5 px-3.5 rounded-xl border border-[rgba(123,215,255,.55)] bg-gradient-to-br from-[rgba(123,215,255,.18)] to-[rgba(198,255,154,.10)] text-[#e8eef7] font-semibold text-sm hover:from-[rgba(123,215,255,.24)] hover:to-[rgba(198,255,154,.16)] transition-all" data-testid="enroll-guided">Enroll (Guided Cohort)</a>
            </div>

            <div className="bg-[rgba(11,15,20,.35)] border border-[rgba(32,48,68,.8)] rounded-2xl p-4">
              <div className="flex justify-between items-baseline gap-2.5 mb-2.5">
                <div className="font-bold">Membership Add-On</div>
                <div className="font-extrabold text-xl">$2,997</div>
              </div>
              <ul className="list-disc pl-4 text-[#b6c2d3] space-y-1.5 mb-4">
                <li>Everything in Guided Cohort</li>
                <li>Small-group or 1:1 supervision</li>
                <li>Case review and readiness support</li>
                <li>Best for aspiring practitioners</li>
              </ul>
              <a href={STRIPE_MEMBERSHIP_LINK} className="inline-flex w-full items-center justify-center py-2.5 px-3.5 rounded-xl border border-[rgba(123,215,255,.55)] bg-gradient-to-br from-[rgba(123,215,255,.18)] to-[rgba(198,255,154,.10)] text-[#e8eef7] font-semibold text-sm hover:from-[rgba(123,215,255,.24)] hover:to-[rgba(198,255,154,.16)] transition-all" data-testid="enroll-membership">Enroll (Membership Add-On)</a>
            </div>
          </div>

          <div className="h-px bg-[rgba(32,48,68,.8)] my-4"></div>

          <div className="border border-[rgba(255,154,169,.45)] bg-[rgba(255,154,169,.06)] rounded-2xl p-4">
            <h3 className="text-lg font-bold mb-2">Professional note on pricing</h3>
            <p className="text-[#b6c2d3]">
              If you plan to train practitioners, pricing should reflect responsibility and seriousness. Underpricing reduces trust and follow-through.
              These tiers support commitment and sustainable delivery.
            </p>
          </div>
        </section>

        {/* FOUNDING COHORT */}
        <section className="mt-4 bg-gradient-to-b from-[rgba(18,28,40,.95)] to-[rgba(15,22,32,.95)] border border-[rgba(32,48,68,.8)] shadow-[0_8px_30px_rgba(0,0,0,.35)] rounded-[18px] p-5" id="cohort">
          <h2 className="text-xl font-bold mb-2.5">Founding Cohort (Limited Seats)</h2>
          <p className="text-[#b6c2d3]">
            The Founding Cohort is the fastest, most effective way to launch this program with real students, real feedback, and real income—without overbuilding.
            Founding students receive early access, direct guidance, and founding pricing.
          </p>

          <div className="grid md:grid-cols-2 gap-3.5 mt-4">
            <div className="border border-[rgba(123,215,255,.35)] bg-[rgba(123,215,255,.06)] rounded-2xl p-4">
              <h3 className="text-lg font-bold mb-2">What Founding Students Receive</h3>
              <ul className="list-disc pl-4 text-[#b6c2d3] space-y-1.5">
                <li>Guided cohort access</li>
                <li>Weekly guidance sessions (live or recorded)</li>
                <li>Direct integration support</li>
                <li>Founding cohort recognition</li>
                <li>Early access to updates and improvements</li>
              </ul>
            </div>

            <div className="border border-[rgba(255,212,138,.45)] bg-[rgba(255,212,138,.06)] rounded-2xl p-4">
              <h3 className="text-lg font-bold mb-2">Founding Cohort Pricing</h3>
              <p className="text-[#b6c2d3]">
                Recommended founding price (limited time): <strong className="text-[#e8eef7]">$997</strong> for the Guided Cohort tier.
              </p>
              <p className="text-[#b6c2d3] text-sm mt-2">
                Use this to validate demand, collect testimonials, and refine. After the founding cohort, return to standard pricing.
              </p>
              <a href={STRIPE_PAYMENT_LINK} className="inline-flex mt-4 items-center justify-center py-2.5 px-3.5 rounded-xl border border-[rgba(255,212,138,.55)] bg-[rgba(255,212,138,.08)] text-[#e8eef7] font-semibold text-sm hover:bg-[rgba(255,212,138,.12)] transition-all" data-testid="enroll-founding">Enroll at Founding Price</a>
            </div>
          </div>

          <div className="h-px bg-[rgba(32,48,68,.8)] my-4"></div>

          <h3 className="text-lg font-bold mb-2">Founding Cohort Announcement</h3>
          <p className="text-[#b6c2d3]">
            <strong className="text-[#e8eef7]">Announcing the Founding Cohort:</strong> The Applied Spiritual Counseling Practitioner Program is now open for a limited founding cohort.
            This is a structured training for spiritually conscious individuals who feel called to support others through illness, trauma, grief, and awakening
            using grounded, ethical counseling tools.
          </p>
          <p className="text-[#b6c2d3] mt-3">
            If you want real structure, professional standards, and practical frameworks you can apply responsibly, this cohort is designed for you.
            Seats are limited to protect quality and student support.
          </p>
          <p className="text-[#b6c2d3] text-sm mt-3">
            Questions? Email: <a href="mailto:info@awakenedmiracles.life?subject=Founding%20Cohort%20Question" className="text-[#7bd7ff] hover:underline">info@awakenedmiracles.life</a>
          </p>
        </section>

        {/* DISCLAIMER */}
        <section className="mt-4 bg-gradient-to-b from-[rgba(18,28,40,.95)] to-[rgba(15,22,32,.95)] border border-[rgba(32,48,68,.8)] shadow-[0_8px_30px_rgba(0,0,0,.35)] rounded-[18px] p-5" id="disclaimer">
          <h2 className="text-xl font-bold mb-2.5">Disclaimer & Scope of Practice</h2>
          <p className="text-[#b6c2d3]">
            This statement is designed to be clear, ethical, and legally safer for spiritual counseling education.
          </p>

          <div className="border border-[rgba(255,154,169,.45)] bg-[rgba(255,154,169,.06)] rounded-2xl p-4 mt-4">
            <h3 className="text-lg font-bold mb-2">Educational Use Only</h3>
            <p className="text-[#b6c2d3]">
              Awakened Miracles provides educational content for personal and professional development. This program does not provide medical,
              psychological, psychiatric, or therapeutic diagnosis or treatment. Participation in this training does not create a therapist-client
              relationship, and the certificate offered is a certificate of completion for training—not a state or government licensure.
            </p>

            <h3 className="text-lg font-bold mb-2 mt-4">Not Medical or Mental Health Care</h3>
            <p className="text-[#b6c2d3]">
              Spiritual counseling and intuitive practices are not a substitute for licensed medical care, psychotherapy, psychiatric services,
              or crisis support. If you are experiencing a medical or mental health emergency, seek immediate assistance from local emergency services
              or a licensed professional.
            </p>

            <h3 className="text-lg font-bold mb-2 mt-4">Appropriate Referral</h3>
            <p className="text-[#b6c2d3]">
              Students are taught to recognize situations requiring referral to licensed professionals. Ethical practice includes staying within scope,
              obtaining informed consent, and prioritizing client welfare at all times.
            </p>

            <p className="text-[#b6c2d3] text-sm mt-4">
              By enrolling, students agree to use the material responsibly and to maintain appropriate professional boundaries in all client-facing settings.
            </p>
          </div>

          <div className="h-px bg-[rgba(32,48,68,.8)] my-4"></div>

          <p className="text-[#b6c2d3] text-sm">
            Co-Founders: <strong className="text-[#e8eef7]">Katherine Kenedi</strong> & <strong className="text-[#e8eef7]">Rochelle "Shelley" Stockwell-Nicholas</strong> | CEO: <strong className="text-[#e8eef7]">Dustin Read</strong><br />
            © {currentYear} Awakened Miracles. All rights reserved. | US Copyright Registration PA 2-355-489
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="max-w-[1050px] mx-auto px-5 py-5 pb-10 text-[#b6c2d3] text-sm border-t border-[rgba(32,48,68,.65)]">
        <div className="text-center space-y-2">
          <p>© {currentYear} Awakened Miracles | All content is copyrighted by <strong className="text-[#e8eef7]">Katherine Kenedi</strong> and <strong className="text-[#e8eef7]">Rochelle "Shelley" Stockwell-Nicholas</strong></p>
          <p className="text-xs">US Copyright Registration PA 2-355-489 | Unauthorized reproduction or distribution of any course materials, videos, or content is strictly prohibited.</p>
        </div>
      </footer>

      {/* Sticky CTA */}
      <div className="fixed left-0 right-0 bottom-0 bg-[rgba(11,15,20,.86)] border-t border-[rgba(32,48,68,.75)] backdrop-blur-xl py-2.5 px-3.5 flex justify-center z-50" role="region" aria-label="Enrollment call to action">
        <div className="w-full max-w-[1050px] flex items-center justify-between gap-3 flex-wrap">
          <div className="text-[#b6c2d3] text-sm">
            Ready to train as a grounded, ethical spiritual counselor?
          </div>
          <div className="flex gap-2.5 flex-wrap">
            <a href="#pricing" className="inline-flex items-center justify-center py-2.5 px-3.5 rounded-xl border border-[rgba(123,215,255,.55)] bg-gradient-to-br from-[rgba(123,215,255,.18)] to-[rgba(198,255,154,.10)] text-[#e8eef7] font-semibold text-sm hover:from-[rgba(123,215,255,.24)] hover:to-[rgba(198,255,154,.16)] transition-all" data-testid="sticky-enroll">Enroll Now</a>
            <a href="mailto:info@awakenedmiracles.life?subject=Program%20Question" className="inline-flex items-center justify-center py-2.5 px-3.5 rounded-xl border border-[rgba(32,48,68,.9)] bg-[rgba(11,15,20,.45)] text-[#e8eef7] font-semibold text-sm hover:bg-[rgba(18,28,40,.65)] transition-all" data-testid="sticky-question">Ask a Question</a>
          </div>
        </div>
      </div>
    </div>
  );
}
