export default class LoginPage {
  #presenter = null;

  async render() {
    return `
      <section class="brutalism-border p-4 space-y-4">
        <h1 class="text-2xl font-bold">Masuk</h1>
      </section>
    `;
  }

  async afterRender() {}
}
