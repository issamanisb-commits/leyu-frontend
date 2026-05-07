export interface Language {
  id: string;
  name: string,
  code: string,
  created_date: string;
  description: string,
  alternative_names?: { key: string; name: string }[] | null;
  continent?:string|null,
}

export interface NewLanguage {

  name: string,
  code: string,

}
export interface DialectBasedata {
  id: string;
  name: string,
  code: string,
  description: string,
  alternative_names?: { key: string; name: string }[] | null;
  language: {
    id: string,
    name: string,
  }
}
export interface AnnotationBasedata {
  id: string;
  name: string,
  code: string,
  description: string,
  alternative_names?: { key: string; name: string }[] | null;
  annotation_type: {
    id: string,
    name: string,
  }
}
export interface RegionBasedata {
  id: string;
  name: string,
  code: string,
  description: string,
  alternative_names?: { key: string; name: string }[] | null;
  country: {
    id: string,
    name: string,
  }
}
export interface BasedataTaskType {
  id: string;
  task_type: string,
  code: string,
  description: string,
  alternative_names?: { key: string; name: string }[] | null;

}
export interface Basedata {
  id: string;
  name: string,
  code: string,
  description: string,
  alternative_names?: { key: string; name: string }[] | null;
  continent?:string|null;


}
export interface Dialect {
  id: string;
  name: string,
  description: string,
  alternative_names?: { key: string; name: string }[] | null;
  code: string

}
export interface Sector {
  id: string;
  name: string,
  description: string,
  alternative_names?: { key: string; name: string }[] | null;
  code: string

}
export interface RejectionType {
  id: string;
  name: string,
  description: string,
  alternative_names?: { key: string; name: string }[] | null;
  code: string

}

export interface Organization {
  id: string;
  name: string,
  email: string,
  phone: string,
  alternative_names?: { key: string; name: string }[] | null;
  address: string
}