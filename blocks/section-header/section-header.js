const BACKGROUND_VIDEO_URL = 'https://www.galleries.unsw.edu.au/sites/default/files/2025-04/Full%20Sissor%20Reel_1_1.mp4';

export default function decorate(block) {

  const cells = block.querySelectorAll(':scope > div > div');

  const title = cells[0]?.textContent || '';
  const button = cells[1]?.querySelector('a');

  block.innerHTML = `
    <div class="section-header__inner">
      <h2 class="section-header__title">${title}</h2>
      ${button ? `<a href="${button.href}" class="section-header__button">${button.textContent}</a>` : ''}
    </div>
  `;
}
