import { useLayoutEffect, useMemo, useRef, useState } from "react";
import "./PreviewCurriculo.css";

function possuiValor(valor) {
  return typeof valor === "string" && valor.trim().length > 0;
}

function possuiItens(lista) {
  return (
    Array.isArray(lista) &&
    lista.some((item) =>
      Object.entries(item).some(
        ([chave, valor]) => chave !== "id" && possuiValor(valor)
      )
    )
  );
}

function Texto({ children, className = "" }) {
  if (!possuiValor(children)) return null;

  return <p className={className}>{children}</p>;
}

function Cabecalho({ dados, classe = "" }) {
  const contatos = [
    dados.email,
    dados.telefone,
    dados.localizacao,
  ].filter(possuiValor);

  const links = (dados.links || []).filter((link) =>
    possuiValor(link.url)
  );

  return (
    <header className={`curriculo-cabecalho ${classe}`}>
      {possuiValor(dados.nome) && <h1>{dados.nome}</h1>}

      {possuiValor(dados.cargo) && (
        <h2 className="curriculo-cargo">{dados.cargo}</h2>
      )}

      {contatos.length > 0 && (
        <div className="curriculo-contatos">
          {contatos.map((contato, index) => (
            <span key={`${contato}-${index}`}>{contato}</span>
          ))}
        </div>
      )}

      {links.length > 0 && (
        <div className="curriculo-links">
          {links.map((link) => (
            <span key={link.id}>{link.url}</span>
          ))}
        </div>
      )}
    </header>
  );
}

function Secao({ titulo, children, className = "" }) {
  if (!children) return null;

  return (
    <section className={`curriculo-secao ${className}`}>
      <h2>{titulo}</h2>
      {children}
    </section>
  );
}

function Experiencias({ dados }) {
  if (!possuiItens(dados.experiencias)) return null;

  return (
    <Secao titulo="Experiência profissional">
      {dados.experiencias.map((experiencia) => {
        const temConteudo =
          possuiValor(experiencia.empresa) ||
          possuiValor(experiencia.funcao) ||
          possuiValor(experiencia.periodo) ||
          possuiValor(experiencia.atividades);

        if (!temConteudo) return null;

        return (
          <article className="experiencia-item" key={experiencia.id}>
            <div className="item-cabecalho">
              <div className="item-identificacao">
                {possuiValor(experiencia.empresa) && (
                  <h3>{experiencia.empresa}</h3>
                )}

                <Texto className="item-subtitulo">
                  {experiencia.funcao}
                </Texto>
              </div>

              <Texto className="item-periodo">
                {experiencia.periodo}
              </Texto>
            </div>

            <Texto>{experiencia.atividades}</Texto>
          </article>
        );
      })}
    </Secao>
  );
}

function Formacao({ dados }) {
  if (!possuiItens(dados.formacao)) return null;

  return (
    <Secao titulo="Formação acadêmica">
      {dados.formacao.map((formacao) => {
        const temConteudo =
          possuiValor(formacao.curso) ||
          possuiValor(formacao.instituicao) ||
          possuiValor(formacao.periodo) ||
          possuiValor(formacao.descricao);

        if (!temConteudo) return null;

        return (
          <article className="formacao-item" key={formacao.id}>
            <div className="item-identificacao">
              {possuiValor(formacao.curso) && (
                <h3>{formacao.curso}</h3>
              )}

              <Texto className="item-subtitulo">
                {formacao.instituicao}
              </Texto>

              <Texto>{formacao.descricao}</Texto>
            </div>

            <Texto className="item-periodo">
              {formacao.periodo}
            </Texto>
          </article>
        );
      })}
    </Secao>
  );
}

function Habilidades({ dados }) {
  const habilidades = (dados.habilidades || []).filter((habilidade) =>
    possuiValor(habilidade.nome)
  );

  if (habilidades.length === 0) return null;

  return (
    <Secao titulo="Habilidades">
      <div className="habilidades-lista">
        {habilidades.map((habilidade) => (
          <span key={habilidade.id}>
            {habilidade.nome}
            {possuiValor(habilidade.nivel)
              ? ` — ${habilidade.nivel}`
              : ""}
          </span>
        ))}
      </div>
    </Secao>
  );
}

function Projetos({ dados }) {
  if (!possuiItens(dados.projetos)) return null;

  return (
    <Secao titulo="Projetos">
      {dados.projetos.map((projeto) => {
        const temConteudo =
          possuiValor(projeto.nome) ||
          possuiValor(projeto.descricao) ||
          possuiValor(projeto.tecnologias) ||
          possuiValor(projeto.link);

        if (!temConteudo) return null;

        return (
          <article className="projeto-item" key={projeto.id}>
            {possuiValor(projeto.nome) && (
              <h3>{projeto.nome}</h3>
            )}

            <Texto>{projeto.descricao}</Texto>

            <Texto className="item-tecnologias">
              {projeto.tecnologias}
            </Texto>

            <Texto className="item-link">
              {projeto.link}
            </Texto>
          </article>
        );
      })}
    </Secao>
  );
}

function Idiomas({ dados }) {
  const idiomas = (dados.idiomas || []).filter((idioma) =>
    possuiValor(idioma.idioma)
  );

  if (idiomas.length === 0) return null;

  return (
    <Secao titulo="Idiomas">
      <div className="idiomas-lista">
        {idiomas.map((idioma) => (
          <span key={idioma.id}>
            {idioma.idioma}
            {possuiValor(idioma.nivel)
              ? ` — ${idioma.nivel}`
              : ""}
          </span>
        ))}
      </div>
    </Secao>
  );
}

function Cursos({ dados }) {
  if (!possuiItens(dados.cursos)) return null;

  return (
    <Secao titulo="Cursos e certificações">
      {dados.cursos.map((curso) => {
        const temConteudo =
          possuiValor(curso.nome) ||
          possuiValor(curso.instituicao) ||
          possuiValor(curso.periodo) ||
          possuiValor(curso.descricao);

        if (!temConteudo) return null;

        return (
          <article className="curso-item" key={curso.id}>
            <div className="item-identificacao">
              {possuiValor(curso.nome) && (
                <h3>{curso.nome}</h3>
              )}

              <Texto className="item-subtitulo">
                {curso.instituicao}
              </Texto>

              <Texto>{curso.descricao}</Texto>
            </div>

            <Texto className="item-periodo">
              {curso.periodo}
            </Texto>
          </article>
        );
      })}
    </Secao>
  );
}

function ConteudoCurriculo({ dados }) {
  return [
    possuiValor(dados.resumo) && (
      <Secao titulo="Resumo profissional" key="resumo">
        <Texto>{dados.resumo}</Texto>
      </Secao>
    ),

    <Habilidades dados={dados} key="habilidades" />,
    <Experiencias dados={dados} key="experiencias" />,
    <Formacao dados={dados} key="formacao" />,
    <Projetos dados={dados} key="projetos" />,
    <Cursos dados={dados} key="cursos" />,
    <Idiomas dados={dados} key="idiomas" />,
  ].filter(Boolean);
}

function obterAlturaComMargens(elemento) {
  if (!elemento) return 0;

  const estilo = window.getComputedStyle(elemento);
  const retangulo = elemento.getBoundingClientRect();

  const margemSuperior = parseFloat(estilo.marginTop || 0);
  const margemInferior = parseFloat(estilo.marginBottom || 0);

  return (
    retangulo.height +
    margemSuperior +
    margemInferior
  );
}

function usePaginasATS(dados) {
  const medidaRef = useRef(null);
  const [paginas, setPaginas] = useState([[]]);
  const [largura, setLargura] = useState(0);

  const blocos = useMemo(
    () => ConteudoCurriculo({ dados }),
    [dados]
  );

  useLayoutEffect(() => {
    const elemento = medidaRef.current;

    if (!elemento) return;

    let frameId = null;

    function calcularPaginas() {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }

      frameId = requestAnimationFrame(() => {
        const larguraAtual = elemento.clientWidth;

        if (!larguraAtual) return;

        setLargura((larguraAnterior) =>
          larguraAnterior === larguraAtual
            ? larguraAnterior
            : larguraAtual
        );

        const estilo = window.getComputedStyle(elemento);

        const paddingVertical =
          parseFloat(estilo.paddingTop || 0) +
          parseFloat(estilo.paddingBottom || 0);

        const alturaFolha = larguraAtual * (297 / 210);
        const alturaDisponivel =
          alturaFolha - paddingVertical;

        const cabecalho = elemento.querySelector(
          "[data-medida-cabecalho]"
        );

        const alturaCabecalho = obterAlturaComMargens(
          cabecalho?.querySelector(".curriculo-cabecalho")
        );

        const primeiraPaginaDisponivel =
          alturaDisponivel - alturaCabecalho;

        const elementosBlocos = Array.from(
          elemento.querySelectorAll("[data-medida-bloco]")
        );

        const alturas = elementosBlocos.map((bloco) =>
          obterAlturaComMargens(bloco)
        );

        const resultado = [];
        let paginaAtual = [];
        let alturaAtual = 0;
        let limiteAtual = primeiraPaginaDisponivel;

        blocos.forEach((bloco, index) => {
          const alturaBloco = alturas[index] || 0;

          const ultrapassaPagina =
            paginaAtual.length > 0 &&
            alturaAtual + alturaBloco > limiteAtual;

          if (ultrapassaPagina) {
            resultado.push(paginaAtual);

            paginaAtual = [];
            alturaAtual = 0;
            limiteAtual = alturaDisponivel;
          }

          paginaAtual.push(bloco);
          alturaAtual += alturaBloco;
        });

        if (paginaAtual.length > 0) {
          resultado.push(paginaAtual);
        }

        setPaginas(resultado.length > 0 ? resultado : [[]]);
      });
    }

    calcularPaginas();

    const observer = new ResizeObserver(calcularPaginas);
    observer.observe(elemento);

    window.addEventListener("resize", calcularPaginas);

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }

      observer.disconnect();
      window.removeEventListener("resize", calcularPaginas);
    };
  }, [blocos]);

  return {
    paginas,
    medidaRef,
    largura,
  };
}

function PreviewATS({ dados }) {
  const { paginas, medidaRef, largura } = usePaginasATS(dados);

  const blocos = useMemo(
    () => ConteudoCurriculo({ dados }),
    [dados]
  );

  return (
    <>
      <div
        ref={medidaRef}
        className="ats-medida"
        aria-hidden="true"
      >
        <div data-medida-cabecalho>
          <Cabecalho
            dados={dados}
            classe="ats-header"
          />
        </div>

        {blocos.map((bloco, index) => (
          <div
            data-medida-bloco
            className={`ats-bloco ${
              index === 0 ? "primeiro" : ""
            }`}
            key={index}
          >
            {bloco}
          </div>
        ))}
      </div>

      <div
        className="ats-paginas"
        style={{
          "--largura-folha": largura
            ? `${largura}px`
            : "100%",
        }}
      >
        {paginas.map((pagina, paginaIndex) => (
          <div className="ats-folha" key={paginaIndex}>
            {paginaIndex === 0 && (
              <Cabecalho
                dados={dados}
                classe="ats-header"
              />
            )}

            <main className="ats-conteudo">
              {pagina.map((bloco, index) => (
                <div
                  className={`ats-bloco ${
                    index === 0 ? "primeiro" : ""
                  }`}
                  key={index}
                >
                  {bloco}
                </div>
              ))}
            </main>
          </div>
        ))}
      </div>
    </>
  );
}

function PreviewModerno({ dados }) {
  const links = (dados.links || []).filter((link) =>
    possuiValor(link.url)
  );

  return (
    <div className="preview-curriculo curriculo-layout curriculo-moderno">
      <aside className="moderno-sidebar">
        {possuiValor(dados.foto) && (
          <div className="moderno-foto-container">
            <img
              src={dados.foto}
              alt="Foto de perfil"
              className="moderno-foto"
            />
          </div>
        )}

        {possuiValor(dados.nome) && <h1>{dados.nome}</h1>}

        {possuiValor(dados.cargo) && (
          <p className="moderno-cargo">{dados.cargo}</p>
        )}

        {(dados.email ||
          dados.telefone ||
          dados.localizacao) && (
          <div className="moderno-contatos">
            <h2>Contato</h2>

            <Texto>{dados.email}</Texto>
            <Texto>{dados.telefone}</Texto>
            <Texto>{dados.localizacao}</Texto>
          </div>
        )}

        {links.length > 0 && (
          <div className="moderno-contatos">
            <h2>Links</h2>

            {links.map((link) => (
              <Texto key={link.id}>{link.url}</Texto>
            ))}
          </div>
        )}

        <Habilidades dados={dados} />
        <Idiomas dados={dados} />
      </aside>

      <main className="moderno-conteudo">
        {possuiValor(dados.resumo) && (
          <Secao titulo="Resumo profissional">
            <Texto>{dados.resumo}</Texto>
          </Secao>
        )}

        <Experiencias dados={dados} />
        <Formacao dados={dados} />
        <Projetos dados={dados} />
        <Cursos dados={dados} />
      </main>
    </div>
  );
}

function PreviewExecutivo({ dados }) {
  const blocos = useMemo(
    () => ConteudoCurriculo({ dados }),
    [dados]
  );

  return (
    <div className="preview-curriculo curriculo-executivo">
      <Cabecalho
        dados={dados}
        classe="executivo-header"
      />

      <main className="executivo-conteudo">
        {blocos}
      </main>
    </div>
  );
}

export default function PreviewCurriculo({ modelo, dados }) {
  if (modelo === "moderno") {
    return <PreviewModerno dados={dados} />;
  }

  if (modelo === "executivo") {
    return <PreviewExecutivo dados={dados} />;
  }

  return <PreviewATS dados={dados} />;
}