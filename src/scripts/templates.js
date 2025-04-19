export function generateMessageTemplate({ title, message }) {
  return `
    <div class="flex flex-col gap-2 text-center">
      <h2 class="text-lg font-semibold">${title}</h2>
      <p>${message}</p>
    </div>
  `;
}

export function generateStoryItemTemplate({
  id,
  name,
  description,
  photoUrl,
  placeName,
}) {
  return `
    <a href="#/story/${id}" class="relative block brutalism-border-accent h-80" data-storyid="${id}">
      <img src="${photoUrl}" alt="Story from ${name}" class="w-full h-full object-cover rounded-md" />
      <div class="absolute inset-0 bg-gray-900/75 p-4 text-white flex flex-col gap-2 justify-end text-sm rounded-md">
        <h2 class="text-lg font-semibold">${name}</h2>
        <p class="inline-flex items-center gap-2">
          <i class="fas fa-map-marker-alt"></i>
          <span class="line-clamp-1">${placeName}</span>
        </p>
        <p class="line-clamp-1">${description}</p>
      </div>
    </a>
  `;
}

export function generateStoriesListLoader() {
  let html = "";

  for (let i = 0; i < 10; i++) {
    html += `<div class="brutalism-border-accent h-80 animate-pulse bg-gray-600"></div>`;
  }

  return html;
}
