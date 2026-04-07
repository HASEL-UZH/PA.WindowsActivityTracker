import Activity from "../types/Activity.js";
import * as devCode from "./devCode.js";
import * as devDebug from "./devDebug.js";
import * as devReview from "./devReview.js";
import * as devVc from "./devVc.js";
import * as email from "./email.js";
import * as planning from "./planning.js";
import * as readWriteDocument from "./readWriteDocument.js";
import * as design from "./design.js";
import * as socialMedia from "./socialMedia.js";
import * as generativeAI from "./generativeAI.js";
import * as instantMessaging from "./instantMessaging.js";
import * as fileManagement from "./fileManagement.js";
import * as other from "./other.js";
import * as otherRdp from "./otherRdp.js";

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
