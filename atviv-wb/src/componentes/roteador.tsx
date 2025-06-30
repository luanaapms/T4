import React, { useEffect, useState } from "react";
import BarraNavegacao from "./barraNavegacao";
import FormularioCadastroCliente from "./formularios/cadastrarCliente";
import ListaCliente from "../componentes/listas/listaCliente";
import { Cliente } from "./models/types";
import { apiClientes } from "./services/api";

export default function Roteador() {
  const [tela, setTela] = useState<string>("Clientes");
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const tema = "purple lighten-4";
  const carregarClientes = async () => {
    try {
      const dados = await apiClientes.listar();
      setClientes(dados);
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
    }
  };
  
  useEffect(() => {
    carregarClientes();
    const interval = setInterval(carregarClientes, 3000);
    return () => clearInterval(interval);
  }, []);

  const selecionarView = (novaTela: string, e?: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e?.preventDefault();
    setTela(novaTela);
  };

  return (
    <>
      <BarraNavegacao
        tema={tema}
        botoes={["Clientes", "Cadastrar Cliente"]}
        seletorView={selecionarView}
      />

      {tela === "Clientes" && (
        <ListaCliente tema={tema} clientes={clientes} setClientes={setClientes} />
      )}

      {tela === "Cadastrar Cliente" && (
        <FormularioCadastroCliente
          tema={tema}
          onAdicionarCliente={async (novoCliente) => {
            try {
              const clienteCriado = await apiClientes.cadastrar(novoCliente);
              setClientes((prev) => [...prev, clienteCriado]);
              setTela("Clientes");
            } catch (error) {
              console.error("Erro ao cadastrar cliente:", error);
            }
          }}
        />
      )}
    </>
  );
}
export { Roteador };