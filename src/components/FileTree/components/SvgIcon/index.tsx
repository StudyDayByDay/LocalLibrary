import md from '@/assets/svg/file-markdown.svg';
import pdf from '@/assets/svg/file-pdf.svg';
import ppt from '@/assets/svg/file-ppt.svg';
import image from '@/assets/svg/file-image.svg';
import json from '@/assets/svg/file-json.svg';
import none from '@/assets/svg/file-none.svg';

export default function SvgIcon({fileName}: {fileName: string}) {
  const svgMap: {
    [key: string]: string;
  } = {
    md,
    pdf,
    ppt,
    pptx: ppt,
    png: image,
    jpg: image,
    jpeg: image,
    json,
  };
  const getSvgBySuffix = (fileName: string) => {
    const arr = fileName.split('.');
    const suffix = arr[arr.length - 1];
    return suffix in svgMap ? svgMap[suffix] : none;
  };
  return <img src={getSvgBySuffix(fileName)} />;
}
