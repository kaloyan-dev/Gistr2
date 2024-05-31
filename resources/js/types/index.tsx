type Settings = {
  [index: string]: boolean | number
}

type Gist = {
  id: string
  name: string
  page: number
}

type ColorMap = {
  [index: string]: string[]
}

type Folder = {
  id: number
  title: string
  color: string
  gists: string[]
}

type IconProps = {
  type: string
  classes: string
  tooltip?: string
}

export { Settings, Gist, ColorMap, Folder, IconProps }
