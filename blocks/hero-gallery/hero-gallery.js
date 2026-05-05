export default function decorate(block) {
  if (!block.querySelector(':scope > div:first-child picture')) {
    block.classList.add('no-image');
  }

  const rows = block.querySelectorAll(':scope > div');
  const title = rows[0];
  const videoLink = rows[1]?.querySelector('a')?.href || '';

  const videoWrapper = document.createElement('div');
  videoWrapper.className = 'hero-gallery__video-wrapper';

  if (videoLink) {
    const overlay = document.createElement('div');
    overlay.className = 'hero-gallery__video-overlay';

    const video = document.createElement('video');
    video.src = videoLink;
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('aria-hidden', 'true');

    videoWrapper.append(overlay, video);
  }

  const content = document.createElement('div');
  content.className = 'hero-gallery__content';
  if (title) content.append(title);

  block.replaceChildren(videoWrapper, content);
}
