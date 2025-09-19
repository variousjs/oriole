export type ButtonAction =
  | 'Undo'
  | 'Redo'
  | 'Paragraph'
  | 'H1'
  | 'H2'
  | 'H3'
  | 'H4'
  | 'H5'
  | 'H6'
  | 'NumberList'
  | 'BulletList'
  | 'CheckList'
  | 'Quote'
  | 'CodeBlock'
  | 'Bold'
  | 'Italic'
  | 'Underline'
  | 'Code'
  | 'Link'
  | 'FontSize'
  | 'Lowercase'
  | 'Uppercase'
  | 'Capitalize'
  | 'Strikethrough'
  | 'Subscript'
  | 'Superscript'
  | 'Highlight'
  | 'Clear'
  | 'Horizontal'
  | 'PageBreak'
  | 'Table'
  | 'Image'
  | 'Columns'
  | 'Collapsible'
  | 'Video'
  | 'LeftAlign'
  | 'CenterAlign'
  | 'RightAlign'
  | 'JustifyAlign'
  | 'Indent'
  | 'Outdent'

export type DropdownAction =
  | 'Color'
  | 'BackgroundColor'
  | 'FontFamily'

export interface DropdownOption {
  items: ButtonAction[],
  type: 'block' | 'align' | 'format',
}

export type ToolbarActions =
  ('_Divider' | ButtonAction | DropdownAction | DropdownOption[])[]
