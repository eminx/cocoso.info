const intro = [
  `Cocoso is a web-based software that runs as a webapp on browsers. You can use it to build and facilitate your web presence; but also a platform for having users follow, participate and contribute to your activities. Whether it's for a festival, an association, non-profit, family, small or medium business, alternative school, yoga space, or a revolutionary artists collective, Cocoso will probably work for you very well.`,
  `It is built for the primary purpose of helping an open community of people cooperate with each other better, whether they are locally engaged with one another or cooperate remotely. It does so by featuring different digital tools for enabling individuals to timely utilise a set of common material resources as well as human.`,
  `It isn't a profit-oriented project, and is fully open source and free. There's been strong artistic, social and economic motives behind building it. Currently we are working with different community building and maintaining projects such as autonomous communities using alternative currencies as well as creating a platform for artists and artist run initiatives.`,
  `We're proud to say that Cocoso is completely free of any surveillance tools. Because freeing of users from surveillance by the Big Tech has probably been the most fundamental motive behind building Cocoso.`,
  `With Cocoso, you own your own data, at the individual and organisation level. You basically run your community on your own terms.`,
];

const activities = [
  `Since Cocoso is primarily built for an artist run space that continuously hosts public stage performances for a limited audience who are required to register beforehand; creating and managing a public event was the number one requirement.`,
  `One can create/edit/delete content with an image, title, description and further info; as well as a set of occurrences with optionally multiple dates (and times). By this way, admins do not need to create new entry for all occurrences`,
  `RSVP registration: People can easily register and receive an email with confirmation`,
  `RSVP verification : Admins can easily see who has signed up for each event under relevant occurrence section to verify attendees registration on arrival`,
  `Auto-sync with Calendar: Each occurrence automatically populates in the calendar as well (see below)`,
];

const resources = [
  `It is possible to list (by admins) a set of shared resources for them to be timely claimed/booked by verified users. Every each booking is automatically displayed on the calendar. This is very similar to the widespread usage of Google & Outlook calendars in typical shared resource contexts like in a e.g. company office.`,
  `However, with Cocoso, the way this works is much more simplified. You make a booking and that's it. It's so far not possible to make calendar invites etc, because we think those become unnecessary automations turning working people into robots feeding machines and become dictated about how the digital systems work rather than digital systems helping people proceed in their workflows. We like to think that people talk to each other more in work places rather than work around tools to prevent that.`,
  `Resource Sharing and Calendar work with one another very tightly. Indeed Calendar is the visual language enabling Resource Sharing, as well as displaying what's happening in the community.`,
];

const calendar = [
  `The calendar is shown with Month (default), Week, Day and Agenda views using Big Calendar, open source React component library. One can navigate to previous or next month/week/day with a click. It's just like the calendar app you're using but embedded on a webpage.`,
  `Each entry in calendar could be assigned a different category such as a resource booked or a type of activity such as yoga. It'd be useful for both presenting different kinds of entries as well as different kinds of bookings. Like every each feature in Cocoso, i's intentionally made very abstract so that it can be applied to different use cases.`,
];

const processes = [
  `A process is a concept and a series of virtual or actual activities by a group of individuals to facilitate a purposeful conceptual activity together and practically keep track of relevant information such as meeting date&time occurrences, documents, members, discussions etc.`,
  `Maybe this explanation was too abstract?`,
  `This feature basically includes most of the digital tools for running, for example a learning, training, cocreation or facilitation process. Like a school, or a continuous/recurrent yoga session, or a cooperative activity of any kind.`,
  `You can basically keep your main information (image and text), members list, a simple discussion forum, documents, and meeting dates all in one page.`,
];

const works = [
  `A work is what an artist, researcher, designer, craftsperson or a reseller showcases their work with. A Work consists of text (title, description, further info etc), images, sound and/or video, categorised in whichever way they like. Its basically a special entry specifically bound to its creator. It is perfect for portfolio use case as well as marketplace.`,
  `One can also create a work and save it privately for internal use and documentation. The primary purpose it is built for is to enable artists and craftspeople to publish and communicate what they do with the rest of the world.`,
  `Images to be uploaded are automatically resized on the client browser before they are uploaded to AWS S3 buckets.`,
];

const members = [
  `If you're admin of an organisation, you can find and filter through members of the organisation. You can verify or unverify them for being able to do certain activities such as creating activities in the program/calendar or creating a process. Think of it like if you run a yoga studio, you'll have both your teachers and students in one platform. Then you will verify your teachers for them to be able to create their activities at the home page, whereas students can only participate to existing activities.`,
  `So necessarily privileges can be meaningfully distributed amongst your community.`,
  `Every user can easily create an account and continue their operations from there. This is built on top of Meteor's account system, which has proven to work very powerful.`,
  `Accounts feature can easily be extended to have further information for each user such as an avatar, phone number, account number etc. Passwords are automatically encrypted in the database so system admins won't be able to track them.`,
  `The way accounts work for the multi tenancy feature in Cocoso is each account is global, but can have different privileges in different spaces. This will allow users to have relation to each other in between spaces while keeping their privileges only in their own spaces. It is designed for autonomy in mind.`,
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
