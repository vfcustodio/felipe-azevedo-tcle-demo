const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
menuToggle.addEventListener('click', () => {
  const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!expanded));
  menuToggle.setAttribute('aria-label', expanded ? 'Abrir menu' : 'Fechar menu');
  navigation.classList.toggle('is-open', !expanded);
});
navigation.addEventListener('click', (event) => {
  if (event.target.closest('a')) {
    navigation.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menu');
  }
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && navigation.classList.contains('is-open')) {
    navigation.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.focus();
  }
});
const video = document.querySelector('#tcle-video');
const videoButton = document.querySelector('#play-video');
const videoError = document.querySelector('#video-error');
videoButton.hidden = false;
videoButton.addEventListener('click', async () => {
  videoButton.disabled = true;
  videoButton.querySelector('span').textContent = 'Carregando vídeo…';
  videoError.hidden = true;
  try {
    await video.play();
    videoButton.hidden = true;
    video.focus();
  } catch {
    videoError.hidden = false;
    videoButton.querySelector('span').textContent = 'Tentar novamente';
  } finally {
    videoButton.disabled = false;
  }
});
video.addEventListener('play', () => { videoButton.hidden = true; });
video.addEventListener('error', () => { videoError.hidden = false; });
const privacy = document.querySelector('#privacidade');
document.querySelectorAll('[data-privacy]').forEach((link) => {
  link.addEventListener('click', () => { privacy.open = true; });
});
if (location.hash === '#privacidade') privacy.open = true;
const form = document.querySelector('#contact-form');
const fields = [...form.querySelectorAll('[required]')];
const summary = document.querySelector('#error-summary');
const summaryList = document.querySelector('#error-list');
const handoff = document.querySelector('#handoff');
const handoffLink = document.querySelector('#handoff-link');
const submit = form.querySelector('button[type="submit"]');
const messages = {
  nome: 'Informe seu nome para identificar a solicitação.',
  perfil: 'Selecione seu perfil profissional.',
  necessidade: 'Selecione a necessidade principal.',
  cidade: 'Informe a cidade e o estado do consultório ou da clínica.',
  retorno: 'Informe um e-mail válido ou telefone com DDD.'
};
function validate(field) {
  const value = field.value.trim();
  let valid = value.length > 0;
  if (valid && field.id === 'retorno') {
    valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || /^[+()\d\s.-]+$/.test(value) && value.replace(/\D/g, '').length >= 10 && value.replace(/\D/g, '').length <= 15;
  }
  const error = document.querySelector(`#${field.id}-error`);
  error.textContent = valid ? '' : messages[field.id];
  error.hidden = valid;
  field.setAttribute('aria-invalid', String(!valid));
  return valid;
}
fields.forEach((field) => field.addEventListener('blur', () => validate(field)));
form.addEventListener('input', () => { handoff.hidden = true; });
form.addEventListener('submit', (event) => {
  event.preventDefault();
  summaryList.replaceChildren();
  const invalid = fields.filter((field) => !validate(field));
  summary.hidden = invalid.length === 0;
  if (invalid.length) {
    invalid.forEach((field) => {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = `#${field.id}`;
      link.textContent = messages[field.id];
      link.addEventListener('click', (event) => { event.preventDefault(); field.focus(); });
      item.append(link);
      summaryList.append(item);
    });
    summary.focus();
    return;
  }
  const data = new FormData(form);
  const message = [
    'Olá, Dr. Felipe. Gostaria de informações sobre assessoria em TCLE.',
    '',
    `Nome: ${String(data.get('nome')).trim()}`,
    `Perfil: ${data.get('perfil')}`,
    `Necessidade: ${data.get('necessidade')}`,
    `Cidade/UF: ${String(data.get('cidade')).trim()}`,
    `Contato para retorno: ${String(data.get('retorno')).trim()}`,
    data.get('mensagem') ? `Mensagem: ${String(data.get('mensagem')).trim()}` : ''
  ].filter((line) => line !== undefined).join('\n');
  const whatsappUrl = `https://wa.me/5548999997686?text=${encodeURIComponent(message)}`;
  handoffLink.href = whatsappUrl;
  handoff.hidden = false;
  submit.querySelector('span').textContent = 'Abrir novamente no WhatsApp';
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  handoff.focus();
});
