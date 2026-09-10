(() => {
  const endpoint = "https://gestor.dmgjuridico.com.br/api/publicacoes/";
  const list = document.querySelector("[data-publications-list]");
  const status = document.querySelector("[data-publications-status]");
  const template = document.querySelector("#publication-card-template");
  if (!list || !status || !template) return;

  const text = (node, value) => { node.textContent = value || ""; };
  const safeSource = (value) => {
    try {
      const url = new URL(value);
      return ["http:", "https:"].includes(url.protocol) ? url.href : "";
    } catch (_) {
      return "";
    }
  };
  const formatDate = (item) => {
    const raw = item.published_at || item.scheduled_for;
    if (!raw) return "";
    const date = new Date(raw.length === 10 ? raw + "T12:00:00" : raw);
    return Number.isNaN(date.getTime()) ? "" : new Intl.DateTimeFormat("pt-BR", {day:"2-digit",month:"long",year:"numeric"}).format(date);
  };

  const render = (items) => {
    list.replaceChildren();
    if (!items.length) {
      status.textContent = "Nenhuma publicação está disponível no momento. Novos conteúdos aparecerão aqui depois da revisão da equipe DMG.";
      return;
    }
    items.forEach((item) => {
      const fragment = template.content.cloneNode(true);
      const card = fragment.querySelector(".publication-card");
      const title = item.visual_title || item.title || "Atualização jurídica";
      text(fragment.querySelector("[data-publication-category]"), item.category);
      const time = fragment.querySelector("[data-publication-date]");
      text(time, formatDate(item));
      if (item.published_at) time.dateTime = item.published_at;
      text(fragment.querySelector("[data-publication-title]"), title);
      text(fragment.querySelector("[data-publication-summary]"), item.summary);
      text(fragment.querySelector("[data-publication-caption]"), item.caption || item.summary);
      const source = fragment.querySelector("[data-publication-source]");
      const sourceUrl = safeSource(item.source_url);
      if (sourceUrl) {
        source.href = sourceUrl;
        source.hidden = false;
        if (item.source_name) source.firstChild.textContent = "Consultar " + item.source_name + " ";
      }
      if (item.image_url) {
        const media = fragment.querySelector("[data-publication-media]");
        const image = media.querySelector("img");
        image.src = item.image_url;
        image.alt = "Imagem da publicação: " + title;
        media.hidden = false;
      }
      card.dataset.publicationId = String(item.id || "");
      list.append(fragment);
    });
    status.hidden = true;
    list.hidden = false;
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  fetch(endpoint, {headers:{"Accept":"application/json"},signal:controller.signal})
    .then((response) => {
      if (!response.ok) throw new Error("Resposta indisponível");
      return response.json();
    })
    .then((data) => render(Array.isArray(data.publications) ? data.publications : []))
    .catch(() => {
      status.classList.add("is-error");
      status.textContent = "Não foi possível carregar as publicações agora. Tente novamente em alguns instantes.";
    })
    .finally(() => clearTimeout(timeout));
})();
