const intro = [
  `Cocoso is a web-based software that runs as a webapp on browsers. You can use it to build and facilitate your web presence; but also a platform for having users follow, participate and contribute to your activities. Whether it's for a festival, an association, non-profit, family, small or medium business, alternative school, yoga space, or a revolutionary artists collective, Cocoso will probably work for you very well.`,
  `It is built for the primary purpose of helping an open community of people cooperate with each other better, whether they are locally engaged with one another or cooperate remotely. It does so by featuring different digital tools for enabling individuals to timely utilise a set of common material resources as well as human.`,
  `It isn't a profit-oriented project, and is fully open source and free. There's been strong artistic, social and economic motives behind building it. Currently we are working with different community building and maintaining projects such as autonomous communities using alternative currencies as well as creating a platform for artists and artist run initiatives.`,
  `We're proud to say that Cocoso is completely free of any surveillance tools. Because freeing of users from surveillance by the Big Tech has probably been the most fundamental motive behind building Cocoso.`,
  `With Cocoso, you own your own data, at the individual and organisation level. You basically run your community on your own terms.`,
];

const activities = [
  `Since Cocoso is primarily built for an artist run space that continuously hosts public stage performances for a limited audience who are required to register beforehand; creating and managing a public event was the number one requirement.`,
  `There are a few components of public events that can be listed as below:`,
];

const resources = [
  `Since Cocoso is primarily built for an artist run space that continuously hosts public stage performances for a limited audience who are required to register beforehand; creating and managing a public event was the number one requirement.`,
  `There are a few components of public events that can be listed as below:`,
];

const calendar = [
  `Since Cocoso is primarily built for an artist run space that continuously hosts public stage performances for a limited audience who are required to register beforehand; creating and managing a public event was the number one requirement.`,
  `There are a few components of public events that can be listed as below:`,
];
const processes = [
  `Since Cocoso is primarily built for an artist run space that continuously hosts public stage performances for a limited audience who are required to register beforehand; creating and managing a public event was the number one requirement.`,
  `There are a few components of public events that can be listed as below:`,
];

const members = [
  `Every user can easily create an account and continue their operations from there. This is built on top of Meteor's account system, which has proven to work very powerful.`,
  `Accounts feature can easily be extended to have further information for each user such as an avatar, phone number, account number etc. Passwords are automatically encrypted in the database so system admins won't be able to track them.`,
  `The way accounts work for the multi tenancy feature in Cocoso is each account is global, but can have different privileges in different spaces. This will allow users to have relation to each other in between spaces while keeping their privileges only in their own spaces. It is designed for autonomy in mind.`,
];

const info = [
  `Since Cocoso is primarily built for an artist run space that continuously hosts public stage performances for a limited audience who are required to register beforehand; creating and managing a public event was the number one requirement.`,
  `There are a few components of public events that can be listed as below:`,
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
