export interface ExcelRow {
  index: number;
  values: unknown[][];
}

export interface DriveItem {
  id: string;
  name: string;
  size: number;
  lastModifiedDateTime: string;
}

export interface SharePointSite {
  id: string;
  name: string;
  displayName: string;
  webUrl: string;
}

export interface GraphListResponse<T> {
  value: T[];
}
