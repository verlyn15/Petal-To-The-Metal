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
    summary:
      'A full-stack airline booking application covering flight discovery, seats, add-ons, and booking management.',
    role: 'Solo full-stack engineer',
    ownership: 'Solo project designed and implemented by Jayrald.',
    repositoryStatus: 'private',
    sourceUrl: null,
    challenge:
      'Protect seat inventory from conflicting bookings while carrying a user through a multi-step reservation flow.',
    contribution:
      'Designed and built the Angular client, Django backend, reservation workflow, and transactionally locked seat selection.',
    architecture:
      'An Angular booking client communicates with a Django backend that applies transactional locking when seats are reserved.',
    technologies: ['Angular', 'Django', 'Relational database'],
    decisions: [
      'Used database transactions and row-level locking to prevent overlapping seat reservations.',
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
    summary:
      'A mobile accountability coach that turns conversational guidance into a focused view of next actions.',
    role: 'Solo mobile engineer',
    ownership: 'Solo project designed and implemented by Jayrald.',
    repositoryStatus: 'public',
    sourceUrl: 'https://github.com/jayraldtajanlangit/sige',
    challenge:
      'Connect a coaching conversation to practical follow-through without presenting unfinished product surfaces as shipped features.',
    contribution:
      'Designed and built the mobile coaching experience, including the chat flow and the supporting task and insight interface prototypes.',
    architecture:
      'A mobile client organizes the coaching conversation and accountability views around a service-backed response flow.',
    technologies: ['Mobile application', 'AI integration', 'Realtime coaching'],
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
