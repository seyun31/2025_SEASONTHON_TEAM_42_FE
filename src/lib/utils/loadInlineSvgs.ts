import path from 'path';
import { promises as fs } from 'fs';

async function loadSvg(relativePath: string) {
  const filePath = path.join(process.cwd(), 'public', relativePath);
  let svg = await fs.readFile(filePath, 'utf8');

  // width/height 강제 세팅
  svg = svg.replace('<svg', `<svg width="24" height="24"`);

  return svg;
}

export const inlineSvgs = {
  keyword: '',
  experience: '',
  recommend: '',
};

export async function initInlineSvgs() {
  inlineSvgs.keyword = await loadSvg('assets/Icons/strength-keyword.svg');
  inlineSvgs.experience = await loadSvg('assets/Icons/strength-experience.svg');
  inlineSvgs.recommend = await loadSvg('assets/Icons/strength-recommend.svg');
}
