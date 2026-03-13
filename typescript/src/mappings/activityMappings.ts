import Activity from "../types/Activity";
import devCode from "./devCode";
import devDebug from "./devDebug";
import devReview from "./devReview";
import devVc from "./devVc";
import email from "./email";
import planning from "./planning";
import readWriteDocument from "./readWriteDocument";
import design from "./design";
import socialMedia from "./socialMedia";
import generativeAI from "./generativeAI";
import instantMessaging from "./instantMessaging";
import fileManagement from "./fileManagement";
import other from "./other";
import otherRdp from "./otherRdp";

const activityMappings = {
  [Activity.DevCode]: devCode,
  [Activity.DevDebug]: devDebug,
  [Activity.DevReview]: devReview,
  [Activity.DevVc]: devVc,
  [Activity.Email]: email,
  [Activity.Planning]: planning,
  [Activity.ReadWriteDocument]: readWriteDocument,
  [Activity.Design]: design,
  [Activity.SocialMedia]: socialMedia,
  [Activity.GenerativeAI]: generativeAI,
  [Activity.InstantMessaging]: instantMessaging,
  [Activity.FileManagement]: fileManagement,
  [Activity.Other]: other,
  [Activity.OtherRdp]: otherRdp,
} as const;

export default activityMappings;
