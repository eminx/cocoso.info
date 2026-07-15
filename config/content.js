function getHomeSections(t) {
  return [
    {
      title: t("home.tripleTitle"),
      tags: t("home.tripleTags", {}, { returnObjects: true }),
      content: t("home.triple", {}, { returnObjects: true }),
      sliderImage:
        "/slider/calendar-birmingham-museums-trust-RpELX3wVm_U-unsplash.jpg",
    },
    {
      title: t("home.federationTitle"),
      tags: t("home.federationTags", {}, { returnObjects: true }),
      content: t("home.federation", {}, { returnObjects: true }),
      sliderImage: "/slider/members-mcgill-library-eMw-fVXNpME-unsplash.jpg",
    },
    {
      title: t("home.accountsTitle"),
      tags: t("home.accountsTags", {}, { returnObjects: true }),
      content: t("home.accounts", {}, { returnObjects: true }),
      sliderImage: "/slider/intro-mcgill-library-rxZLty9pnh4-unsplash.jpg",
      bgPosition: "bottom",
    },
    {
      title: t("home.dataTitle"),
      tags: t("home.dataTags", {}, { returnObjects: true }),
      content: t("home.data", {}, { returnObjects: true }),
      sliderImage: "/slider/info-british-library-b8vYa2-83pw-unsplash.jpg",
      bgPosition: "top",
    },
    {
      title: t("home.openSourceTitle"),
      tags: t("home.openSourceTags", {}, { returnObjects: true }),
      content: t("home.openSource", {}, { returnObjects: true }),
      sliderImage:
        "/slider/works-boston-public-library-awhvI865NQk-unsplash.jpg",
      bgPosition: "top",
    },
  ];
}

function getFeatureSections(t) {
  return [
    {
      group: "community",
      title: t("features.activityTitle"),
      tags: t("features.activityTags", {}, { returnObjects: true }),
      content: t("features.activities", {}, { returnObjects: true }),
      sliderImage: "/slider/activities-mcgill-library-1Rbv8ubJix0-unsplash.jpg",
      image: "/activities.jpeg",
    },
    {
      group: "community",
      title: t("features.resourceTitle"),
      tags: t("features.resourceTags", {}, { returnObjects: true }),
      content: t("features.resources", {}, { returnObjects: true }),
      sliderImage: "/slider/resources-mcgill-library---DJjEqekIM-unsplash.jpg",
      image: "/resources.jpg",
      bgPosition: "top",
    },
    {
      group: "community",
      title: t("features.calendarTitle"),
      tags: t("features.calendarTags", {}, { returnObjects: true }),
      content: t("features.calendar", {}, { returnObjects: true }),
      sliderImage: `/slider/calendar-birmingham-museums-trust-RpELX3wVm_U-unsplash.jpg`,
      image: "/calendar.png",
    },
    {
      group: "community",
      title: t("features.groupTitle"),
      tags: t("features.groupTags", {}, { returnObjects: true }),
      content: t("features.groups", {}, { returnObjects: true }),
      sliderImage: "/slider/processes-mcgill-library-IpZCihceRkQ-unsplash.jpg",
      image: "/processes.png",
    },
    {
      group: "community",
      title: t("features.workTitle"),
      tags: t("features.workTags", {}, { returnObjects: true }),
      content: t("features.works", {}, { returnObjects: true }),
      sliderImage:
        "/slider/works-boston-public-library-awhvI865NQk-unsplash.jpg",
      image: "/works.jpg",
    },
    {
      group: "admin",
      title: t("features.memberTitle"),
      tags: t("features.memberTags", {}, { returnObjects: true }),
      content: t("features.members", {}, { returnObjects: true }),
      sliderImage: "/slider/members-mcgill-library-eMw-fVXNpME-unsplash.jpg",
      image: "/members.png",
    },
    {
      group: "admin",
      title: t("features.pagesTitle"),
      tags: t("features.pagesTags", {}, { returnObjects: true }),
      content: t("features.pages", {}, { returnObjects: true }),
      sliderImage: "/slider/info-british-library-b8vYa2-83pw-unsplash.jpg",
    },
    {
      group: "admin",
      title: t("features.adminTitle"),
      tags: t("features.adminTags", {}, { returnObjects: true }),
      content: t("features.admin", {}, { returnObjects: true }),
      sliderImage: "/slider/intro-mcgill-library-rxZLty9pnh4-unsplash.jpg",
    },
    {
      group: "admin",
      title: t("features.designTitle"),
      tags: t("features.designTags", {}, { returnObjects: true }),
      content: t("features.design", {}, { returnObjects: true }),
      sliderImage: "/slider/activities-mcgill-library-1Rbv8ubJix0-unsplash.jpg",
    },
    {
      group: "admin",
      title: t("features.newsletterTitle"),
      tags: t("features.newsletterTags", {}, { returnObjects: true }),
      content: t("features.newsletter", {}, { returnObjects: true }),
      sliderImage: "/slider/resources-mcgill-library---DJjEqekIM-unsplash.jpg",
    },
  ];
}

function getClientSections(t) {
  return [
    {
      title: t("clients.samarbetetTitle"),
      tags: t("clients.samarbetetTags", {}, { returnObjects: true }),
      content: t("clients.samarbetet", {}, { returnObjects: true }),
      logo: "/partners/samarbetet-logo.webp",
      link: "https://www.samarbetet.org",
      linkLabel: t("clients.samarbetetLinkLabel"),
      sliderImage: "/slider/processes-mcgill-library-IpZCihceRkQ-unsplash.jpg",
    },
    {
      title: t("clients.kkvTitle"),
      tags: t("clients.kkvTags", {}, { returnObjects: true }),
      content: t("clients.kkv", {}, { returnObjects: true }),
      logo: "/partners/kkv-logo.webp",
      link: "https://stockholm.kkv.nu",
      linkLabel: t("clients.kkvLinkLabel"),
      sliderImage:
        "/slider/works-boston-public-library-awhvI865NQk-unsplash.jpg",
      bgPosition: "top",
    },
    {
      title: t("clients.hojdenTitle"),
      tags: t("clients.hojdenTags", {}, { returnObjects: true }),
      content: t("clients.hojden", {}, { returnObjects: true }),
      logo: "/slider/hojdenlogo.webp",
      link: "https://www.hojden.house/en",
      linkLabel: t("clients.hojdenLinkLabel"),
      sliderImage: "/slider/activities-mcgill-library-1Rbv8ubJix0-unsplash.jpg",
    },
    {
      title: t("clients.gerlesborgTitle"),
      tags: t("clients.gerlesborgTags", {}, { returnObjects: true }),
      content: t("clients.gerlesborg", {}, { returnObjects: true }),
      logo: "/partners/gerlesborg-logo.webp",
      link: "https://www.gerlesborgskulturhus.se",
      linkLabel: t("clients.gerlesborgLinkLabel"),
      sliderImage:
        "/slider/calendar-birmingham-museums-trust-RpELX3wVm_U-unsplash.jpg",
    },
    {
      title: t("clients.minaTitle"),
      tags: t("clients.minaTags", {}, { returnObjects: true }),
      content: t("clients.mina", {}, { returnObjects: true }),
      logo: "/slider/mina-logo-beyaz.png",
      logoDark: true,
      link: "https://en.minakocailik.com",
      linkLabel: t("clients.minaLinkLabel"),
      sliderImage: "/slider/mina.jpeg",
      bgPosition: "top",
    },
  ];
}

export { getHomeSections, getFeatureSections, getClientSections };
