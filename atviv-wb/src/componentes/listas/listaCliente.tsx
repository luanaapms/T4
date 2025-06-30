import React, { useState, ChangeEvent } from "react";
import 'materialize-css/dist/css/materialize.min.css';
import FormularioAtualizarCliente from "../formularios/atualizarCliente";
import FormularioExcluirCliente from "../formularios/excluirCliente";
import { Cliente } from "../models/types";
import { apiClientes } from "../services/api";

type Props = {
  tema?: string;
  clientes: Cliente[];
  setClientes: React.Dispatch<React.SetStateAction<Cliente[]>>;
};

const ListaCliente: React.FC<Props> = ({ tema, clientes, setClientes }) => {
  const [busca, setBusca] = useState<string>('');
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);
  const [idParaExcluir, setIdParaExcluir] = useState<number | null>(null);
  const [paginaAtual, setPaginaAtual] = useState<number>(1);
  const clientesPorPagina = 5;

  const handleBuscaChange = (e: ChangeEvent<HTMLInputElement>) => {
    setBusca(e.target.value);
    setPaginaAtual(1);
  };

  const atualizarCliente = async (clienteAtualizado: Cliente) => {
    try {
      await apiClientes.atualizar(clienteAtualizado);
      setClientes(prev =>
        prev.map(c => (c.id === clienteAtualizado.id ? clienteAtualizado : c))
      );
      setClienteEditando(null);
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
    }
  };

  const excluirCliente = async (id: number) => {
    try {
      await apiClientes.excluir(id);
      setClientes(prev => prev.filter(c => c.id !== id));
      setIdParaExcluir(null);
    } catch (error) {
      console.error("Erro ao excluir cliente:", error);
    }
  };

  const clientesFiltrados = clientes.filter(cliente => {
    if (!busca) return true;

    const buscaLower = busca.toLowerCase();
    return (
      cliente.nome?.toLowerCase().includes(buscaLower) ||
      cliente.sobreNome?.toLowerCase().includes(buscaLower)
    );
  });

  const indexUltimoCliente = paginaAtual * clientesPorPagina;
  const indexPrimeiroCliente = indexUltimoCliente - clientesPorPagina;
  const clientesPaginaAtual = clientesFiltrados.slice(indexPrimeiroCliente, indexUltimoCliente);
  const totalPaginas = Math.ceil(clientesFiltrados.length / clientesPorPagina);

  const irParaPagina = (num: number) => {
    if (num < 1) num = 1;
    else if (num > totalPaginas) num = totalPaginas;
    setPaginaAtual(num);
  };

  return (
    <div className="container">
      <h4 className="center-align">Lista de Clientes</h4>

      <div className="input-field">
        <input
          type="text"
          placeholder="Buscar por nome"
          value={busca}
          onChange={handleBuscaChange}
        />
      </div>

      {clienteEditando && typeof clienteEditando.id === 'number' && (
        <FormularioAtualizarCliente
          tema={tema || ''}
          id={clienteEditando.id}
          onAtualizar={atualizarCliente}
          onCancelar={() => setClienteEditando(null)}
        />
      )}

      {idParaExcluir !== null && (
        <FormularioExcluirCliente
          tema={tema || ''}
          id={idParaExcluir}
          onExcluir={excluirCliente}
          onCancelar={() => setIdParaExcluir(null)}
        />
      )}

      {clientesPaginaAtual.length > 0 ? (
        <>
          <ul className="collection">
            {clientesPaginaAtual.map((cliente) => (
              <li key={cliente.id} className="collection-item">
                <strong>Nome:</strong> {cliente.nome}<br />
                <strong>Sobrenome:</strong> {cliente.sobreNome}<br />
                <strong>Telefone(s):</strong>{" "}
                {cliente.telefones?.map(t => `(${t.ddd}) ${t.numero}`).join(", ")}<br />
                <button
                  className="btn green lighten-2"
                  onClick={() => setClienteEditando(cliente)}
                >
                  Atualizar
                </button>
                <button
                  className="btn purple darken-2"
                  style={{ marginLeft: "10px" }}
                  onClick={() => {
                    if (typeof cliente.id === 'number') setIdParaExcluir(cliente.id);
                  }}
                >
                  Excluir
                </button>
              </li>
            ))}
          </ul>

          <div className="center-align" style={{ marginTop: '20px' }}>
            <button
              className="btn purple lighten-4"
              disabled={paginaAtual === 1}
              onClick={() => irParaPagina(paginaAtual - 1)}
              style={{ marginRight: '10px' }}
            >
              Anterior
            </button>

            {[...Array(totalPaginas)].map((_, i) => {
              const numPagina = i + 1;
              return (
                <button
                  key={numPagina}
                  className={`btn ${paginaAtual === numPagina ? 'purple darken-2' : 'purple lighten-4'}`}
                  style={{ marginRight: '5px' }}
                  onClick={() => irParaPagina(numPagina)}
                >
                  {numPagina}
                </button>
              );
            })}

            <button
              className="btn purple lighten-4"
              disabled={paginaAtual === totalPaginas}
              onClick={() => irParaPagina(paginaAtual + 1)}
              style={{ marginLeft: '10px' }}
            >
              Próxima
            </button>
          </div>
        </>
      ) : (
        <p className="center-align">Nenhum cliente encontrado.</p>
      )}
    </div>
  );
};

export default ListaCliente;
