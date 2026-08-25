export const insightCategories = [
  {
    id: "software-engineering",
    label: "Software Engineering",
    description: "Architecture, maintainability, testing, and production-ready systems.",
  },
  {
    id: "frontend-development",
    label: "Frontend Development",
    description: "Responsive interfaces, performance, accessibility, and modern React patterns.",
  },
  {
    id: "backend-development",
    label: "Backend Development",
    description: "APIs, services, background jobs, and dependable application logic.",
  },
  {
    id: "ai-automation",
    label: "AI & Automation",
    description: "Practical AI workflows, agents, integrations, and operational automation.",
  },
  {
    id: "saas-development",
    label: "SaaS Development",
    description: "Multi-tenant products, billing, onboarding, and sustainable product systems.",
  },
  {
    id: "devops-cloud",
    label: "DevOps & Cloud",
    description: "Deployment pipelines, infrastructure, observability, and release operations.",
  },
  {
    id: "databases-performance",
    label: "Databases & Performance",
    description: "Data modeling, query efficiency, caching, and application performance.",
  },
  {
    id: "security-reliability",
    label: "Security & Reliability",
    description: "Secure defaults, resilient workflows, permissions, and failure recovery.",
  },
  {
    id: "project-case-studies",
    label: "Project Case Studies",
    description: "Detailed breakdowns of real products, constraints, decisions, and outcomes.",
  },
  {
    id: "engineering-lessons",
    label: "Engineering Lessons",
    description: "Practical lessons collected while designing, shipping, and supporting software.",
  },
] as const;

export type InsightCategoryId = (typeof insightCategories)[number]["id"];

export type InsightSection = {
  heading: string;
  paragraphs: string[];
  points?: string[];
  visual?: {
    src: string;
    alt: string;
    label: string;
    caption: string;
  };
};

export type InsightPost = {
  slug: string;
  title: string;
  excerpt: string;
  lead: string;
  categoryId: InsightCategoryId;
  image: string;
  imageAlt: string;
  author: string;
  publishedAt: string;
  readTime: string;
  tags: string[];
  featured: boolean;
  sections: InsightSection[];
};

export const insights: InsightPost[] = [
  {
    slug: "designing-a-modular-monolith-that-can-grow-with-your-product",
    title: "Designing a Modular Monolith That Can Grow with Your Product",
    excerpt:
      "How to keep one deployable application simple to operate while giving business domains clear ownership, dependable contracts, and room to evolve.",
    lead:
      "I rarely begin a growing product by asking how quickly it can be split into services. I ask whether the team can see where one business responsibility ends and another begins. A modular monolith makes that boundary explicit while keeping deployment and operations deliberately simple.",
    categoryId: "software-engineering",
    image: "/insights/modular-monolith-architecture.webp",
    imageAlt: "A unified architectural model assembled from distinct connected modules on a technical drafting table",
    author: "Sagor Hossain",
    publishedAt: "2026-08-25",
    readTime: "10 min read",
    tags: ["Architecture", "Modularity", "Django"],
    featured: true,
    sections: [
      {
        heading: "A monolith is not the problem",
        paragraphs: [
          "The word monolith is often used as shorthand for old, tangled, or difficult software. That mixes two separate concerns. A monolith describes how an application is deployed. It says very little about whether the code inside has clear responsibilities or whether a change in billing can accidentally break customer messaging.",
          "For an early or steadily growing product, one deployable application has real advantages. A developer can run the whole system locally, a transaction can update related data atomically, and a small team can release one version without coordinating several services. The goal is not to escape those advantages. It is to stop convenience at deployment time from becoming careless coupling in the codebase.",
        ],
      },
      {
        heading: "Draw boundaries around business capabilities",
        paragraphs: [
          "I prefer to begin with the language of the product rather than a diagram of controllers, models, and utilities. Identity, subscriptions, orders, messaging, scheduling, and reporting are business capabilities. Each one has its own rules, data changes, and reasons to evolve. Those are much stronger boundaries than technical folders that every feature must cross.",
          "A useful question is: which concepts usually change together? If subscription status, invoices, plan limits, and payment retries move together, they probably belong to one billing module. A campaign may use billing information, but it should not decide how an overdue invoice changes an account. That decision remains with the module that owns the rule.",
        ],
        visual: {
          src: "/insights/modular-monolith-domain-boundaries.webp",
          alt: "A unified software architecture divided into six distinct business modules connected through narrow contracts",
          label: "Boundaries before layers",
          caption:
            "One deployment can still contain strong ownership boundaries. Each business capability keeps its rules and data while communicating through a small, intentional contract.",
        },
      },
      {
        heading: "Make ownership obvious in the codebase",
        paragraphs: [
          "A boundary only helps when the directory structure and imports make it visible. In a Django application, a domain may begin as a focused app containing its models, use cases, tasks, and API layer. In a Next.js application, a product capability can own its components, server actions, validation, and data access instead of distributing them across global folders.",
          "I do not force every module into identical ceremony. A small notification module does not need the same internal layers as billing. What matters is that another module enters through a small public surface. Reaching into a neighbor's private model, helper, or database query may save ten minutes today, but it quietly removes the boundary the architecture depends on.",
        ],
      },
      {
        heading: "Keep communication between modules boring",
        paragraphs: [
          "The healthiest cross-module communication is usually explicit and unsurprising. A module can expose a small application service, command, or query that describes what callers are allowed to request. The caller should not need to understand the internal tables or the sequence of private functions used to produce the result.",
          "Synchronous calls are appropriate when the caller needs an answer before it can continue. Events are useful when something has already happened and another module may react independently. Problems begin when every interaction becomes an event, or when a global utility layer becomes a hidden route around ownership. A boring function with a clear contract is often the better architectural decision.",
        ],
      },
      {
        heading: "Share a database without sharing ownership",
        paragraphs: [
          "A modular monolith commonly uses one physical database, and that is not a compromise to apologize for. It allows dependable transactions, straightforward backups, and simpler operations. The important distinction is between sharing infrastructure and sharing ownership of every table.",
          "Each module should own the tables and migrations behind its rules. Other modules can ask for information through a public query or consume a deliberately prepared read model. Reporting sometimes needs data from several domains, but that does not give reporting code permission to update those domains. Keeping writes behind the owner is what preserves invariants when the schema changes later.",
        ],
      },
      {
        heading: "Move slow work outside the request path",
        paragraphs: [
          "One application process does not mean every task belongs inside an HTTP request. Email delivery, search indexing, document generation, webhook calls, and large imports are usually better handled by background workers. The request can commit the important business change first, then schedule work that can be retried safely.",
          "For work that must not disappear between the database commit and the queue, an outbox record provides a dependable handoff. I keep events in past tense, include stable identifiers, and design handlers to tolerate delivery more than once. Just as importantly, failed jobs need an owner, useful context, and a recovery path. Asynchronous code without operational visibility is only delayed uncertainty.",
        ],
      },
      {
        heading: "Test contracts, not private choreography",
        paragraphs: [
          "A modular design changes what deserves testing. The most valuable tests exercise a module through its public use cases: create a subscription, reserve stock, schedule a campaign, or reject an action the current role cannot perform. Integration tests verify persistence and infrastructure at the boundary, while a smaller set of end-to-end tests protects the journeys customers depend on.",
          "Tests that mirror every private method make refactoring expensive without proving much about behavior. I also like lightweight architecture checks that prevent forbidden imports between modules. They are not glamorous, but they catch boundary erosion during development, when fixing it is still a small conversation rather than a rewrite.",
        ],
      },
      {
        heading: "Extract a service only when the evidence is clear",
        paragraphs: [
          "Microservices introduce independent deployment and scaling, but they also introduce network failure, distributed tracing, data synchronization, service ownership, and more demanding release operations. Those costs can be worthwhile. They are not automatically a sign that a product has matured.",
          "I would consider extraction when a module has a genuinely different scaling profile, a strict security boundary, a separate release cadence, or a team that can own it independently. If the modular monolith already has clear contracts and data ownership, extraction becomes a controlled engineering task. Until that evidence appears, one well-structured deployment is often the most professional choice.",
        ],
        visual: {
          src: "/insights/modular-monolith-service-extraction.webp",
          alt: "A well-bounded module moving from a unified architecture into an independently operated service through a controlled connection",
          label: "Extract with evidence",
          caption:
            "A service boundary should answer a measured operational or ownership need. Clear contracts make extraction a deliberate transition instead of a costly rewrite.",
        },
      },
      {
        heading: "A practical modularity review",
        paragraphs: [
          "Before adding another architectural layer, I use a short review to see whether the current boundaries are doing useful work. A weak answer is not an automatic reason to split the application, but it identifies where the next round of design attention belongs.",
        ],
        points: [
          "Can a new feature be placed inside one business module without touching unrelated domains?",
          "Does every important record have one module responsible for its rules and writes?",
          "Can each module be exercised through a small, intentional public interface?",
          "Are cross-module reads, writes, and side effects visible during code review?",
          "Can background handlers be retried without duplicating business outcomes?",
          "Would extracting a module solve a measured operational or organizational constraint?",
          "Is one deployable application still the simplest reliable way to serve the product?",
        ],
      },
    ],
  },
  {
    slug: "building-production-ready-software-beyond-the-happy-path",
    title: "Building Production-Ready Software Beyond the Happy Path",
    excerpt:
      "A practical framework for turning working features into software that remains observable, recoverable, and maintainable after launch.",
    lead:
      "A feature is not finished when the ideal request succeeds. It is finished when the team understands how it behaves under pressure, how it fails, and how it can be restored without guesswork.",
    categoryId: "software-engineering",
    image: "/insights/production-ready-software.webp",
    imageAlt: "Software architecture and observability workspace",
    author: "Sagor Hossain",
    publishedAt: "2026-08-24",
    readTime: "7 min read",
    tags: ["Architecture", "Reliability", "Delivery"],
    featured: true,
    sections: [
      {
        heading: "Working software is only the starting point",
        paragraphs: [
          "The happy path proves that an idea can work. Production readiness proves that the system can keep working when requests arrive twice, dependencies slow down, data is incomplete, or a release needs to be reversed.",
          "That difference changes engineering priorities. Error states, audit trails, permissions, retries, and deployment strategy become part of the feature rather than tasks postponed until after launch.",
        ],
      },
      {
        heading: "Define boundaries before adding layers",
        paragraphs: [
          "Clear ownership is more valuable than a large collection of abstractions. A module should have a focused responsibility, an explicit contract, and a predictable way to report failure. This keeps business rules from leaking into controllers, interface components, or background workers.",
          "I start by mapping the user action, the data it changes, the external services it depends on, and the events that other parts of the product must observe. The resulting boundaries make the code easier to test and safer to change.",
        ],
        visual: {
          src: "/insights/system-boundaries.webp",
          alt: "Architecture map connecting web and mobile clients to an API boundary, application services, asynchronous workers, data storage, and external integrations",
          label: "System boundaries",
          caption:
            "Clear boundaries give clients one entry point, keep application responsibilities focused, and separate asynchronous work from the request path.",
        },
      },
      {
        heading: "Treat failure as a designed state",
        paragraphs: [
          "Distributed workflows rarely fail in a clean, all-or-nothing way. A payment may complete before a webhook arrives, an email provider may time out after accepting a message, or a user may retry while the first request is still processing.",
          "Idempotent operations, bounded retries, useful error messages, and recovery paths prevent these moments from becoming manual data repairs. The interface should also communicate what happened and what the user can do next.",
        ],
      },
      {
        heading: "Make important behavior visible",
        paragraphs: [
          "Logs are most useful when they explain a business event, not only a stack trace. Structured context such as an account, request, job, and integration identifier makes an incident traceable across services.",
          "Metrics and alerts should follow the workflows the product depends on: queue age, failed automation runs, payment reconciliation, response latency, and unusual permission failures. Visibility shortens debugging and helps the team improve the system with evidence.",
        ],
        visual: {
          src: "/insights/observability-release-workflow.webp",
          alt: "Operational workflow showing application telemetry flowing into observability dashboards, deployment health gates, progressive release stages, and rollback",
          label: "Observe, release, recover",
          caption:
            "Runtime signals become useful when they inform release gates and provide a direct path from detection to rollback and recovery.",
        },
      },
      {
        heading: "Ship in slices that can be reversed",
        paragraphs: [
          "Small releases reduce uncertainty. Database changes can be made backward compatible, risky behavior can sit behind a feature flag, and migrations can be separated from the code that begins using them.",
          "A release plan should answer three questions before deployment: how success will be measured, how a problem will be detected, and how the change will be disabled or rolled back.",
        ],
      },
      {
        heading: "A compact production-readiness checklist",
        paragraphs: [
          "The exact checklist changes by product, but these questions catch many expensive omissions before customers do.",
        ],
        points: [
          "Are authorization and validation enforced at the system boundary?",
          "Can repeated requests run safely without duplicating side effects?",
          "Are slow dependencies, partial failures, and retries handled deliberately?",
          "Can the team trace a user action across the relevant services and jobs?",
          "Are database changes backward compatible and recoverable?",
          "Is there a clear success signal and a tested rollback path?",
        ],
      },
    ],
  },
  {
    slug: "building-idempotent-apis-for-payments-webhooks-and-automation",
    title: "Building Idempotent APIs for Payments, Webhooks, and Automation",
    excerpt:
      "A practical approach to making retries safe, preventing duplicate side effects, and giving clients a dependable answer when the network cannot.",
    lead:
      "The most dangerous request is not always the one that fails. It is the one that succeeds on the server, loses its response on the network, and arrives again because the caller has no way to know what happened. Idempotency turns that uncertainty into a contract: one intended operation, one durable outcome, and a response that can be repeated safely.",
    categoryId: "software-engineering",
    image: "/insights/idempotent-api-requests.webp",
    imageAlt: "Repeated request capsules passing through one precision gateway to produce a single recorded outcome",
    author: "Sagor Hossain",
    publishedAt: "2026-05-14",
    readTime: "10 min read",
    tags: ["API Design", "Reliability", "Payments"],
    featured: true,
    sections: [
      {
        heading: "When success and failure look identical",
        paragraphs: [
          "Imagine a customer submits a payment and the server commits it, but the response times out on the way back. From the browser's point of view, the request failed. From the payment system's point of view, it succeeded. Retrying is reasonable, yet processing the retry as a new instruction could charge the customer twice.",
          "The same ambiguity appears in less obvious places. Webhook providers redeliver events when acknowledgements arrive late. Queue workers restart after losing their connection. Users double-click a button, mobile clients reconnect, and SDKs retry transient errors automatically. A reliable API assumes these repeats will happen and decides, in advance, which business effects are allowed to happen only once.",
        ],
      },
      {
        heading: "Treat idempotency as a contract",
        paragraphs: [
          "For a create or command endpoint, I prefer an explicit idempotency key generated by the caller for one intended business operation. The caller keeps that key when it retries. The server scopes it, records the result durably, and returns the recorded result when the same request comes back. This is more useful than trying to guess whether two requests happen to look similar.",
          "That distinction matters. Two invoices for the same amount and customer may both be legitimate, while two deliveries carrying the same operation key are retries of one instruction. Idempotency does not mean every repeated payload is ignored. It means the client and server agree on the identity of an operation and preserve the outcome attached to that identity.",
        ],
        visual: {
          src: "/insights/idempotency-key-lifecycle.webp",
          alt: "A request token being registered with a durable key before an identical retry receives the preserved result",
          label: "One key, one outcome",
          caption:
            "The key identifies the caller's intent. Once its result is stored durably, later retries can receive that result without running the business operation again.",
        },
      },
      {
        heading: "Define what the key actually identifies",
        paragraphs: [
          "An idempotency key should rarely be global by itself. I normally scope it with the account or tenant and the business operation. A practical unique identity might combine tenant, endpoint, and key, so a key used to create a payment cannot accidentally collide with the same value used to schedule a campaign.",
          "I also store a fingerprint of the meaningful request data. If a retry uses the same key but changes the amount, currency, recipient, or another protected field, the server should reject it as a conflict. Silently replaying the first response would hide a client bug; processing the changed request would break the contract. The fingerprint makes that misuse visible.",
        ],
      },
      {
        heading: "Store intent and outcome durably",
        paragraphs: [
          "The idempotency record needs enough information to explain what happened after the original process is gone. I usually keep the scoped key, request fingerprint, processing state, resulting resource identifier, response status, selected response body, and timestamps. For long-running work, the record can point to an operation resource instead of pretending the work finished synchronously.",
          "This record belongs in a durable store with consistency guarantees appropriate to the business effect. An in-memory cache can make lookups faster, but it should not be the only authority for a payment or account-changing command. Expiration also needs a product decision. A short retry window may suit a lightweight import, while financial operations often require a much longer record for reconciliation and support.",
        ],
      },
      {
        heading: "Make the first write atomic",
        paragraphs: [
          "The classic implementation bug is checking whether a key exists and inserting it later. Two requests can both pass the check before either insert completes, then both perform the side effect. The code looks correct during ordinary testing because the race only appears under precise timing or real concurrency.",
          "I let the database decide the winner with a unique constraint on the scoped key and a transaction that creates the idempotency record before the protected work proceeds. The request that wins owns the operation. A concurrent request reads the existing state and either returns the finished result or receives a clear in-progress response. The important part is that claiming the key and beginning the operation are not separated by an unprotected gap.",
        ],
        visual: {
          src: "/insights/idempotent-concurrency-control.webp",
          alt: "Two concurrent request capsules meeting one transaction lock that protects a single committed result",
          label: "Close the race",
          caption:
            "A uniqueness constraint and transactional claim choose one owner even when duplicate requests arrive together. Both requests can then resolve to the same authoritative result.",
        },
      },
      {
        heading: "Plan for work that stops halfway",
        paragraphs: [
          "A processing record can outlive the worker that created it. The process may crash, a deployment may restart it, or an external provider may accept a request before the local transaction finishes. A permanent processing state is not recovery; it is only a quieter failure mode.",
          "I model states such as processing, succeeded, and failed, then define who may recover an expired processing lease. For external side effects, I pass the same stable key to providers that support idempotency. When local data and asynchronous delivery must move together, an outbox record closes the gap between committing the business state and publishing the next action. There is no single trick that makes every distributed effect atomic, so each uncertainty needs an explicit reconciliation path.",
        ],
      },
      {
        heading: "Adapt the pattern to the workflow",
        paragraphs: [
          "For an outbound payment, the operation key should follow the payment attempt through the API, database, and provider. For an inbound webhook, the provider's stable event identifier is often the natural deduplication key, scoped to that integration. The handler should record receipt before applying the business transition and acknowledge duplicates without repeating it.",
          "Automation needs a little more care because one run may contain several legitimate side effects. I avoid using one broad key to suppress the whole workflow. Instead, each step receives a stable identity derived from the run and the action it performs. A retried email step cannot send twice, while a later, intentionally separate email still has its own identity.",
        ],
      },
      {
        heading: "Return responses clients can trust",
        paragraphs: [
          "A completed retry should receive the same meaningful result as the original request whenever practical: the same resource identifier, compatible status, and enough response data to continue. A key reused with different input should return a conflict. A request still owned by another worker should return a deliberate processing response rather than waiting forever or starting over.",
          "Operational visibility matters here too. I track new claims, successful replays, payload conflicts, time spent in processing, and records recovered after a lease expires. Logs include the scoped operation identifier but avoid exposing raw credentials or sensitive payloads. These signals reveal noisy clients and hidden race conditions long before duplicate charges become a support ticket.",
        ],
      },
      {
        heading: "An idempotency review before release",
        paragraphs: [
          "Before calling a retryable endpoint safe, I walk through the failure timeline from the client's intent to the final side effect. These questions usually expose the gaps that a happy-path test will miss.",
        ],
        points: [
          "Does one key represent exactly one business operation within a clear tenant and endpoint scope?",
          "Will the server reject the same key when protected request data changes?",
          "Can concurrent requests claim the key only once through an atomic database operation?",
          "Is the authoritative outcome stored somewhere that survives restarts and cache loss?",
          "Can an abandoned processing record be recovered without repeating a completed side effect?",
          "Do external providers, webhook handlers, and background jobs reuse stable operation identities?",
          "Will a retry receive a useful previous result instead of an ambiguous generic success?",
          "Can the team observe replays, conflicts, stuck operations, and reconciliation failures?",
        ],
      },
    ],
  },
  {
    slug: "designing-reliable-background-jobs-with-retries-and-dead-letter-queues",
    title: "Designing Reliable Background Jobs with Retries and Dead-Letter Queues",
    excerpt:
      "How to move work beyond the request safely, recover from temporary failures, and turn exhausted jobs into an operational workflow instead of a hidden backlog.",
    lead:
      "The first queue I add to a product usually feels like relief. A slow task leaves the request path, the interface becomes faster, and the worker can handle the rest later. But later is where ownership becomes less visible. A reliable background job needs more than a queue: it needs a durable contract, a safe retry policy, and a clear route from failure back to recovery.",
    categoryId: "software-engineering",
    image: "/insights/background-jobs-handmade-workflow.webp",
    imageAlt: "Handmade paper collage showing jobs moving through workers, retrying, and entering a recovery queue",
    author: "Sagor Hossain",
    publishedAt: "2026-02-07",
    readTime: "11 min read",
    tags: ["Background Jobs", "Reliability", "Queues"],
    featured: true,
    sections: [
      {
        heading: "Moving work also moves responsibility",
        paragraphs: [
          "A queue makes an HTTP response faster by moving work somewhere else. It does not make the work less important. Sending an invoice, importing contacts, generating a report, or calling a partner API still has a customer waiting for an outcome, even when no browser connection remains open to observe it.",
          "That shift changes the questions I ask. Who can tell whether the job completed? What happens when the worker stops after half the work? How long may the job remain delayed before it is no longer useful? A background task becomes dependable when those answers are part of the feature rather than details left to the queue library's defaults.",
        ],
      },
      {
        heading: "Give every job a durable contract",
        paragraphs: [
          "I keep job payloads small and explicit. Stable identifiers, a tenant or account scope, the intended operation, and a schema version usually travel better than a serialized model or a large snapshot of mutable data. The worker can load current state deliberately and decide whether the operation is still valid when execution begins.",
          "The contract should also define ownership and time. Some jobs may run whenever capacity becomes available; others become stale after a campaign closes or a report is superseded. Including a correlation identifier and enqueue timestamp makes the job traceable, while a deadline or expected version prevents yesterday's instruction from quietly changing today's state.",
        ],
      },
      {
        heading: "Assume a job can run more than once",
        paragraphs: [
          "Most practical queues provide at-least-once delivery. A worker can finish the side effect and crash before acknowledging the message, so the queue delivers it again. Increasing the visibility timeout reduces some duplicates, but it cannot remove this uncertainty completely.",
          "I design the handler around a stable operation identity. A database constraint, state transition, or idempotency record can make the business effect safe to repeat. External providers should receive the same operation key when they support one. The aim is not to guarantee that the function executes once; it is to guarantee that repeated execution does not create a second invoice, email, payment, or workflow transition.",
        ],
      },
      {
        heading: "Retry only failures that can recover",
        paragraphs: [
          "A retry policy begins with classification. A timeout, temporary network failure, rate limit, or unavailable dependency may recover. Invalid input, a missing required record, revoked access, or an unsupported file usually will not. Repeating a permanent failure wastes capacity and delays healthy work behind it.",
          "I translate low-level exceptions into a small set of operational outcomes: retryable, terminal, or uncertain enough to require reconciliation. The decision belongs near the integration or business boundary where its meaning is understood. A blanket catch that retries every exception can turn a simple validation problem into hours of noisy traffic.",
        ],
      },
      {
        heading: "Use backoff as traffic control",
        paragraphs: [
          "Immediate retries are attractive because they appear responsive, but they often attack the dependency while it is already struggling. Exponential backoff creates space between attempts, and jitter prevents a fleet of workers from waking up together. When a provider sends a reliable retry-after value, I treat it as part of the integration contract.",
          "Every workflow still needs a retry budget. The maximum attempts and total elapsed time should reflect the value and urgency of the job, not a number copied from another service. A password email and a monthly data export have different useful windows. Once that budget is exhausted, the system should stop spending capacity blindly and move the job into an owned recovery path.",
        ],
        visual: {
          src: "/insights/background-job-retry-backoff.webp",
          alt: "Hand-drawn notebook timeline showing failed job attempts separated by increasing waits before recovery",
          label: "Create room to recover",
          caption:
            "Backoff spaces repeated attempts so a temporary failure has time to clear. Jitter and a bounded retry budget keep recovery traffic from becoming another outage.",
        },
      },
      {
        heading: "Bound time, concurrency, and side effects",
        paragraphs: [
          "A worker needs an execution timeout shorter than the point where the queue considers it lost, or a heartbeat for work that legitimately runs longer. Without that relationship, a slow job can overlap with its replacement. Long operations are often safer when divided into restartable checkpoints instead of extending one invisible lease indefinitely.",
          "Concurrency should follow the capacity of the dependency, not only the number of CPUs available to the worker. Per-tenant limits prevent one large account from consuming the queue, while integration-specific limits protect rate-limited providers. I also check whether the work has been cancelled, replaced, or made irrelevant before each expensive side effect.",
        ],
      },
      {
        heading: "Treat the dead-letter queue as a workspace",
        paragraphs: [
          "A dead-letter queue is useful only when someone owns it. After retries are exhausted, I preserve the job identity, safe payload reference, attempt history, failure class, timestamps, and enough code or integration context to investigate. Sensitive values still follow normal retention and access rules; failure is not permission to copy secrets into an easier place to inspect.",
          "The queue should distinguish one malformed job from a wider product problem. A sudden group of similar failures may point to a deployment, expired credential, schema change, or provider incident. Alerts based on age and inflow make that pattern visible. A growing dead-letter count without an owner is not resilience; it is a backlog of customer promises the system has stopped discussing.",
        ],
        visual: {
          src: "/insights/dead-letter-queue-recovery.webp",
          alt: "Hand-printed workflow showing a damaged job isolated, inspected, repaired, and returned to successful processing",
          label: "Isolate, repair, replay",
          caption:
            "Exhausted jobs need context and ownership. The recovery path starts with understanding the failure, fixing its cause, and replaying only the affected work deliberately.",
        },
      },
      {
        heading: "Replay failed work like a release",
        paragraphs: [
          "Replaying a dead-letter queue changes production state, so I treat it with the care of a deployment. First I group failures by cause and fix the code, configuration, credentials, or data problem. Then I test a small sample, verify the resulting business state, and increase the replay rate gradually while watching the same signals that exposed the failure.",
          "A replay tool should support filtering, rate limits, audit history, and a dry-run or inspection mode where the workflow allows it. It must preserve the original operation identity so idempotency still protects completed side effects. Releasing thousands of jobs from a queue with one button may feel efficient, but it removes the control needed at the moment risk is highest.",
        ],
      },
      {
        heading: "Observe the outcome, not only the queue",
        paragraphs: [
          "Queue depth matters, but it cannot explain whether customers are receiving what they asked for. I watch the age of the oldest ready job, end-to-end completion time, attempt distribution, retry reasons, dead-letter inflow, recovery time, and worker saturation. These measurements separate a healthy burst of traffic from a queue that is quietly falling behind.",
          "The strongest alert often follows the business outcome: invoices not delivered within the expected window, imports that never reach completion, or automation runs stuck between steps. Correlation identifiers connect that outcome to the API request, queue message, worker logs, and external call. Operations becomes much calmer when the team can follow one job without searching every system by timestamp.",
        ],
      },
      {
        heading: "A background-job readiness review",
        paragraphs: [
          "Before releasing a new asynchronous workflow, I trace one successful job, one duplicate, one temporary failure, and one permanent failure from enqueue to final status. This short review catches most missing ownership decisions.",
        ],
        points: [
          "Does the payload use stable identifiers, an explicit scope, and a versioned contract?",
          "Can the handler run more than once without duplicating its business effect?",
          "Are retryable, terminal, and uncertain failures classified deliberately?",
          "Do backoff, jitter, and the retry budget match the dependency and customer expectation?",
          "Are execution time, visibility timeout, concurrency, and cancellation handled coherently?",
          "Does every dead-lettered job retain useful context without exposing sensitive data?",
          "Can the team inspect and replay a controlled group with audit history and rate limits?",
          "Will monitoring reveal delayed customer outcomes before the queue becomes an incident?",
        ],
      },
    ],
  },
];

export function getInsightCategory(categoryId: InsightCategoryId) {
  return insightCategories.find((category) => category.id === categoryId);
}

export function getInsightBySlug(slug: string) {
  return insights.find((insight) => insight.slug === slug);
}
