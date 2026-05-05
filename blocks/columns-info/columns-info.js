export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-info-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {

      const link = col.querySelector('a');

      // wrap the col's inner html with the link if it exists, and remove other links from col but keep their content
      if (link) {
        const href = link.href;
        const innerHTML = col.innerHTML.replace(/<a[^>]*>(.*?)<\/a>/g, '$1');
        col.innerHTML = `<a href="${href}">${innerHTML}</a>`;
      } else {
        // if no link, just remove any links but keep their content
        col.innerHTML = col.innerHTML.replace(/<a[^>]*>(.*?)<\/a>/g, '$1');
      }
    });
  });
}
