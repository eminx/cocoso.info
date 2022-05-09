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

function getSections(t) {
  const sections = [
    {
      title: t("introTitle"),
      tags: t("introTags", {}, { returnObjects: true }),
      content: t("intro", {}, { returnObjects: true }),
      sliderImage: "/slider/intro-mcgill-library-rxZLty9pnh4-unsplash.jpg",
      sliderCaption: {
        title: `Art Deco - A colour plate entitled "L'Eau" from Falbalas & fanfreluches : almanach des modes présentes, passées et futures.`,
        link: `https://unsplash.com/photos/rxZLty9pnh4`,
      },
    },
    {
      title: t("activityTitle"),
      tags: t("activityTags", {}, { returnObjects: true }),
      content: t("activities", {}, { returnObjects: true }),
      sliderImage: "/slider/activities-mcgill-library-1Rbv8ubJix0-unsplash.jpg",
      sliderCaption: {
        title: `Persian Literary History. Isfandiyar kills Bidarafsh`,
        link: `https://unsplash.com/photos/1Rbv8ubJix0`,
      },
      image: "/activities.jpeg",
    },
    {
      title: t("resourceTitle"),
      tags: t("resourceTags", {}, { returnObjects: true }),
      content: t("resources", {}, { returnObjects: true }),
      sliderImage: "/slider/resources-mcgill-library---DJjEqekIM-unsplash.jpg",
      sliderCaption: {
        title: `Art Deco and the Decorative Arts in the 1920's and 1930's`,
        link: `https://unsplash.com/photos/--DJjEqekIM`,
      },
      image: "/resources.jpg",
    },
    {
      title: t("calendarTitle"),
      tags: t("calendarTags", {}, { returnObjects: true }),
      content: t("calendar", {}, { returnObjects: true }),
      sliderImage: `/slider/calendar-birmingham-museums-trust-RpELX3wVm_U-unsplash.jpg`,
      sliderCaption: {
        title: `The Old Theatre Stores, New Street, Birmingham. By George Warren Blackham`,
        link: `https://unsplash.com/photos/RpELX3wVm_U`,
      },
      image: "/calendar.png",
    },
    {
      title: t("processTitle"),
      tags: t("processTags", {}, { returnObjects: true }),
      content: t("processes", {}, { returnObjects: true }),
      sliderImage: "/slider/processes-mcgill-library-IpZCihceRkQ-unsplash.jpg",
      sliderCaption: {
        title: `Cinderella`,
        link: `https://unsplash.com/photos/IpZCihceRkQ`,
      },
      image: "/processes.png",
    },
    {
      title: t("workTitle"),
      tags: t("workTags", {}, { returnObjects: true }),
      content: t("works", {}, { returnObjects: true }),
      sliderImage:
        "/slider/works-boston-public-library-awhvI865NQk-unsplash.jpg",
      sliderCaption: {
        title: `Colored print of a costume for the original (1912) production of Richard Strauss's Ariadne auf Naxos`,
        link: `https://unsplash.com/photos/awhvI865NQk`,
      },
      image: "/works.jpg",
    },
    {
      title: t("memberTitle"),
      tags: t("memberTags", {}, { returnObjects: true }),
      content: t("members", {}, { returnObjects: true }),
      sliderImage: "/slider/members-mcgill-library-eMw-fVXNpME-unsplash.jpg",
      sliderCaption: {
        title: `Who killed cock robin?`,
        link: `https://unsplash.com/photos/eMw-fVXNpME`,
      },
      image: "/members.png",
    },
    {
      title: t("info"),
      tags: t("infoTags", {}, { returnObjects: true }),
      content: t("info", {}, { returnObjects: true }),
      sliderImage: "/slider/info-british-library-b8vYa2-83pw-unsplash.jpg",
      sliderCaption: {
        title: `Valentine's Day`,
        link: `https://unsplash.com/photos/b8vYa2-83pw`,
      },
    },
  ];

  return sections;
}

export { getSections };
