import React, { FormEvent, useState } from "react";
import { apiClientes } from '../services/api';

type Props = {
  tema: string;
  id: number;
  onExcluir: (id: number) => void;
  onCancelar: () => void;
};

const FormularioExcluirCliente: React.FC<Props> = ({ tema, id, onExcluir, onCancelar }) => {
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setErro(null);

    try {
      await apiClientes.excluir(id);
      onExcluir(id);
    } catch (error: any) {
    } finally {
      setLoading(false);
    }
  };

  const estiloBotao = `btn waves-effect waves-light ${tema}`;

  return (
    <div className="card-panel red lighten-5">
      <form onSubmit={handleSubmit}>
        <h5 className="red-text">Confirmar Exclusão</h5>
        <p>Deseja realmente excluir o cliente com ID <strong>{id}</strong>?</p>

        {erro && <p className="red-text">{erro}</p>}

        <div className="row">
          <div className="col s6">
            <button className={estiloBotao} type="submit" disabled={loading}>
              {loading ? "Excluindo..." : "Excluir"}
            </button>
          </div>
          <div className="col s6">
            <button type="button" className="btn grey" onClick={onCancelar} disabled={loading}>
              Cancelar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FormularioExcluirCliente;
