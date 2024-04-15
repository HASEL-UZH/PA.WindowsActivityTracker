enum Activity {
  Uncategorized = "Uncategorized",
  DevCode = "DevCode",
  DevDebug = "DevDebug",
  DevReview = "DevReview",
  DevVc = "DevVc",
  Planning = "Planning",
  ReadWriteDocument = "ReadWriteDocument",
  Design = "design",
  GenerativeAI = "GenerativeAI",
  PlannedMeeting = "PlannedMeeting",
  Email = "Email",
  InstantMessaging = "InstantMessaging",
  WorkRelatedBrowsing = "WorkRelatedBrowsing",
  WorkUnrelatedBrowsing = "WorkUnrelatedBrowsing",
  SocialMedia = "SocialMedia", // sub-group of WorkUnrelatedBrowsing
  FileNavigationInExplorer = "FileNavigationInExplorer",
  Other = "Other",
  OtherRdp = "OtherRdp",
  Idle = "Idle", // all IDLE events that can't be mapped elsewhere
  Unknown = "Unknown",
}

export default Activity;
