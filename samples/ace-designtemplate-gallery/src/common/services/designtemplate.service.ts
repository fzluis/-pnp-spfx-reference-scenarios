import { cloneDeep, find } from "@microsoft/sp-lodash-subset";
import { Logger, LogLevel } from "@pnp/logging";
import * as strings from "AceDesignTemplatePersonalAppWebPartStrings";
import * as eventStrings from "EventscheduleAdaptiveCardExtensionStrings";
import * as faqStrings from "FaqaccordionAdaptiveCardExtensionStrings";
import { AppData, BenefitDetails, AppList, EventRegistration, DeepLinkType, InventoryItem, DeepLinkData, Benefits, AccordionList, Event, FAQ, IFAQ, ImageCarousel, InventoryDetail, IInventoryItem, PayPeriod, Payslip, SimpleList, Anniversary, Praise, Day, Appointment, AppointmentType, Holiday, HolidayTimeline, TimeOff, TimeOffRequest, VaccineAppointment, Cafeteria, Cuisine } from "../models/designtemplate.models";

export interface IDesignTemplateGalleryService {
  Ready: boolean;
  TeamsUrl: string;
  Init(): void;
  GetAllApps: () => AppData[];
  GetAppData: (linkdata: any) => AppData;
  GetBenefits(): Benefits;
  GetEvents(): Event;
  GetEventRegistrationLink(eventRegistration: EventRegistration): string;
  GetFAQs(): AccordionList;
  SubmitFAQ(message: string): void;
  GetImageCarousel(): ImageCarousel;
  GetInventoryDetail(): InventoryDetail;
  GetPayPeriods: () => PayPeriod[];
  GetPaySlips: () => Payslip[];
  GetSimpleList(): SimpleList;
  getCalendarDays: (currentDate: Date) => Day[];
}

export class DesignTemplateGalleryService implements IDesignTemplateGalleryService {
  private LOG_SOURCE: string = "🔶 ACE Design Template Service";
  private _ready: boolean = false;
  private _teamsUrl: string = "https://teams.microsoft.com/l/entity/58a452d7-f97a-40fb-b146-44f74fadf0dc/com.acedesigntemplate.spfx";

  constructor() {
  }

  public get Ready(): boolean {
    return this._ready;
  }
  public get TeamsUrl(): string {
    return this._teamsUrl;
  }

  public Init() {
    try {
      this._ready = true;
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (init) - ${err.message}`, LogLevel.Error);
    }
  }

  public GetAllApps(): AppData[] {
    let retVal: AppData[] = [];
    try {
      for (const item in AppList) {
        retVal.push(this.GetAppData(AppList[item]));
      }
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (GetAllApps) - ${err.message}`, LogLevel.Error);
    }
    return retVal;
  }

  public GetAppData(appName: AppList): AppData {
    let retVal: AppData = new AppData();
    try {
      switch (appName) {
        case AppList.BENEFITS: {
          retVal.appCardImage = require('../images/benefits/dashboard-card.png');
          retVal.appQuickViewImage = require('../images/benefits/card.png');
          retVal.appName = strings.BenefitsAppName;
          retVal.appDescription = strings.BenefitsAppDesc;
          break;
        }
        case AppList.EVENTSCHEDULE: {
          retVal.appCardImage = require('../images/event-schedule/dashboard-card.png');
          retVal.appQuickViewImage = require('../images/event-schedule/card.png');
          retVal.appName = strings.EventScheduleAppName;
          retVal.appDescription = strings.EventScheduleAppDesc;
          break;
        }
        case AppList.FAQACCORDION: {
          retVal.appCardImage = require('../images/faq-accordion/dashboard-card.png');
          retVal.appQuickViewImage = require('../images/faq-accordion/card.png');
          retVal.appName = strings.FAQAppName;
          retVal.appDescription = strings.FAQAppDesc;
          break;
        }
        case AppList.IMAGECAROUSEL: {
          retVal.appCardImage = require('../images/image-carousel/dashboard-card.png');
          retVal.appQuickViewImage = require('../images/image-carousel/card.png');
          retVal.appName = strings.ImageCarouselAppName;
          retVal.appDescription = strings.ImageCarouselAppDesc;
          break;
        }
        case AppList.INVENTORY: {
          retVal.appCardImage = require('../images/inventory/dashboard-card.png');
          retVal.appQuickViewImage = require('../images/inventory/card.png');
          retVal.appName = strings.InventoryAppName;
          retVal.appDescription = strings.InventoryAppDesc;
          break;
        }
        case AppList.PAYSLIP: {
          retVal.appCardImage = require('../images/payslip/dashboard-card.png');
          retVal.appQuickViewImage = require('../images/payslip/card.png');
          retVal.appName = strings.PayslipAppName;
          retVal.appDescription = strings.PayslipAppDesc;
          break;
        }
        case AppList.SIMPLELIST: {
          retVal.appCardImage = require('../images/simple-list/dashboard-card.png');
          retVal.appQuickViewImage = require('../images/simple-list/card.png');
          retVal.appName = strings.SimpleListAppName;
          retVal.appDescription = strings.SimpleListAppDesc;
          break;
        }
        case AppList.TEAMCALENDAR: {
          retVal.appCardImage = require('../images/team-calendar/dashboard-card.png');
          retVal.appQuickViewImage = require('../images/team-calendar/card.png');
          retVal.appName = strings.TeamCalendarAppName;
          retVal.appDescription = strings.TeamCalendarAppDesc;
          break;
        }
        case AppList.TIMELINEHOLIDAY: {
          retVal.appCardImage = require('../images/timeline-holidays/dashboard-card.png');
          retVal.appQuickViewImage = require('../images/timeline-holidays/card.png');
          retVal.appName = strings.TimelineAppName;
          retVal.appDescription = strings.TimelineAppDesc;
          break;
        }
        case AppList.TIMEOFF: {
          retVal.appCardImage = require('../images/timeoff/dashboard-card.png');
          retVal.appQuickViewImage = require('../images/timeoff/card.png');
          retVal.appName = strings.TimeoffAppName;
          retVal.appDescription = strings.TimeoffAppDesc;
          break;
        }
        case AppList.VACCINATIONBOOSTER: {
          retVal.appCardImage = require('../images/vaccination-booster/dashboard-card.png');
          retVal.appQuickViewImage = require('../images/vaccination-booster/card.png');
          retVal.appName = strings.VaccinationAppName;
          retVal.appDescription = strings.VaccinationAppDesc;
          break;
        }
        case AppList.VISUALLIST: {
          retVal.appCardImage = require('../images/visual-list/dashboard-card.png');
          retVal.appQuickViewImage = require('../images/visual-list/card.png');
          retVal.appName = strings.VisualListAppName;
          retVal.appDescription = strings.VisualListAppDesc;
          break;
        }
      }
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (GetAllApps) - ${err.message}`, LogLevel.Error);
    }

    return retVal;
  }

  public GetDeepLinkData(subEntityId: any): DeepLinkData {
    let retVal: DeepLinkData = new DeepLinkData();
    try {
      retVal.appName = subEntityId.appName;
      switch (subEntityId.appName) {
        case AppList.BENEFITS: {
          const benefits: Benefits = this.GetBenefits();
          const link: BenefitDetails = find(benefits.details, { id: subEntityId.message });
          retVal = new DeepLinkData(subEntityId.appName, DeepLinkType.TEXT, link.linkText);
          break;
        }
        case AppList.EVENTSCHEDULE: {
          const registration: EventRegistration = subEntityId.message;
          if (registration) {
            retVal.message = registration;
          }
          retVal = new DeepLinkData(subEntityId.appName, DeepLinkType.EVENTREGISTRATION, registration);
          break;
        }
        case AppList.FAQACCORDION: {
          retVal = new DeepLinkData(subEntityId.appName, DeepLinkType.TEXT, subEntityId.message);
          break;
        }
        case AppList.INVENTORY: {
          const inventory: InventoryDetail = this.GetInventoryDetail();
          const link: IInventoryItem = find(inventory.inventoryItems, { id: subEntityId.message });
          retVal = new DeepLinkData(subEntityId.appName, DeepLinkType.TEXT, link.name);
          break;
        }
        case AppList.SIMPLELIST: {
          const simpleList: SimpleList = this.GetSimpleList();
          if (subEntityId.linkType == DeepLinkType.ANNIVERSARY) {
            const anniversary: Anniversary = find(simpleList.anniversaries, { id: subEntityId.message });
            retVal = new DeepLinkData(subEntityId.appName, DeepLinkType.ANNIVERSARY, anniversary);
          }
          if (subEntityId.linkType == DeepLinkType.PRAISE) {
            const praise: Praise = find(simpleList.praise, { id: subEntityId.message });
            retVal = new DeepLinkData(subEntityId.appName, DeepLinkType.PRAISE, praise);
          }
          break;
        }
        case AppList.TIMEOFF: {
          if (subEntityId.linkType == DeepLinkType.TIMEOFFREQUEST) {
            const request: TimeOff = subEntityId.message;
            retVal = new DeepLinkData(subEntityId.appName, DeepLinkType.TIMEOFFREQUEST, request);
          }
          break;
        }
        case AppList.VACCINATIONBOOSTER: {
          if (subEntityId.linkType == DeepLinkType.VACCINATIONBOOSTER) {
            const request: VaccineAppointment = subEntityId.message;
            retVal = new DeepLinkData(subEntityId.appName, DeepLinkType.VACCINATIONBOOSTER, request);
          }
          break;
        }
        case AppList.VISUALLIST: {
          const cafes: Cafeteria[] = this.GetCafeterias();
          const cafe: Cafeteria = find(cafes, { id: "0" });
          const link: Cuisine = find(cafe.cuisine, { id: subEntityId.message });
          retVal = new DeepLinkData(subEntityId.appName, DeepLinkType.TEXT, link.name);
          break;
        }
        default: {
          //statements; 
          break;
        }
      }
    }
    catch (err) {
      Logger.write(`${this.LOG_SOURCE} (GetDeepLinkData) - ${err.message}`, LogLevel.Error);
    }

    return retVal;
  }

  public GetBenefits(): Benefits {
    let retVal: Benefits = new Benefits();
    try {
      //Sample pulls data from mock
      //To extend pull data from a list of your items
      retVal = require("../data/benefits.data.json");

      //We need to manipulate the data for the deep link to Teams.
      let details: BenefitDetails[] = cloneDeep(retVal.details);
      details.map((item) => {
        if (item.isTeamsDeepLink) {
          const url = encodeURI(`${this._teamsUrl}?context={"subEntityId":{"appName":"${AppList.BENEFITS}","linkType":"${DeepLinkType.TEXT}","message":"${item.id}"}}`);
          //const url = " https://teams.microsoft.com/l/entity/58a452d7-f97a-40fb-b146-44f74fadf0dc/0" //encodeURI(`${this._teamsUrl}`); //?context={"subEntityId":{"appName":"${AppList.BENEFITS}","linkType":"${DeepLinkType.TEXT}","message":"${item.id}"}}`);
          item.linkUrl = url;
        }
      });
      retVal.details = details;

    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (GetBenefits) - ${err.message}`, LogLevel.Error);
    }
    return retVal;
  }

  public GetEvents(): Event {
    let retVal: Event = new Event();
    try {
      //Sample pulls data from mock
      //To extend pull data from a list of your items
      retVal = require("../data/eventschedule.data.json");
      //Lets set some event specific data
      //This would come out of our event management system
      retVal.cardViewImage = require('../images/event-schedule/events.png');
      retVal.eventTitle = eventStrings.EventTitle;
      retVal.headline = eventStrings.ScheduleHeading;
      retVal.imageCaption = eventStrings.ImageCaption;
      retVal.introContent = eventStrings.IntroContent;
      retVal.mainImage = require('../images/event-schedule/Ignite-2021-fall-trim.gif');

    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (GetEvents) - ${err.message}`, LogLevel.Error);
    }
    return retVal;
  }

  public GetEventRegistrationLink(registration: EventRegistration): string {
    let retVal: string = "";
    try {
      //In a real world scenario you would use this method to save the 
      //save data into the system of record.
      //Here we are going to link to the Teams App and demonstrate deep linking
      retVal = encodeURI(`${this._teamsUrl}?context={"subEntityId":{"appName":"${AppList.EVENTSCHEDULE}","linkType":"${DeepLinkType.EVENTREGISTRATION}","message":${JSON.stringify(registration)}}}`);

    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (GetEventRegistrationLink) - ${err.message}`, LogLevel.Error);
    }
    return retVal;
  }

  public GetFAQs(): AccordionList {
    let retVal: AccordionList = new AccordionList();
    try {
      //Sample pulls data from mock
      //To extend pull data from a list of your items
      retVal = require("../data/faqaccordion.data.json");
      //Lets set some specific data
      //This would come out of our knowledge management system
      retVal.mainImage = require('../images/faq-accordion/officelogo.png');
      retVal.title = faqStrings.FAQTitle;
      retVal.imageCaption = faqStrings.ImageCaption;
      retVal.introContent = faqStrings.IntroContent;
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (GetFAQs) - ${err.message}`, LogLevel.Error);
    }
    return retVal;
  }

  public SubmitFAQ(message: string): void {
    try {
      const url = encodeURI(`${this._teamsUrl}?context={"subEntityId":{"appName":"${AppList.FAQACCORDION}","linkType":"${DeepLinkType.TEXT}","message":"${message}"}}`);
      window.open(url);
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (GetFAQs) - ${err.message}`, LogLevel.Error);
    }
  }

  public GetImageCarousel(): ImageCarousel {
    let retVal: ImageCarousel = new ImageCarousel();
    try {
      //Sample pulls data from mock
      //To extend pull data from a list of your items
      retVal = require("../data/imagecarousel.data.json");
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (GetImageCarousel) - ${err.message}`, LogLevel.Error);
    }
    return retVal;
  }

  public GetInventoryDetail(): InventoryDetail {
    let retVal: InventoryDetail = new InventoryDetail();
    try {
      //Sample pulls data from mock
      //To extend pull data from a list of your items
      retVal = require("../data/inventory.data.json");
      //We need to manipulate the data for the deep link to Teams.
      let inventoryItems: IInventoryItem[] = cloneDeep(retVal.inventoryItems);
      inventoryItems.map((item) => {
        const url = encodeURI(`${this._teamsUrl}?context={"subEntityId":{"appName":"${AppList.INVENTORY}","linkType":"${DeepLinkType.TEXT}","message":"${item.id}"}}`);
        item.linkUrl = url;
      });
      retVal.inventoryItems = inventoryItems;
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (GetInventoryDetail) - ${err.message}`, LogLevel.Error);
    }
    return retVal;
  }

  public GetPayPeriods(): PayPeriod[] {
    let retVal: PayPeriod[] = [];
    try {
      const currentDate: Date = new Date();
      let payPeriodIndex: number = 0;
      for (let i = 0; i <= 11; i++) {
        let monthEnd: number;
        if (i == 3 || i == 5 || i == 8 || i == 10) {
          monthEnd = 30;
        } else if (i == 1) {
          if (currentDate.getFullYear() % 4 != 0 || (currentDate.getFullYear() % 100 == 0 && currentDate.getFullYear() % 400 != 0)) {
            monthEnd = 28;
          } else {
            monthEnd = 29;
          }
        } else {
          monthEnd = 31;
        }

        const monthStartDate: Date = new Date(currentDate.getFullYear(), i, 1);
        const payPeriod1End: Date = new Date(currentDate.getFullYear(), i, 15);
        const payPeriod2Start: Date = new Date(currentDate.getFullYear(), i, 16);
        const monthEndDate: Date = new Date(currentDate.getFullYear(), i, monthEnd);

        let payPeriod1Current: boolean = false;
        let payPeriod2Current: boolean = false;
        if (currentDate.getMonth() == i) {
          if (currentDate.getDate() <= payPeriod1End.getDate()) {
            payPeriod1Current = true;
          } else {
            payPeriod2Current = true;
          }
        }
        retVal.push(new PayPeriod(payPeriodIndex, monthStartDate.toISOString(), payPeriod1End.toISOString(), payPeriod1Current));
        payPeriodIndex = payPeriodIndex + 1;
        retVal.push(new PayPeriod(payPeriodIndex, payPeriod2Start.toISOString(), monthEndDate.toISOString(), payPeriod2Current));
        payPeriodIndex = payPeriodIndex + 1;
      }

    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (_getPayPeriods) - ${err.message}`, LogLevel.Error);
    }
    return retVal;
  }

  public GetPaySlips(): Payslip[] {
    let retVal: Payslip[] = [];
    try {
      //Sample pulls data from mock
      //To extend pull data from a list of your items
      retVal = require("../data/payslip.data.json");
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (GetPaySlips) - ${err.message}`, LogLevel.Error);
    }
    return retVal;
  }

  public GetSimpleList(): SimpleList {
    let retVal: SimpleList = new SimpleList();
    try {
      //Sample pulls data from mock
      //To extend pull data from a list of your items
      retVal = require("../data/simplelist.data.json");
      let anniversaries: Anniversary[] = cloneDeep(retVal.anniversaries);
      let currentDate: Date = new Date();
      anniversaries.map((item) => {
        const anniversaryDate: Date = new Date(item.anniversaryDate);
        let duration = currentDate.getFullYear() - anniversaryDate.getFullYear();
        item.anniversaryDuration = duration;
        const url = encodeURI(`${this._teamsUrl}?context={"subEntityId":{"appName":"${AppList.SIMPLELIST}","linkType":"${DeepLinkType.ANNIVERSARY}","message":"${item.id}"}}`);
        item.linkUrl = url;

      });
      retVal.anniversaries = anniversaries;

      let praise: Praise[] = cloneDeep(retVal.praise);
      praise.map((item) => {
        const url = encodeURI(`${this._teamsUrl}?context={"subEntityId":{"appName":"${AppList.SIMPLELIST}","linkType":"${DeepLinkType.PRAISE}","message":"${item.id}"}}`);
        item.linkUrl = url;
      });
      retVal.praise = praise;
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (GetSimpleList) - ${err.message}`, LogLevel.Error);
    }
    return retVal;
  }

  public getCalendarDays(currentDate: Date): Day[] {
    let retVal: Day[] = [];
    try {
      const currentMonthIndex: number = currentDate.getMonth();
      let dayCount: number = 31;
      if (currentMonthIndex == 3 || currentMonthIndex == 5 || currentMonthIndex == 8 || currentMonthIndex == 10) {
        dayCount = 30;
      } else if (currentMonthIndex == 1) {
        if (currentDate.getFullYear() % 4 != 0 || (currentDate.getFullYear() % 100 == 0 && currentDate.getFullYear() % 400 != 0)) {
          dayCount = 28;
        } else {
          dayCount = 29;
        }
      }

      for (let i = 1; i <= dayCount; i++) {
        const currentDay: Date = new Date(currentDate.getFullYear(), currentMonthIndex, i);
        const dayOfWeek: number = currentDay.getDay();
        if ((i == 1) && dayOfWeek != 0) {
          for (let x = dayOfWeek - 1; x >= 0; x--) {
            retVal.push(new Day());
          }
        }
        let day = new Day(currentMonthIndex, dayOfWeek, i, []);
        retVal.push(day);

        if ((i == dayCount) && dayOfWeek != 6) {
          for (let x = dayOfWeek + 1; x <= 6; x++) {
            retVal.push(new Day());
          }
        }
      }

      const appointments: Appointment[] = this.GetAppointments(currentDate);
      appointments.map((appt) => {
        let startDate: Date = new Date(appt.startDate);
        //If the event spans months set the start to the first day of the current month.
        if (currentDate.getMonth() != startDate.getMonth()) {
          startDate.setMonth(currentDate.getMonth());
          startDate.setDate(1);
        }
        const endDate: Date = new Date(appt.endDate);
        let dif: number = endDate.getTime() - startDate.getTime();
        let duration: number = dif / (1000 * 3600 * 24);
        for (let x = 0; x <= duration; x++) {
          const apptStartDate: Date = cloneDeep(startDate);
          apptStartDate.setDate(startDate.getDate() + x);
          const day: Day = find(retVal, { day: apptStartDate.getDate(), monthIndex: apptStartDate.getMonth() });
          if (day) {
            day.appointments.push(new Appointment(appt.startDate, appt.endDate, appt.title, appt.appointmentType));
          }
        }

      });
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (getCalendarDays) - ${err.message}`, LogLevel.Error);
    }
    return retVal;
  }

  public GetAppointments(currentDate: Date): Appointment[] {
    let retVal: Appointment[] = [];
    try {
      //Sample pulls data from mock
      //To extend pull data from a list of your items
      const allAppointments: Appointment[] = require("../data/teamcalendar.data.json");
      allAppointments.map((appt) => {
        const apptStartDate: Date = new Date(appt.startDate);
        const apptEndDate: Date = new Date(appt.endDate);
        if (currentDate.getFullYear() == apptStartDate.getFullYear() && currentDate.getMonth() == apptStartDate.getMonth()) {
          retVal.push(appt);
        } else if (currentDate.getFullYear() == apptEndDate.getFullYear() && currentDate.getMonth() == apptEndDate.getMonth()) {
          retVal.push(appt);
        }
      });

    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (GetAppointments) - ${err.message}`, LogLevel.Error);
    }
    return retVal;
  }

  public GetThisWeekData(currentDate: Date): Appointment[] {
    let retVal: Appointment[] = [];
    try {

      const sunday: Date = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay());
      const friday: Date = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + (currentDate.getDay() - 6));

      //Sample pulls data from mock
      //To extend pull data from a list of your items
      const allAppointments: Appointment[] = require("../data/teamcalendar.data.json");
      allAppointments.map((appt) => {
        const apptStartDate: Date = new Date(appt.startDate);
        const apptEndDate: Date = new Date(appt.endDate);
        if ((apptStartDate.getTime() >= sunday.getTime() && apptEndDate.getTime() <= friday.getTime()) || (apptEndDate.getTime() >= sunday.getTime() && apptEndDate.getTime() <= friday.getTime())) {
          retVal.push(appt);
        }
      });

    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (GetThisWeekData) - ${err.message}`, LogLevel.Error);
    }
    return retVal;
  }

  public GetHolidayTimeline(): HolidayTimeline {
    let retVal: HolidayTimeline = new HolidayTimeline();
    try {
      const today: Date = new Date();
      const holidays: Holiday[] = require("../data/timelineholiday.data.json");
      holidays.map((holiday) => {
        const holidayDate: Date = new Date(holiday.date);
        if (holidayDate.getTime() >= today.getTime()) {
          if ((holidayDate.getDay() == 1) && (holidayDate.getFullYear() == today.getFullYear())) {
            holiday.holidayWeekend = true;
            let friday: Date = new Date(holidayDate.getFullYear(), holidayDate.getMonth(), holidayDate.getDate() - 3);
            let tuesday: Date = new Date(holidayDate.getFullYear(), holidayDate.getMonth(), holidayDate.getDate() + 1);
            holiday.holidayWeekendFri = friday.toISOString();
            holiday.holidayWeekendTue = tuesday.toISOString();
          }
          retVal.holidays.push(holiday);
          if (retVal.years.indexOf(holidayDate.getFullYear()) <= -1) {
            retVal.years.push(holidayDate.getFullYear());
          }
        }
      });
      if (retVal.holidays.length > 0) {
        retVal.nextHoliday = retVal.holidays[0];
      }
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (GetHolidayTimeline) - ${err.message}`, LogLevel.Error);
    }
    return retVal;
  }

  public GetTimeOff(): TimeOff {
    let retVal: TimeOff = new TimeOff();
    try {
      //Sample pulls data from mock
      //To extend pull data from a list of your items
      retVal = require("../data/timeoff.data.json");
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (GetTimeOff) - ${err.message}`, LogLevel.Error);
    }
    return retVal;
  }

  public SubmitTimeOffRequest(request: TimeOffRequest): void {
    try {
      const url = encodeURI(`${this._teamsUrl}?context={"subEntityId":{"appName":"${AppList.TIMEOFF}","linkType":"${DeepLinkType.TIMEOFFREQUEST}","message":${JSON.stringify(request)}}}`);
      window.open(url);
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (SubmitTimeOffRequest) - ${err.message}`, LogLevel.Error);
    }
  }

  public SubmitVaccineAppointment(request: VaccineAppointment): void {
    try {
      const url = encodeURI(`${this._teamsUrl}?context={"subEntityId":{"appName":"${AppList.VACCINATIONBOOSTER}","linkType":"${DeepLinkType.VACCINATIONBOOSTER}","message":${JSON.stringify(request)}}}`);
      window.open(url);
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (SubmitTimeOffRequest) - ${err.message}`, LogLevel.Error);
    }
  }

  public GetCafeterias(): Cafeteria[] {
    let retVal: Cafeteria[] = [];
    try {
      //Sample pulls data from mock
      //To extend pull data from a list of your items
      retVal = require("../data/visuallist.data.json");

      //We need to manipulate the data for the deep link to Teams.
      const cafes: Cafeteria[] = cloneDeep(retVal);
      cafes.map((cafe) => {
        let cuisine: Cuisine[] = cloneDeep(cafe.cuisine);
        cuisine.map((item) => {
          const url = encodeURI(`${this._teamsUrl}?context={"subEntityId":{"appName":"${AppList.VISUALLIST}","linkType":"${DeepLinkType.TEXT}","message":"${item.id}"}}`);
          item.linkUrl = url;
        });
        cafe.cuisine = cuisine;
      });
      retVal = cafes;
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (GetCafeterias) - ${err.message}`, LogLevel.Error);
    }
    return retVal;
  }
}



export const dtg = new DesignTemplateGalleryService();