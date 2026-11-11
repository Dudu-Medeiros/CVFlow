import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import logoCvFlow from "../assets/logo-cvflow-sem-fundo.png";

const A4_LARGURA_MM = 210;
const A4_ALTURA_MM = 297;
const LARGURA_A4_PX = 794;
const ALTURA_A4_PX = 1123;

function esperarFrame() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(resolve);
    });
  });
}

async function esperarImagens(elemento) {
  const imagens = Array.from(elemento.querySelectorAll("img"));
  if (imagens.length === 0) return;
  await Promise.all(
    imagens.map((imagem) => {
      if (imagem.complete) {
        return Promise.resolve();
      }
      return new Promise((resolve) => {
        imagem.addEventListener("load", resolve, { once: true });
        imagem.addEventListener("error", resolve, { once: true });
      });
    })
  );
}

async function prepararElemento(elemento) {
  await esperarImagens(elemento);
  if (document.fonts?.ready) {
    await document.fonts.ready;
  }
  await esperarFrame();
}

async function capturarElemento(elemento, opcoes = {}) {
  await prepararElemento(elemento);
  const largura = opcoes.largura || elemento.scrollWidth || elemento.offsetWidth;
  const altura = opcoes.altura || elemento.scrollHeight || elemento.offsetHeight;
  return html2canvas(elemento, {
    scale: 2,
    width: largura,
    height: altura,
    windowWidth: largura,
    windowHeight: altura,
    useCORS: true,
    allowTaint: false,
    backgroundColor: "#ffffff",
    logging: false,
    scrollX: 0,
    scrollY: 0,
  });
}

function adicionarCanvasNaPagina(pdf, canvas, paginaNova = false) {
  if (paginaNova) {
    pdf.addPage();
  }
  const paginaLargura = A4_LARGURA_MM;
  const paginaAltura = A4_ALTURA_MM;
  const proporcao = canvas.height / canvas.width;
  let largura = paginaLargura;
  let altura = largura * proporcao;
  if (altura > paginaAltura) {
    altura = paginaAltura;
    largura = altura / proporcao;
  }
  const x = (paginaLargura - largura) / 2;
  const y = (paginaAltura - altura) / 2;
  pdf.addImage(
    canvas.toDataURL("image/jpeg", 1.0),
    "JPEG",
    x,
    y,
    largura,
    altura,
    undefined,
    "FAST"
  );
}

async function carregarImagemLogo(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
  });
}

function aplicarMarcaDagua(pdf, logoImg) {
  const totalPaginas = pdf.internal.getNumberOfPages();
  const largura = pdf.internal.pageSize.getWidth();
  const altura = pdf.internal.pageSize.getHeight();

  for (let i = 1; i <= totalPaginas; i++) {
    pdf.setPage(i);
    pdf.setTextColor(148, 163, 184);
    pdf.setFontSize(11);
    
    if (logoImg) {
      const texto = "Criado gratuitamente com ";
      const textoWidth = pdf.getTextWidth(texto);
      const logoHeight = 5.5;
      const proporcao = logoImg.width / logoImg.height;
      const logoWidth = logoHeight * proporcao;
      const totalWidth = textoWidth + logoWidth;
      const startX = (largura - totalWidth) / 2;
      
      pdf.text(texto, startX, altura - 8, { baseline: "bottom" });
      pdf.addImage(logoImg, "PNG", startX + textoWidth, altura - 8 - logoHeight + 0.8, logoWidth, logoHeight);
    } else {
      pdf.text("Criado gratuitamente com CVFlow", largura / 2, altura - 8, {
        align: "center",
        baseline: "bottom"
      });
    }
  }
}

async function capturarModeloContinuo(elemento) {
  const modelo = elemento.querySelector(".preview-curriculo");
  if (!modelo) {
    throw new Error("Preview do currículo não encontrado.");
  }
  const escalaOriginal = modelo.style.transform;
  const origemOriginal = modelo.style.transformOrigin;
  const larguraOriginal = modelo.style.width;
  const minWidthOriginal = modelo.style.minWidth;
  const maxWidthOriginal = modelo.style.maxWidth;
  modelo.style.width = `${LARGURA_A4_PX}px`;
  modelo.style.minWidth = `${LARGURA_A4_PX}px`;
  modelo.style.maxWidth = `${LARGURA_A4_PX}px`;
  modelo.style.transform = "none";
  modelo.style.transformOrigin = "top left";
  await prepararElemento(modelo);
  const alturaNatural = modelo.scrollHeight || modelo.offsetHeight;
  const escala = Math.min(1, ALTURA_A4_PX / alturaNatural);
  if (escala < 1) {
    modelo.style.transform = `scale(${escala})`;
    modelo.style.transformOrigin = "top left";
  }
  await esperarFrame();
  const larguraCaptura = LARGURA_A4_PX;
  const alturaCaptura = escala < 1 ? alturaNatural * escala : alturaNatural;
  const canvas = await capturarElemento(modelo, {
    largura: larguraCaptura,
    altura: alturaCaptura,
  });
  modelo.style.transform = escalaOriginal;
  modelo.style.transformOrigin = origemOriginal;
  modelo.style.width = larguraOriginal;
  modelo.style.minWidth = minWidthOriginal;
  modelo.style.maxWidth = maxWidthOriginal;
  return canvas;
}

async function gerarPdf(elemento, nomeArquivo = "curriculo.pdf", planoUsuario = "Starter") {
  if (!elemento) {
    throw new Error("Elemento do currículo não encontrado.");
  }
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });
  const folhasATS = elemento.querySelectorAll(".ats-folha");
  
  if (folhasATS.length > 0) {
    for (let index = 0; index < folhasATS.length; index++) {
      const folha = folhasATS[index];
      const canvas = await capturarElemento(folha, {
        largura: folha.clientWidth || LARGURA_A4_PX,
        altura: folha.clientHeight || ALTURA_A4_PX,
      });
      adicionarCanvasNaPagina(pdf, canvas, index > 0);
    }
  } else {
    const canvas = await capturarModeloContinuo(elemento);
    adicionarCanvasNaPagina(pdf, canvas, false);
  }

  if (planoUsuario === "Starter") {
    let logoImg = null;
    try {
      logoImg = await carregarImagemLogo(logoCvFlow);
    } catch (e) {
      console.error(e);
    }
    aplicarMarcaDagua(pdf, logoImg);
  }

  pdf.save(nomeArquivo);
}

export default gerarPdf;