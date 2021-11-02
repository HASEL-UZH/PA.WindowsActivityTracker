enum Activity {
  Uncategorized = "Uncategorized",
  DevCode = "DevCode",
  DevDebug = "DevDebug",
  DevReview = "DevReview",
  DevVc = "DevVc",
  Email = "Email",
  Planning = "Planning",
  ReadWriteDocument = "ReadWriteDocument",
  PlannedMeeting = "PlannedMeeting",
  InformalMeeting = "InformalMeeting",
  InstantMessaging = "InstantMessaging", // subcategory of InformalMeeting
  WorkRelatedBrowsing = "WorkRelatedBrowsing",
  WorkUnrelatedBrowsing = "WorkUnrelatedBrowsing",
  FileNavigationInExplorer = "FileNavigationInExplorer",
  Other = "Other",
  OtherRdp = "OtherRdp",
  Idle = "Idle", // all IDLE events that can't be mapped elsewhere
  Gaming = "Gaming",
  Unknown = "Unknown",
}

export default Activity;
