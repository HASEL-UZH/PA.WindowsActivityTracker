import Activity from "../types/Activity";
import * as devCode from "./devCode";
import * as devDebug from "./devDebug";
import * as devReview from "./devReview";
import * as devVc from "./devVc";
import * as email from "./email";
import * as planning from "./planning";
import * as readWriteDocument from "./readWriteDocument";
import * as design from "./design";
import * as socialMedia from "./socialMedia";
import * as generativeAI from "./generativeAI";
import * as instantMessaging from "./instantMessaging";
import * as fileManagement from "./fileManagement";
import * as other from "./other";
import * as otherRdp from "./otherRdp";

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
};

export default activityMappings;
