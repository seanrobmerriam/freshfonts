export interface Icon {
  name: string;
  file: string;
}

export interface IconSet {
  slug: string;
  name: string;
  count: number;
  icons: Icon[];
}
