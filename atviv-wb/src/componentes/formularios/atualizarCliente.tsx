import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { Cliente, Endereco, Telefone } from '../models/types';
import { apiClientes } from '../services/api';
import { on } from "events";

type Props = {
  tema: string;
  id: number;
  onAtualizar: (cliente: Cliente) => void;
  onCancelar: () => void;
};

const FormularioAtualizarCliente: React.FC<Props> = ({ tema, id, onAtualizar, onCancelar }) => {
  const [nome, setNome] = useState<string>('');
  const [sobreNome, setSobreNome] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [endereco, setEndereco] = useState<Endereco>({
    estado: '',
    cidade: '',
    bairro: '',
    rua: '',
    numero: '',
    codigoPostal: '',
    informacoesAdicionais: ''
  });
  const [telefones, setTelefones] = useState<Telefone[]>([]);
  const [cliente, setCliente] = useState<Cliente>({
    id: id,
    nome: '',
    sobreNome: '',
    email: null,
    endereco: endereco,
    telefones: telefones
  });
  
   useEffect(() => {
      const carregarClientes = async () => {
        try {
          const dados = await apiClientes.buscar(id);
          setCliente(dados);
        } catch (error) {
          console.error("Erro ao carregar clientes:", error);
        }
      };
      carregarClientes();
    }, []);

  useEffect(() => {
    setNome(cliente.nome);
    setSobreNome(cliente.sobreNome);
    setEmail(cliente.email ?? '');
    setEndereco(cliente.endereco);
    setTelefones(cliente.telefones ?? []);
  }, [cliente]);


  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case 'nome': setNome(value); break;
      case 'sobreNome': setSobreNome(value); break;
      case 'email': setEmail(value); break;
      case 'estado': setEndereco(prev => ({ ...prev, estado: value })); break;
      case 'cidade': setEndereco(prev => ({ ...prev, cidade: value })); break;
      case 'bairro': setEndereco(prev => ({ ...prev, bairro: value })); break;
      case 'rua': setEndereco(prev => ({ ...prev, rua: value })); break;
      case 'numero': setEndereco(prev => ({ ...prev, numero: value })); break;
      case 'codigoPostal': setEndereco(prev => ({ ...prev, codigoPostal: value })); break;
      case 'informacoesAdicionais': setEndereco(prev => ({ ...prev, informacoesAdicionais: value })); break;
    }
  };


  const handleTelefoneChange = (index: number, field: keyof Telefone, value: string) => {
    const novosTelefones = [...telefones];
    novosTelefones[index] = { ...novosTelefones[index], [field]: value };
    setTelefones(novosTelefones);
  };

  const adicionarTelefone = () => {
    setTelefones([...telefones, { ddd: '', numero: '' }]);
  };

  const removerTelefone = (index: number) => {
    setTelefones(telefones.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const clienteAtualizado: Cliente = {
      id: cliente.id,
      nome,
      sobreNome,
      email: email || null,
      endereco,
      telefones,
    };

    try {
       fetch('http://localhost:32832/cliente/atualizar', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(clienteAtualizado)
        }).then(r=> {
            alert(r.status === 200 ? 'Cliente atualizado com sucesso!' : 'Erro ao atualizar cliente.')
        })
        onAtualizar(clienteAtualizado);
    } catch (error: any) {
    }
  };

  const estiloBotao = `btn waves-effect waves-light ${tema}`;

  return (
    <div className="card-panel">
      <form onSubmit={handleSubmit}>
        <h5>Atualizar Cliente</h5>
        <div className="row">
          <div className="input-field col s6">
            <input name="nome" type="text" value={nome} onChange={handleChange} required />
            <label className="active">Nome</label>
          </div>
          <div className="input-field col s6">
            <input name="sobreNome" type="text" value={sobreNome} onChange={handleChange} required />
            <label className="active">Sobrenome</label>
          </div>
        </div>

        <div className="row">
          <div className="input-field col s12">
            <input name="email" type="email" value={email} onChange={handleChange} />
            <label className="active">Email</label>
          </div>
        </div>

        <h6>Endereço</h6>
        <div className="row">
          <div className="input-field col s4">
            <input name="estado" type="text" value={endereco.estado} onChange={handleChange} required />
            <label className="active">Estado</label>
          </div>
          <div className="input-field col s4">
            <input name="cidade" type="text" value={endereco.cidade} onChange={handleChange} required />
            <label className="active">Cidade</label>
          </div>
          <div className="input-field col s4">
            <input name="bairro" type="text" value={endereco.bairro} onChange={handleChange} required />
            <label className="active">Bairro</label>
          </div>
        </div>

        <div className="row">
          <div className="input-field col s6">
            <input name="rua" type="text" value={endereco.rua} onChange={handleChange} required />
            <label className="active">Rua</label>
          </div>
          <div className="input-field col s3">
            <input name="numero" type="text" value={endereco.numero} onChange={handleChange} required />
            <label className="active">Número</label>
          </div>
          <div className="input-field col s3">
            <input name="codigoPostal" type="text" value={endereco.codigoPostal} onChange={handleChange} />
            <label className="active">Código Postal</label>
          </div>
        </div>

        <div className="row">
          <div className="input-field col s12">
            <input name="informacoesAdicionais" type="text" value={endereco.informacoesAdicionais ?? ''} onChange={handleChange} />
            <label className="active">Informações Adicionais</label>
          </div>
        </div>

        <h6>Telefones</h6>
        {telefones.map((tel, i) => (
          <div key={i} className="row">
            <div className="input-field col s2">
              <input
                type="text"
                placeholder="DDD"
                value={tel.ddd}
                onChange={(e) => handleTelefoneChange(i, 'ddd', e.target.value)}
                required
              />
              <label className={tel.ddd ? 'active' : ''}>DDD</label>
            </div>
            <div className="input-field col s8">
              <input
                type="text"
                placeholder="Número"
                value={tel.numero}
                onChange={(e) => handleTelefoneChange(i, 'numero', e.target.value)}
                required
              />
              <label className={tel.numero ? 'active' : ''}>Número</label>
            </div>
            <div className="input-field col s2">
              <button type="button" className="btn red" onClick={() => removerTelefone(i)}>Remover</button>
            </div>
          </div>
        ))}

        <button type="button" className="btn green" onClick={adicionarTelefone} style={{ marginBottom: '1rem' }}>
          Adicionar Telefone
        </button>

        <div className="row">
          <div className="col s6">
            <button className={estiloBotao} type="submit">Atualizar</button>
          </div>
          <div className="col s6">
            <button type="button" className="btn grey" onClick={onCancelar}>Cancelar</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FormularioAtualizarCliente;
