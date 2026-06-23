// No import

// Need to mock or compile since it's TS... let's just write a quick script to test the regex
const html = `
<ul class="wp-block-list">
<li>Digitale</li>
</ul>
<h1 class="wp-block-heading">Lösungen</h1>
<p class="wp-block-paragraph">Maßgeschneiderte Lösungen, abgestimmt auf individuelle Geschäftsziele – von der Analyse bis zur erfolgreichen Umsetzung.</p>
<p class="wp-block-paragraph"><a href="https://2hws-termin-buchen.vercel.app/" target="_blank" rel="noreferrer noopener">Kostenloses Erstgespräch vereinbaren</a></p>
<figure class="wp-block-image size-large is-resized"><img loading="lazy" decoding="async" width="684" height="1024" src="http://silvioh23.sg-host.com/wp-content/uploads/2026/06/ztrh-684x1024.jpg" alt="" class="wp-image-244" style="aspect-ratio:0.6679719736565317;width:226px;height:auto" srcset="https://silvioh23.sg-host.com/wp-content/uploads/2026/06/ztrh-684x1024.jpg 684w, https://silvioh23.sg-host.com/wp-content/uploads/2026/06/ztrh-200x300.jpg 200w, https://silvioh23.sg-host.com/wp-content/uploads/2026/06/ztrh-768x1150.jpg 768w, https://silvioh23.sg-host.com/wp-content/uploads/2026/06/ztrh.jpg 844w" sizes="auto, (max-width: 684px) 100vw, 684px" /></figure>
`;

  const heroHtml = html.split(/<h[23]/i)[0] || html;
  const subtitleMatch = heroHtml.match(/<h6[^>]*>([\s\S]*?)<\/h6>/i) || heroHtml.match(/<li[^>]*>([\s\S]*?)<\/li>/i);
  const titleMatch = heroHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  
  let description = "";
  const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  let pMatch;
  while ((pMatch = pRegex.exec(heroHtml)) !== null) {
    if (!pMatch[1].includes('<a')) {
      description = pMatch[1];
      break;
    }
  }

  const btnMatch = heroHtml.match(/<a[^>]*href="(.*?)"[^>]*>([\s\S]*?)<\/a>/i);
  const imgMatch = heroHtml.match(/<img[^>]*src="(.*?)"/i);

console.log({
    subtitle: subtitleMatch?.[1] || "DIGITALE",
    title: titleMatch?.[1] || "LÖSUNGEN",
    description: description,
    btnLink: btnMatch?.[1] || "",
    btnText: btnMatch?.[2].replace(/<[^>]*>?/gm, '').trim() || "",
    imageUrl: imgMatch?.[1] || "",
  });
