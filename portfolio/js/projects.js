export const contacts = {
  email: 'jayraldtajanlangit123@gmail.com',
  github: 'https://github.com/jayraldtajanlangit',
  linkedin: 'https://www.linkedin.com/in/jayrald-tajanlangit-b8646a280/',
};

export const site = {
  name: 'Jayrald Tajanlangit',
  positioning: 'Full-stack and mobile engineer',
  location: 'Philippines',
};

function mediaFor(slug) {
  return {
    poster: `assets/images/projects/${slug}/poster.webp`,
    video: `assets/videos/${slug}.webm`,
    stills: [
      `assets/images/projects/${slug}/still-01.webp`,
      `assets/images/projects/${slug}/still-02.webp`,
    ],
  };
}

export const projects = [
  {
    slug: 'maistra',
    title: 'mAIstra',
    folio: '01 / Learning systems',
    platform: 'Web application',
    summary:
      'A teaching workflow for reviewing programming submissions, executing code, and recording grades.',
    role: 'Full-stack engineer for submission review and grading',
    ownership:
      'Team project; Jayrald owned the web submissions, review, and grading interface, the Judge0 integration, and the Supabase data layer.',
    repositoryStatus: 'team',
    sourceUrl:
      'https://github.com/Francismarcnikko123/mAIstra/tree/judge0-integration',
    challenge:
      'Connect an instructor-facing review flow to remote code execution while keeping submission and grading state coherent.',
    contribution:
      'Built the web submissions, code-review, and grading interface; integrated Judge0 execution; and implemented the Supabase persistence layer.',
    architecture:
      'A web interface reads and writes submission state through Supabase and sends reviewed code to Judge0 for execution before grading.',
    technologies: ['Web application', 'Supabase', 'Judge0'],
    systemFlow: [
      ['Instructor review', 'Opens a learner submission and inspects the submitted code.'],
      ['Supabase', 'Provides the submission record and keeps review state available to the interface.'],
      ['Judge0 boundary', 'Receives code through a dedicated integration and returns execution output.'],
      ['Grade record', 'Returns the instructor to one workflow to record the final grade in Supabase.'],
    ],
    decisionLedger: [
      {
        decision: 'Isolate remote execution behind a Judge0 integration boundary.',
        why: 'The review interface needed execution results without taking responsibility for running untrusted code itself.',
        tradeoff: 'The workflow depends on a remote execution service and must surface its failure states clearly.',
      },
      {
        decision: 'Use Supabase as the shared persistence layer for review and grading state.',
        why: 'Submission context and the resulting grade needed one source of truth across the review sequence.',
        tradeoff: 'Interface behavior stays coupled to the agreed data shape and access rules.',
      },
    ],
    repositoryDisclosure:
      'Public team repository. This case study is limited to Jayrald\'s review, grading, Judge0, and Supabase work; other team features fall outside this ownership record.',
    decisions: [
      'Kept code execution behind a dedicated Judge0 integration boundary.',
      'Stored review and grading state in Supabase so the workflow shares one source of truth.',
    ],
    workflow: [
      'Open a learner submission.',
      'Review the submitted code.',
      'Run the code and record the grade.',
    ],
    media: mediaFor('maistra'),
  },
  {
    slug: 'skyfire',
    title: 'SkyFire — Airline Booking System',
    folio: '02 / Reservation systems',
    platform: 'Web application',
    summary:
      'A full-stack airline booking application covering flight discovery, seats, add-ons, and booking management.',
    role: 'Solo full-stack engineer',
    ownership: 'Solo project designed and implemented by Jayrald.',
    repositoryStatus: 'private',
    sourceUrl: null,
    challenge:
      'Keep seat validation authoritative on the backend while carrying a user through a multi-step reservation flow.',
    contribution:
      'Designed and built the Angular client, Django backend, reservation workflow, and a transaction.atomic seat-validation boundary that expresses lock intent with select_for_update.',
    architecture:
      'An Angular booking client sends reservation requests to a Django API that validates and writes seat state inside transaction.atomic. The SQLite demo backend does not enforce SELECT FOR UPDATE row locks.',
    technologies: ['Angular 21', 'Django REST Framework', 'JWT', 'SQLite'],
    systemFlow: [
      ['Angular client', 'Guides search, seat choice, add-ons, confirmation, and booking review.'],
      ['Django REST API', 'Validates authenticated booking requests and coordinates reservation state.'],
      ['Transactional seat validation', 'Checks availability and writes the reservation inside one backend transaction boundary.'],
      ['SQLite record', 'Persists the confirmed booking for the My Bookings view.'],
    ],
    decisionLedger: [
      {
        decision: 'Put seat validation and the reservation write inside transaction.atomic, using select_for_update to express lock intent.',
        why: 'Availability must be checked by the backend at the point where the booking is written, rather than trusted from client state.',
        tradeoff: 'SQLite ignores SELECT FOR UPDATE, so the current demo cannot claim row-level conflict prevention; that guarantee requires a database backend that supports row locks.',
      },
      {
        decision: 'Keep the source repository private.',
        why: 'The project can still be explained through its architecture and captured booking flow without publishing the codebase.',
        tradeoff: 'Reviewers cannot inspect source, so this case study discloses that limitation directly.',
      },
    ],
    repositoryDisclosure:
      'Private solo repository. Source access is not offered publicly. The demo uses SQLite, so its select_for_update call documents the intended locking boundary without providing a row-lock guarantee.',
    decisions: [
      'Kept seat validation and reservation writes inside a backend transaction boundary; the SQLite demo does not provide row-level SELECT FOR UPDATE locking.',
      'Kept the repository private while documenting the architecture and interaction flow publicly.',
    ],
    workflow: [
      'Search available flights.',
      'Choose a seat and optional add-ons.',
      'Confirm the reservation and review it in My Bookings.',
    ],
    media: mediaFor('skyfire'),
  },
  {
    slug: 'bulk-buying-companion',
    title: 'Bulk Buying Companion',
    folio: '03 / Cooperative commerce',
    platform: 'Mobile application',
    summary:
      'A mobile coordination tool for discovering nearby bulk deals, splitting quantities, and managing pickup and payment updates.',
    role: 'Mobile and backend contributor',
    ownership:
      'Team project; Jayrald delivered defined product slices across authentication, discovery, collaboration, and fulfillment.',
    repositoryStatus: 'team',
    sourceUrl: null,
    challenge:
      'Coordinate location-aware group purchases while keeping reservations, payments, notifications, and pickup status current.',
    contribution:
      'Implemented authentication, the geolocation hub, Split Board search, realtime notifications and payment flows, profiles and purchase history, pickup and reporting tools, and the barcode extension. Receipt OCR was team work.',
    architecture:
      'A Flutter client uses Supabase for authenticated data and realtime updates, with geolocation and on-device scanning features supporting discovery and fulfillment.',
    technologies: ['Flutter', 'Supabase', 'Realtime', 'Geolocation', 'On-device ML'],
    systemFlow: [
      ['Nearby hub', 'Uses location context to surface relevant group-purchase activity.'],
      ['Split Board', 'Lets a participant search offers and reserve a share of a bulk quantity.'],
      ['Supabase state', 'Keeps participant, payment, notification, and pickup records synchronized.'],
      ['Fulfillment tools', 'Carries the shared purchase through history, reporting, barcode, and pickup views.'],
    ],
    decisionLedger: [
      {
        decision: 'Use realtime updates for shared purchase state.',
        why: 'Reservations, payment updates, and pickup status are useful only when every participant sees current information.',
        tradeoff: 'The client has to reconcile network interruptions and event ordering instead of assuming a static record.',
      },
      {
        decision: 'Keep barcode recognition on the device.',
        why: 'The extension can identify an item at the point of use without adding a server round trip.',
        tradeoff: 'Recognition quality depends on device camera conditions and the supported barcode formats.',
      },
    ],
    repositoryDisclosure:
      'Team repository, not currently linked publicly. Jayrald\'s scope is listed above; receipt OCR belongs to the wider team rather than to him.',
    decisions: [
      'Used realtime updates for reservation, payment, and pickup state shared across participants.',
      'Kept barcode recognition on-device while treating receipt OCR as a separate team-owned capability.',
    ],
    workflow: [
      'Browse or search the Split Board.',
      'Open a nearby bulk deal and reserve a share.',
      'Track payment and pickup updates through notifications.',
    ],
    media: mediaFor('bulk-buying-companion'),
  },
  {
    slug: 'pulso',
    title: 'Pulso',
    folio: '04 / Community products',
    platform: 'Mobile application',
    summary:
      'A Flutter community product centered on social posts, reactions, saved content, profiles, and realtime updates.',
    role: 'Mobile and backend contributor',
    ownership:
      'Team project; Jayrald established the application foundation and built major social and realtime product features.',
    repositoryStatus: 'team',
    sourceUrl: 'https://github.com/jayraldtajanlangit/Pulso',
    challenge:
      'Give community interactions a responsive mobile experience backed by consistent authentication and realtime state.',
    contribution:
      'Built the Flutter scaffold, Supabase and Riverpod foundation, authentication, and major social, profile, saved-content, and realtime features.',
    architecture:
      'A Flutter client uses Riverpod for application state and Supabase for authentication, persisted social data, and realtime changes.',
    technologies: ['Flutter', 'Riverpod', 'Supabase', 'Realtime'],
    systemFlow: [
      ['Flutter interface', 'Presents the feed, reactions, saved posts, and profile surfaces.'],
      ['Riverpod state', 'Coordinates session and feature state across the supported social workflow.'],
      ['Supabase services', 'Handles authentication, persisted social data, and realtime changes.'],
      ['Profile and saved views', 'Return a member to their identity and the posts they chose to keep.'],
    ],
    decisionLedger: [
      {
        decision: 'Centralize feature state with Riverpod.',
        why: 'Feed, profile, authentication, and saved-content behavior share session and data dependencies.',
        tradeoff: 'Providers require deliberate boundaries so feature state does not become globally tangled.',
      },
      {
        decision: 'Show only the supported feed-to-saved-content path.',
        why: 'That flow reflects implemented work that can be demonstrated honestly.',
        tradeoff: 'Unreleased direct messages are omitted even though messaging would broaden the product story.',
      },
    ],
    repositoryDisclosure:
      'Public team repository. Jayrald built the app foundation and major social, profile, saved-content, and realtime features; unreleased direct messages are not presented as shipped.',
    decisions: [
      'Centralized client state in Riverpod to keep feed, profile, and saved-content behavior predictable.',
      'Showcases the supported feed and profile workflow rather than an unreleased direct-message flow.',
    ],
    workflow: [
      'Browse the community feed.',
      'React to or save a post.',
      'Review saved content from the profile.',
    ],
    media: mediaFor('pulso'),
  },
  {
    slug: 'sige',
    title: 'Sige',
    folio: '05 / Accountability tools',
    platform: 'Mobile application',
    summary:
      'A mobile accountability coach that turns conversational guidance into a focused view of next actions.',
    role: 'Solo mobile engineer',
    ownership: 'Solo project designed and implemented by Jayrald.',
    repositoryStatus: 'public',
    sourceUrl: 'https://github.com/jayraldtajanlangit/sige',
    challenge:
      'Connect a coaching conversation to practical follow-through without presenting unfinished product surfaces as shipped features.',
    contribution:
      'Designed and built the Flutter coaching experience and its service-backed chat integration; designed Tasks and Insights as clearly labeled interface prototypes.',
    architecture:
      'A Flutter client uses Supabase and a FastAPI service to support the coaching conversation, with Groq generating responses and FCM available for notification delivery.',
    technologies: ['Flutter', 'Supabase', 'FastAPI', 'Groq', 'FCM'],
    systemFlow: [
      ['Flutter client', 'Collects a message or quick reply in the coaching conversation.'],
      ['FastAPI service', 'Receives the request and coordinates the service-backed response flow.'],
      ['Groq integration', 'Generates the coaching response returned to the active conversation.'],
      ['Accountability surfaces', 'Tasks and Insights demonstrate the intended follow-through as labeled UI prototypes.'],
    ],
    decisionLedger: [
      {
        decision: 'Keep the coaching exchange inside the active conversation.',
        why: 'Quick replies and generated responses need immediate context to feel actionable rather than detached.',
        tradeoff: 'The usefulness of the experience depends on service availability and careful response handling.',
      },
      {
        decision: 'Label Tasks and Insights as UI prototypes.',
        why: 'Their interface direction can be shown without implying that unfinished service behavior is live.',
        tradeoff: 'The demonstration is intentionally narrower than the planned product surface.',
      },
    ],
    repositoryDisclosure:
      'Public solo repository. The chat integration is implemented; Tasks and Insights are presented as UI prototypes, not completed live features.',
    decisions: [
      'Kept quick replies and coaching responses close to the active conversation.',
      'Labels Tasks and Insights as UI prototypes wherever live service behavior is not demonstrated.',
    ],
    workflow: [
      'Choose a quick reply in the coaching chat.',
      'Review the coach response.',
      'Open the Tasks UI prototype for the next action.',
    ],
    media: mediaFor('sige'),
  },
];

export function getProject(slug) {
  return projects.find((project) => project.slug === slug);
}
