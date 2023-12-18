interface Settings {
  [index: string]: boolean | number;
}

interface Gist {
  id: string;
  name: string;
  page: number;
};

interface ColorMap {
  [index: string]: string[];
}
interface Folder {
  id: number;
  title: string;
  color: string;
  gists: string[];
}
interface IconProps {
  type: string;
  classes: string;
  tooltip?: string;
};

export {
  Settings,
  Gist,
  ColorMap,
  Folder,
  IconProps
}
