/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect } from "react";
import 'materialize-css/dist/css/materialize.min.css';
import M from 'materialize-css';

type Props = {
  tema: string;
  botoes: string[];
  seletorView: (valor: string, e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
};

export default function BarraNavegacao({ tema, botoes, seletorView }: Props) {

  useEffect(() => {
    const elems = document.querySelectorAll('.sidenav');
    M.Sidenav.init(elems);
  }, []);

  function gerarListaBotoes() {
    if (botoes.length <= 0) {
      return null;
    }

    return botoes.map(valor => (
      <li key={valor}>
        <a href="#!" onClick={(e) => seletorView(valor, e)}>
          {valor}
        </a>
      </li>
    ));
  }

  return (
    <>
      <nav className={tema}>
        <div className="nav-wrapper" style={{ padding: "0 2rem" }}>
          <a className="brand-logo" style={{ fontSize: "2.2rem", fontWeight: "bold" }}>
            WB
          </a>
          <a href="#!" data-target="mobile-menu" className="sidenav-trigger">
            <i className="material-icons">menu</i>
          </a>
          <ul className="right hide-on-med-and-down">
            {gerarListaBotoes()}
          </ul>
        </div>
      </nav>
      <ul className="sidenav" id="mobile-menu">
        {gerarListaBotoes()}
      </ul>
    </>
  );
}
