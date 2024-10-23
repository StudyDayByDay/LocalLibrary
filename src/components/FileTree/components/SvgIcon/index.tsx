import md from '@/assets/svg/file-markdown.svg';
import pdf from '@/assets/svg/file-pdf.svg';
import ppt from '@/assets/svg/file-ppt.svg';
import image from '@/assets/svg/file-image.svg';
import json from '@/assets/svg/file-json.svg';
import svg from '@/assets/svg/file-svg.svg';
import html from '@/assets/svg/file-html.svg';
import css from '@/assets/svg/file-css.svg';
import js from '@/assets/svg/file-javascript.svg';
import ts from '@/assets/svg/file-typescript.svg';
import react from '@/assets/svg/file-react.svg';
import vue from '@/assets/svg/file-vue.svg';
import nvmrc from '@/assets/svg/file-nvm.svg';
import git from '@/assets/svg/file-git.svg';
import none from '@/assets/svg/file-none.svg';
import word from '@/assets/svg/file-word.svg';
import excel from '@/assets/svg/file-excel.svg';
import text from '@/assets/svg/file-text.svg';
import video from '@/assets/svg/file-video.svg';
import gif from '@/assets/svg/file-gif.svg';
import ico from '@/assets/svg/file-ico.svg';

export default function SvgIcon({fileName}: {fileName: string}) {
  const svgMap: {
    [key: string]: string;
  } = {
    md,
    MD: md,
    doc: word,
    docx: word,
    xls: excel,
    xlsx: excel,
    pdf,
    ppt,
    pptx: ppt,
    png: image,
    mp4: video,
    mov: video,
    avi: video,
    wmv: video,
    mkv: video,
    flv: video,
    webm: video,
    '3gp': video,
    m4v: video,
    txt: text,
    jpg: image,
    jpeg: image,
    gif,
    ico,
    svg,
    json,
    html,
    css,
    js,
    ts,
    jsx: react,
    tsx: react,
    vue,
    nvmrc,
    gitignore: git,
  };
  const getSvgBySuffix = (fileName: string) => {
    const arr = fileName.split('.');
    const suffix = arr[arr.length - 1];
    return suffix in svgMap ? svgMap[suffix] : none;
  };
  return <img style={{width: '22px', height: '22px'}} src={getSvgBySuffix(fileName)} />;
}
