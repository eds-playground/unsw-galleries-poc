import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  /* change to ul, li */

  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);

    let url = '';
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-exhibition-card-image';
      } else {
        url = div.querySelector('a')?.href || '';
        // remove the link from the body copy
        if (url) {
          const a = div.querySelector('a');
          a.remove();

          // remove empty p tags that may have been left after removing the link
          div.querySelectorAll('p').forEach((p) => {
            if (p.textContent.trim() === '') p.remove();
          });
        }
        div.className = 'cards-exhibition-card-body'
      };
    });

    const a = document.createElement('a');
    a.href = url;
    a.innerHTML = li.innerHTML;
    li.replaceChildren(a);
    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));

  block.replaceChildren(ul);
}
