const intro = [
  `Cocoso is a web based social collaboration platform software and productivity tool for facilitating internal/external interactions within and out of a community. It empowers web presence and accessibility. Cocoso is an open productivity platform, for autonomous and creative groups, suitable for any type of collaboration including: festivals, artist-run initiatives, non-for-profits, families, small or medium businesses, yoga spaces, alternative schools, permaculture sites, yoga spaces or your grandmother’s farm that will turn into an open air museum.`,
  `Cocoso features tools for open or private communication, sharing information between members, scheduling, and managing documentation of any kind -- whether locally engaged or waving hands remotely. Resource sharing is not limited with digital mediums on Cocoso. Collective sharing management of physical assets and collective spaces are also facilitated equally.`,
  `Cocoso is a community-driven, resource-aware and open source project. Strong artistic aspirations, social motives and economic inclusion needs paved the path at its earlier stages. Currently, it facilitates and learns from multiple communities to help build and maintain their unique projects. These communities are made up of artists, artist-run initiatives, alternative currency projects - and hopefully yours.`,
  `Cocoso doesn't feature tools for spying on users for tracking their data. Each member of any community owns their data, and are free to share only as much as they wish. No information is shared with any third party service or organisation, the data is owned by the community. You run projects of your community and their data on your own terms.`,
];

const activities = [
  `The earliest version of Cocoso was built with an artist-run initiative, hosting multiple public stage performances for pre-registered audiences. Management and publishing of customisable and recurring events require several different features like RSVP. Registrations with RSVP are communicated to guests by email, as event administrators have the possibility to verify their arrival at the time of any event.`,
  `One can create/edit/delete content with an image, title, description and further info; as well as a set of occurrences with optionally multiple dates (and times). By this way, admins do not need to create new entry for all occurrences`,
  `RSVP registration: People can easily register and receive an email with confirmation`,
  `RSVP verification : Admins can easily see who has signed up for each event under relevant occurrence section to verify attendees registration on arrival`,
  `Each occurrence and action reflects real-time on the open collective calendar.`,
];

const resources = [
  `Cocoso enables planning and overviewing of resource sharing processes at a timely manner. Everytime a verified user claims a physical resource or books a space, this information is shared with members of the collective through the calendar. The calendar experience is as accessible and simple as widely used cloud-based digital calendar solutions -- with a difference.`,
  `At Cocoso software, there are no calendar invites. Because, we believe that machines should facilitate our communication and sharing - not operate and act for us. Cocoso’s calendar is the main facade of community events and resource sharing. We also like so much that people talk to each other as much as we free our emails from data clutter.`,
  `Resource Sharing and Calendar work with one another very tightly. Indeed Calendar is the visual language enabling Resource Sharing of Commons co-owned or individually owned by a community, as well as showcasing what's happening in the community.`,
];

const calendar = [
  `Cocoso’s web calendar can be displayed to show Monthly/Weekly/Daily events and resource updates. Users can navigate between these timeframes with a single tap. Each calendar activity can correspond to a resource-utilisation activity or a community event. Multiplicity of resources and events are welcome at the calendar. Calendar is built for flexibility, transparency and simplicity to fit your unique needs and collective scenarios. `,
  `Each entry in calendar could be assigned a different category such as a resource booked or a type of activity such as yoga. It'd be useful for both presenting different kinds of public activity entries as well as different kinds of bookings. Like every each feature in Cocoso, it's intentionally made very abstract so that it can be applied to different use cases.`,
];

const processes = [
  `Process is an abstract term to cover multiple activities conducted by a group -- either virtual or in the real world. It allows members of a process to log all their relevant data from creating till proceeding a meaningful process together to share a space, document, or conduct a meeting with another member.`,
  `Process enables management of processes such as training, social creation or learning activities -- such as recurring yoga sessions, or school training sessions. Just add the details of your CoProcess and your simple forum, documents list and dates are ready in one page.`,
  `This feature basically includes most of the digital tools for running, for example a learning, training, cocreation or facilitation process. Like a school, or a continuous/recurrent yoga session, or a cooperative activity of any kind.`,
  `You can basically keep your main information (image and text), members list, a simple discussion forum, documents, and meeting dates all in one page.`,
];

const works = [
  `A Work is a visual (or audiovisual) creation of an artist, researcher, designer, craftsperson or reseller to be showcased to the community. Details of the work, with images, sound files and videos can be shared within a category of creator’s choice. A CoWork is a unique entry, associated with its creator -- a perfect tool for portfolios, and marketplaces.`,
  `One can also create a work and save it privately for internal use and documentation. The primary purpose it is built for is to enable artists and craftspeople to publish and communicate what they do with the rest of the world, as well as document for their own reference`,
  `Images to be uploaded are automatically resized on the client browser before they are uploaded to AWS S3 buckets.`,
];

const members = [
  `If you're admin of an organisation, you can find and filter through members of the organisation. You can verify or unverify them for being able to do certain activities such as creating activities in the program/calendar or creating a process.`,
  `For example if you run a yoga studio, you'll have both your teachers and students in one platform. Then you will verify your teachers for them to be able to create their activities at the home page, whereas students will only be able participate (RSVP) to existing activities/processes.`,
  `So, necessarily, privileges can be meaningfully distributed amongst your community.`,
  `Every user can easily create an account and continue their operations from there.`,
  `Passwords are automatically encrypted in the database so system admins won't be able to track them.`,
];

const info = [
  `This is a very simple page, basically. The simplest CMS you could ever think of...`,
  `With this feature one can easily create a page only with a title and a description (with rich text editing). Title becomes the slug with a little modification like About Us becoming /page/about-us and that's pretty much it. Each page is automatically added to navigation as just another static page.`,
];

const publicActs = [
  `Since Cocoso is primarily built for an artist run space that continuously hosts public stage performances for a limited audience who are required to register beforehand; creating and managing a public event was the number one requirement.`,
  `There are a few components of public events that can be listed as below:`,
];

const publicActsList = [
  `Create/edit/delete content with an image, title, description and further info; as well as a set of occurrences with optionally multiple dates (and times). By this way, admins do not need to create new entry for all occurrences`,
  `RSVP registration: People can easily register and receive an email with confirmation`,
  `RSVP verification : Admins can easily see who has signed up for each event under relevant occurrence section to verify attendees registration on arrival`,
  `Auto-sync with Calendar: Each occurrence automatically populates in the calendar as well (see below)`,
];

const sections = [
  {
    title: `Intro`,
    content: intro,
    image:
      'https://mikroklima-landingpages.s3.eu-central-1.amazonaws.com/cocoso-landingpage/mcgill-library-rxZLty9pnh4-unsplash.jpg',
  },
  {
    title: `Activities`,
    content: activities,
    image:
      'https://mikroklima-landingpages.s3.eu-central-1.amazonaws.com/cocoso-landingpage/mcgill-library-1Rbv8ubJix0-unsplash.jpg',
  },
  {
    title: `Resources`,
    content: resources,
    image:
      'https://mikroklima-landingpages.s3.eu-central-1.amazonaws.com/cocoso-landingpage/mcgill-library---DJjEqekIM-unsplash.jpg',
  },
  {
    title: `Calendar`,
    content: calendar,
    image:
      'https://mikroklima-landingpages.s3.eu-central-1.amazonaws.com/cocoso-landingpage/birmingham-museums-trust-RpELX3wVm_U-unsplash.jpg',
  },
  {
    title: `Processes`,
    content: processes,
    image:
      'https://mikroklima-landingpages.s3.eu-central-1.amazonaws.com/cocoso-landingpage/british-library-b8vYa2-83pw-unsplash.jpg',
  },
  {
    title: `Works`,
    content: works,
    image:
      'https://mikroklima-landingpages.s3.eu-central-1.amazonaws.com/cocoso-landingpage/british-library-b8vYa2-83pw-unsplash.jpg',
  },
  {
    title: `Members`,
    content: members,
    image:
      'https://mikroklima-landingpages.s3.eu-central-1.amazonaws.com/cocoso-landingpage/mcgill-library-eMw-fVXNpME-unsplash.jpg',
  },
  {
    title: `Info`,
    content: info,
    image:
      'https://mikroklima-landingpages.s3.eu-central-1.amazonaws.com/cocoso-landingpage/boston-public-library-awhvI865NQk-unsplash.jpg',
  },
];

export {
  intro,
  activities,
  resources,
  calendar,
  processes,
  members,
  info,
  publicActs,
  publicActsList,
  sections,
};
