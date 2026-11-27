/* =====================================================================
   FEIRA DAS NAÇÕES — REPÚBLICA DEMOCRÁTICA DO CONGO
   Funcionalidades do site
   ===================================================================== */

/* =====================================================================
   >>> DADOS DAS COMPARAÇÕES (RDC × BRASIL) <<<
   Esta é a ÚNICA parte do script que você precisa editar.

   Como usar:
   - Cada linha de "itens" vira uma linha da tabela e, se houver números
     nos DOIS países, também uma barra comparativa no gráfico.
   - Troque null pelo valor numérico (use ponto como separador decimal).
   - "unidade" é o texto mostrado depois do número (ex.: "milhões", "km²", "%").
   - "indicador" é o nome da linha. Edite, apague ou copie linhas à vontade.
   - Enquanto os valores estiverem null, a tabela mostra "[INSERIR DADO]" e o
     gráfico mostra o aviso "[INSERIR GRÁFICO AQUI]".
   ===================================================================== */
const COMPARATIVOS = {

  // Seção 3 — Quadro Geoeconômico
  geo: {
    titulo: 'Comparativo geoeconômico',
    itens: [
      { indicador: 'População',            unidade: 'milhões de habitantes', rdc: 105,     brasil: 212 },
      { indicador: 'Área territorial',     unidade: 'km²',                   rdc: 2345000, brasil: 8510000 },
      { indicador: 'IDH',                  unidade: '',                      rdc: 0.481,   brasil: 0.760, casas: 3, rdcNota: 'Baixo', brasilNota: 'Alto' },
      { indicador: 'PIB',                  unidade: 'bilhões de US$',        rdc: 66,      brasil: 2100 },
      { indicador: 'Expectativa de vida',  unidade: 'anos',                  rdc: 60,      brasil: 76 },
      { indicador: 'Taxa de urbanização',  unidade: '%',                     rdc: 47,      brasil: 87 }
    ]
  },

  // Seção 6 — Aspectos geopolíticos e ambientais
  geopolitico: {
    titulo: 'Comparativo geopolítico e ambiental',
    // IMAGEM DO GRÁFICO: se houver, ela aparece no lugar do gráfico de barras automático.
    // Para voltar ao gráfico de barras, apague esta linha ou troque por: imagem: '',
    imagem: 'images/graficotop.jpg',
    itens: [
      { indicador: 'Cobertura florestal (2024)',                   unidade: '%', rdc: 61.52, brasil: 58.55, casas: 2 },
      { indicador: 'Área terrestre protegida (2025)',             unidade: '%', rdc: 14.9,  brasil: 30.6,  casas: 1 },
      { indicador: 'Energia renovável no consumo final (2023)',   unidade: '%', rdc: 95.7,  brasil: 50.2,  casas: 1 }
    ]
  }
};

/* ===================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Cada parte roda isolada: se uma falhar, as outras continuam funcionando
  // (o erro aparece no Console do navegador, aba F12, dizendo qual parte falhou).
  [iniciarComparativos, iniciarMenu, iniciarScroll, iniciarAnimacoes, iniciarImagens, iniciarLinks].forEach(fn => {
    try { fn(); } catch (erro) { console.error('Erro em ' + fn.name + ':', erro); }
  });
});

/* ---------- MENU (celular + destaque do item ativo) ---------- */
function iniciarMenu() {
  const botao = document.getElementById('menuBotao');
  const lista = document.getElementById('menuLista');
  if (!botao || !lista) return; // menu não encontrado no HTML: ignora esta parte
  const links = lista.querySelectorAll('a');

  botao.addEventListener('click', () => {
    const aberto = lista.classList.toggle('aberto');
    botao.setAttribute('aria-expanded', aberto);
    botao.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
  });

  // Fecha o menu ao clicar em um link (no celular)
  links.forEach(link => link.addEventListener('click', () => {
    lista.classList.remove('aberto');
    botao.setAttribute('aria-expanded', 'false');
  }));

  // Marca no menu a seção que está na tela
  const secoes = document.querySelectorAll('main section[id]');
  const observador = new IntersectionObserver(entradas => {
    entradas.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.toggle('ativo', l.getAttribute('href') === '#' + e.target.id));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  secoes.forEach(s => observador.observe(s));
}

/* ---------- ROLAGEM: menu, progresso e botão "voltar ao topo" ---------- */
function iniciarScroll() {
  const topo = document.getElementById('topo');
  const barra = document.getElementById('progresso');
  const voltar = document.getElementById('voltarTopo');
  if (!topo || !barra || !voltar) return; // elemento não encontrado no HTML: ignora esta parte

  const atualizar = () => {
    const y = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    topo.classList.toggle('rolou', y > 40);
    barra.style.width = (total > 0 ? (y / total) * 100 : 0) + '%';
    voltar.classList.toggle('visivel', y > 600);
  };
  window.addEventListener('scroll', atualizar, { passive: true });
  atualizar();

  voltar.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ---------- ANIMAÇÃO DE ENTRADA DOS ELEMENTOS ---------- */
function iniciarAnimacoes() {
  const itens = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) { itens.forEach(i => i.classList.add('visivel')); return; }

  const observador = new IntersectionObserver((entradas, obs) => {
    entradas.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visivel'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  itens.forEach(i => observador.observe(i));
}

/* ---------- IMAGENS: esconde o aviso quando a foto/mapa é inserido ---------- */
function iniciarImagens() {
  document.querySelectorAll('.foto-box').forEach(caixa => {
    const img = caixa.querySelector('img');
    const aviso = caixa.querySelector('.placeholder');
    if (!img || !aviso) return;

    const mostrar = () => aviso.classList.add('oculto');
    const esconder = () => aviso.classList.remove('oculto');

    if (img.getAttribute('src')) {
      if (img.complete && img.naturalWidth > 0) mostrar();
      img.addEventListener('load', mostrar);
      img.addEventListener('error', esconder); // arquivo não encontrado: mantém o aviso
    }
  });

  // Vídeos: se um <iframe> foi colado, remove o aviso
  document.querySelectorAll('.video-box').forEach(caixa => {
    if (caixa.querySelector('iframe')) {
      const aviso = caixa.querySelector('.placeholder');
      if (aviso) aviso.classList.add('oculto');
    }
  });
}

/* ---------- LINKS AINDA NÃO PREENCHIDOS ---------- */
// Links com href="#" e atributo data-link-vazio não fazem nada até você
// colocar o endereço real. Quando você trocar o href, eles passam a funcionar sozinhos.
function iniciarLinks() {
  document.querySelectorAll('a[data-link-vazio]').forEach(link => {
    link.addEventListener('click', ev => {
      const href = link.getAttribute('href');
      if (!href || href === '#') ev.preventDefault();
    });
    const href = link.getAttribute('href');
    if (href && href !== '#') link.setAttribute('target', '_blank'), link.setAttribute('rel', 'noopener');
  });
}

/* ---------- COMPARATIVOS RDC × BRASIL (tabela + gráfico de barras) ---------- */
function iniciarComparativos() {
  document.querySelectorAll('[data-comparativo]').forEach(area => {
    const dados = COMPARATIVOS[area.dataset.comparativo];
    if (!dados) return;

    area.innerHTML = '';
    area.append(criarTabela(dados), criarGrafico(dados));

    // Anima as barras quando aparecem na tela
    const obs = new IntersectionObserver((entradas, o) => {
      entradas.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.barra').forEach(b => b.style.width = b.dataset.largura);
          o.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    obs.observe(area);
  });
}

function formatar(valor, unidade, casas) {
  if (valor === null || valor === undefined || valor === '') return null;
  const opcoes = (typeof casas === 'number') ? { minimumFractionDigits: casas, maximumFractionDigits: casas } : {};
  const texto = typeof valor === 'number' ? valor.toLocaleString('pt-BR', opcoes) : String(valor);
  return unidade ? `${texto} ${unidade}` : texto;
}

function criarTabela(dados) {
  const envoltorio = document.createElement('div');
  envoltorio.className = 'tabela-wrap';

  const linhas = dados.itens.map(it => {
    const rdc = formatar(it.rdc, it.unidade, it.casas);
    const br = formatar(it.brasil, it.unidade, it.casas);
    const notaRdc = it.rdcNota ? ` (${it.rdcNota})` : '';
    const notaBr = it.brasilNota ? ` (${it.brasilNota})` : '';
    return `<tr>
      <td><strong>${it.indicador}</strong></td>
      <td class="${rdc ? '' : 'vazio'}">${rdc ? rdc + notaRdc : '[INSERIR DADO]'}</td>
      <td class="${br ? '' : 'vazio'}">${br ? br + notaBr : '[INSERIR DADO]'}</td>
    </tr>`;
  }).join('');

  envoltorio.innerHTML = `<table class="tabela">
    <caption class="sr-only" style="position:absolute;left:-9999px">${dados.titulo}</caption>
    <thead><tr><th>Indicador</th><th>República Democrática do Congo</th><th>Brasil</th></tr></thead>
    <tbody>${linhas}</tbody>
  </table>`;
  return envoltorio;
}

function criarGrafico(dados) {
  const comNumeros = dados.itens.filter(it => typeof it.rdc === 'number' && typeof it.brasil === 'number');
  const caixa = document.createElement('div');
  caixa.className = 'grafico-box';
  caixa.innerHTML = `<h3>${dados.titulo}</h3>`;

  // Se foi indicada uma imagem, mostra a imagem em vez do gráfico de barras
  if (dados.imagem) {
    caixa.insertAdjacentHTML('beforeend',
      `<img src="${dados.imagem}" alt="${dados.titulo}" style="width:100%;height:auto;border-radius:12px;">`);
    return caixa;
  }

  // Sem números: mostra o espaço reservado
  if (comNumeros.length === 0) {
    caixa.insertAdjacentHTML('beforeend',
      `<div class="placeholder placeholder-fixo"><span class="ph-icone">📊</span>
       <strong>[INSERIR GRÁFICO AQUI]</strong>
       <small>Preencha os valores em COMPARATIVOS no arquivo script.js</small></div>`);
    return caixa;
  }

  const barras = document.createElement('div');
  barras.className = 'barras';
  comNumeros.forEach(it => {
    const maior = Math.max(it.rdc, it.brasil) || 1;
    const larg = v => Math.max((v / maior) * 100, 2) + '%';
    const grupo = document.createElement('div');
    grupo.className = 'barra-grupo';
    grupo.innerHTML = `<h5>${it.indicador}</h5>
      <div class="barra-linha"><span>RDC</span>
        <div class="barra-trilho"><div class="barra rdc" data-largura="${larg(it.rdc)}"></div></div>
        <span class="barra-valor">${formatar(it.rdc, it.unidade, it.casas)}</span></div>
      <div class="barra-linha"><span>Brasil</span>
        <div class="barra-trilho"><div class="barra br" data-largura="${larg(it.brasil)}"></div></div>
        <span class="barra-valor">${formatar(it.brasil, it.unidade, it.casas)}</span></div>`;
    barras.append(grupo);
  });
  caixa.append(barras);
  return caixa;
}