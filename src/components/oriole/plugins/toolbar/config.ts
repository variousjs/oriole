import { getCodeLanguageOptions } from '@lexical/code'
import { ElementFormatType } from 'lexical'

export const blockTypeToBlockName = {
  bullet: 'Bulleted List',
  check: 'Check List',
  code: 'Code Block',
  h1: 'Heading 1',
  h2: 'Heading 2',
  h3: 'Heading 3',
  h4: 'Heading 4',
  h5: 'Heading 5',
  h6: 'Heading 6',
  number: 'Numbered List',
  paragraph: 'Normal',
  quote: 'Quote',
}

export const rootTypeToRootName = {
  root: 'Root',
  table: 'Table',
}

export const DEFAULT_FONT_SIZE = 14
export const MIN_ALLOWED_FONT_SIZE = 12
export const MAX_ALLOWED_FONT_SIZE = 72;

export const CODE_LANGUAGE_OPTIONS = getCodeLanguageOptions().filter((option) =>
  [
    'c',
    'clike',
    'cpp',
    'css',
    'html',
    'java',
    'js',
    'javascript',
    'markdown',
    'objc',
    'objective-c',
    'plain',
    'powershell',
    'py',
    'python',
    'rust',
    'sql',
    'swift',
    'typescript',
    'xml',
  ].includes(option[0]))


export const FONT_FAMILY_OPTIONS = [
  ['Arial', 'Arial'],
  ['Courier New', 'Courier New'],
  ['Georgia', 'Georgia'],
  ['Times New Roman', 'Times New Roman'],
  ['Trebuchet MS', 'Trebuchet MS'],
  ['Verdana', 'Verdana'],
]

export const ELEMENT_FORMAT_OPTIONS: {
  [key in Exclude<ElementFormatType, ''>]: {
    icon: string;
    iconRTL: string;
    name: string;
  };
} = {
  center: {
    icon: 'center-align',
    iconRTL: 'center-align',
    name: 'Center Align',
  },
  end: {
    icon: 'right-align',
    iconRTL: 'left-align',
    name: 'End Align',
  },
  justify: {
    icon: 'justify-align',
    iconRTL: 'justify-align',
    name: 'Justify Align',
  },
  left: {
    icon: 'left-align',
    iconRTL: 'left-align',
    name: 'Left Align',
  },
  right: {
    icon: 'right-align',
    iconRTL: 'right-align',
    name: 'Right Align',
  },
  start: {
    icon: 'left-align',
    iconRTL: 'right-align',
    name: 'Start Align',
  },
}
