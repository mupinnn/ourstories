export default class NotFoundPage {
  async render() {
    return `
      <section class="space-y-4 max-w-xl mx-auto text-center">
        <i class="fas fa-ban fa-3x"></i>
        <h1 class="text-2xl font-bold">Aww, you lost?</h1>
        <p>The page you are looking for is not found</p>
        <a href="#/" class="btn">
          <i class="fas fa-arrow-left"></i>
          Back to home
        </a>
      </section>
    `;
  }

  async afterRender() {}
}
