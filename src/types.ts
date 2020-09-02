export interface pageMeta {
  type: string;
  detail_url: string;
  html_url: string;
  slug?: string;
  show_in_menus?: boolean;
  seo_title?: string;
  search_description?: string;
  first_published_at?: string;
  parent?: pageDataType;
}

export interface pageDataType {
  id: number;
  meta: pageMeta;
  title: string;
  [propName: string]: any;
}

interface imageRendition {
  src: string;
  width: number;
  height: number;
  alt: string;
}

interface imageBlock {
  id: number;
  title: string;
  [propName: string]: any;
}

interface homeSlideValue {
  title: string;
  text: string;
  anchor: string;
  image: imageBlock;
  page: number | null;
  link: string | null;
}

export interface MainMenuItem {
  id: number;
  link: string;
  url_append: string;
  handle: string;
  label: string;
}

export interface homeSlide {
  type: string;
  value: homeSlideValue;
  id: string;
}

export interface componentDataType {
  type: string;
  id: string;
  value: object;
}

export interface IndustryPageDataType extends pageDataType {
  concerns?: pageDataType[];
}

// Vuex States

export interface RootState {
  version: string;
}

export interface PageDataState {
  data?: pageDataType;
  error: boolean;
}

export interface CareersDataState {
  data?: any[];
  error: boolean;
}
export interface IndustryPageNavController {
  currentPage: number;
  nextAnime: number | null;
  beforeAnime: number | null;
  lock: boolean;
}

export interface IndustriesState {
  parentPage?: pageDataType;
  data?: { [key: string]: IndustryPageDataType };
  error: boolean;
  controllers: IndustryPageNavController;
}

export interface AnimationState {
  mainTimeLine: any | null;
  menuLoaded: boolean;
  preloaderLoaded: boolean;
  pageImageLoaded: boolean;
}

export interface MenuState {
  mainMenu: MainMenuItem[];
  mainMenuError: boolean;
}

// Other types

export interface SmoothScrollType {
  t: any;
  h: HTMLElement;
}

// Splitting

export interface AnalyticsSettings {
  facebook_app_id: string | null;
  google_analytics_id: string | null;
}

export interface SiteSettingsState {
  analytics?: AnalyticsSettings;
  analyticsError: boolean;
}
